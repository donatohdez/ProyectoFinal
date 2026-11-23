import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { abrirBase } from '../../src/db/connection.js';
import { migrar } from '../../src/db/migrate.js';
import { cargarDemo } from '../../src/db/seed-demo.js';
import { listarEspaciosLibres } from '../../src/modules/agenda/repository.js';
import { buscarCita, buscarCitaPorOperacion, insertarCita } from '../../src/modules/citas/repository.js';
import { buscarMedico, listarHorarios, listarMedicos } from '../../src/modules/medicos/repository.js';
import { buscarPacientePorNss } from '../../src/modules/pacientes/repository.js';

const ahora = Date.parse('2026-11-23T16:00:00Z') / 1000;
const nss = '00000000001';

function prepararDatos(context) {
  const db = abrirBase(':memory:');
  context.after(() => db.close());
  migrar(db);
  cargarDemo(db, ahora);
  return db;
}

function agenda(db, medicoId = 1) {
  return listarEspaciosLibres(db, { medicoId, desde: ahora, hasta: ahora + 86400, ahora });
}

function reservaDePrueba(db, espacio, campos = {}) {
  const paciente = buscarPacientePorNss(db, nss);
  const medico = buscarMedico(db, espacio.medico_id);
  return {
    id: 'cita-prueba',
    pacienteId: paciente.id,
    espacioId: espacio.id,
    claveOperacion: 'operacion-prueba',
    registradaUtc: ahora,
    pacienteNombre: paciente.nombre_completo,
    pacienteNss: paciente.nss,
    medicoNombre: medico.nombre_completo,
    consultorio: medico.consultorio,
    inicioUtc: espacio.inicio_utc,
    ...campos,
  };
}

test('el catálogo conserva el NSS textual y expone ficha y horarios de cada médico', (context) => {
  const db = prepararDatos(context);
  assert.equal(buscarPacientePorNss(db, nss).nss, nss);
  assert.equal(buscarPacientePorNss(db, '00000000003'), undefined);
  assert.equal(listarMedicos(db).length, 2);
  assert.equal(buscarMedico(db, 1).consultorio, 'A-01');
  const [horario] = listarHorarios(db, 1);
  assert.equal(horario.dia_semana, 1);
  assert.equal(horario.inicio_minuto, 540);
  assert.equal(horario.fin_minuto, 720);
});

test('la agenda ficticia usa espacios futuros de 30 minutos dentro de consulta', (context) => {
  const db = prepararDatos(context);
  const espacios = agenda(db);
  assert.equal(espacios.length, 5);
  assert.equal(espacios[0].inicio_utc, ahora + 1800);
  assert.equal(espacios.at(-1).fin_utc, ahora + 3 * 3600);
  assert.ok(espacios.every(({ inicio_utc, fin_utc }) => fin_utc - inicio_utc === 1800));
  assert.equal(agenda(db, 2)[0].inicio_utc, ahora + 3600);
});

test('SQLite rechaza un segundo registro del espacio y la agenda excluye los ocupados', (context) => {
  const db = prepararDatos(context);
  const [espacio] = agenda(db);
  insertarCita(db, reservaDePrueba(db, espacio));
  assert.throws(
    () => insertarCita(db, reservaDePrueba(db, espacio, { id: 'otra-cita', claveOperacion: 'otra-op' })),
    /UNIQUE constraint failed: citas\.espacio_id/,
  );
  assert.ok(!agenda(db).some(({ id }) => id === espacio.id));
  assert.equal(buscarCita(db, 'cita-prueba').paciente_nss, nss);
});

test('la clave de operación es única y permite recuperar la cita guardada', (context) => {
  const db = prepararDatos(context);
  const [primero, segundo] = agenda(db);
  insertarCita(db, reservaDePrueba(db, primero));
  assert.throws(
    () => insertarCita(db, reservaDePrueba(db, segundo, { id: 'otra-cita' })),
    /UNIQUE constraint failed: citas\.clave_operacion/,
  );
  assert.equal(buscarCitaPorOperacion(db, 'operacion-prueba').espacio_id, primero.id);
});

test('la cita permanece al reabrir SQLite y repetir la preparación de datos ficticios', () => {
  const directorio = mkdtempSync(join(tmpdir(), 'rcm-datos-'));
  const archivo = join(directorio, 'recepcion.sqlite');
  try {
    const db = abrirBase(archivo);
    try {
      migrar(db);
      cargarDemo(db, ahora);
      insertarCita(db, reservaDePrueba(db, agenda(db)[0]));
    } finally {
      db.close();
    }

    const reabierta = abrirBase(archivo);
    try {
      migrar(reabierta);
      cargarDemo(reabierta, ahora);
      assert.equal(buscarCita(reabierta, 'cita-prueba').paciente_nss, nss);
      assert.equal(listarMedicos(reabierta).length, 2);
      assert.equal(agenda(reabierta).length, 4);
    } finally {
      reabierta.close();
    }
  } finally {
    rmSync(directorio, { recursive: true, force: true });
  }
});
