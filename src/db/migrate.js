import { readFileSync, readdirSync } from 'node:fs';

const directory = new URL('./migrations/', import.meta.url);

export function migrar(db) {
  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY) STRICT');
    const aplicada = db.prepare('SELECT 1 FROM schema_migrations WHERE version = ?');
    const registrar = db.prepare('INSERT INTO schema_migrations (version) VALUES (?)');
    const migrations = readdirSync(directory).filter((name) => name.endsWith('.sql')).sort();
    for (const migration of migrations) {
      if (aplicada.get(migration)) continue;
      db.exec(readFileSync(new URL(migration, directory), 'utf8'));
      registrar.run(migration);
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
