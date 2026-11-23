CREATE TABLE pacientes (
  id INTEGER PRIMARY KEY,
  nss TEXT NOT NULL UNIQUE CHECK (length(nss) = 11 AND nss NOT GLOB '*[^0-9]*'),
  nombre_completo TEXT NOT NULL
) STRICT;

CREATE TABLE medicos (
  id INTEGER PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  consultorio TEXT NOT NULL
) STRICT;

CREATE TABLE horarios_consulta (
  id INTEGER PRIMARY KEY,
  medico_id INTEGER NOT NULL REFERENCES medicos(id),
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  inicio_minuto INTEGER NOT NULL CHECK (inicio_minuto BETWEEN 0 AND 1439 AND inicio_minuto % 30 = 0),
  fin_minuto INTEGER NOT NULL CHECK (fin_minuto BETWEEN 1 AND 1439 AND fin_minuto % 30 = 0),
  CHECK (fin_minuto > inicio_minuto),
  UNIQUE (medico_id, dia_semana, inicio_minuto)
) STRICT;

-- Los instantes se almacenan en segundos Unix UTC.
CREATE TABLE espacios_agenda (
  id INTEGER PRIMARY KEY,
  medico_id INTEGER NOT NULL REFERENCES medicos(id),
  inicio_utc INTEGER NOT NULL CHECK (inicio_utc % 1800 = 0),
  fin_utc INTEGER NOT NULL CHECK (fin_utc - inicio_utc = 1800),
  UNIQUE (medico_id, inicio_utc)
) STRICT;

CREATE TABLE citas (
  id TEXT PRIMARY KEY,
  paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
  espacio_id INTEGER NOT NULL UNIQUE REFERENCES espacios_agenda(id),
  clave_operacion TEXT NOT NULL UNIQUE,
  registrada_utc INTEGER NOT NULL,
  paciente_nombre TEXT NOT NULL,
  paciente_nss TEXT NOT NULL CHECK (length(paciente_nss) = 11 AND paciente_nss NOT GLOB '*[^0-9]*'),
  medico_nombre TEXT NOT NULL,
  consultorio TEXT NOT NULL,
  inicio_utc INTEGER NOT NULL
) STRICT;
