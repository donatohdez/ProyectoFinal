# Plan de implementación de Registro de Citas Médicas

**Asignatura:** Fundamentos de IA en Ingeniería de Software · **Equipo 5** · **Caso 5:** Registrar cita médica · **Versión:** 1.0

## 1. Objetivo y entregables

Construir una aplicación web que permita al personal de recepción buscar un paciente por su Número de Seguridad Social (NSS), consultar médicos y su disponibilidad, apartar un horario y confirmar que la cita quedó guardada. El resultado visible del caso será el cambio del panel derecho. Al seleccionar un médico, el panel muestra sus datos. Después de guardar la cita, el mismo panel muestra la información del paciente, el nombre del médico, el consultorio, la fecha y la hora.

La consigna de la primera asignación pide el plan completo en Markdown tras revisar los videos 00 y 01. La entrega indicada en la plataforma cierra el **27 de noviembre de 2026 a las 00:00**. La aplicación funcional, su base de datos y las pruebas son los resultados de las etapas de implementación que define este plan. Las historias y el seguimiento de Jira sirven como antecedentes de planificación.

| Entregable de implementación | Evidencia prevista |
|---|---|
| Aplicación web de recepción | Demostración desde la búsqueda por NSS hasta la confirmación en el panel derecho. |
| Base de datos local con catálogo ficticio | Esquema versionado, carga reproducible de pacientes, médicos, horarios y espacios, y una cita que se conserva al reiniciar. |
| Pruebas automatizadas y recorrido manual | Resultados registrados para el flujo principal, validaciones y reservas en conflicto. |
| Repositorio reproducible | Instrucciones de instalación, arranque, carga de datos y ejecución de pruebas. |
| Bitácora de trabajo con IA | Prompts utilizados, decisiones, cambios revisados y evidencias de la verificación. |

## 2. Caso de uso y alcance

Enunciado proporcionado por el equipo:

> **5. Registrar cita médica**
>
> a. Solicitar Número de Seguridad Social.
>
> b. Mostrar datos del Paciente y Lista de Médicos. Al seleccionar un médico, a la derecha aparecen sus datos: nombre completo, especialidad, consultorio, días y horas de consulta.
>
> c. Al apartar cita con un médico en particular, a la derecha, en la misma zona donde aparecían los datos del médico ahora aparecen los datos de la cita: Información del paciente, nombre del médico, consultorio, fecha y hora.

El actor principal es el personal de recepción. El paciente es la persona a cuyo nombre se guarda la cita. Los pacientes, médicos y horarios de la demostración estarán precargados.

El caso define la búsqueda, la consulta del médico y la confirmación. Para implementar el acto de apartar cita, el equipo acordó en Jira que recepción elija un espacio futuro de 30 minutos dentro del horario de consulta. También acordó conservar el NSS como texto de exactamente 11 dígitos, utilizar la zona `America/Hermosillo`, persistir la cita y rechazar reservas simultáneas del mismo espacio. La validación del NSS es de formato y existencia dentro del catálogo ficticio.

**Alcance de esta versión.** Pantalla de recepción, búsqueda de pacientes, catálogo de médicos, consulta de horarios, reserva, persistencia y confirmación. El catálogo se administra mediante datos de demostración. Quedan fuera las altas de pacientes y médicos desde la interfaz, cancelaciones, reprogramaciones, pagos, recetas, expediente clínico, avisos y conexiones con instituciones de salud. Se propone una ejecución local para la evaluación académica. Si el docente solicita publicación, el despliegue y sus requisitos de acceso se planificarán como un hito aparte.

### Trazabilidad con Jira

| Historia | Trabajo que se implementará | Resultado verificable |
|---|---|---|
| HU-01 / RCM-4 | Consultar un paciente por NSS. | Una coincidencia devuelve el paciente correcto, incluido el NSS que empieza con cero. |
| HU-02 / RCM-8 | Validar el NSS antes de buscar y orientar la corrección. | Se distingue campo vacío, formato inválido, paciente no encontrado y fallo de consulta. |
| HU-03 / RCM-12 | Mostrar y sincronizar los datos del paciente. | Una nueva búsqueda invalida la selección anterior. Una respuesta tardía no repone un paciente anterior. |
| HU-04 / RCM-16 | Listar médicos y consultar su ficha. | El panel derecho muestra nombre completo, especialidad, consultorio, días y horas. |
| HU-05 / RCM-20 | Consultar y seleccionar un espacio de agenda. | Solo se eligen espacios futuros disponibles. Cambiar médico o fecha borra el horario seleccionado. |
| HU-06 / RCM-24 | Guardar la cita con sus datos completos. | La reserva puede recuperarse al reiniciar la aplicación y conserva los datos guardados. |
| HU-07 / RCM-25 | Evitar la doble reserva y gestionar reintentos. | Dos operaciones para el mismo espacio dejan una cita. Reenviar la misma operación recupera su resultado. |
| HU-08 / RCM-26 | Presentar la confirmación después de guardar. | La ficha del médico se sustituye dentro del mismo panel por los datos de la cita registrada. |

