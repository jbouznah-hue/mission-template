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
  fileName: string | null;
  ordre: number;
}

const COLUMNS: {
  key: string;
  label: string;
  headerBg: string;
  headerText: string;
  badgeClass: string;
}[] = [
  {
    key: 'a_faire',
    label: 'À faire',
    headerBg: '#f1f5f9',
    headerText: '#475569',
    badgeClass: 'badge-gray',
  },
  {
    key: 'brouillon',
    label: 'En cours',
    headerBg: '#dbeafe',
    headerText: '#1e40af',
    badgeClass: 'badge-info',
  },
  {
    key: 'en_review',
    label: 'Bloqué',
    headerBg: '#fef3c7',
    headerText: '#92400e',
    badgeClass: 'badge-warning',
  },
  {
    key: 'valide',
    label: 'Validé',
    headerBg: '#d1fae5',
    headerText: '#065f46',
    badgeClass: 'badge-success',
  },
];

const PHASE_BADGES: Record<number, string> = {
  1: 'badge-info',
  2: 'badge-warning',
  3: 'badge-gray',
  4: 'badge-success',
  5: 'badge-gray',
};

function getPhaseName(phase: number): string {
  const phaseMap: Record<number, string> = {
    1: 'Comprendre',
    2: 'Structurer',
    3: 'Déployer',
    4: 'Lancer',
    5: 'Accompagner',
  };
  return phaseMap[phase] ?? `Phase ${phase}`;
}

function LivrableCard({ livrable }: { livrable: Livrable }) {
  const truncated =
    livrable.description.length > 100
      ? livrable.description.slice(0, 100) + '…'
      : livrable.description;

  return (
    <div
      className="card"
      style={{
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '0.75rem',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="flex items-start gap-3">
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-bg)',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {livrable.numero}
        </span>
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--color-dark)',
              lineHeight: '1.3',
              marginBottom: '0.25rem',
            }}
          >
            {livrable.titre}
          </div>
          {livrable.description && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.4',
                marginBottom: '0.5rem',
              }}
            >
              {truncated}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`badge ${PHASE_BADGES[livrable.phase] ?? 'badge-gray'}`}
              style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}
            >
              {getPhaseName(livrable.phase)}
            </span>
            {livrable.statut === 'valide' && livrable.fileName && (
              <a
                href={`/api/livrables/${livrable.id}/download`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#065f46',
                  background: '#d1fae5',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.75')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
              >
                ↓ Télécharger
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Livrables() {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/livrables')
      .then(res => res.json())
      .then(data => {
        setLivrables(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const total = livrables.length;
  const valides = livrables.filter(l => l.statut === 'valide').length;
  const progress = total > 0 ? Math.round((valides / total) * 100) : 0;

  const byColumn = (key: string) =>
    livrables.filter(l => l.statut === key).sort((a, b) => a.ordre - b.ordre);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section>
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{
            background: 'var(--color-primary-bg)',
            color: 'var(--color-primary)',
          }}
        >
          {definitions.concepts.livrable.nom}
        </div>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: 'var(--color-dark)',
            marginBottom: '0.5rem',
          }}
        >
          Livrables & Suivi
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {definitions.concepts.livrable.definition}
        </p>
      </section>

      {/* Progress bar */}
      <section className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
            Progression globale
          </span>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            {valides}/{total} validés
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div
          style={{
            textAlign: 'right',
            fontSize: '0.75rem',
            color: 'var(--color-text-light)',
            marginTop: '0.25rem',
          }}
        >
          {progress}%
        </div>
      </section>

      <div className="section-divider" />

      {/* Kanban board */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 0',
            color: 'var(--color-text-light)',
          }}
        >
          Chargement des livrables...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            alignItems: 'start',
          }}
          className="kanban-board"
        >
          {COLUMNS.map(col => {
            const items = byColumn(col.key);
            return (
              <div
                key={col.key}
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  minHeight: '200px',
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    background: col.headerBg,
                    color: col.headerText,
                    padding: '0.75rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <span>{col.label}</span>
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.08)',
                      borderRadius: '9999px',
                      padding: '0.1rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {items.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ padding: '0.75rem' }}>
                  {items.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '2rem 0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        fontStyle: 'italic',
                      }}
                    >
                      Aucun livrable
                    </div>
                  ) : (
                    items.map(l => <LivrableCard key={l.id} livrable={l} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .kanban-board {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
