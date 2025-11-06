// Cargar comunicados desde la API
document.addEventListener('DOMContentLoaded', async () => {
  const listaEl = document.getElementById('lista-comunicados');
  if (!listaEl) return;

  try {
    const res = await fetch('/api/comunicados');
    if (!res.ok) throw new Error('Error al cargar comunicados');
    const comunicados = await res.json();

    if (!Array.isArray(comunicados) || comunicados.length === 0) {
      listaEl.innerHTML = '<p class="sin-datos">No hay comunicados disponibles.</p>';
      return;
    }

    // Ordenar por fecha descendente (más reciente primero)
    const sorted = [...comunicados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const cards = sorted.map(com => {
      const fecha = new Date(com.fecha).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return `
        <article class="card-comunicado">
          ${com.imagen ? `
            <div class="card-img">
              <img src="/${com.imagen}" alt="${com.titulo}" onerror="this.style.display='none'">
            </div>
          ` : ''}
          <div class="card-content">
            <span class="fecha-comunicado">${fecha}</span>
            <h2 class="titulo-comunicado">${com.titulo}</h2>
            <p class="resumen-comunicado">${com.contenido?.substring(0, 120)}${com.contenido?.length > 120 ? '...' : ''}</p>
            <a href="./comunicado.html?id=${com.id}" class="btn-ver-mas">Leer más</a>
          </div>
        </article>
      `;
    }).join('');

    listaEl.innerHTML = cards;

    // Aplicar animaciones si usas ScrollReveal u otras
    if (typeof ScrollReveal !== 'undefined') {
      ScrollReveal().sync();
    }

  } catch (err) {
    console.error('Error:', err);
    listaEl.innerHTML = '<p class="error-carga">No se pudieron cargar los comunicados.</p>';
  }
});