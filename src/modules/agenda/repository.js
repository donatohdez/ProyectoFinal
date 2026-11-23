export function listarEspaciosLibres(db, { medicoId, desde, hasta, ahora }) {
  return db.prepare(`
    SELECT e.id, e.medico_id, e.inicio_utc, e.fin_utc
    FROM espacios_agenda e
    WHERE e.medico_id = ?
      AND e.inicio_utc >= ? AND e.inicio_utc < ? AND e.inicio_utc > ?
      AND NOT EXISTS (SELECT 1 FROM citas c WHERE c.espacio_id = e.id)
    ORDER BY e.inicio_utc
  `).all(medicoId, desde, hasta, ahora);
}
