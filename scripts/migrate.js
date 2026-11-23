import { abrirBase } from '../src/db/connection.js';
import { migrar } from '../src/db/migrate.js';

const db = abrirBase();
try {
  migrar(db);
  console.log('Migraciones aplicadas.');
} finally {
  db.close();
}
