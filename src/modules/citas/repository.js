export function insertarCita(db, cita) {
  db.prepare(`
    INSERT INTO citas (
      id, paciente_id, espacio_id, clave_operacion, registrada_utc,
      paciente_nombre, paciente_nss, medico_nombre, consultorio, inicio_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    cita.id, cita.pacienteId, cita.espacioId, cita.claveOperacion, cita.registradaUtc,
    cita.pacienteNombre, cita.pacienteNss, cita.medicoNombre, cita.consultorio, cita.inicioUtc,
  );
}

export function buscarCita(db, id) {
  return db.prepare('SELECT * FROM citas WHERE id = ?').get(id);
}

export function buscarCitaPorOperacion(db, claveOperacion) {
  return db.prepare('SELECT * FROM citas WHERE clave_operacion = ?').get(claveOperacion);
}