## 3. Recorrido de uso y pantalla

| Paso | Acción de recepción | Respuesta del sistema |
|---|---|---|
| 1 | Introduce el NSS y pulsa **Buscar paciente**. | Valida que haya 11 dígitos y consulta el catálogo. Si encuentra al paciente, muestra nombre y NSS y habilita la lista de médicos. |
| 2 | Selecciona a un médico. | Muestra su ficha en el panel derecho. A la izquierda sigue visible el paciente identificado y se habilita la selección de la fecha. |
| 3 | Elige una fecha y un horario disponible. | Muestra los espacios libres de esa fecha. Seleccionar uno prepara la operación. El espacio se aparta al confirmar el guardado. |
| 4 | Pulsa **Apartar cita**. | El servidor comprueba que el paciente y el espacio existan, que el espacio pertenezca al médico elegido y que siga disponible y en el futuro. Registra la cita en la base de datos. |
| 5 | Revisa la confirmación. | Tras el guardado, la pantalla presenta en el mismo panel derecho el nombre y NSS del paciente, el nombre del médico, el consultorio, la fecha y la hora. |
| 6 | Pulsa **Registrar otra cita**. | Abre un formulario nuevo y limpia el contexto de la reserva anterior. |

```text
┌────────────────────────────────┬────────────────────────────────┐
│ Recepción                      │ Panel derecho                  │
│ NSS y búsqueda                 │ Antes de guardar               │
│ Paciente identificado          │ Ficha y horario del médico     │
│ Médico, fecha y espacio        │                                │
│ Apartar cita                   │ Después de guardar             │
│ Mensajes y estado              │ Confirmación de la cita        │
└────────────────────────────────┴────────────────────────────────┘
```

### Estados alternativos

- **NSS vacío o inválido.** Indicar qué corregir y devolver el foco al campo. Conservar el NSS como texto, incluyendo sus ceros iniciales.
- **Paciente inexistente o búsqueda fallida.** Limpiar el paciente y la selección anteriores. Distinguir entre ausencia en el catálogo y un error que admite reintento. Si se realizan consultas en paralelo, solo aplicar la respuesta de la búsqueda más reciente.
- **Sin médicos o sin espacios en la fecha.** Explicar qué falta. Mantener la identificación del paciente y permitir cambiar médico o fecha cuando haya opciones.
- **Horario ocupado al confirmar.** Mostrar el conflicto, refrescar los espacios, retirar la selección ocupada y conservar al paciente y al médico.
- **Fallo o respuesta incierta al guardar.** Mantener la operación pendiente de confirmación. Ofrecer reintento con la misma clave de operación para recuperar una cita que ya se haya guardado. Mostrar la confirmación cuando el servidor pueda leer la cita registrada.

Los campos y botones tendrán etiquetas visibles, foco perceptible y operación por teclado. Los mensajes de estado se anunciarán con una región accesible y la confirmación tendrá un encabezado al que se pueda llevar el foco. En pantallas angostas, el panel se colocará debajo del formulario y conservará su función. Como meta inicial, una búsqueda local con los datos de muestra deberá mostrar el resultado en hasta dos segundos. La verificación registrará equipo, tamaño del catálogo y tiempos observados.

## 4. Stack y arquitectura

### Tecnologías elegidas

