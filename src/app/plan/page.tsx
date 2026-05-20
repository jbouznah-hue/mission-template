import { definitions } from '@/config/definitions';

interface Task {
  numero: string;
  tache: string;
  responsabilite: string;
  detail: string;
  limites: string;
  depend_de: string;
}

interface PhaseSection {
  phaseKey: string;
  sousSections: {
    titre: string;
    taches: Task[];
  }[];
}

// Template data - replaced by prompt per client
const planData: PhaseSection[] = [
  {
    phaseKey: 'comprendre',
    sousSections: [
      {
        titre: '1.1 Audit & Cartographie',
        taches: [
          { numero: '1.1.1', tache: "Audit de l'existant", responsabilite: 'ORRTYL', detail: 'Analyse des outils, process et organisation actuels', limites: '1 rapport complet', depend_de: '—' },
          { numero: '1.1.2', tache: 'Entretiens parties prenantes', responsabilite: 'CLIENT', detail: 'Réunions individuelles avec les acteurs clés', limites: '3 entretiens max', depend_de: '1.1.1' },
          { numero: '1.1.3', tache: 'Synthèse des besoins', responsabilite: 'ORRTYL', detail: 'Document formalisant problèmes et objectifs', limites: '1 document', depend_de: '1.1.2' },
        ],
      },
    ],
  },
  {
    phaseKey: 'structurer',
    sousSections: [
      {
        titre: '2.1 Stratégie & Plan d\'action',
        taches: [
          { numero: '2.1.1', tache: 'Stratégie globale', responsabilite: 'ORRTYL', detail: "Plan directeur avec axes d'intervention et moyens", limites: '1 document stratégique', depend_de: '1.1.3' },
          { numero: '2.1.2', tache: 'Validation du plan', responsabilite: 'ENSEMBLE', detail: 'Session de présentation et validation client', limites: '1 session, 2h max', depend_de: '2.1.1' },
        ],
      },
    ],
  },
  {
    phaseKey: 'deployer',
    sousSections: [
      {
        titre: '3.1 Mise en oeuvre',
        taches: [
          { numero: '3.1.1', tache: 'Déploiement des outils', responsabilite: 'ORRTYL', detail: 'Création et configuration des outils validés dans le plan', limites: 'Selon périmètre validé', depend_de: '2.1.2' },
        ],
      },
    ],
  },
  {
    phaseKey: 'lancer',
    sousSections: [
      {
        titre: '4.1 Go-live & Formation',
        taches: [
          { numero: '4.1.1', tache: 'Formation équipe', responsabilite: 'ENSEMBLE', detail: 'Session de prise en main de tous les outils déployés', limites: '1 session, 2h max', depend_de: '3.1.1' },
        ],
      },
    ],
  },
  {
    phaseKey: 'accompagner',
    sousSections: [
      {
        titre: '5.1 Coaching & Reporting',
        taches: [
          { numero: '5.1.1', tache: 'Reporting mensuel', responsabilite: 'ORRTYL', detail: 'Rapport PDF : trafic, engagement, performance, KPIs', limites: '1 rapport/mois', depend_de: '4.1.1' },
        ],
      },
    ],
  },
];

const respColors: Record<string, string> = {
  ORRTYL: 'badge-info',
  CLIENT: 'badge-warning',
  ENSEMBLE: 'badge-success',
};

export default function PlanDetaille() {
  const phases = definitions.phases;

  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-xs font-medium mb-4">
          {definitions.concepts.plan_action.nom}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Plan Détaillé</h1>
        <p className="text-[var(--color-text-secondary)]">
          {definitions.concepts.plan_action.definition}
        </p>
      </section>

      {/* Phase legend */}
      <section className="card">
        <h3 className="font-semibold text-[var(--color-dark)] mb-4">Légende des responsabilités</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(definitions.responsabilites).map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`badge ${respColors[key]}`}>{key}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Phases */}
      {planData.map((section) => {
        const phase = phases[section.phaseKey as keyof typeof phases];
        if (!phase) return null;

        return (
          <section key={section.phaseKey}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg">
                {phase.numero}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-dark)]">
                  Phase {phase.numero} — {phase.nom}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {phase.responsabilite_defaut}
                </p>
              </div>
            </div>

            {section.sousSections.map((ss) => (
              <div key={ss.titre} className="mb-8">
                <h3 className="font-semibold text-[var(--color-dark)] mb-4">{ss.titre}</h3>
                <div className="overflow-x-auto">
                  <table className="table-mission">
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th>Tâche</th>
                        <th>Qui</th>
                        <th>Détail</th>
                        <th>Limites</th>
                        <th>Dépend de</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ss.taches.map((t) => (
                        <tr key={t.numero}>
                          <td className="font-mono text-xs font-semibold">{t.numero}</td>
                          <td className="font-medium">{t.tache}</td>
                          <td><span className={`badge ${respColors[t.responsabilite] || 'badge-gray'}`}>{t.responsabilite}</span></td>
                          <td className="text-[var(--color-text-secondary)]">{t.detail}</td>
                          <td className="text-[var(--color-text-light)] text-xs">{t.limites}</td>
                          <td className="font-mono text-xs">{t.depend_de}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="section-divider" />
          </section>
        );
      })}
    </div>
  );
}
