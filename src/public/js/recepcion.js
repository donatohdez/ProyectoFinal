// Punto de enlace para el hito 1. Mientras la búsqueda por NSS esté pendiente
// (data-busqueda="pendiente"), el envío no consulta nada y se explica en la
// región de estado. Al conectar la búsqueda, basta con quitar ese atributo y
// el aria-disabled del botón.
const formulario = document.querySelector('#form-nss');

if (formulario) {
  const estado = formulario.querySelector('#nss-estado');
  const campo = formulario.querySelector('#nss');

  formulario.addEventListener('submit', (evento) => {
    if (formulario.dataset.busqueda === 'pendiente') {
      evento.preventDefault();
      estado.className = 'estado estado--pendiente';
      estado.lastChild.textContent = ' La búsqueda por NSS aún no está conectada. Esta acción se habilitará en el hito 1.';
      campo.focus();
    }
  });
}
