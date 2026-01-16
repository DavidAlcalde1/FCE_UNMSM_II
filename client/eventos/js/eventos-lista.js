// Controlador del spinner - versión robusta
(function() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Siempre esperar 1.5 segundos antes de ocultar
  setTimeout(function() {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';
    setTimeout(function() {
      loader.style.display = 'none';
    }, 500);
  }, 1500);
})();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/eventos');
    const eventos = await res.json();

    const contenedor = document.getElementById('todos-eventos');
    if (!contenedor) return;

    if (!eventos || eventos.length === 0) {
      contenedor.innerHTML = '<p class="sin-datos">No hay eventos programados.</p>';
      return;
    }

    // Ordenar por fecha ascendente (próximos primero)
    const sorted = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const cards = sorted.map(e => {
      const fecha = e.fecha 
        ? new Date(e.fecha).toLocaleDateString('es-PE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })
        : 'Sin fecha';

      return `
        <article class="evento-card">
          ${e.imagen ? `<div class="evento-imagen"><img src="/${e.imagen}" alt="${e.titulo}"></div>` : ''}
          <div class="evento-contenido">
            <span class="evento-fecha">${fecha}</span>
            <h3 class="evento-titulo">${e.titulo}</h3>
            <p class="evento-descripcion">${e.descripcion?.substring(0, 100)}${e.descripcion?.length > 100 ? '...' : ''}</p>
            <a href="./evento.html?id=${e.id}" class="evento-boton">Ver más</a>
          </div>
        </article>
      `;
    }).join('');

    contenedor.innerHTML = cards;

  } catch (err) {
    console.error(err);
    document.getElementById('todos-eventos').innerHTML = '<p class="error-carga">Error al cargar eventos.</p>';
  }
});
