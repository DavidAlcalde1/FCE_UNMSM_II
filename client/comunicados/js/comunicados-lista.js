fetch('json/comunicados.json')
  .then(r => r.json())
  .then(d => {
    d.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const box = document.getElementById('lista-comunicados');
    box.innerHTML = d.map(c => `
      <article class="card-comunicado">
        <img src="${c.imagen}" alt="">
        <div class="card-body">
          <p class="card-fecha">${new Date(c.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h2 class="card-title">${c.titulo}</h2>
          <p class="card-resumen">${c.resumen}</p>
          <a href="comunicado.html?id=${c.id}" class="btn-leer">Ver comunicado</a>
        </div>
      </article>
    `).join('');
  })
  .catch(() => {
    document.getElementById('lista-comunicados').innerHTML =
      '<p style="text-align:center;">Error al cargar comunicados.</p>';
  });