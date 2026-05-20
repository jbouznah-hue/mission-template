import { siteConfig } from '@/config/site';
import { definitions } from '@/config/definitions';
import Link from 'next/link';

export default function Accueil() {
  const phases = Object.values(definitions.phases);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] text-sm font-medium mb-6">
          Proposition de collaboration
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] mb-4">
          {siteConfig.client.name}
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-2">
          {siteConfig.client.tagline}
        </p>
        <p className="text-sm text-[var(--color-text-light)]">
          Suite à notre réunion du {siteConfig.client.reunionDate} ({siteConfig.client.reunionDuration})
        </p>
      </section>

      {/* Key info cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--color-primary)]">{siteConfig.client.name}</div>
          <div className="text-sm text-[var(--color-text-secondary)] mt-1">Client</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--color-primary)]">{siteConfig.entity.brand}</div>
          <div className="text-sm text-[var(--color-text-secondary)] mt-1">Accompagnement par</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--color-primary)]">{siteConfig.client.location}</div>
          <div className="text-sm text-[var(--color-text-secondary)] mt-1">Localisation</div>
        </div>
      </section>

      {/* Phases overview */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">
          Un accompagnement structuré en {phases.length} phases
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          De la compréhension de vos besoins jusqu&apos;au coaching post-lancement
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {phases.map((phase) => (
            <div key={phase.numero} className="card phase-card text-center">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-bold flex items-center justify-center mx-auto mb-3">
                {phase.numero}
              </div>
              <h3 className="font-semibold text-[var(--color-dark)] mb-2">{phase.nom}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {phase.definition.split('.')[0]}.
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Context */}
      <section className="card">
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">Contexte</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Suite à notre réunion du {siteConfig.client.reunionDate}, ce document formalise notre proposition de collaboration. Il couvre l&apos;ensemble du périmètre discuté : de la compréhension de votre écosystème actuel jusqu&apos;au déploiement opérationnel et l&apos;accompagnement post-lancement. Chaque phase, chaque livrable et chaque engagement y sont détaillés de manière transparente.
        </p>
      </section>

      {/* Navigation cards */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Explorer ce document</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/besoin', title: 'Votre Besoin', desc: 'Priorités identifiées, verbatims de réunion, reformulation des enjeux' },
            { href: '/plan', title: 'Plan Détaillé', desc: 'Phases, tâches, responsabilités et dépendances' },
            { href: '/livrables', title: 'Livrables & Suivi', desc: 'Liste exhaustive, timeline, jalons de validation' },
            { href: '/conditions', title: 'Conditions', desc: 'Investissement, garde-fous contractuels, engagements' },
            { href: '/comptes-rendus', title: 'Comptes Rendus', desc: 'Notes de réunion et transcriptions' },
            { href: '/messagerie', title: 'Messagerie', desc: 'Échanges contextuels en temps réel' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="card phase-card group block">
              <h3 className="font-semibold text-[var(--color-dark)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
              <div className="mt-3 text-[var(--color-primary)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explorer →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