| Tecnología | Función | Por qué conviene en este proyecto |
|---|---|---|
| **Node.js 24 LTS** | Ejecutar la aplicación y las pruebas. | Una misma instalación ejecuta el servidor, los scripts de datos y las pruebas. Se usará JavaScript tanto en el servidor como en las interacciones de la pantalla. Al crear el repositorio se fijará la versión de Node verificada para que la IA y el equipo trabajen sobre la misma base. |
| **Express** | Servir las páginas y recibir las solicitudes de búsqueda, agenda y reserva. | Permite tener interfaz y servidor en un solo proyecto. La separación por rutas deja claro dónde se valida lo que envía el navegador y dónde se llama a la lógica de negocio. |
| **EJS** | Generar el HTML de la recepción y de la confirmación. | El flujo cabe en una vista principal. Podemos reutilizar el diseño de dos paneles y generar la confirmación con datos que el servidor acaba de leer de la cita guardada. |
| **HTML, CSS y JavaScript del navegador** | Construir el formulario, ordenar los paneles y cargar médicos y espacios. | Las interacciones son acotadas. El navegador actualizará los datos del médico y de la agenda en el formulario, y abrirá la vista de confirmación tras un guardado exitoso. Los formularios y elementos nativos simplifican la navegación por teclado. |
| **SQLite mediante `node:sqlite`** | Persistir catálogos, agenda y citas en un archivo local. | La demo necesita datos persistentes y restricciones de unicidad. SQLite evita instalar un servidor de base de datos y permite usar archivos temporales en pruebas. `node:sqlite` forma parte de la familia de Node elegida y su API está en fase de candidato a lanzamiento según su documentación. Se concentrará su uso en la capa de datos y se verificará al fijar la versión de Node. |
| **npm y archivo de bloqueo** | Instalar dependencias y ejecutar scripts compartidos. | Da al equipo comandos uniformes como `npm ci` y `npm test`. El archivo de bloqueo fija las versiones instaladas. |
| **`node:test`** | Ejecutar pruebas automatizadas. | Permite cubrir validaciones, operaciones sobre SQLite y el comportamiento de las rutas con el ejecutor incluido en Node. La revisión en navegador cubrirá lo visible y el uso por teclado. |
| **Git** | Versionar el plan, el esquema, las pruebas y el código. | Permite revisar los cambios de la IA por etapa, relacionarlos con Jira y recuperar una versión anterior si un cambio rompe el flujo. |

La elección prioriza una demostración reproducible. Con respecto a la opción de Java y PostgreSQL que evaluamos antes, esta combinación reduce la preparación de un entorno académico local. El repositorio tendrá un solo proceso web y un archivo SQLite. Si después se necesita un despliegue con varias instancias o muchas escrituras simultáneas, se volverá a evaluar el almacenamiento y el entorno de ejecución.

### Arquitectura propuesta

Se construirá un **monolito modular**. Un servidor Express atiende el navegador y llama a servicios y repositorios en el mismo proceso. La interfaz muestra datos y recoge la selección. Los servicios aplican reglas de negocio. Los repositorios usan consultas parametrizadas y mantienen las operaciones de SQLite separadas de la interfaz.

```text
Navegador de recepción
        ↓
Rutas Express ──────────────→ Vistas EJS
        ↓
Servicios de pacientes, médicos, agenda y citas
        ↓
Repositorios y conexión a SQLite
        ↓
Archivo local con catálogos, horarios, espacios y citas
```

| Capa | Responsabilidad |
|---|---|
| Interfaz | Mostrar el estado del flujo y enviar identificadores. Mantener el panel derecho como la misma región visible de la pantalla. |
| Rutas | Validar la estructura de las solicitudes, llamar al servicio y traducir el resultado a una página o mensaje. |
| Servicios | Buscar el paciente, consultar disponibilidad, verificar reglas de agenda y coordinar la reserva. Las validaciones del navegador ayudan a usar la pantalla y el servidor vuelve a comprobarlas. |
| Repositorios | Ejecutar consultas, recuperar la cita guardada y hacer cumplir la operación de reserva mediante una transacción y restricciones en SQLite. |

### Esquema propuesto de carpetas

