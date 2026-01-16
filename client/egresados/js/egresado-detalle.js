// Controlador del spinner - versión robusta
(function() {
  const loader = document.getElementById('loader');
  if (!loader) return;

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
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">ID de egresado inválido.</h2>';
    return;
  }

  try {
    const res = await fetch(`/api/egresados/${id}`);
    if (!res.ok) throw new Error('Egresado no encontrado');
    const data = await res.json();

    // Mostrar todos los campos para debugging
    console.log('Datos del egresado:', data);
    console.log('Campos disponibles:', Object.keys(data));

    const box = document.getElementById('testimonio-box');
    if (!box) return;

    // Buscar automáticamente el campo de imagen
    const camposPosibles = ['imagen', 'foto', 'url_foto', 'url_imagen', 'avatar', 'image', 'img'];
    let fotoSrc = '';
    
    for (const campo of camposPosibles) {
      if (data[campo]) {
        // Verificar si la ruta ya contiene "img/" al inicio
        if (data[campo].startsWith('img/')) {
          fotoSrc = data[campo];
        } else {
          fotoSrc = `img/index/egresados/${data[campo]}`;
        }
        console.log(`Campo encontrado: ${campo} = ${data[campo]}`);
        break;
      }
    }

    const imagenHTML = fotoSrc 
      ? `<img src="${fotoSrc}" alt="${data.nombre}" onerror="this.style.display='none'">` 
      : '';

    box.innerHTML = `
      <article class="testimonio-card">
        ${imagenHTML}
        <h2>${data.nombre}</h2>
        <p class="cargo">${data.cargo || data.especialidad || ''}</p>
        <blockquote>${data.testimonio || data.mensaje || 'Sin testimonio disponible.'}</blockquote>
        ${data.empresa ? `<p class="empresa">${data.empresa}</p>` : ''}
        <a href="./egresados.html" class="btn-volver">Volver a egresados</a>
      </article>
    `;

    document.title = `${data.nombre} - Egresado FCE`;

  } catch (err) {
    console.error(err);
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:4rem;">Error al cargar el egresado.</h2>';
  }
});