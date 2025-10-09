/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});



fetch('./json/eventos.json')
  .then(r=>r.json())
  .then(data=>{
      const wrap = document.getElementById('todos-eventos');
      wrap.innerHTML = data.map(ev=>`
        <article class="evento-card">
          <img src="${ev.imagen}" alt="${ev.titulo}">
          <div class="content">
            <div class="fecha">${ev.fecha}</div>
            <h3>${ev.titulo}</h3>
            <p>${ev.descripcion || ''}</p>
            <a href="${ev.url}">Ver más</a>
          </div>
        </article>`).join('');
  })
  .catch(()=> document.getElementById('todos-eventos').innerHTML = '<p>Error al cargar los eventos.</p>');