```text
registro-citas-medicas/
├── PLAN.md                         # Plan de implementación
├── README.md                       # Instalación, pruebas y demostración
├── package.json                    # Dependencias y comandos
├── package-lock.json               # Versiones de dependencias
├── src/
│   ├── app.js                      # Configura Express para uso y pruebas
│   ├── server.js                   # Inicia el servidor local
│   ├── modules/
│   │   ├── pacientes/              # Búsqueda y validación por NSS
│   │   ├── medicos/                # Catálogo y ficha del médico
│   │   ├── agenda/                 # Días de consulta y espacios libres
│   │   └── citas/                  # Reserva, conflictos y confirmación
│   ├── db/
│   │   ├── connection.js           # Conexión y configuración de SQLite
│   │   └── migrations/             # Versiones del esquema SQL
│   ├── views/
│   │   ├── recepcion.ejs           # Vista completa de recepción
│   │   └── partials/               # Ficha del médico y confirmación
│   └── public/
│       ├── css/
│       └── js/                     # Interacción del formulario
├── scripts/
│   ├── migrate.js                  # Aplica cambios de esquema
│   └── seed-demo.js                # Carga catálogos y agenda ficticia
├── test/
│   ├── unit/                       # Validaciones y reglas
│   ├── integration/                # Base de datos y rutas
│   └── fixtures/                   # Casos con fecha y hora controladas
├── docs/
│   ├── bitacora-ia.md              # Prompts, decisiones y revisión
│   └── evidencias/                 # Pruebas y capturas seleccionadas
└── data/                           # Base local generada e ignorada por Git
```

El árbol describe el repositorio que se construirá. Cada módulo agrupará los archivos que necesite de rutas, servicio y repositorio. La aplicación exportará su configuración por separado del arranque para que las pruebas puedan usar una base temporal y un reloj controlado.

## 5. Modelo de datos y contrato de la reserva

### Tablas propuestas

| Tabla | Datos principales | Integridad |
|---|---|---|
| `pacientes` | ID, NSS y nombre completo ficticios. | NSS único y obligatorio. Se almacena como texto y se valida que tenga 11 dígitos. |
| `medicos` | ID, nombre completo, especialidad y consultorio. | Campos de la ficha obligatorios. |
| `horarios_consulta` | ID, médico, día de semana, hora local de inicio y de fin. | Referencia a un médico. Inicio anterior al fin. Para esta versión, cada franja empieza y termina el mismo día. |
| `espacios_agenda` | ID, médico, inicio y fin en UTC. | Cada espacio dura 30 minutos, queda dentro de una franja del médico y tiene una combinación única de médico e inicio. La agenda de muestra se prepara al cargar los datos ficticios. |
| `citas` | ID público aleatorio, paciente, espacio, clave de operación, fecha de registro y copia de los datos de confirmación. | Referencias obligatorias al paciente y al espacio. Espacio y clave de operación únicos. La copia incluye nombre y NSS del paciente, nombre del médico, consultorio e inicio en UTC. Se guarda en la misma transacción para recuperar la confirmación aunque se actualice el catálogo. |

Un médico tiene varias franjas de consulta y varios espacios de agenda. Un paciente puede tener varias citas y cada espacio admite una. Se activará la comprobación de claves foráneas en cada conexión de SQLite. Los instantes de agenda se almacenarán en UTC y se mostrarán en `America/Hermosillo`. Las pruebas usarán fechas controladas para evitar resultados que cambien con el día de ejecución. La carga para la demo preparará fechas futuras en esa misma zona.

### Operaciones de la aplicación

| Método y ruta propuesta | Entrada | Salida esperada |
|---|---|---|
| `GET /` | Sin datos del paciente. | Vista de recepción lista para capturar el NSS. |
| `POST /pacientes/buscar` | NSS como texto en el cuerpo. | ID, nombre y NSS ficticio del paciente encontrado, o mensaje de validación, búsqueda sin resultado o fallo. |
| `GET /medicos` | Sin parámetros obligatorios. | Lista de médicos seleccionables. |
| `GET /medicos/:id` | ID del médico. | Nombre, especialidad, consultorio, días y horas de consulta. |
| `GET /medicos/:id/espacios?fecha=AAAA-MM-DD` | Médico y día en horario de Hermosillo. | Espacios futuros y libres dentro de esa fecha, o lista vacía. |
| `POST /citas` | ID del paciente, médico y espacio, más una clave generada para el intento. | `201` con URL de la confirmación al crear. `200` con la misma URL al recuperar un intento ya guardado. `400` para entrada inválida, `404` para recursos inexistentes y `409` para horario ocupado, vencido o clave reutilizada con otros datos. Un fallo temporal devolverá un mensaje de reintento. |
| `GET /citas/:id` | Identificador público de la cita. | La misma estructura de recepción con la confirmación en el panel derecho, obtenida desde la cita persistida. |

### Guardado y reintentos

