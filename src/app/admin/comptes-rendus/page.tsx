'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CompteRendu {
  id: number;
  titre: string;
  dateReunion: string;
  dureeReunion: string | null;
  contenu: string;
  statut: string;
  createdAt: string;
}

export default function AdminComptesRendus() {
  const [crs, setCrs] = useState<CompteRendu[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const router = useRouter();

  // New CR form
  const [showForm, setShowForm] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newParticipants, setNewParticipants] = useState('');
  const [newHtml, setNewHtml] = useState('');
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.push('/admin/login'); });
    fetch('/api/comptes-rendus')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setCrs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const createCR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHtml.trim()) return;

    const titre = `Compte rendu du ${new Date(newDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    const res = await fetch('/api/comptes-rendus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titre,
        date_reunion: newDate,
        duree_reunion: newParticipants ? `Participants: ${newParticipants}` : null,
        contenu: newHtml,
        statut: 'brouillon',
      }),
    });
    if (res.ok) {
      const cr = await res.json();
      setCrs(prev => [cr, ...prev]);
      setShowForm(false);
      setNewHtml('');
      setNewParticipants('');
    }
  };

  const updateStatut = async (id: number, statut: string) => {
    const res = await fetch(`/api/comptes-rendus/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCrs(prev => prev.map(c => c.id === id ? updated : c));
    }
  };

  const saveEdit = async (id: number) => {
    const res = await fetch(`/api/comptes-rendus/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenu: editContent }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCrs(prev => prev.map(c => c.id === id ? updated : c));
      setEditingId(null);
    }
  };

  const deleteCR = async (id: number) => {
    if (!confirm('Supprimer ce compte rendu ?')) return;
    const res = await fetch(`/api/comptes-rendus/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCrs(prev => prev.filter(c => c.id !== id));
    }
  };

  if (loading) return <div className="text-center py-12 text-[var(--color-text-light)]">Chargement...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-dark)]">Comptes Rendus</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setShowForm(!showForm); setPreviewMode('code'); }}
            className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {showForm ? 'Annuler' : 'Nouveau compte rendu'}
          </button>
          <a href="/admin" className="text-sm text-[var(--color-primary)] hover:underline">Dashboard</a>
        </div>
      </div>

      {/* New CR form */}
      {showForm && (
        <section className="card space-y-5">
          <h2 className="font-semibold text-[var(--color-dark)]">Nouveau compte rendu</h2>

          <form onSubmit={createCR} className="space-y-5">
            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Date de la réunion</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Participants</label>
                <input
                  type="text"
                  value={newParticipants}
                  onChange={e => setNewParticipants(e.target.value)}
                  placeholder="ex: Jeremy, Dan, Emma"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            {/* HTML Editor with tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">Contenu HTML</label>
                <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('code')}
                    className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                      previewMode === 'code'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-white text-[var(--color-text-secondary)] hover:bg-gray-50'
                    }`}
                  >
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('preview')}
                    className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                      previewMode === 'preview'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-white text-[var(--color-text-secondary)] hover:bg-gray-50'
                    }`}
                  >
                    Aperçu
                  </button>
                </div>
              </div>

              {previewMode === 'code' ? (
                <textarea
                  value={newHtml}
                  onChange={e => setNewHtml(e.target.value)}
                  required
                  rows={18}
                  placeholder={`<h2>Points abordés</h2>\n<ul>\n  <li>Présentation du contexte</li>\n  <li>Identification des besoins</li>\n</ul>\n\n<h2>Décisions prises</h2>\n<p>...</p>\n\n<h2>Prochaines étapes</h2>\n<ol>\n  <li>Action 1 — Responsable : Jeremy</li>\n  <li>Action 2 — Responsable : Client</li>\n</ol>`}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:border-[var(--color-primary)] bg-[#1e1e2e] text-[#cdd6f4] placeholder-[#585b70]"
                />
              ) : (
                <div className="border border-[var(--color-border)] rounded-xl p-6 min-h-[300px] bg-white">
                  {newHtml.trim() ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: newHtml }}
                    />
                  ) : (
                    <p className="text-[var(--color-text-light)] italic">Tapez du HTML dans l&apos;onglet Code pour voir l&apos;aperçu ici</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Publier en brouillon
              </button>
              <span className="text-xs text-[var(--color-text-light)]">
                Vous pourrez le passer en &quot;Publié&quot; ensuite
              </span>
            </div>
          </form>
        </section>
      )}

      {/* Existing CRs */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">
          Comptes rendus ({crs.length})
        </h2>
        {crs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--color-text-light)]">Aucun compte rendu</p>
            <p className="text-xs text-[var(--color-text-light)] mt-2">Cliquez sur &quot;Nouveau compte rendu&quot; pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {crs.map(cr => (
              <div key={cr.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)]">{cr.titre}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[var(--color-text-light)]">
                        {new Date(cr.dateReunion).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      {cr.dureeReunion && (
                        <span className="text-xs text-[var(--color-text-light)]">{cr.dureeReunion}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={cr.statut}
                      onChange={e => updateStatut(cr.id, e.target.value)}
                      className={`text-xs px-3 py-1.5 border rounded-lg font-medium ${
                        cr.statut === 'publie'
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <option value="brouillon">Brouillon</option>
                      <option value="publie">Publié</option>
                    </select>
                    <button
                      onClick={() => { setEditingId(editingId === cr.id ? null : cr.id); setEditContent(cr.contenu); }}
                      className="text-xs px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)] transition-colors"
                    >
                      {editingId === cr.id ? 'Annuler' : 'Éditer'}
                    </button>
                    <button
                      onClick={() => deleteCR(cr.id)}
                      className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-[var(--color-error)] hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {editingId === cr.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:border-[var(--color-primary)] bg-[#1e1e2e] text-[#cdd6f4]"
                    />
                    <div className="border border-[var(--color-border)] rounded-xl p-6 bg-white">
                      <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">Aperçu :</p>
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: editContent }} />
                    </div>
                    <button
                      onClick={() => saveEdit(cr.id)}
                      className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Sauvegarder
                    </button>
                  </div>
                ) : (
                  <div
                    className="prose prose-sm max-w-none text-[var(--color-text-secondary)]"
                    dangerouslySetInnerHTML={{ __html: cr.contenu }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
