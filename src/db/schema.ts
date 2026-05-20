import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const adminUsers = pgTable(
  'admin_users',
  {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('admin_users_username_idx').on(table.username)]
);

export const livrables = pgTable(
  'livrables',
  {
    id: serial('id').primaryKey(),
    phase: integer('phase').notNull(),
    numero: text('numero').notNull(),
    titre: text('titre').notNull(),
    description: text('description').notNull(),
    responsabilite: text('responsabilite')
      .$type<'ORRTYL' | 'CLIENT' | 'ENSEMBLE'>()
      .notNull(),
    statut: text('statut')
      .$type<'a_faire' | 'brouillon' | 'en_review' | 'valide'>()
      .notNull()
      .default('a_faire'),
    ordre: integer('ordre').notNull(),
    fileName: text('file_name'),
    fileData: text('file_data'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('livrables_phase_idx').on(table.phase),
    index('livrables_statut_idx').on(table.statut),
    index('livrables_ordre_idx').on(table.ordre),
  ]
);

export const tempsEntries = pgTable(
  'temps_entries',
  {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    dureeMinutes: integer('duree_minutes').notNull(),
    categorie: text('categorie')
      .$type<'reunion' | 'production' | 'strategie' | 'admin' | 'autre'>()
      .notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('temps_entries_date_idx').on(table.date),
    index('temps_entries_categorie_idx').on(table.categorie),
  ]
);

export const comptesRendus = pgTable(
  'comptes_rendus',
  {
    id: serial('id').primaryKey(),
    titre: text('titre').notNull(),
    dateReunion: date('date_reunion').notNull(),
    dureeReunion: text('duree_reunion'),
    audioUrl: text('audio_url'),
    transcriptBrut: text('transcript_brut'),
    transcriptNettoye: text('transcript_nettoye'),
    contenu: text('contenu').notNull(),
    statut: text('statut')
      .$type<'brouillon' | 'publie'>()
      .notNull()
      .default('brouillon'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('comptes_rendus_date_reunion_idx').on(table.dateReunion),
    index('comptes_rendus_statut_idx').on(table.statut),
  ]
);

export const messages = pgTable(
  'messages',
  {
    id: serial('id').primaryKey(),
    itemType: text('item_type')
      .$type<'livrable' | 'phase' | 'arbitrage' | 'general'>()
      .notNull(),
    itemId: text('item_id'),
    auteur: text('auteur').$type<'admin' | 'client'>().notNull(),
    contenu: text('contenu').notNull(),
    lu: boolean('lu').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('messages_item_type_idx').on(table.itemType),
    index('messages_item_id_idx').on(table.itemId),
    index('messages_lu_idx').on(table.lu),
    index('messages_auteur_idx').on(table.auteur),
  ]
);

export const arbitrages = pgTable(
  'arbitrages',
  {
    id: serial('id').primaryKey(),
    source: text('source').notNull(),
    typeChangement: text('type_changement')
      .$type<'ajout' | 'modification' | 'suppression'>()
      .notNull(),
    description: text('description').notNull(),
    impact: text('impact'),
    statut: text('statut')
      .$type<'propose' | 'valide' | 'rejete'>()
      .notNull()
      .default('propose'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('arbitrages_statut_idx').on(table.statut)]
);

export const siteConfig = pgTable(
  'site_config',
  {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
  },
  (table) => [uniqueIndex('site_config_key_idx').on(table.key)]
);