1. La pantalla genera una clave al enviar por primera vez una combinación de paciente, médico y espacio. Reutiliza esa clave si la respuesta se pierde. Una selección distinta genera una operación nueva.
2. El servicio abre una transacción de escritura. Si encuentra esa clave ligada a los mismos datos, devuelve la cita registrada, aunque el horario ya haya pasado. Si la clave ya corresponde a otros datos, rechaza el intento.
3. El servicio verifica que paciente, médico y espacio existan, que el espacio corresponda al médico elegido y a su franja de consulta, y que su inicio sea posterior al momento actual.
4. El servicio intenta insertar la cita. La restricción única sobre el ID del espacio resuelve dos solicitudes distintas sobre el mismo horario. Solo se envía éxito después de confirmar la transacción.
5. Si el espacio se ocupó, el navegador conserva el paciente, vuelve a consultar la disponibilidad y deja elegir otro horario. Si el guardado se confirma, abre la vista de la cita, que usa los datos persistidos.

Para esta demo se introducirán únicamente datos ficticios. El NSS se enviará en el cuerpo de la consulta, se omitirá de URLs y registros técnicos y se usará SQL parametrizado. La aplicación escuchará localmente por defecto y el archivo generado de SQLite quedará fuera de Git.

## 6. Etapas de implementación y coordinación

Se propone ejecutar los hitos en este orden. Cada etapa termina con una prueba verificable y una revisión del equipo. La coordinación toma como referencia los responsables del backlog de Jira. Las fechas y los puntos del ejercicio anterior quedan como antecedentes que el equipo podrá consultar al calendarizar esta implementación.

| Hito | Trabajo y dependencias | Coordinación de referencia | Resultado para avanzar |
|---|---|---|---|
| 0. Revisar el plan y preparar el repositorio | Confirmar este alcance, fijar Node, crear el árbol base, preparar Express y EJS, migraciones, datos ficticios y conexión de pruebas. | Manuel coordina la revisión y Cristopher revisa el arranque y SQLite. | La página abre localmente y un entorno nuevo puede crear y cargar la base desde los scripts documentados. |
| 1. Identificar al paciente | Implementar HU-01, HU-02 y HU-03. La ficha del paciente depende de su búsqueda. Cubrir NSS inválido, ausencia y cambio de paciente. | Cristopher, Juan Carlos y Humberto según las historias. | Recepción encuentra un paciente válido y corrige errores sin arrastrar datos de otro paciente. |
| 2. Consultar médico y horario | Implementar HU-04 y HU-05. La selección de espacio depende del médico y de su agenda. Integrar fecha local, lista vacía y reinicio de la selección al cambiar el contexto. | Humberto y Cristopher. | Se muestra la ficha en el panel derecho y se puede elegir un espacio futuro y disponible. |
| 3. Guardar y confirmar la cita | Implementar HU-06, HU-07 y HU-08. El registro requiere un paciente válido y un espacio seleccionado. La confirmación requiere un guardado exitoso y la verificación de conflictos. | Cristopher coordina el guardado y la exclusividad. Jesús Alejandro coordina la confirmación. | Una cita persiste al reiniciar, un conflicto deja una sola reserva y el panel cambia a la confirmación correcta. |
| 4. Verificar y preparar la demostración | Ejecutar pruebas, probar con datos limpios, revisar accesibilidad, corregir hallazgos y completar el README y la bitácora. | Juan Carlos revisa pruebas y evidencias. Manuel coordina el corte de entrega. | Otro integrante reproduce la demo usando el README y la evidencia coincide con el resultado real. |

La preparación de datos, los bocetos y el diseño de pruebas pueden avanzar en paralelo. La integración sigue la cadena **paciente identificado y médico con horario → reserva persistida y protegida → confirmación → demostración**. Jesús Alejandro da seguimiento a los bloqueos y Humberto valida que la pantalla cubra el enunciado. El cierre se registrará en Jira después de comprobar los resultados de cada historia.

## 7. Pruebas y criterio de terminado

Las pruebas unitarias cubrirán formato del NSS y reglas de fecha. Las de integración usarán SQLite temporal para probar rutas, guardado, recuperación y unicidad. La comprobación manual en navegador cubrirá el cambio del panel, la navegación por teclado y la claridad de los estados. Por cada historia crítica se escribirá primero una prueba que describa el resultado esperado, se comprobará que falla antes de implementar y luego se ejecutará de nuevo con la solución.

