# Contexto compartido del proyecto

**Proyecto:** Registro de Citas Médicas · **Equipo:** 5 · **Materia:** Fundamentos de IA en Ingeniería de Software.

## Resultado que debe poder demostrarse

El caso 5, «Registrar cita médica», pide solicitar el Número de Seguridad Social, mostrar los datos del paciente y la lista de médicos, y mostrar a la derecha la ficha del médico seleccionado. Al apartar una cita, esa misma zona presenta la información del paciente, el nombre del médico, el consultorio, la fecha y la hora.

El enunciado completo, la arquitectura, el modelo de datos y las pruebas previstas están en [PLAN.md](../../PLAN.md). El estado de la implementación vive en [ESTADO.md](ESTADO.md). El [backlog de Jira](https://equipodeopta1.atlassian.net/jira/software/projects/RCM/boards/35/backlog) reúne las historias del ejercicio anterior y sirve como referencia de requisitos y coordinación.

## Decisiones acordadas

| Tema | Decisión |
|---|---|
| Aplicación | Node.js 24 LTS, Express, EJS, HTML, CSS, JavaScript y SQLite mediante `node:sqlite`. La interfaz y el servidor viven en el mismo proyecto. |
| Datos de demostración | Catálogos ficticios y base local persistente. El NSS se guarda como texto de 11 dígitos para conservar ceros iniciales. |
| Agenda | Espacios futuros de 30 minutos dentro del horario del médico. La hora se presenta en `America/Hermosillo`. |
| Reserva | El servidor vuelve a validar antes de guardar. Cada espacio admite una cita y un reintento de la misma operación recupera su resultado. La confirmación utiliza los datos guardados. |
| Alcance inicial | Recepción, identificación, médicos, agenda y reserva. La ejecución local es la base de la demostración. |
| Trabajo con IA | El equipo usa ChatGPT y Claude. Cada tarea indica contexto, resultado, restricciones y criterio de terminado. El equipo revisa los cambios y las pruebas. |

## Historias de referencia

| Flujo | Historias en Jira |
|---|---|
| Paciente | HU-01 / RCM-4 búsqueda, HU-02 / RCM-8 validación, HU-03 / RCM-12 datos del paciente. |
| Médico y agenda | HU-04 / RCM-16 consulta de médicos, HU-05 / RCM-20 selección de horario. |
| Reserva | HU-06 / RCM-24 guardado, HU-07 / RCM-25 exclusividad, HU-08 / RCM-26 confirmación. |

## Guías para la interfaz web

Al trabajar en HTML, CSS o JavaScript del navegador, consulta la skill [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance) desde Codex o Claude Code. Las dos herramientas comparten la misma instalación del proyecto. Usa el caso y el plan para elegir qué recomendaciones aplicar.

- **Búsqueda por NSS.** Empieza por [validación después de la interacción](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md). El NSS sigue siendo texto de 11 dígitos y Express valida cada consulta.
- **Médicos, horarios y confirmación.** Consulta las guías de diseño adaptable y accesibilidad para la distribución de los paneles, la navegación por teclado y los mensajes de estado.
- Registra en la bitácora la guía aplicada, qué decisión orientó y la comprobación que hiciste.

## Cómo retomar con la otra IA

- **Codex o Claude Code con la carpeta abierta.** Abre `ProyectoFinal` como carpeta de trabajo para que ambos consulten los mismos archivos. Pasa de una sesión a otra una vez guardado el estado. Si dos sesiones están abiertas, asigna solo a una la edición de la misma tarea.
- **ChatGPT o Claude en un chat.** Adjunta `CONTEXTO.md` y `ESTADO.md` actualizados, además de `PLAN.md` y los archivos concretos que necesite la tarea. Guarda en `ProyectoFinal` cualquier cambio aceptado y el estado actualizado antes de regresar a la otra IA.

Mensaje para iniciar una sesión con acceso a la carpeta:

> Lee AGENTS.md, docs/ia/CONTEXTO.md y docs/ia/ESTADO.md. Consulta las secciones de PLAN.md aplicables. Comprueba el último avance en los archivos y continúa con la tarea que te indique. Al cerrar, actualiza ESTADO.md con lo que verificaste y el siguiente paso.
