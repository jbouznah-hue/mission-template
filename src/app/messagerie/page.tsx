'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  itemType: string;
  itemId: string | null;
  auteur: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

interface Conversation {
  key: string;
  label: string;
  lastMessage?: Message;
  unread: number;
}

interface Livrable {
  id: number;
  nom: string;
  reference?: string;
}

export default function Messagerie() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New conversation modal state
  const [showNewConv, setShowNewConv] = useState(false);
  const [newConvType, setNewConvType] = useState<'general' | 'livrable' | 'phase'>('general');
  const [newConvPhase, setNewConvPhase] = useState<string>('1');
  const [newConvLivrableId, setNewConvLivrableId] = useState<string>('');
  const [livrablesList, setLivrablesList] = useState<Livrable[]>([]);
  const [livrablesFetched, setLivrablesFetched] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (r.ok) setIsAdmin(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.ok ? r.json() : [])
      .then((data: Message[]) => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        setMessages(data);
        // Group into conversations
        const convMap = new Map<string, Message[]>();
        data.forEach(m => {
          const key = m.itemId ? `${m.itemType}:${m.itemId}` : 'general';
          if (!convMap.has(key)) convMap.set(key, []);
          convMap.get(key)!.push(m);
        });
        const convs: Conversation[] = [
          {
            key: 'general',
            label: 'Conversation générale',
            lastMessage: convMap.get('general')?.at(-1),
            unread: convMap.get('general')?.filter(m => !m.lu && m.auteur === (isAdmin ? 'client' : 'admin')).length || 0,
          },
        ];
        convMap.forEach((msgs, key) => {
          if (key !== 'general') {
            const [type, id] = key.split(':');
            convs.push({
              key,
              label: `${type === 'livrable' ? 'Livrable' : type === 'phase' ? 'Phase' : type} #${id}`,
              lastMessage: msgs.at(-1),
              unread: msgs.filter(m => !m.lu && m.auteur === (isAdmin ? 'client' : 'admin')).length,
            });
          }
        });
        setConversations(convs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, messages]);

  const activeMessages = messages.filter(m => {
    if (activeConv === 'general') return !m.itemId || m.itemType === 'general';
    const [type, id] = activeConv.split(':');
    return m.itemType === type && m.itemId === id;
  }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    let itemType = 'general';
    let itemId: string | null = null;
    if (activeConv !== 'general') {
      const parts = activeConv.split(':');
      itemType = parts[0];
      itemId = parts[1] || null;
    }

    const auteur = isAdmin ? 'admin' : 'client';

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_type: itemType,
          item_id: itemId,
          auteur,
          contenu: text,
        }),
      });
      const msg = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
      } else {
        console.error('Erreur envoi message:', msg);
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
    }
  };

  const fetchLivrables = async () => {
    if (livrablesFetched) return;
    try {
      const res = await fetch('/api/livrables');
      if (res.ok) {
        const data = await res.json();
        setLivrablesList(Array.isArray(data) ? data : (data.livrables ?? []));
      }
    } catch {
      // ignore
    }
    setLivrablesFetched(true);
  };

  const openNewConvModal = () => {
    setNewConvType('general');
    setNewConvPhase('1');
    setNewConvLivrableId('');
    setShowNewConv(true);
  };

  const handleNewConvTypeChange = (type: 'general' | 'livrable' | 'phase') => {
    setNewConvType(type);
    if (type === 'livrable') fetchLivrables();
  };

  const submitNewConversation = () => {
    let key = 'general';
    let label = 'Conversation générale';

    if (newConvType === 'phase') {
      key = `phase:${newConvPhase}`;
      label = `Phase ${newConvPhase}`;
    } else if (newConvType === 'livrable' && newConvLivrableId) {
      const found = livrablesList.find(l => String(l.id) === newConvLivrableId);
      key = `livrable:${newConvLivrableId}`;
      label = found
        ? `${found.reference ? found.reference + ' — ' : ''}${found.nom}`
        : `Livrable #${newConvLivrableId}`;
    }

    // Add conversation if not already present
    setConversations(prev => {
      if (prev.find(c => c.key === key)) return prev;
      return [...prev, { key, label, unread: 0 }];
    });
    setActiveConv(key);
    setShowNewConv(false);
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Who is "me" for display purposes
  const myRole = isAdmin ? 'admin' : 'client';

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-dark)]">Messagerie</h1>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAdmin
            ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)]'
            : 'bg-gray-100 text-[var(--color-text-secondary)]'
        }`}>
          {isAdmin ? 'ORRTYL (admin)' : 'Client'}
        </div>
      </div>

      <div className="flex gap-4 h-[600px]">
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white">
          <div className="p-4 border-b border-[var(--color-border)] bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--color-dark)]">Conversations</h3>
            <button
              onClick={openNewConvModal}
              className="text-xs px-2.5 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              + Nouveau sujet
            </button>
          </div>
          <div className="overflow-y-auto h-full">
            {/* General conversation first */}
            {conversations.filter(c => c.key === 'general').map(conv => (
              <button
                key={conv.key}
                onClick={() => setActiveConv(conv.key)}
                className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] transition-colors ${
                  activeConv === conv.key ? 'bg-[var(--color-primary-bg)]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-dark)] truncate">{conv.label}</span>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center">{conv.unread}</span>
                  )}
                </div>
                {conv.lastMessage && (
                  <p className="text-xs text-[var(--color-text-light)] truncate mt-1">
                    <span className="font-medium">{conv.lastMessage.auteur === 'admin' ? 'ORRTYL' : 'Client'}</span>: {conv.lastMessage.contenu}
                  </p>
                )}
              </button>
            ))}
            {/* Contextual conversations */}
            {conversations.filter(c => c.key !== 'general').map(conv => {
              const [type] = conv.key.split(':');
              const badge = type === 'livrable' ? '📄' : type === 'phase' ? '🔷' : '💬';
              return (
                <button
                  key={conv.key}
                  onClick={() => setActiveConv(conv.key)}
                  className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] transition-colors ${
                    activeConv === conv.key ? 'bg-[var(--color-primary-bg)]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium text-[var(--color-dark)] truncate">
                      <span className="mr-1">{badge}</span>{conv.label}
                    </span>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 flex-shrink-0 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center">{conv.unread}</span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-[var(--color-text-light)] truncate mt-1">
                      <span className="font-medium">{conv.lastMessage.auteur === 'admin' ? 'ORRTYL' : 'Client'}</span>: {conv.lastMessage.contenu}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)] bg-gray-50">
            <h3 className="font-semibold text-sm text-[var(--color-dark)]">
              {conversations.find(c => c.key === activeConv)?.label || 'Conversation générale'}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="text-center text-[var(--color-text-light)] py-8">Chargement...</div>
            ) : activeMessages.length === 0 ? (
              <div className="text-center text-[var(--color-text-light)] py-8">
                <p>Aucun message</p>
                <p className="text-xs mt-1">Envoyez le premier message pour démarrer la conversation</p>
              </div>
            ) : (
              activeMessages.map(m => {
                const isMine = m.auteur === myRole;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMine
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-gray-100 text-[var(--color-dark)]'
                    }`}>
                      <p className={`text-xs font-medium mb-1 ${isMine ? 'text-white/70' : 'text-[var(--color-primary)]'}`}>
                        {m.auteur === 'admin' ? 'ORRTYL' : 'Client'}
                      </p>
                      <p>{m.contenu}</p>
                      {formatTime(m.createdAt) && (
                        <p className={`text-xs mt-1 ${isMine ? 'text-white/50' : 'text-[var(--color-text-light)]'}`}>
                          {formatTime(m.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={isAdmin ? 'Répondre en tant qu\'ORRTYL...' : 'Votre message...'}
                className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New conversation modal */}
      {showNewConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold text-[var(--color-dark)] mb-4">Nouveau sujet</h2>

            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Type</label>
              <select
                value={newConvType}
                onChange={e => handleNewConvTypeChange(e.target.value as 'general' | 'livrable' | 'phase')}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="general">Général</option>
                <option value="livrable">Livrable</option>
                <option value="phase">Phase</option>
              </select>
            </div>

            {newConvType === 'phase' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Phase</label>
                <select
                  value={newConvPhase}
                  onChange={e => setNewConvPhase(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={String(n)}>Phase {n}</option>
                  ))}
                </select>
              </div>
            )}

            {newConvType === 'livrable' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Livrable</label>
                {livrablesList.length === 0 && livrablesFetched ? (
                  <p className="text-xs text-[var(--color-text-light)] italic">Aucun livrable disponible</p>
                ) : !livrablesFetched ? (
                  <p className="text-xs text-[var(--color-text-light)] italic">Chargement...</p>
                ) : (
                  <select
                    value={newConvLivrableId}
                    onChange={e => setNewConvLivrableId(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="">Sélectionner un livrable...</option>
                    {livrablesList.map(l => (
                      <option key={l.id} value={String(l.id)}>
                        {l.reference ? `${l.reference} — ` : ''}{l.nom}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowNewConv(false)}
                className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitNewConversation}
                disabled={newConvType === 'livrable' && !newConvLivrableId}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
