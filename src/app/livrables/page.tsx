'use client';

import { useState, useEffect } from 'react';
import { definitions } from '@/config/definitions';

interface Livrable {
  id: number;
  phase: number;
  numero: string;
  titre: string;
  description: string;
  responsabilite: string;
  statut: string;
}

const statutConfig = definitions.statuts;

export default function Livrables() {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/livrables')
      .then(res => res.json())
      .then(data => { setLivrables(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? livrables : livrables.filter(l => l.statut === filter);
  const total = livrables.length;
  const valides = livrables.filter(l => l.statut === 'valide').length;
  const progress = total > 0 ? Math.round((valides / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-xs font-medium mb-4">
          {definitions.concepts.livrable.nom}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Livrables & Suivi</h1>
        <p className="text-[var(--color-text-secondary)]">
          {definitions.concepts.livrable.definition}
        </p>
      </section>

      {/* Progress */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-[var(--color-dark)]">Progression globale</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">{valides}/{total} validés</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-right text-xs text-[var(--color-text-light)] mt-1">{progress}%</div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200'}`}
        >
          Tous ({total})
        </button>
        {Object.entries(statutConfig).map(([key, config]) => {
          const count = livrables.filter(l => l.statut === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === key ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200'}`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-light)]">Chargement des livrables...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-light)]">Aucun livrable trouvé</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => {
            const config = statutConfig[l.statut as keyof typeof statutConfig] || statutConfig.a_faire;
            const badgeClass = l.statut === 'valide' ? 'badge-success' : l.statut === 'en_review' ? 'badge-info' : l.statut === 'brouillon' ? 'badge-warning' : 'badge-gray';
            return (
              <div key={l.id} className="card flex items-center gap-4">
                <div className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-bg)] px-3 py-2 rounded-lg">
                  {l.numero}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[var(--color-dark)]">{l.titre}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{l.description}</div>
                </div>
                <span className={`badge ${badgeClass}`}>{config.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
