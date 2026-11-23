# Estado de implementación

- **Última actualización:** 23/11/2026, hora local de Hermosillo.
- **Actualizó:** Claude Code.
- **Hito actual:** 0 completado con base visual de recepción. Hito 1 por iniciar.
- **Estado:** Base de la aplicación, capa de datos y pantalla de recepción diseñada. La búsqueda por NSS sigue pendiente.

## Último avance verificado

- Node.js 24.12.0, Express y EJS sirven la pantalla inicial de recepción en `GET /`.
- SQLite aplica una migración versionada y carga los catálogos ficticios y los horarios de consulta. Se crearon repositorios para pacientes, médicos, agenda y citas.
- Seis pruebas de integración verifican el arranque, las consultas, la agenda, la persistencia y las restricciones de unicidad.
- La [bitácora](../bitacora-ia.md) documenta lo realizado para el video 02a y enlaza las salidas de verificación.

## Base visual de recepción (Claude Code)

**Archivos:** `src/views/recepcion.ejs`, `src/public/css/recepcion.css`, `src/public/js/recepcion.js` (nuevo).

**Decisiones que deben mantener las siguientes pantallas:**
- Variables en `:root` de `recepcion.css` (color, tipografía, espaciado `--espacio-*`, `--radio`, `--foco-*`, `--alto-control`). No usar valores sueltos.
- Componentes reutilizables: `.panel` (+ `.panel--detalle`), `.campo` (label, `.campo__ayuda`, input), `.boton`, `.estado` (`--pendiente`, `--ok`, `--error`; siempre con texto, no solo color).
- Paleta azul petróleo (`--color-primario` #0b5c63) sobre fondo claro; foco azul de 3 px con `outline-offset`; controles de 3 rem (3.25 rem en puntero táctil).
- Distribución: formulario a la izquierda y `#panel-derecho` (`<aside>`) a la derecha desde 56 rem; debajo del formulario en pantallas angostas. Médico, horario y confirmación se renderizan dentro de `#panel-derecho` con `.panel`/`.estado`.
- Etiquetas visibles, ayuda enlazada con `aria-describedby`, mensajes en `role="status"`, indicador de pasos `<ol>` con `aria-current="step"`, enlace para saltar al NSS.
- Búsqueda pendiente: el formulario tiene `data-busqueda="pendiente"` y el botón `aria-disabled="true"`. `recepcion.js` evita el envío y avisa en la región de estado. Para conectar el hito 1, quitar ese atributo y el `aria-disabled`, y sustituir el aviso por resultados.

**Comprobaciones:** `npm test` → 6 de 6 pasan. Capturas con Chrome headless a 1280 px (dos columnas) y 500 px (apilado, sin desbordamiento horizontal). Servidor responde 200 en `/`, CSS y JS. **No verificado:** navegación con teclado real y lector de pantalla (la extensión de Chrome no estaba conectada). El foco se implementó con `:focus-visible`; pendiente de revisión manual con Tab. Tampoco se probó a 390 px reales (el modo headless no baja de 500 px).

## Implementación y pruebas

| Área | Estado |
|---|---|
| Repositorio Git | Rama `main`, con `origin` configurado. Cambios del hito 0 locales. |
| Node, Express y EJS | Arranque y respuesta HTTP verificados. |
| Migración SQLite y datos ficticios | Esquema y datos de demostración verificados. |
| Hitos 1 a 3 | Pendientes. Comprenden paciente, médico y agenda, y reserva con confirmación. |
| Verificación y demostración | El flujo completo se verificará cuando estén conectadas las historias. |

## Siguiente paso

**Hito 1 · Identificación del paciente (primera tarea técnica).** Revisar con Tab el foco de la pantalla. Después conectar el formulario de recepción con la ruta de búsqueda y el repositorio de pacientes. Validar el NSS de 11 dígitos y probar los resultados de búsqueda, los mensajes de error y la limpieza del paciente anterior. Guiarse por HU-01 a HU-03 y [PLAN.md](../../PLAN.md).

## Cómo actualizar este registro

Reemplaza el resumen y el siguiente paso con el estado vigente. Añade una entrada breve al historial si cambió un hito, hubo un bloqueo o quedó una decisión relevante. Si se usa Git, anota la rama o el commit que ayude a localizar el avance.

Cada entrada debe indicar **quién y cuándo**, **qué cambió**, **qué se verificó**, **qué queda pendiente** y **qué tarea sigue**.

## Historial

- **23/11/2026 · Codex.** Preparó el plan y el contexto compartido. La implementación empieza en el hito 0.
- **23/11/2026 10:17 · Codex.** Inicializó Git en `main`, configuró `origin` para [ProyectoFinal](https://github.com/donatohdez/ProyectoFinal) y preparó el commit de planificación `23123a7`.
- **23/11/2026 · Codex.** Preparó y verificó el arranque de Express y EJS y los repositorios con SQLite. El siguiente paso es conectar la búsqueda de pacientes.
- **23/11/2026 10:53 · Codex.** Configuró Modern Web Guidance como skill de proyecto para Codex y Claude Code. Verificó que ambos apuntan al mismo archivo y que el buscador devuelve la guía de validación de formularios. El siguiente paso sigue siendo conectar la búsqueda por NSS.
- **23/11/2026 · Claude Code.** Diseñó la base visual de recepción (HTML/CSS/JS en `src/`), documentó decisiones visuales y verificó pruebas y capturas. Pendiente: revisión manual de teclado. Siguiente: conectar la búsqueda por NSS (hito 1).
