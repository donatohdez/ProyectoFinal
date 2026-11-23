export function listarMedicos(db) {
  return db.prepare('SELECT id, nombre_completo FROM medicos ORDER BY nombre_completo, id').all();
}

export function buscarMedico(db, id) {
  return db.prepare('SELECT * FROM medicos WHERE id = ?').get(id);
}

export function listarHorarios(db, medicoId) {
  return db.prepare(`
    SELECT dia_semana, inicio_minuto, fin_minuto FROM horarios_consulta
    WHERE medico_id = ? ORDER BY dia_semana, inicio_minuto
  `).all(medicoId);
}
