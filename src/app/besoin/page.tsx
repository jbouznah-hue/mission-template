'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { definitions } from '@/config/definitions';

interface Priority {
  id: string;
  level: 'critique' | 'haute' | 'importante' | 'secondaire';
  title: string;
  description: string;
  verbatim?: string;
}

interface Axe {
  num: string;
  title: string;
  desc: string;
  objectif: string;
  actions: string[];
  livrables: string[];
  timeline: string;
  phase: string;
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

const axes: Axe[] = [
  {
    num: '01',
    title: 'Stratégie digitale',
    desc: 'Audit complet, positionnement, plan d\'action structuré avec KPIs mesurables.',
    objectif: 'Définir une feuille de route claire qui aligne la présence digitale avec les objectifs business. Passer d\'une approche réactive à une stratégie proactive et mesurable.',
    actions: [
      'Audit de l\'existant : outils, process, présence en ligne, concurrence',
      'Définition des personas clients (3-4 profils types)',
      'Positionnement et messages clés par persona',
      'Plan d\'action sur 12 mois avec jalons trimestriels',
      'Définition des KPIs de suivi (trafic, conversion, CA)',
    ],
    livrables: [
      'Rapport d\'audit complet (PDF)',
      'Document personas (fiches détaillées)',
      'Plan stratégique 12 mois',
      'Tableau de bord KPIs',
    ],
    timeline: 'Mois 1-2',
    phase: 'Comprendre + Structurer',
  },
  {
    num: '02',
    title: 'Site web & CRM',
    desc: 'Site professionnel bilingue, back-office de gestion client, prise de rendez-vous en ligne.',
    objectif: 'Créer une vitrine professionnelle qui convertit les visiteurs en clients, couplée à un outil de gestion qui centralise toute la relation client.',
    actions: [
      'Maquette mobile-first (5 pages : Accueil, Services, À propos, Contact, RDV)',
      'Développement site bilingue FR/HE avec hébergement inclus',
      'Intégration d\'un système de prise de rendez-vous en ligne',
      'CRM : dashboard clients, historique, statuts, relances',
      'Formation à l\'utilisation du back-office (1 session)',
    ],
    livrables: [
      'Site web 5 pages en ligne',
      'Back-office CRM fonctionnel',
      'Système de réservation intégré',
      'Guide utilisateur (PDF)',
    ],
    timeline: 'Mois 2-4',
    phase: 'Déployer',
  },
  {
    num: '03',
    title: 'Marketing & Réseaux',
    desc: 'Présence optimisée sur Instagram, Facebook, Google. Planning éditorial automatisé.',
    objectif: 'Bâtir une présence digitale cohérente sur les canaux où se trouvent les clients. Automatiser la publication pour maintenir une régularité sans effort quotidien.',
    actions: [
      'Création et optimisation des profils Instagram, Facebook, Google My Business',
      'Création de 6 templates de posts réutilisables',
      'Rédaction et programmation de 12 posts pour le mois de lancement',
      'Configuration de l\'automatisation de publication (planning mensuel)',
      'Stratégie de contenu : calendrier éditorial type sur 3 mois',
      'Lancement de la première campagne publicitaire Meta',
    ],
    livrables: [
      'Profils sociaux créés et optimisés',
      '6 templates de posts (Canva/Figma)',
      'Calendrier éditorial 3 mois',
      '8 visuels publicitaires',
      'Campagne Meta configurée',
    ],
    timeline: 'Mois 3-5',
    phase: 'Déployer + Lancer',
  },
  {
    num: '04',
    title: 'Automatisations',
    desc: 'WhatsApp Business, bot IA, relances automatiques, facturation connectée.',
    objectif: 'Éliminer les tâches manuelles répétitives pour libérer du temps sur le cœur de métier. Chaque interaction client est automatiquement tracée et suivie.',
    actions: [
      'Configuration WhatsApp Business Pro (profil, horaires, catalogue)',
      'Mise en place des messages automatiques (confirmation, rappel, suivi)',
      'Développement d\'un bot IA conversationnel (FAQ + prise de RDV)',
      'Connexion facturation : CRM → génération automatique de factures',
      'Configuration des relances automatiques (J+1, J+3, J+7)',
    ],
    livrables: [
      'WhatsApp Business configuré',
      'Bot IA opérationnel (FR/HE)',
      '3 séquences de messages automatiques',
      'Intégration facturation',
      'Documentation des workflows',
    ],
    timeline: 'Mois 4-6',
    phase: 'Déployer + Accompagner',
  },
];

const levelConfig = {
  critique: { label: 'Critique', badge: 'badge-error', dot: 'bg-red-500' },
  haute: { label: 'Haute', badge: 'badge-warning', dot: 'bg-orange-500' },
  importante: { label: 'Importante', badge: 'badge-info', dot: 'bg-yellow-500' },
  secondaire: { label: 'Secondaire', badge: 'badge-gray', dot: 'bg-gray-400' },
};

export default function Besoin() {
  const [openAxe, setOpenAxe] = useState<string | null>(null);

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

      {/* Axes d'intervention - Accordion */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-dark)] mb-2">
          Axes d&apos;intervention proposés
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Cliquez sur chaque axe pour voir le détail complet
        </p>

        <div className="space-y-4">
          {axes.map((axe) => {
            const isOpen = openAxe === axe.num;
            return (
              <div key={axe.num} className={`card transition-all duration-300 ${isOpen ? 'border-[var(--color-primary-border)] shadow-lg' : ''}`}>
                {/* Header - clickable */}
                <button
                  onClick={() => setOpenAxe(isOpen ? null : axe.num)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {axe.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-dark)] text-lg">{axe.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{axe.desc}</p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-[var(--color-text-light)] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-[var(--color-border)] space-y-6 animate-fade-in">
                    {/* Objectif */}
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-2">Objectif</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{axe.objectif}</p>
                    </div>

                    {/* Timeline + Phase badges */}
                    <div className="flex flex-wrap gap-3">
                      <span className="badge badge-info">{axe.timeline}</span>
                      <span className="badge badge-gray">{axe.phase}</span>
                    </div>

                    {/* Actions concrètes */}
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-3">Actions concrètes</h4>
                      <div className="space-y-2">
                        {axe.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary)] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Livrables attendus */}
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-3">Livrables attendus</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {axe.livrables.map((livrable, i) => (
                          <div key={i} className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm">
                            <span className="text-green-500">✓</span>
                            {livrable}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