| Prueba | Dado que | Cuando | Entonces |
|---|---|---|---|
| T01 Flujo completo | Existe un paciente ficticio y un médico con un espacio libre futuro. | Recepción busca el NSS, elige médico y espacio, y aparta la cita. | Se guarda una cita y el mismo panel derecho muestra paciente, médico, consultorio, fecha y hora. |
| T02 Formato y ceros iniciales | Hay entradas vacías, con letras o de longitud incorrecta, y un NSS válido que empieza con cero. | Se intenta buscar cada valor. | Se orienta la corrección en las entradas inválidas y la válida encuentra al paciente sin perder el cero. |
| T03 Búsqueda sin resultado | Hay un paciente visible. | Se busca otro NSS válido e inexistente. | Aparece un mensaje, se limpia la selección anterior y se deshabilita **Apartar cita**. |
| T04 Respuestas tardías | Se inician dos búsquedas y la primera tarda más. | La respuesta antigua llega al final. | La pantalla conserva el resultado de la búsqueda más reciente. |
| T05 Ficha y cambio de médico | Un médico y un espacio están seleccionados. | Se cambia a otro médico. | La ficha muestra los datos del nuevo médico y se borra el espacio anterior. |
| T06 Agenda inválida o vencida | Un espacio está pasado, pertenece a otro médico o se envía una fecha sin disponibilidad. | Se consulta la agenda o se intenta reservar. | La lista refleja la disponibilidad real y el servidor rechaza el espacio que no corresponde. |
| T07 Dos intentos por un espacio | Dos operaciones distintas eligieron el mismo espacio disponible. | Ambas solicitan apartarlo. | Una se confirma, la otra informa conflicto y SQLite contiene una sola cita en ese espacio. |
| T08 Reintento de la misma operación | Una reserva se guardó y su respuesta pudo perderse. | Se reenvían los mismos datos con la misma clave. | Se recupera la confirmación original y el número de citas se mantiene. |
| T09 Médicos distintos | Dos médicos tienen espacios disponibles a la misma hora. | Se aparta un espacio de cada médico. | Las dos citas se guardan. |
| T10 Persistencia y recarga | Existe una cita confirmada. | Se cierra el servidor, se inicia con el mismo archivo SQLite y se abre su confirmación. | Se recuperan los mismos datos de la cita. |
| T11 Fallo de guardado | Se simula un error de base de datos antes de confirmar la transacción. | Recepción intenta apartar. | Se informa el fallo y el panel conserva el contexto para corregir o reintentar. |
| T12 Operación por teclado | El formulario se usa desde el navegador. | Se completa el flujo usando el teclado. | Se llega a todos los controles, se ve el foco y se puede identificar el resultado de la reserva. |
| T13 Clave reutilizada con otros datos | Una clave ya está asociada a una cita guardada. | Se reutiliza la clave con otro paciente o espacio. | Se informa el conflicto y se conserva el registro original. |

**Criterio de terminado del proyecto.** Desde un entorno limpio, un integrante puede instalar dependencias, preparar los datos ficticios y arrancar la aplicación con el README. Las pruebas automatizadas pasan y se conserva el resultado de la revisión manual del flujo. La cita se guarda en SQLite, permanece tras reiniciar y su confirmación se muestra en la misma zona donde se consultaba al médico. El intento duplicado deja una sola cita. La bitácora identifica las pruebas efectivamente ejecutadas y los resultados observados.

## 8. Trabajo con IA, herramientas y costos

**Video 00.** El material distingue autocompletado, chat y agente y presenta diferencias entre herramientas locales y de nube. Usaremos chat o modo de planificación para analizar una decisión y un agente para implementar tareas concretas, editar archivos y ejecutar pruebas. El equipo revisará los cambios y validará el resultado con el caso de uso. La aplicación de citas funciona de forma independiente del asistente.

**Video 01.** Cada solicitud de implementación incluirá contexto, tarea, restricciones y criterio de terminado. Al cambiar de tarea se facilitarán al agente los archivos y criterios que correspondan al nuevo objetivo. Las pruebas y los cambios se revisarán por etapas para que cada fallo pueda asociarse con la historia que se está trabajando.

