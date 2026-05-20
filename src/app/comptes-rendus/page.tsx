'use client';

import { useState, useEffect } from 'react';

interface CompteRendu {
  id: number;
  titre: string;
  date_reunion: string;
  duree_reunion: string | null;
  contenu: string;
  statut: string;
  created_at: string;
}

export default function ComptesRendus() {
  const [crs, setCrs] = useState<CompteRendu[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/comptes-rendus')
      .then(r => r.json())
      .then(data => { setCrs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Comptes Rendus</h1>
        <p className="text-[var(--color-text-secondary)]">
          Notes de réunion et transcriptions des échanges
        </p>
      </section>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-light)]">Chargement...</div>
      ) : crs.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-[var(--color-text-light)]">Aucun compte rendu publié</p>
          <p className="text-xs text-[var(--color-text-light)] mt-2">Les comptes rendus de réunion apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {crs.map(cr => (
            <div key={cr.id} className="card">
              <button
                onClick={() => setExpandedId(expandedId === cr.id ? null : cr.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)]">{cr.titre}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[var(--color-text-light)]">
                        {new Date(cr.date_reunion).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      {cr.duree_reunion && (
                        <span className="text-xs text-[var(--color-text-light)]">({cr.duree_reunion})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${cr.statut === 'publie' ? 'badge-success' : 'badge-warning'}`}>
                      {cr.statut === 'publie' ? 'Publié' : 'Brouillon'}
                    </span>
                    <svg className={`w-5 h-5 text-[var(--color-text-light)] transition-transform ${expandedId === cr.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {expandedId === cr.id && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div
                    className="prose prose-sm max-w-none text-[var(--color-text-secondary)]"
                    dangerouslySetInnerHTML={{ __html: cr.contenu }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
