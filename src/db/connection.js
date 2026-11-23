import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const defaultPath = fileURLToPath(new URL('../../data/recepcion.sqlite', import.meta.url));

export function abrirBase(path = process.env.RCM_DB_PATH ?? defaultPath) {
  const filename = path === ':memory:' ? path : resolve(path);
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename, { enableForeignKeyConstraints: true, timeout: 3000 });
  return db;
}
