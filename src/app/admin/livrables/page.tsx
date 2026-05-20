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
  file_name: string | null;
  file_data: string | null;
  ordre: number;
}

type Statut = 'a_faire' | 'en_cours' | 'bloque' | 'valide';

const STATUTS: Statut[] = ['a_faire', 'en_cours', 'bloque', 'valide'];

const STATUT_LABELS: Record<Statut, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  bloque: 'Bloqué',
  valide: 'Validé',
};

const COLUMN_COLORS: Record<Statut, { border: string; header: string; badge: string }> = {
  a_faire: {
    border: 'border-gray-300',
    header: 'bg-gray-100 text-gray-700',
    badge: 'badge-gray',
  },
  en_cours: {
    border: 'border-blue-300',
    header: 'bg-blue-100 text-blue-700',
    badge: 'badge-info',
  },
  bloque: {
    border: 'border-orange-300',
    header: 'bg-orange-100 text-orange-700',
    badge: 'badge-warning',
  },
  valide: {
    border: 'border-green-300',
    header: 'bg-green-100 text-green-700',
    badge: 'badge-success',
  },
};

interface NewLivrableForm {
  phase: string;
  numero: string;
  titre: string;
  description: string;
}

export default function AdminLivrablesKanban() {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewLivrableForm>({ phase: '1', numero: '', titre: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.push('/admin/login'); });
    fetch('/api/livrables')
      .then(r => r.json())
      .then(data => { setLivrables(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
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

  const deleteLivrable = async (id: number) => {
    if (!confirm('Supprimer ce livrable ?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/livrables/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLivrables(prev => prev.filter(l => l.id !== id));
    }
    setDeletingId(null);
  };

  const addLivrable = async () => {
    if (!form.titre.trim() || !form.numero.trim()) return;
    setSubmitting(true);
    const res = await fetch('/api/livrables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phase: parseInt(form.phase),
        numero: form.numero,
        titre: form.titre,
        description: form.description,
        responsabilite: 'ORRTYL',
        ordre: 0,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setLivrables(prev => [...prev, created]);
      setShowModal(false);
      setForm({ phase: '1', numero: '', titre: '', description: '' });
    }
    setSubmitting(false);
  };

  const uploadFile = async (id: number, file: File) => {
    setUploadingId(id);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/livrables/${id}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const updated = await res.json();
      setLivrables(prev => prev.map(l => l.id === id ? updated : l));
    }
    setUploadingId(null);
  };

  const getLivrablesForStatut = (statut: Statut) =>
    livrables.filter(l => l.statut === statut);

  if (loading) {
    return (
      <div className="text-center py-12 text-[var(--color-text-light)]">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-dark)]">Livrables — Kanban</h1>
          <a href="/admin" className="text-sm text-[var(--color-primary)] hover:underline">
            ← Retour au dashboard
          </a>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          + Nouveau livrable
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUTS.map(statut => {
          const cols = COLUMN_COLORS[statut];
          const cards = getLivrablesForStatut(statut);
          return (
            <div
              key={statut}
              className={`rounded-xl border-2 ${cols.border} flex flex-col`}
              style={{ minHeight: 480 }}
            >
              {/* Column Header */}
              <div className={`${cols.header} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
                <span className="font-semibold text-sm">{STATUT_LABELS[statut]}</span>
                <span className="text-xs font-bold bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {cards.length === 0 && (
                  <p className="text-xs text-center text-[var(--color-text-light)] py-6">
                    Aucun livrable
                  </p>
                )}
                {cards.map(livrable => (
                  <LivrableCard
                    key={livrable.id}
                    livrable={livrable}
                    badgeClass={cols.badge}
                    onStatusChange={updateStatut}
                    onDelete={deleteLivrable}
                    onUpload={uploadFile}
                    isUploading={uploadingId === livrable.id}
                    isDeleting={deletingId === livrable.id}
                    fileInputRef={(el) => { fileInputRefs.current[livrable.id] = el; }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-dark)]">Nouveau livrable</h2>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                    Phase
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.phase}
                    onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                    Numéro *
                  </label>
                  <input
                    type="text"
                    placeholder="ex: L1.1"
                    value={form.numero}
                    onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  placeholder="Titre du livrable"
                  value={form.titre}
                  onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Description (optionnelle)"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addLivrable}
                disabled={submitting || !form.titre.trim() || !form.numero.trim()}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface LivrableCardProps {
  livrable: Livrable;
  badgeClass: string;
  onStatusChange: (id: number, statut: string) => void;
  onDelete: (id: number) => void;
  onUpload: (id: number, file: File) => void;
  isUploading: boolean;
  isDeleting: boolean;
  fileInputRef: (el: HTMLInputElement | null) => void;
}

function LivrableCard({
  livrable,
  badgeClass,
  onStatusChange,
  onDelete,
  onUpload,
  isUploading,
  isDeleting,
  fileInputRef,
}: LivrableCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(livrable.id, file);
    e.target.value = '';
  };

  return (
    <div className="card bg-white rounded-xl border border-[var(--color-border)] p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow">
      {/* Top row: numero + phase badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-bg)] px-2 py-1 rounded">
          {livrable.numero}
        </span>
        <span className="text-xs text-[var(--color-text-light)]">Phase {livrable.phase}</span>
      </div>

      {/* Title */}
      <p className="font-semibold text-sm text-[var(--color-dark)] leading-snug">
        {livrable.titre}
      </p>

      {/* Description */}
      {livrable.description && (
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
          {livrable.description}
        </p>
      )}

      {/* File badge */}
      {livrable.file_name && (
        <div className="flex items-center gap-1.5">
          <span className="badge badge-success text-xs truncate max-w-[140px]" title={livrable.file_name}>
            📎 {livrable.file_name}
          </span>
        </div>
      )}

      {/* Actions row */}
      <div className="pt-1 border-t border-[var(--color-border)] flex items-center gap-2 flex-wrap">
        {/* Status selector */}
        <select
          value={livrable.statut}
          onChange={e => onStatusChange(livrable.id, e.target.value)}
          className="flex-1 min-w-0 px-2 py-1 border border-[var(--color-border)] rounded text-xs bg-white"
        >
          {STATUTS.map(s => (
            <option key={s} value={s}>{STATUT_LABELS[s]}</option>
          ))}
        </select>

        {/* Upload button */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          title="Attacher un fichier"
          className="px-2 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {isUploading ? '⏳' : '📎'}
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(livrable.id)}
          disabled={isDeleting}
          title="Supprimer"
          className="px-2 py-1 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {isDeleting ? '⏳' : '🗑'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={el => {
          inputRef.current = el;
          fileInputRef(el);
        }}
        type="file"
        accept=".pdf,.xlsx,.html,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
