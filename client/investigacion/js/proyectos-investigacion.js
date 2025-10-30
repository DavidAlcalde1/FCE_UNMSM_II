/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});

/* ====== CARGA PROYECTOS DESDE JSON ====== */
fetch('./investigacion/json/proyectos.json')
  .then(res => res.json())
  .then(data => mostrarProyectos(data))
  .catch(err => console.error('Error al cargar proyectos:', err));

function mostrarProyectos(lista) {
  const contenedor = document.getElementById('proyectos-lista');
  contenedor.innerHTML = ''; // limpia previos

  lista.forEach(p => {
    const claseEstado = p.estado === 'activo' ? 'estado-activo' : 'estado-finalizado';
    const card = document.createElement('div');
    card.className = 'proyecto-card';
    card.innerHTML = `
      <h3 class="proyecto-titulo">${p.titulo}</h3>
      <p class="proyecto-responsable">Responsable: ${p.responsable}</p>
      <p class="proyecto-resumen">${p.resumen}</p>
      <span class="proyecto-estado ${claseEstado}">${p.estado}</span>
      <p class="proyecto-fechas">Inicio: ${p.inicio} &nbsp;&nbsp; Fin: ${p.fin}</p>
      <a href="${p.url}" class="proyecto-btn" target="_blank">Ver detalle</a>
    `;
    contenedor.appendChild(card);
  });
}