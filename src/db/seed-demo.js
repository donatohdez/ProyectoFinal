const mediaHora = 30 * 60;
const diasDeAgenda = 14;
const diasSemana = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const relojLocal = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Hermosillo',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function cargarDemo(db, ahora = Math.floor(Date.now() / 1000)) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const paciente = db.prepare(`
      INSERT INTO pacientes (nss, nombre_completo) VALUES (?, ?)
      ON CONFLICT(nss) DO NOTHING
    `);
    paciente.run('00000000001', 'Paciente de prueba Uno');
    paciente.run('00000000002', 'Paciente de prueba Dos');

    const medico = db.prepare(`
      INSERT INTO medicos (id, nombre_completo, especialidad, consultorio) VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `);
    medico.run(1, 'Dra. Demo Luna', 'Medicina general', 'A-01');
    medico.run(2, 'Dr. Demo Río', 'Pediatría', 'B-02');

    const horario = db.prepare(`
      INSERT INTO horarios_consulta (medico_id, dia_semana, inicio_minuto, fin_minuto)
      VALUES (?, ?, ?, ?) ON CONFLICT(medico_id, dia_semana, inicio_minuto) DO NOTHING
    `);
    for (let dia = 1; dia <= 5; dia++) {
      horario.run(1, dia, 9 * 60, 12 * 60);
      horario.run(2, dia, 10 * 60, 13 * 60);
    }

    const franjas = db.prepare('SELECT * FROM horarios_consulta').all();
    const espacio = db.prepare(`
      INSERT INTO espacios_agenda (medico_id, inicio_utc, fin_utc) VALUES (?, ?, ?)
      ON CONFLICT(medico_id, inicio_utc) DO NOTHING
    `);
    const primerInicio = (Math.floor(ahora / mediaHora) + 1) * mediaHora;
    const limite = ahora + diasDeAgenda * 24 * 60 * 60;
    for (let inicio = primerInicio; inicio + mediaHora <= limite; inicio += mediaHora) {
      const partes = Object.fromEntries(
        relojLocal.formatToParts(inicio * 1000).map(({ type, value }) => [type, value]),
      );
      const dia = diasSemana.indexOf(partes.weekday) + 1;
      const minuto = +partes.hour * 60 + +partes.minute;
      for (const franja of franjas) {
        if (franja.dia_semana === dia && minuto >= franja.inicio_minuto &&
            minuto + 30 <= franja.fin_minuto &&
            (minuto - franja.inicio_minuto) % 30 === 0) {
          espacio.run(franja.medico_id, inicio, inicio + mediaHora);
        }
      }
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
