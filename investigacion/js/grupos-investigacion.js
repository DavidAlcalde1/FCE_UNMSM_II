
/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});



/* ====== CARGA GRUPOS DESDE JSON ====== */
fetch('./investigacion/json/grupos.json')
  .then(res => res.json())
  .then(data => mostrarGrupos(data))
  .catch(err => console.error('Error al cargar grupos:', err));

function mostrarGrupos(lista) {
  const contenedor = document.getElementById('grupos-lista');
  contenedor.innerHTML = '';

  lista.forEach(g => {
    const card = document.createElement('div');
    card.className = 'grupo-card';
    card.innerHTML = `
      <h3 class="grupo-nombre">${g.nombre}</h3>
      <p class="grupo-coordinador">Coordinador: ${g.coordinador}</p>
      <p class="grupo-descripcion">${g.descripcion}</p>
      <p class="grupo-miembros">${g.miembros} investigadores</p>
      <a href="${g.url}" class="grupo-btn" target="_blank">Ver más</a>
    `;
    contenedor.appendChild(card);
  });
}