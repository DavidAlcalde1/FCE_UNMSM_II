/* Oculta loader cuando todo esté listo + retardo */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200);
});

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));

if (!id) {
  document.body.innerHTML = '<p style="text-align:center; margin-top:3rem;">Noticia no encontrada.</p>';
}

// ✅ FETCH A TU API (no al JSON estático)
fetch(`/api/noticias/${id}`)
  .then(res => {
    if (!res.ok) throw new Error('Noticia no encontrada');
    return res.json();
  })
  .then(noticia => {
    const container = document.getElementById('noticia-container');
    container.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}" />
      <h1>${noticia.titulo}</h1>
      <p class="fecha">${noticia.fecha}</p>
      <div class="contenido">${noticia.contenido}</div>
    `;
  })
  .catch(err => {
    document.body.innerHTML = `<p style="text-align:center; margin-top:3rem;">${err.message}</p>`;
  });