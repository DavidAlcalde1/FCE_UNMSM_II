//= concursos.js
fetch('./convocatorias/json/concursos.json')
  .then(r => r.json())
  .then(data => {
    const wrap = document.getElementById('lista-concursos');
    wrap.innerHTML = data.map(c => `
      <article class="convocatoria-item">
        <h3 class="convocatoria-titulo">${c.titulo}</h3>
        <time class="convocatoria-fecha">Vence: ${c.fecha}</time>
        <p class="convocatoria-descripcion">${c.descripcion}</p>
        <span class="convocatoria-estado">${c.estado}</span>
        <a href="${c.pdf}" target="_blank" class="convocatoria-pdf">Ver convocatoria</a>
      </article>`).join('');
  });