import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { livrables, adminUsers, comptesRendus } from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('🌱 Seeding database...');

  // Admin user
  await db.insert(adminUsers).values({
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: 'env-based-auth', // Auth is env-based, not DB-based
  }).onConflictDoNothing();

  // Template livrables - these are replaced by the prompt per client
  const templateLivrables = [
    // Phase 1 - Comprendre
    { phase: 1, numero: '1.1.1', titre: 'Audit de l\'existant', description: 'Analyse factuelle des outils, process et organisation actuels', responsabilite: 'ORRTYL' as const, ordre: 1 },
    { phase: 1, numero: '1.1.2', titre: 'Cartographie de l\'écosystème', description: 'Vue complète des entités, marques, activités et flux', responsabilite: 'ORRTYL' as const, ordre: 2 },
    { phase: 1, numero: '1.1.3', titre: 'Document de synthèse des besoins', description: 'Formalisation des problèmes à résoudre et objectifs', responsabilite: 'ORRTYL' as const, ordre: 3 },
    { phase: 1, numero: '1.1.4', titre: 'Validation du besoin', description: 'Le client confirme que la synthèse reflète sa réalité', responsabilite: 'CLIENT' as const, ordre: 4 },

    // Phase 2 - Structurer
    { phase: 2, numero: '2.1.1', titre: 'Stratégie globale', description: 'Plan directeur avec axes d\'intervention et moyens', responsabilite: 'ORRTYL' as const, ordre: 10 },
    { phase: 2, numero: '2.1.2', titre: 'Plan d\'action détaillé', description: 'Découpage en tâches avec responsabilités et dépendances', responsabilite: 'ORRTYL' as const, ordre: 11 },
    { phase: 2, numero: '2.1.3', titre: 'Chiffrage & prévisionnel', description: 'Estimation financière et calendrier prévisionnel', responsabilite: 'ORRTYL' as const, ordre: 12 },
    { phase: 2, numero: '2.1.4', titre: 'Validation du plan', description: 'Le client approuve la stratégie et le chiffrage', responsabilite: 'CLIENT' as const, ordre: 13 },

    // Phase 3 - Déployer
    { phase: 3, numero: '3.1.1', titre: 'Mise en place des outils', description: 'Création et configuration des outils validés', responsabilite: 'ORRTYL' as const, ordre: 20 },
    { phase: 3, numero: '3.1.2', titre: 'Production des supports', description: 'Création des supports de communication et marketing', responsabilite: 'ORRTYL' as const, ordre: 21 },
    { phase: 3, numero: '3.1.3', titre: 'Documentation des process', description: 'Rédaction des procédures opérationnelles', responsabilite: 'ORRTYL' as const, ordre: 22 },
    { phase: 3, numero: '3.1.4', titre: 'Fourniture des contenus', description: 'Le client fournit textes, photos, informations nécessaires', responsabilite: 'CLIENT' as const, ordre: 23 },

    // Phase 4 - Lancer
    { phase: 4, numero: '4.1.1', titre: 'Formation équipe', description: 'Session de prise en main de tous les outils', responsabilite: 'ENSEMBLE' as const, ordre: 30 },
    { phase: 4, numero: '4.1.2', titre: 'Go-live', description: 'Mise en production et lancement opérationnel', responsabilite: 'ENSEMBLE' as const, ordre: 31 },
    { phase: 4, numero: '4.1.3', titre: 'Guide utilisateur', description: 'Documentation PDF des procédures utilisateur', responsabilite: 'ORRTYL' as const, ordre: 32 },

    // Phase 5 - Accompagner
    { phase: 5, numero: '5.1.1', titre: 'Reporting mensuel', description: 'Rapport de suivi : trafic, performance, KPIs', responsabilite: 'ORRTYL' as const, ordre: 40 },
    { phase: 5, numero: '5.1.2', titre: 'Réunion de suivi', description: 'Point stratégique mensuel (1h max)', responsabilite: 'ENSEMBLE' as const, ordre: 41 },
    { phase: 5, numero: '5.1.3', titre: 'Optimisations', description: 'Ajustements basés sur les retours et données', responsabilite: 'ORRTYL' as const, ordre: 42 },
    { phase: 5, numero: '5.1.4', titre: 'Bilan de mission', description: 'Rapport final avec recommandations pour la suite', responsabilite: 'ORRTYL' as const, ordre: 43 },
  ];

  for (const l of templateLivrables) {
    await db.insert(livrables).values({
      ...l,
      statut: 'a_faire',
    }).onConflictDoNothing();
  }

  // Sample compte rendu
  await db.insert(comptesRendus).values({
    titre: 'Réunion de cadrage initiale',
    dateReunion: new Date().toISOString().slice(0, 10),
    dureeReunion: '2h',
    contenu: 'Compte rendu de la réunion initiale.\n\nPoints abordés :\n- Présentation du contexte\n- Identification des besoins prioritaires\n- Définition du périmètre de la mission\n- Prochaines étapes',
    statut: 'publie',
  }).onConflictDoNothing();

  console.log('✅ Seed complete!');
  console.log(`   - ${templateLivrables.length} livrables créés`);
  console.log('   - 1 compte rendu créé');

  await client.end();
}

seed().catch(console.error);