| Parte del prompt | Ejemplo para HU-07 |
|---|---|
| Contexto | Ya existe la búsqueda de pacientes y la agenda en SQLite. El caso requiere confirmar una cita en el panel derecho después de guardarla. |
| Tarea | Implementa la protección contra reservas duplicadas del mismo espacio e integra el mensaje de conflicto. |
| Restricciones | Usa la estructura de Express y SQLite de este plan. Conserva al paciente al refrescar la agenda y usa datos ficticios en pruebas. |
| Terminado cuando | Dos solicitudes distintas para el mismo espacio dan un solo guardado. Reintentar con la misma clave recupera la cita original. Registra qué ejecutaste y cuál fue el resultado. |

La bitácora guardará la historia de Jira, el prompt efectivamente usado, la propuesta del agente, las decisiones revisadas, los archivos modificados y el resultado de las pruebas. Si el agente propone una dependencia nueva, se anotará qué problema resuelve y el equipo revisará el alcance del cambio.

| Recurso | Tratamiento previsto |
|---|---|
| Asistente de IA | Uso del acceso disponible del equipo. Registrar el uso real si se solicita un reporte de consumo. |
| Aplicación, base de datos y pruebas | Ejecución local con Node, dependencias del repositorio y SQLite. El presupuesto base de infraestructura no prevé hosting ni una API de IA. |
| Herramientas o despliegue adicionales | Revisar su costo y necesidad si el docente pide publicación o hace falta ampliar el acceso a herramientas. |

## 9. Arranque, demostración y riesgos

### Comandos que documentará el repositorio

| Comando previsto | Resultado |
|---|---|
| `npm ci` | Instala las versiones registradas en el archivo de bloqueo. |
| `npm run db:migrate` | Prepara el esquema SQLite o aplica migraciones pendientes. |
| `npm run db:seed` | Carga o actualiza los datos ficticios para la demostración y prepara espacios futuros sin sobrescribir citas guardadas. |
| `npm test` | Ejecuta las pruebas con bases temporales y datos controlados. |
| `npm start` | Levanta la aplicación en `http://127.0.0.1:3000` de forma predeterminada. |

El README incluirá la versión de Node, los comandos en orden, dos NSS ficticios, cómo localizar la fecha de muestra y cómo iniciar otra cita. También indicará cómo crear una base aparte para repetir la demostración. El repositorio conservará el esquema y el generador de datos.

### Guion de verificación para la entrega funcional

1. Iniciar la aplicación con una base de demostración y abrir la pantalla de recepción.
2. Buscar un NSS ficticio con cero inicial y verificar los datos del paciente.
3. Seleccionar un médico y comprobar que el panel derecho muestra todos los datos solicitados.
4. Elegir una fecha y un espacio disponible. Apartar la cita y mostrar que la confirmación ocupa el mismo panel.
5. Revisar la confirmación después de recargar o reiniciar con la misma base. Luego mostrar la prueba de dos solicitudes para el mismo espacio y su resultado.

### Riesgos de implementación

| Riesgo | Medida y comprobación |
|---|---|
| La IA agrega funcionalidades fuera del caso. | Vincular cada cambio con una historia y revisar el conjunto modificado antes de integrarlo. |
| Una cita se duplica o se confirma antes de guardarse. | Restricción única por espacio, transacción, clave de operación y pruebas T07, T08 y T11. |
| La demo no encuentra horarios porque cambió la fecha. | Generar espacios futuros para la demo y usar un reloj fijo en las pruebas. Revisar la fecha y la zona antes de grabar. |
| Cada integrante tiene un entorno distinto. | Fijar Node y dependencias y verificar el README con un arranque limpio en otro equipo. |
| La pantalla conserva un paciente o un horario anterior. | Invalidar la selección al cambiar el contexto y probar respuestas tardías y cambios de médico. |
| Las evidencias contienen datos que no corresponden al ejercicio. | Preparar catálogos ficticios y revisar capturas, registros y prompts antes de compartirlos. |

### Fuentes de referencia

- Enunciado del caso 5 «Registrar cita médica», proporcionado por el equipo.
- Consigna «Plan del proyecto (.md)» y videos del taller «00 - Herramientas y Costos» y «01 - Prompt, modos y token».
- [Backlog de Registro de Citas Médicas en Jira](https://equipodeopta1.atlassian.net/jira/software/projects/RCM/boards/35/backlog).
- [Plantillas en Express](https://expressjs.com/en/guide/using-template-engines/) · [SQLite en Node](https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html) · [Funcionamiento local de SQLite](https://sqlite.org/serverless.html).
