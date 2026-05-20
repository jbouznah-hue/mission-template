'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

type Statut = 'a_faire' | 'en_cours' | 'bloque' | 'valide';

const STATUTS: Statut[] = ['a_faire', 'en_cours', 'bloque', 'valide'];

const COL: Record<Statut, { label: string; border: string; header: string; bg: string }> = {
  a_faire: { label: 'À faire', border: 'border-gray-200', header: 'bg-gray-100 text-gray-700', bg: 'bg-gray-50' },
  en_cours: { label: 'En cours', border: 'border-blue-200', header: 'bg-blue-50 text-blue-700', bg: 'bg-blue-50/30' },
  bloque: { label: 'Bloqué', border: 'border-orange-200', header: 'bg-orange-50 text-orange-700', bg: 'bg-orange-50/30' },
  valide: { label: 'Validé', border: 'border-green-200', header: 'bg-green-50 text-green-700', bg: 'bg-green-50/30' },
};

export default function AdminLivrablesKanban() {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.push('/admin/login'); });
    fetch('/api/livrables')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLivrables(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const moveStatut = async (id: number, statut: Statut) => {
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

  const uploadFile = async (id: number, file: File) => {
    setUploadingId(id);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/livrables/${id}/upload`, { method: 'POST', body: formData });
    if (res.ok) {
      // Re-fetch to get updated fileName
      const listRes = await fetch('/api/livrables');
      if (listRes.ok) {
        const data = await listRes.json();
        setLivrables(Array.isArray(data) ? data : []);
      }
    }
    setUploadingId(null);
  };

  const removeFile = async (id: number) => {
    const res = await fetch(`/api/livrables/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: null, fileData: null }),
    });
    if (res.ok) {
      setLivrables(prev => prev.map(l => l.id === id ? { ...l, fileName: null } : l));
    }
  };

  const total = livrables.length;
  const valides = livrables.filter(l => l.statut === 'valide').length;
  const progress = total > 0 ? Math.round((valides / total) * 100) : 0;

  if (loading) return <div className="text-center py-12 text-[var(--color-text-light)]">Chargement...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-dark)]">Livrables</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Déplacez les livrables entre les colonnes et attachez les fichiers
          </p>
        </div>
        <a href="/admin" className="text-sm text-[var(--color-primary)] hover:underline">Dashboard</a>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--color-dark)]">Progression</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">{valides}/{total} validés ({progress}%)</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUTS.map(statut => {
          const col = COL[statut];
          const cards = livrables.filter(l => l.statut === statut).sort((a, b) => a.ordre - b.ordre);
          return (
            <div key={statut} className={`rounded-2xl border ${col.border} flex flex-col min-h-[400px]`}>
              <div className={`${col.header} rounded-t-2xl px-4 py-3 flex items-center justify-between`}>
                <span className="font-semibold text-sm">{col.label}</span>
                <span className="text-xs font-bold opacity-70">{cards.length}</span>
              </div>

              <div className={`flex-1 p-3 space-y-3 overflow-y-auto ${col.bg}`}>
                {cards.length === 0 && (
                  <p className="text-xs text-center text-[var(--color-text-light)] py-8 italic">Vide</p>
                )}
                {cards.map(l => (
                  <Card
                    key={l.id}
                    livrable={l}
                    currentStatut={statut}
                    onMove={moveStatut}
                    onUpload={uploadFile}
                    onRemoveFile={removeFile}
                    isUploading={uploadingId === l.id}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ livrable, currentStatut, onMove, onUpload, onRemoveFile, isUploading }: {
  livrable: Livrable;
  currentStatut: Statut;
  onMove: (id: number, statut: Statut) => void;
  onUpload: (id: number, file: File) => void;
  onRemoveFile: (id: number) => void;
  isUploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Move buttons: show arrows to adjacent columns
  const idx = STATUTS.indexOf(currentStatut);
  const canLeft = idx > 0;
  const canRight = idx < STATUTS.length - 1;

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-bg)] px-2 py-0.5 rounded">
          {livrable.numero}
        </span>
        <span className="text-[10px] text-[var(--color-text-light)] uppercase tracking-wider">Phase {livrable.phase}</span>
      </div>

      {/* Title */}
      <p className="font-medium text-sm text-[var(--color-dark)] leading-snug">{livrable.titre}</p>

      {/* Description */}
      {livrable.description && (
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{livrable.description}</p>
      )}

      {/* File */}
      {livrable.fileName ? (
        <div className="flex items-center gap-2">
          <a
            href={`/api/livrables/${livrable.id}/download`}
            className="flex-1 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg truncate hover:bg-green-100 transition-colors"
            title={livrable.fileName}
          >
            <span>📎</span>
            <span className="truncate">{livrable.fileName}</span>
          </a>
          <button
            onClick={() => onRemoveFile(livrable.id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
            title="Retirer le fichier"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full text-xs text-[var(--color-text-light)] border border-dashed border-[var(--color-border)] rounded-lg py-2 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          {isUploading ? 'Upload en cours...' : '+ Attacher un fichier'}
        </button>
      )}

      {/* Move arrows */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]">
        <button
          onClick={() => canLeft && onMove(livrable.id, STATUTS[idx - 1])}
          disabled={!canLeft}
          className={`text-xs px-2 py-1 rounded transition-colors ${canLeft ? 'text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]' : 'text-gray-200 cursor-default'}`}
        >
          ← {canLeft ? COL[STATUTS[idx - 1]].label : ''}
        </button>
        <button
          onClick={() => canRight && onMove(livrable.id, STATUTS[idx + 1])}
          disabled={!canRight}
          className={`text-xs px-2 py-1 rounded transition-colors ${canRight ? 'text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]' : 'text-gray-200 cursor-default'}`}
        >
          {canRight ? COL[STATUTS[idx + 1]].label : ''} →
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.html,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onUpload(livrable.id, file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
