import { siteConfig } from '@/config/site';
import { definitions } from '@/config/definitions';

interface Priority {
  id: string;
  level: 'critique' | 'haute' | 'importante' | 'secondaire';
  title: string;
  description: string;
  verbatim?: string;
}

// Demo data - replaced by prompt per client
const priorities: Priority[] = [
  {
    id: 'P1',
    level: 'critique',
    title: 'Structuration digitale complète',
    description: 'Centraliser tous les outils et process dans un écosystème unifié. Remplacer les solutions fragmentées par une plateforme cohérente.',
    verbatim: 'Aujourd\'hui tout est éparpillé, je perds un temps fou à jongler entre les outils.',
  },
  {
    id: 'P2',
    level: 'critique',
    title: 'Visibilité en ligne et acquisition',
    description: 'Créer une présence digitale professionnelle qui génère des leads qualifiés. Site web, réseaux sociaux, référencement.',
    verbatim: 'Les clients me trouvent par le bouche-à-oreille mais je n\'ai aucune visibilité en ligne.',
  },
  {
    id: 'P3',
    level: 'haute',
    title: 'Automatisation des process récurrents',
    description: 'Automatiser les tâches chronophages : relances, confirmations, facturation, reporting.',
  },
  {
    id: 'P4',
    level: 'importante',
    title: 'Pilotage et tableaux de bord',
    description: 'Avoir une vision claire et en temps réel de l\'activité : chiffre d\'affaires, pipeline, performance des campagnes.',
  },
];

const levelConfig = {
  critique: { label: 'Critique', badge: 'badge-error', dot: 'bg-red-500' },
  haute: { label: 'Haute', badge: 'badge-warning', dot: 'bg-orange-500' },
  importante: { label: 'Importante', badge: 'badge-info', dot: 'bg-yellow-500' },
  secondaire: { label: 'Secondaire', badge: 'badge-gray', dot: 'bg-gray-400' },
};

export default function Besoin() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-xs font-medium mb-4">
          {definitions.concepts.besoin.nom}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-dark)] mb-2">Votre Besoin</h1>
        <p className="text-[var(--color-text-secondary)]">
          {definitions.concepts.besoin.definition}
        </p>
      </section>

      {/* Priorities */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6">
          Priorités identifiées
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Établies à partir de l&apos;analyse de l&apos;écosystème et des entretiens du {siteConfig.client.reunionDate}
        </p>

        <div className="space-y-4">
          {priorities.map((p) => {
            const config = levelConfig[p.level];
            return (
              <div key={p.id} className="card phase-card">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary-bg)] flex items-center justify-center text-[var(--color-primary)] font-bold">
                    {p.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--color-dark)]">{p.title}</h3>
                      <span className={`badge ${config.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-3">{p.description}</p>
                    {p.verbatim && (
                      <blockquote className="border-l-3 border-[var(--color-primary)] pl-4 italic text-sm text-[var(--color-text-light)]">
                        &ldquo;{p.verbatim}&rdquo;
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="section-divider" />

      {/* Propositions */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6">
          Axes d&apos;intervention proposés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { num: '01', title: 'Stratégie digitale', desc: 'Audit complet, positionnement, plan d\'action structuré avec KPIs mesurables.' },
            { num: '02', title: 'Site web & CRM', desc: 'Site professionnel bilingue, back-office de gestion client, prise de rendez-vous en ligne.' },
            { num: '03', title: 'Marketing & Réseaux', desc: 'Présence optimisée sur Instagram, Facebook, Google. Planning éditorial automatisé.' },
            { num: '04', title: 'Automatisations', desc: 'WhatsApp Business, bot IA, relances automatiques, facturation connectée.' },
          ].map((axe) => (
            <div key={axe.num} className="card phase-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {axe.num}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-dark)] mb-1">{axe.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{axe.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
