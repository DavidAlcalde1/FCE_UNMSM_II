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
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id || isNaN(id)) {
    document.body.innerHTML = '<h2 class="mensaje-error">ID de evento inválido.</h2>';
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

  } catch (err) {
    console.error(err);
    document.body.innerHTML = '<h2 class="mensaje-error">Error al cargar el evento.</h2>';
  }
});
