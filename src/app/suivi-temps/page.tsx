'use client';

import { useState, useEffect, useRef } from 'react';

interface TempsEntry {
  id: number;
  date: string;
  duree_minutes: number;
  categorie: string;
  description: string;
}

const categories = ['reunion', 'production', 'strategie', 'admin', 'autre'];
const catLabels: Record<string, string> = {
  reunion: 'Réunion', production: 'Production', strategie: 'Stratégie', admin: 'Admin', autre: 'Autre',
};

export default function SuiviTemps() {
  const [entries, setEntries] = useState<TempsEntry[]>([]);
  const [chrono, setChrono] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Manual form
  const [manualDate, setManualDate] = useState(new Date().toISOString().slice(0, 10));
  const [manualHours, setManualHours] = useState(0);
  const [manualMinutes, setManualMinutes] = useState(0);
  const [manualCat, setManualCat] = useState('production');
  const [manualDesc, setManualDesc] = useState('');

  useEffect(() => {
    fetch('/api/temps').then(r => r.json()).then(setEntries).catch(() => {});
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setChrono(c => c + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  };

  const saveChronoEntry = async () => {
    if (chrono < 60) return;
    const cat = prompt('Catégorie (reunion/production/strategie/admin/autre):') || 'autre';
    const desc = prompt('Description:') || '';
    const res = await fetch('/api/temps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        duree_minutes: Math.round(chrono / 60),
        categorie: cat,
        description: desc,
      }),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries(prev => [entry, ...prev]);
      setChrono(0);
      setRunning(false);
    }
  };

  const saveManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const duree = manualHours * 60 + manualMinutes;
    if (duree <= 0) return;
    const res = await fetch('/api/temps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: manualDate,
        duree_minutes: duree,
        categorie: manualCat,
        description: manualDesc,
      }),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries(prev => [entry, ...prev]);
      setManualHours(0);
      setManualMinutes(0);
      setManualDesc('');
    }
  };

  // Summary by category
  const summary = categories.map(cat => ({
    cat,
    label: catLabels[cat],
    total: entries.filter(e => e.categorie === cat).reduce((s, e) => s + e.duree_minutes, 0),
  }));
  const grandTotal = entries.reduce((s, e) => s + e.duree_minutes, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Suivi des Temps</h1>
        <p className="text-[var(--color-text-secondary)]">Chronomètre interactif et saisie manuelle du temps passé sur la mission</p>
      </section>

      {/* Chrono */}
      <section className="card text-center">
        <h2 className="font-semibold text-[var(--color-dark)] mb-4">Chronomètre</h2>
        <div className="text-5xl font-mono font-bold text-[var(--color-primary)] mb-6">{formatTime(chrono)}</div>
        <div className="flex justify-center gap-3">
          {!running ? (
            <button onClick={() => setRunning(true)} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Démarrer
            </button>
          ) : (
            <button onClick={() => setRunning(false)} className="px-6 py-3 bg-[var(--color-error)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Arrêter
            </button>
          )}
          {chrono > 0 && !running && (
            <button onClick={saveChronoEntry} className="px-6 py-3 bg-[var(--color-success)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Enregistrer
            </button>
          )}
        </div>
      </section>

      {/* Manual entry */}
      <section className="card">
        <h2 className="font-semibold text-[var(--color-dark)] mb-4">Saisie manuelle</h2>
        <form onSubmit={saveManualEntry} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Date</label>
            <input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm" />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Heures</label>
              <input type="number" min={0} max={24} value={manualHours} onChange={e => setManualHours(+e.target.value)} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Minutes</label>
              <input type="number" min={0} max={59} step={5} value={manualMinutes} onChange={e => setManualMinutes(+e.target.value)} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Catégorie</label>
            <select value={manualCat} onChange={e => setManualCat(e.target.value)} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm">
              {categories.map(c => <option key={c} value={c}>{catLabels[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Description</label>
            <input type="text" value={manualDesc} onChange={e => setManualDesc(e.target.value)} placeholder="Description..." className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Ajouter
          </button>
        </form>
      </section>

      {/* Summary */}
      <section className="card">
        <h2 className="font-semibold text-[var(--color-dark)] mb-4">Récapitulatif</h2>
        <div className="space-y-2">
          {summary.map(s => (
            <div key={s.cat} className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-secondary)]">{s.label}</span>
              <span className="text-sm font-semibold">{formatMinutes(s.total)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-bold text-[var(--color-primary)]">
            <span>Total</span>
            <span>{formatMinutes(grandTotal)}</span>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="card">
        <h2 className="font-semibold text-[var(--color-dark)] mb-4">Historique</h2>
        {entries.length === 0 ? (
          <p className="text-center py-6 text-[var(--color-text-light)]">Aucune entrée enregistrée</p>
        ) : (
          <table className="table-mission">
            <thead>
              <tr>
                <th>Date</th>
                <th>Durée</th>
                <th>Catégorie</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td className="text-xs">{e.date}</td>
                  <td className="font-semibold">{formatMinutes(e.duree_minutes)}</td>
                  <td><span className="badge badge-info">{catLabels[e.categorie] || e.categorie}</span></td>
                  <td className="text-[var(--color-text-secondary)]">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
