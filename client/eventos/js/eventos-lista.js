document.addEventListener('DOMContentLoaded', async () => {
      try {
        const res = await fetch('/api/eventos');
        const eventos = await res.json();

        const contenedor = document.getElementById('todos-eventos');
        if (!contenedor) return;

        if (!eventos || eventos.length === 0) {
          contenedor.innerHTML = '<p style="text-align:center; color:#6c757d;">No hay eventos programados.</p>';
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
            <article style="background:white; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
              ${e.imagen ? `<img src="/${e.imagen}" alt="${e.titulo}" style="width:100%; height:180px; object-fit:cover;">` : ''}
              <div style="padding:1.2rem;">
                <span style="color:#007bff; font-size:0.9rem;">${fecha}</span>
                <h3 style="margin:0.5rem 0; font-size:1.2rem;">${e.titulo}</h3>
                <p style="color:#555; font-size:0.95rem; margin:0.8rem 0;">
                  ${e.descripcion?.substring(0, 100)}${e.descripcion?.length > 100 ? '...' : ''}
                </p>
                <a href="./evento.html?id=${e.id}" style="display:inline-block; color:#007bff; text-decoration:underline; font-weight:bold;">
                  Ver más →
                </a>
              </div>
            </article>
          `;
        }).join('');

        contenedor.innerHTML = cards;

        // Ocultar loader
        const loader = document.getElementById('loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 500);
        }

      } catch (err) {
        console.error(err);
        document.getElementById('todos-eventos').innerHTML = '<p style="text-align:center; color:red;">Error al cargar eventos.</p>';
      }
    });