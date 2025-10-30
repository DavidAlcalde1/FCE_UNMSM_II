// becas-ayudas.js
fetch('./convocatorias/json/becas-ayudas.json')
  .then(r => r.json())
  .then(data => {
    const contenedor = document.getElementById('lista-becas');
    contenedor.innerHTML = data.map(item => `
      <article class="convocatoria-item">
        <h3 class="convocatoria-titulo">${item.titulo}</h3>
        <time class="convocatoria-fecha">Vence: ${item.fecha}</time>
        <p class="convocatoria-descripcion">${item.descripcion}</p>
        <span class="convocatoria-estado">${item.estado}</span>
        <a href="${item.pdf}" class="convocatoria-pdf" target="_blank">Ver convocatoria</a>
      </article>
    `).join('');
  });

  