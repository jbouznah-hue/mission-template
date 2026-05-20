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

export default function Messagerie() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!newMessage.trim()) return;
    const [itemType, itemId] = activeConv === 'general' ? ['general', null] : activeConv.split(':');
    const auteur = isAdmin ? 'admin' : 'client';
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_type: itemType,
        item_id: itemId,
        auteur,
        contenu: newMessage.trim(),
      }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    }
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
          <div className="p-4 border-b border-[var(--color-border)] bg-gray-50">
            <h3 className="font-semibold text-sm text-[var(--color-dark)]">Conversations</h3>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map(conv => (
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
    </div>
  );
}
