/**
 * DEFINITIONS METIER - SOURCE DE VERITE
 * Chaque concept utilisé dans les missions ORRTYL est défini ici.
 * Ces définitions sont injectées dans le prompt de génération
 * et affichées en tooltip/aide dans l'interface.
 */

export const definitions = {
  // === PHASES DE MISSION ===
  phases: {
    comprendre: {
      numero: 1,
      nom: "Comprendre",
      definition: "Phase d'immersion et de diagnostic. On écoute, on observe, on cartographie l'existant. Aucune solution n'est proposée à ce stade — on cherche à comprendre la réalité du terrain, les douleurs, les opportunités et les contraintes.",
      livrables_types: ["Audit de l'existant", "Cartographie de l'écosystème", "Document de synthèse des besoins", "Verbatims clés"],
      responsabilite_defaut: "ORRTYL réalise, Client fournit accès et informations",
    },
    structurer: {
      numero: 2,
      nom: "Structurer",
      definition: "Phase de conception stratégique. On transforme la compréhension en plan d'action concret. On définit les priorités, les ressources nécessaires, le chiffrage et le calendrier. Le client valide la direction avant toute exécution.",
      livrables_types: ["Plan d'action détaillé", "Stratégie par axe", "Chiffrage & prévisionnel", "Matrice de priorisation"],
      responsabilite_defaut: "ORRTYL propose, Client valide",
    },
    deployer: {
      numero: 3,
      nom: "Déployer",
      definition: "Phase de mise en œuvre opérationnelle. On exécute le plan d'action validé : création des outils, mise en place des process, développement des supports. C'est la phase de production concrète.",
      livrables_types: ["Outils créés", "Process documentés", "Supports produits", "Intégrations configurées"],
      responsabilite_defaut: "ORRTYL réalise, Client fournit contenus",
    },
    lancer: {
      numero: 4,
      nom: "Lancer",
      definition: "Phase de mise en marché et d'activation. On passe du mode projet au mode opérationnel. Formation des équipes, lancement des campagnes, go-live des outils. Le client prend progressivement la main.",
      livrables_types: ["Formation équipe", "Campagnes lancées", "Go-live validé", "Guide utilisateur"],
      responsabilite_defaut: "ENSEMBLE — ORRTYL forme, Client exécute",
    },
    accompagner: {
      numero: 5,
      nom: "Accompagner",
      definition: "Phase de suivi et d'optimisation post-lancement. Reporting mensuel, ajustements stratégiques, coaching opérationnel. Le client pilote, ORRTYL coache et optimise. Durée variable selon le contrat.",
      livrables_types: ["Reporting mensuel", "Optimisations", "Recommandations", "Bilan de mission"],
      responsabilite_defaut: "Client pilote, ORRTYL coache",
    },
  },

  // === CONCEPTS METIER ===
  concepts: {
    audit: {
      nom: "Audit",
      definition: "Analyse factuelle et objective de l'existant. On regarde ce qui est en place (outils, process, équipes, finances) sans jugement. L'audit produit un état des lieux documenté qui sert de base à toute recommandation.",
      quand: "Toujours en Phase 1 (Comprendre)",
    },
    ecosysteme: {
      nom: "Écosystème",
      definition: "Vue complète de l'environnement du client : structures juridiques, marques, activités, outils utilisés, parties prenantes, flux financiers. C'est la cartographie de tout ce qui gravite autour du projet.",
      quand: "Phase 1 (Comprendre) — obligatoire si multi-entités ou activités multiples",
    },
    besoin: {
      nom: "Besoin",
      definition: "Expression formalisée des problèmes à résoudre et des objectifs à atteindre. Issu du transcript de réunion, validé avec le client. Distingue les besoins exprimés (ce que le client dit) des besoins latents (ce qu'on détecte).",
      quand: "Phase 1 (Comprendre) — toujours présent",
    },
    strategie: {
      nom: "Stratégie",
      definition: "Plan directeur qui définit la direction, les axes d'intervention et les moyens à mobiliser. La stratégie répond au 'pourquoi' et au 'quoi' avant le 'comment'. Elle est validée avant toute exécution.",
      quand: "Phase 2 (Structurer)",
    },
    plan_action: {
      nom: "Plan d'action",
      definition: "Découpage opérationnel de la stratégie en tâches concrètes avec responsabilités, dépendances, limites et critères de validation. Chaque tâche est numérotée (ex: 3.1.2) et rattachée à une phase.",
      quand: "Phase 2 (Structurer) — toujours présent",
    },
    chiffrage: {
      nom: "Chiffrage",
      definition: "Estimation financière de la mission : investissement mensuel, durée d'engagement, frais inclus/exclus, conditions de paiement, propriété intellectuelle. Transparent et détaillé.",
      quand: "Phase 2 (Structurer) — toujours dans les Conditions",
    },
    livrable: {
      nom: "Livrable",
      definition: "Résultat tangible et vérifiable d'une tâche. Un livrable a un format défini (PDF, site, document, fonctionnalité), des critères de validation et un responsable. Son statut est suivi dans le back-office.",
      quand: "Toutes les phases — suivi continu",
    },
    verbatim: {
      nom: "Verbatim",
      definition: "Citation exacte du client extraite du transcript de réunion. Les verbatims illustrent les besoins dans les mots du client et servent de preuve de compréhension. Ils sont présentés entre guillemets avec le contexte.",
      quand: "Phase 1 (Comprendre) — optionnel mais recommandé",
    },
    arbitrage: {
      nom: "Arbitrage",
      definition: "Décision de modification du plan initial. Tout changement (ajout, modification, suppression de tâche ou livrable) est documenté comme arbitrage avec sa source, son impact et sa validation.",
      quand: "Toutes les phases — journal des modifications",
    },
  },

  // === RESPONSABILITES ===
  responsabilites: {
    ORRTYL: "ORRTYL réalise — Le prestataire exécute et livre",
    CLIENT: "CLIENT réalise — Le client fournit, décide ou exécute",
    ENSEMBLE: "ENSEMBLE — Travail collaboratif, co-construction",
  },

  // === STATUTS LIVRABLES ===
  statuts: {
    a_faire: { label: "À faire", color: "gray", description: "Pas encore commencé" },
    brouillon: { label: "Brouillon", color: "yellow", description: "En cours de production" },
    en_review: { label: "En review", color: "blue", description: "Soumis au client pour validation" },
    valide: { label: "Validé", color: "green", description: "Approuvé par le client" },
  },
} as const;

export type Phase = keyof typeof definitions.phases;
export type Concept = keyof typeof definitions.concepts;
export type Responsabilite = keyof typeof definitions.responsabilites;
export type StatutLivrable = keyof typeof definitions.statuts;
