'use client';

import { useState, useEffect } from 'react';
import { definitions } from '@/config/definitions';

interface Arbitrage {
  id: number;
  source: string;
  type_changement: string;
  description: string;
  impact: string | null;
  statut: string;
  created_at: string;
}

const typeLabels: Record<string, { label: string; badge: string }> = {
  ajout: { label: 'Ajout', badge: 'badge-success' },
  modification: { label: 'Modification', badge: 'badge-warning' },
  suppression: { label: 'Suppression', badge: 'badge-error' },
};

const statutLabels: Record<string, { label: string; badge: string }> = {
  propose: { label: 'Proposé', badge: 'badge-info' },
  valide: { label: 'Validé', badge: 'badge-success' },
  rejete: { label: 'Rejeté', badge: 'badge-error' },
};

export default function Arbitrages() {
  const [arbitrages, setArbitrages] = useState<Arbitrage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/arbitrages').then(r => r.json()).then(data => { setArbitrages(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-xs font-medium mb-4">
          {definitions.concepts.arbitrage.nom}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Arbitrages</h1>
        <p className="text-[var(--color-text-secondary)]">
          {definitions.concepts.arbitrage.definition}
        </p>
      </section>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-light)]">Chargement...</div>
      ) : arbitrages.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-[var(--color-text-light)]">Aucun arbitrage enregistré</p>
          <p className="text-xs text-[var(--color-text-light)] mt-2">Les modifications du plan sont documentées ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {arbitrages.map(a => {
            const typeConfig = typeLabels[a.type_changement] || { label: a.type_changement, badge: 'badge-gray' };
            const statutConfig = statutLabels[a.statut] || { label: a.statut, badge: 'badge-gray' };
            return (
              <div key={a.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${typeConfig.badge}`}>{typeConfig.label}</span>
                    <span className={`badge ${statutConfig.badge}`}>{statutConfig.label}</span>
                  </div>
                  <span className="text-xs text-[var(--color-text-light)]">{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <p className="text-sm text-[var(--color-dark)] mb-1">{a.description}</p>
                {a.impact && <p className="text-xs text-[var(--color-text-secondary)]">Impact : {a.impact}</p>}
                <p className="text-xs text-[var(--color-text-light)] mt-2">Source : {a.source}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
