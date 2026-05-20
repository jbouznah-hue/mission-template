import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), '.data');

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(collection: string) {
  return join(DATA_DIR, `${collection}.json`);
}

export function getAll<T>(collection: string): T[] {
  ensureDir();
  const fp = filePath(collection);
  if (!existsSync(fp)) return [];
  try {
    return JSON.parse(readFileSync(fp, 'utf-8'));
  } catch {
    return [];
  }
}

export function insert<T extends Record<string, unknown>>(collection: string, item: T): T & { id: number; created_at: string } {
  const items = getAll<T & { id: number }>(collection);
  const maxId = items.reduce((max, i) => Math.max(max, i.id || 0), 0);
  const newItem = { ...item, id: maxId + 1, created_at: new Date().toISOString() };
  items.push(newItem);
  ensureDir();
  writeFileSync(filePath(collection), JSON.stringify(items, null, 2));
  return newItem;
}

export function update<T extends Record<string, unknown>>(collection: string, id: number, data: Partial<T>): (T & { id: number }) | null {
  const items = getAll<T & { id: number }>(collection);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updated_at: new Date().toISOString() };
  ensureDir();
  writeFileSync(filePath(collection), JSON.stringify(items, null, 2));
  return items[idx];
}

export function remove(collection: string, id: number): boolean {
  const items = getAll<{ id: number }>(collection);
  const filtered = items.filter(i => i.id !== id);
  if (filtered.length === items.length) return false;
  ensureDir();
  writeFileSync(filePath(collection), JSON.stringify(filtered, null, 2));
  return true;
}
