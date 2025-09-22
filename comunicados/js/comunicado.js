/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});



const id = Number(new URLSearchParams(location.search).get('id'));
if (!id) document.body.innerHTML = '<p style="text-align:center;margin-top:3rem;">Comunicado no encontrado.</p>';

fetch('./json/comunicados.json')
  .then(r => r.json())
  .then(d => {
    const c = d.find(x => x.id === id);
    if (!c) throw new Error('Comunicado no encontrado');
    document.getElementById('comunicado-container').innerHTML = `
      <img src="${c.imagen}" alt="">
      <h1>${c.titulo}</h1>
      <p class="comunicado-fecha">${new Date(c.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div class="comunicado-texto">${c.contenido}</div>
    `;
  })
  .catch(e => {
    document.body.innerHTML = `<p style="text-align:center;margin-top:3rem;">${e.message}</p>`;
  });

  // Aplicar animación a cada tarjeta
const cards = document.querySelectorAll('.comunicado-card');
cards.forEach((card, index) => {
  card.classList.add('fade-in');
  card.style.animationDelay = `${index * 0.1}s`;
});