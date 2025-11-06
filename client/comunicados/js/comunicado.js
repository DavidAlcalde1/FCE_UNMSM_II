/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});

// comunicados/js/comunicado.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id || isNaN(id)) {
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">ID de comunicado inválido.</h2>';
    return;
  }

  // 2. Cargar desde la API
  try {
    const res = await fetch(`/api/comunicados/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">Comunicado no encontrado.</h2>';
      } else {
        document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">Error al cargar el comunicado.</h2>';
      }
      return;
    }

    const com = await res.json();

    // 3. Rellenar el contenido
    document.title = `Comunicado - ${com.titulo}`;
    document.getElementById('comunicado-titulo').textContent = com.titulo;
    document.getElementById('comunicado-fecha').textContent = 
      new Date(com.fecha).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

    // Imagen (si existe)
    const imgEl = document.getElementById('comunicado-imagen');
    if (com.imagen) {
      imgEl.src = '/' + com.imagen;
      imgEl.style.display = 'block';
    } else {
      imgEl.style.display = 'none';
    }

    // Contenido
    document.getElementById('comunicado-contenido').innerHTML = 
      com.contenido ? com.contenido.replace(/\n/g, '<br>') : '';

    // Botón de descarga (si hay archivo)
    const archivoEl = document.getElementById('comunicado-archivo');
    const enlaceEl = document.getElementById('enlace-archivo');

    if (com.archivo) {
      // Asegurar que la ruta sea absoluta si es relativa
      let urlArchivo = com.archivo;
      if (!urlArchivo.startsWith('http') && !urlArchivo.startsWith('/')) {
        urlArchivo = '/' + urlArchivo;
      }
      enlaceEl.href = urlArchivo;
      archivoEl.style.display = 'block';
    } else {
      archivoEl.style.display = 'none';
    }

  } catch (err) {
    console.error('Error:', err);
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">Error de conexión.</h2>';
  }
});