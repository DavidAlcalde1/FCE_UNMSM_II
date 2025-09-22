/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});



fetch('../../json/noticias.json')
  .then(res => res.json())
  .then(data => {
    // orden descendente por fecha
    data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const contenedor = document.getElementById('lista-noticias');
    contenedor.innerHTML = data.map(n => `
      <article class="tarjeta-noticia">
        <img src="${n.imagen}" alt="${n.titulo}">
        <div class="tarjeta-contenido">
          <h2>${n.titulo}</h2>
          <p class="tarjeta-fecha">${new Date(n.fecha).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
          <p class="tarjeta-resumen">${n.resumen}</p>
          <a href="noticia.html?id=${n.id}" class="btn-leer">Leer más</a>
        </div>
      </article>
    `).join('');
  })
  .catch(err => {
    document.getElementById('lista-noticias').innerHTML =
      '<p style="text-align:center;">Error al cargar las noticias.</p>';
  });