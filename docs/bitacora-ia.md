# Bitácora de implementación con IA

## Punto de partida

- **Solicitud del usuario:** «vamos con eso, me recomiendas pasar a codex?». La tarea de referencia fue aplicar el video 02a al caso de citas médicas y conservar evidencia para el informe técnico posterior.
- **Plan suministrado:** `PLAN.md`, commit inicial `23123a7`. Sus secciones 4 a 7 definen el stack, el árbol, las tablas, los hitos y las pruebas.
- **Agente:** Codex. Los encargos técnicos siguientes se formularon en la sesión a partir de la solicitud del usuario.

## Encargo 1 · Estructura y arranque

> Aplica las secciones 4 y 6 de PLAN.md. Prepara Node.js 24, Express, EJS y la estructura de pacientes, médicos, agenda y citas. Separa la configuración de Express del arranque. Sirve en GET / la primera pantalla de recepción con el panel de detalle. Comprueba la respuesta HTTP y documenta cómo se reproduce. Deja las consultas y la reserva para los siguientes encargos.

## Encargo 2 · Esquema y repositorios

> Aplica las secciones 5 y 7 de PLAN.md. Prepara la conexión SQLite, la migración inicial, la carga de datos ficticios y los repositorios parametrizados. Conserva el NSS como texto, usa espacios futuros en la demostración y aplica la unicidad por espacio y clave de operación. Comprueba la consulta de pacientes y agenda, la persistencia y el rechazo de un duplicado en la base de datos. Deja los servicios y las rutas del flujo para los siguientes hitos.

## Resultado frente al plan

| Punto previsto | Resultado obtenido |
|---|---|
| Pantalla inicial de recepción | Express respondió HTTP 200. La vista muestra el campo de NSS y el panel derecho. La acción de búsqueda se conectará en el hito 1. |
| Arquitectura y persistencia | La aplicación usa el stack acordado. SQLite crea las cinco tablas de dominio y registra las migraciones en una tabla técnica. |
| Catálogos y agenda | Las consultas recuperan el NSS con sus ceros iniciales, la ficha del médico y espacios futuros de 30 minutos dentro de consulta. |
| Prevención de duplicados | SQLite impide repetir el espacio o la clave de operación. La prueba comprueba estas restricciones en la capa de datos. El flujo HTTP de reserva, los reintentos y las solicitudes simultáneas se verificarán en su hito. |

La instalación inicial con `npm install --offline` devolvió `ENOTCACHED`. La instalación con acceso al registro generó `package-lock.json`. La primera prueba HTTP en el entorno restringido devolvió `listen EPERM`. La repetición con permiso para abrir un puerto local respondió correctamente.

## Evidencias

- [02a-01 · Prueba HTTP de la pantalla inicial](evidencias/02a-01-arranque.txt)
- [02a-02 · Migración, carga de demostración y ejecución de pruebas](evidencias/02a-02-datos.txt)

## Encargo 3 · Pantalla principal de recepción (Claude Code)

> Diseña e implementa la pantalla principal con identidad de clínica, NSS como primera acción, panel derecho reutilizable y estado real de la búsqueda, consultando Modern Web Guidance.

| Guía de Modern Web Guidance | Decisión concreta en el código |
|---|---|
| `responsive-design` | `--texto-h1: clamp(1.75rem, 1.2rem + 2vw, 2.5rem)` (mínimo y máximo en rem, razón menor a 2.5) y `min-block-size: 100dvh` en `body` en lugar de `vh`. |
| `forms` | `<search><form>` con `<label for>` visible, ayuda enlazada con `aria-describedby`, `inputmode="numeric"` sin `type="number"` (conserva ceros iniciales del NSS), `autocorrect="off"`, `font-size: max(1rem, 1em)`, controles de 48 px (52 px con `pointer: coarse`) y `:user-invalid` en lugar de `:invalid`. |
| `accessibility` | `:focus-visible` con contorno de 3 px y `outline-offset`; botón con `aria-disabled` (sigue enfocable) en lugar de `disabled`; región `role="status"` para el estado de la búsqueda; enlace de salto, `lang="es"`, título único, `<ol>` con `aria-current="step"` y estados con texto además de color. |

**Comprobaciones:** `npm test` 6/6; capturas headless a 1280 px y 500 px; HTTP 200 de vista, CSS y JS. Teclado y lector de pantalla quedan pendientes de revisión manual.
