/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});
    
    
    
    
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id || isNaN(id)) {
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">ID de evento inválido.</h2>';
    return;
  }

  try {
    const res = await fetch(`/api/eventos/${id}`);
    if (!res.ok) throw new Error('Evento no encontrado');
    const evento = await res.json();

    document.title = `Evento - ${evento.titulo}`;
    document.getElementById('evento-titulo').textContent = evento.titulo;
    document.getElementById('evento-fecha').textContent = 
      new Date(evento.fecha).toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

    if (evento.imagen) {
      document.getElementById('evento-imagen').src = '/' + evento.imagen;
      document.getElementById('evento-imagen').style.display = 'block';
    }

    document.getElementById('evento-descripcion').innerHTML = 
      evento.descripcion ? evento.descripcion.replace(/\n/g, '<br>') : '';

    const enlaceEl = document.getElementById('evento-enlace');
    const linkEl = document.getElementById('enlace-evento');
    if (evento.url) {
      linkEl.href = evento.url;
      enlaceEl.style.display = 'block';
    }

    // Ocultar loader
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }

  } catch (err) {
    console.error(err);
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">Error al cargar el evento.</h2>';
  }
});