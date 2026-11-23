import { abrirBase } from '../src/db/connection.js';
import { cargarDemo } from '../src/db/seed-demo.js';

const db = abrirBase();
try {
  cargarDemo(db);
  console.log('Catálogos ficticios y agenda futura disponibles.');
} finally {
  db.close();
}
