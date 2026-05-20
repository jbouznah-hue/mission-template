import { siteConfig } from './site';

export interface PageConfig {
  slug: string;
  title: string;
  description: string;
  obligatoire: boolean;
  enabled: boolean;
  icon: string;
  ordre: number;
  group: 'core' | 'suivi' | 'outils';
}

export const pagesRegistry: PageConfig[] = [
  // === CORE (toujours présent) ===
  { slug: '/', title: 'Accueil', description: 'Vue d\'ensemble de la mission', obligatoire: true, enabled: true, icon: '🏠', ordre: 1, group: 'core' },
  { slug: '/besoin', title: 'Besoin', description: 'Analyse de la situation et des besoins du client', obligatoire: true, enabled: true, icon: '🎯', ordre: 2, group: 'core' },
  { slug: '/plan', title: 'Plan détaillé', description: 'Phases, tâches, responsabilités et dépendances', obligatoire: true, enabled: true, icon: '📋', ordre: 3, group: 'core' },
  { slug: '/livrables', title: 'Livrables & Suivi', description: 'Progression et statut des livrables', obligatoire: true, enabled: true, icon: '📦', ordre: 4, group: 'core' },
  { slug: '/conditions', title: 'Conditions', description: 'Investissement, PI, paiement, exclusions', obligatoire: true, enabled: true, icon: '📜', ordre: 5, group: 'core' },

  // === SUIVI (optionnel) ===
  { slug: '/comptes-rendus', title: 'Comptes Rendus', description: 'Notes de réunion et transcriptions', obligatoire: false, enabled: siteConfig.pages.comptesRendus, icon: '📝', ordre: 6, group: 'suivi' },
  { slug: '/suivi-temps', title: 'Suivi Temps', description: 'Chronomètre et saisie du temps passé', obligatoire: false, enabled: siteConfig.pages.suiviTemps, icon: '⏱️', ordre: 7, group: 'suivi' },
  { slug: '/arbitrages', title: 'Arbitrages', description: 'Journal des modifications du plan', obligatoire: false, enabled: siteConfig.pages.arbitrages, icon: '⚖️', ordre: 8, group: 'suivi' },
  { slug: '/messagerie', title: 'Messagerie', description: 'Échanges contextuels avec le client', obligatoire: false, enabled: true, icon: '💬', ordre: 9, group: 'suivi' },

  // === OUTILS (optionnel) ===
  { slug: '/verbatims', title: 'Verbatims', description: 'Citations exactes du client', obligatoire: false, enabled: siteConfig.pages.verbatims, icon: '💬', ordre: 10, group: 'outils' },
  { slug: '/demo', title: 'Démo Interactive', description: 'Maquettes cliquables du projet', obligatoire: false, enabled: siteConfig.pages.demoInteractive, icon: '🖥️', ordre: 11, group: 'outils' },
  { slug: '/cdc', title: 'Cahier des Charges', description: 'Spécifications techniques détaillées', obligatoire: false, enabled: siteConfig.pages.cdcTechnique, icon: '📐', ordre: 12, group: 'outils' },
  { slug: '/signatures', title: 'Signatures', description: 'Signatures électroniques', obligatoire: false, enabled: siteConfig.pages.signaturesElectroniques, icon: '✍️', ordre: 13, group: 'outils' },
  { slug: '/ecosysteme', title: 'Écosystème', description: 'Cartographie juridique et organisationnelle', obligatoire: false, enabled: siteConfig.pages.ecosystemeJuridique, icon: '🗺️', ordre: 14, group: 'outils' },
];

export const enabledPages = pagesRegistry.filter(p => p.enabled);
export const navPages = enabledPages.filter(p => p.group === 'core' || p.group === 'suivi');
