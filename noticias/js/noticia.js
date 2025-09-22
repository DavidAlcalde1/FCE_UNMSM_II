/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});


const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));

if (!id) {
  document.body.innerHTML = '<p style="text-align:center; margin-top:3rem;">Noticia no encontrada.</p>';
}

fetch('../../json/noticias.json')
  .then(res => res.json())
  .then(data => {
    const noticia = data.find(n => n.id === id);
    if (!noticia) throw new Error('Noticia no encontrada');

    const container = document.getElementById('noticia-container');
    container.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}" />
      <h1>${noticia.titulo}</h1>
      <p class="fecha">${new Date(noticia.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</p>
      <div class="contenido">${noticia.contenido}</div>
    `;
  })
  .catch(err => {
    document.body.innerHTML = `<p style="text-align:center; margin-top:3rem;">${err.message}</p>`;
  });