# Registro de Citas Médicas

Estas instrucciones se comparten entre Codex y Claude Code.

## Antes de trabajar

1. Lee [CONTEXTO.md](docs/ia/CONTEXTO.md) para ubicar el caso y [ESTADO.md](docs/ia/ESTADO.md) para conocer el último avance y el siguiente paso.
2. Consulta las secciones de [PLAN.md](PLAN.md) que correspondan a la tarea. Si existe un repositorio Git, revisa la rama y los cambios locales. Comprueba el código y los resultados antes de dar por válido un estado anterior.
3. Atiende la tarea que indicó el usuario. Si te pide retomar, usa el siguiente paso de `ESTADO.md` y verifica que siga pendiente. Conserva los cambios locales de otras sesiones.

## Mientras trabajas

- Relaciona los cambios con el hito, la historia de Jira o el criterio del caso que corresponda.
- Conserva el stack acordado y los datos ficticios. Registra en el estado los cambios de diseño que el usuario acepte y actualiza el plan cuando cambie el alcance.
- Revisa el flujo afectado y ejecuta las pruebas pertinentes cuando existan. Registra los comandos y sus resultados reales. Si una comprobación queda pendiente, indica el motivo.

## Al entregar el turno

- Actualiza [ESTADO.md](docs/ia/ESTADO.md) si cambió el código, la planificación o el avance verificable. Anota fecha y hora, autor del cambio, hito, evidencias, archivos relevantes, pendientes y un siguiente paso concreto.
- Antes de actualizar el estado, reléelo e incorpora los cambios recientes de la otra sesión. Usa un único registro de avance para ambas herramientas.
- Si trabajas en un chat sin acceso a los archivos del proyecto, devuelve los cambios y el texto de relevo para incorporarlos a la carpeta compartida. Distingue el trabajo propuesto del que se verificó en el proyecto.
