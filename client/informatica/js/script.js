
/* =========  SPINNER  ========= */
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const TIEMPO = 1500; // 3 segundos 

  setTimeout(() => {
    loader.style.transition = 'opacity 1s ease';
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 1000);
  }, TIEMPO);
});

/* =========  GALERÍA (solo si estamos en galeria-informatica.html)  ========= */
document.addEventListener('DOMContentLoaded', () => {
  const IMAGES_BASE_PATH = './img/informatica/trabajos/';
  const JSON_URL = './informatica/json/trabajos.json';
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;                  // no estamos en la galería

  cargarGaleria();

  async function cargarGaleria() {
    try {
      const res = await fetch(JSON_URL);
      if (!res.ok) throw new Error('Error ' + res.status);
      const data = await res.json();
      renderizarGaleria(data.trabajos);
    } catch (err) {
      console.error(err);
      galleryGrid.innerHTML = `<p class="error-message">Error al cargar la galería.</p>`;
    }
  }

  function renderizarGaleria(trabajos) {
    galleryGrid.innerHTML = '';
    trabajos.forEach(t => {
      const card = document.createElement('a');
      card.href = `galeria-detalle.html?id=${t.id}`;
      card.className = 'gallery-card';
      const img = t.imagenes[0];
      card.innerHTML = `
        <div class="card-image">
          <img src="${IMAGES_BASE_PATH}${img}" alt="${t.titulo}" loading="lazy">
          <div class="card-overlay"><i class="fas fa-images"></i><span>Ver más fotos</span></div>
        </div>
        <div class="card-content">
          <h3>${t.titulo}</h3>
          <span class="card-date"><i class="far fa-calendar-alt"></i> ${t.fecha}</span>
        </div>`;
      galleryGrid.appendChild(card);
    });
  }
});

/* =========  MENÚ + HEADER (solo si existen)  ========= */
function initMenuHamburguesa() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 100);
    });
  }
}

/* =========  COSAS DE OTRAS PÁGINAS (con guardas)  ========= */
document.addEventListener('DOMContentLoaded', () => {
  // Carrusel
  const carrusel = document.querySelector('.carrusel-noticias');
  if (carrusel) carrusel.innerHTML = '<p>Carrusel cargado</p>'; // tu lógica real aquí

  // Noticias home
  const noticiasHome = document.querySelector('.noticias-home');
  if (noticiasHome) {
    fetch('./json/noticias.json')
      .then(r => r.json())
      .then(data => console.log('Noticias:', data))
      .catch(() => {});
  }

  // Últimas noticias
  const ultNot = document.querySelector('.ultimas-noticias');
  if (ultNot) console.log('Últimas noticias listas');

  // GSAP solo si existe
  if (typeof gsap !== 'undefined') {
    // animarTarjetas();  // descomenta cuando cargues GSAP
  }

  // Botones genéricos
  const btn = document.querySelector('.btn-something');
  if (btn) btn.addEventListener('click', () => console.log('click'));
});