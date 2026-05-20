import * as jsonStore from './json-store';

/**
 * Unified store — uses JSON files.
 * In production with PostgreSQL, the API routes use Drizzle directly.
 * In dev without Docker/PostgreSQL, this JSON fallback works out of the box.
 */

export const store = {
  getAll: <T>(collection: string) => jsonStore.getAll<T>(collection),
  insert: <T extends Record<string, unknown>>(collection: string, item: T) => jsonStore.insert(collection, item),
  update: <T extends Record<string, unknown>>(collection: string, id: number, data: Partial<T>) => jsonStore.update(collection, id, data),
  remove: (collection: string, id: number) => jsonStore.remove(collection, id),
};
