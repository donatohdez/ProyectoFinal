export function buscarPacientePorNss(db, nss) {
  return db.prepare('SELECT id, nss, nombre_completo FROM pacientes WHERE nss = ?').get(nss);
}
