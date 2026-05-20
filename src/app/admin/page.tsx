'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  livrables: { total: number; valides: number; en_review: number };
  temps: { total_minutes: number };
  messages: { unread: number };
  arbitrages: { proposes: number };
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => setAuthenticated(true))
      .catch(() => router.push('/admin/login'));
  }, [router]);

  useEffect(() => {
    if (!authenticated) return;
    Promise.all([
      fetch('/api/livrables').then(r => r.ok ? r.json() : []),
      fetch('/api/temps').then(r => r.ok ? r.json() : []),
      fetch('/api/messages').then(r => r.ok ? r.json() : []),
      fetch('/api/arbitrages').then(r => r.ok ? r.json() : []),
    ]).then(([livrables, temps, messages, arbitrages]) => {
      setStats({
        livrables: {
          total: Array.isArray(livrables) ? livrables.length : 0,
          valides: Array.isArray(livrables) ? livrables.filter((l: { statut: string }) => l.statut === 'valide').length : 0,
          en_review: Array.isArray(livrables) ? livrables.filter((l: { statut: string }) => l.statut === 'en_review').length : 0,
        },
        temps: {
          total_minutes: Array.isArray(temps) ? temps.reduce((s: number, e: { duree_minutes: number }) => s + (e.duree_minutes || 0), 0) : 0,
        },
        messages: {
          unread: Array.isArray(messages) ? messages.filter((m: { lu: boolean; auteur: string }) => !m.lu && m.auteur === 'client').length : 0,
        },
        arbitrages: {
          proposes: Array.isArray(arbitrages) ? arbitrages.filter((a: { statut: string }) => a.statut === 'propose').length : 0,
        },
      });
    }).catch(() => {
      setStats({ livrables: { total: 0, valides: 0, en_review: 0 }, temps: { total_minutes: 0 }, messages: { unread: 0 }, arbitrages: { proposes: 0 } });
    });
  }, [authenticated]);

  if (!authenticated) return <div className="text-center py-12 text-[var(--color-text-light)]">Chargement...</div>;

  const formatMinutes = (m: number) => `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}min`;

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-dark)]">Administration</h1>
        <button onClick={logout} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors">
          Déconnexion
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)]">{stats.livrables.valides}/{stats.livrables.total}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">Livrables validés</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--color-info)]">{formatMinutes(stats.temps.total_minutes)}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">Temps total</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--color-warning)]">{stats.messages.unread}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">Messages non lus</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-[var(--color-error)]">{stats.arbitrages.proposes}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">Arbitrages en attente</div>
          </div>
        </div>
      )}

      {/* Back-office actions */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">Back-office</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/livrables" className="card phase-card group block">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">Livrables</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Gérer les statuts et la progression</p>
          </Link>
          <Link href="/admin/comptes-rendus" className="card phase-card group block">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">Comptes rendus</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Upload audio, transcrire et publier</p>
          </Link>
          <Link href="/messagerie" className="card phase-card group block">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">Messagerie</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Échanges avec le client</p>
          </Link>
        </div>
      </section>

      {/* Client-facing pages */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">Pages client</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/', label: 'Accueil', icon: '🏠' },
            { href: '/besoin', label: 'Besoin', icon: '🎯' },
            { href: '/plan', label: 'Plan', icon: '📋' },
            { href: '/livrables', label: 'Livrables', icon: '📦' },
            { href: '/conditions', label: 'Conditions', icon: '📜' },
            { href: '/comptes-rendus', label: 'Comptes Rendus', icon: '📝' },
            { href: '/suivi-temps', label: 'Suivi Temps', icon: '⏱️' },
            { href: '/arbitrages', label: 'Arbitrages', icon: '⚖️' },
          ].map(p => (
            <Link key={p.href} href={p.href} className="card text-center py-4 hover:border-[var(--color-primary-border)] transition-colors">
              <div className="text-xl">{p.icon}</div>
              <div className="text-xs font-medium text-[var(--color-text-secondary)] mt-1">{p.label}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
