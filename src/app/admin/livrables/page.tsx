'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Livrable {
  id: number;
  phase: number;
  numero: string;
  titre: string;
  description: string;
  responsabilite: string;
  statut: string;
}

const statuts = ['a_faire', 'brouillon', 'en_review', 'valide'];
const statutLabels: Record<string, string> = { a_faire: 'À faire', brouillon: 'Brouillon', en_review: 'En review', valide: 'Validé' };

export default function AdminLivrables() {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.push('/admin/login'); });
    fetch('/api/livrables').then(r => r.json()).then(data => { setLivrables(data); setLoading(false); }).catch(() => setLoading(false));
  }, [router]);

  const updateStatut = async (id: number, statut: string) => {
    const res = await fetch(`/api/livrables/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLivrables(prev => prev.map(l => l.id === id ? updated : l));
    }
  };

  if (loading) return <div className="text-center py-12 text-[var(--color-text-light)]">Chargement...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-dark)]">Gestion des livrables</h1>
        <a href="/admin" className="text-sm text-[var(--color-primary)] hover:underline">Retour au dashboard</a>
      </div>

      {livrables.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-[var(--color-text-light)]">Aucun livrable. Utilisez le seed script pour initialiser.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {livrables.map(l => (
            <div key={l.id} className="card flex items-center gap-4">
              <div className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-bg)] px-3 py-2 rounded-lg">
                {l.numero}
              </div>
              <div className="flex-1">
                <div className="font-medium text-[var(--color-dark)]">{l.titre}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">{l.description}</div>
              </div>
              <select
                value={l.statut}
                onChange={e => updateStatut(l.id, e.target.value)}
                className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
              >
                {statuts.map(s => (
                  <option key={s} value={s}>{statutLabels[s]}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
