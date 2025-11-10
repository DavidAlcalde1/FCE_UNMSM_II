/* Oculta loader cuando todo esté listo + retardo */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});


// === UTILIDAD: OBTENER RUTA BASE DEL PROYECTO ===
function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const src = currentScript.src;
    const path = src.substring(0, src.lastIndexOf('/') + 1);
    return path.replace('/js/', '/');
}
const BASE_PATH = getBasePath();

// === POP-UP DE TRANSPARENCIA ===
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('transparencia-popup');
    const cerrarBtn = document.getElementById('cerrar-popup');

    if (popup) {
        setTimeout(() => {
            popup.style.display = 'flex';
        }, 1000);
    }

    function cerrarPopup() {
        if (popup) {
            popup.style.opacity = '0';
            popup.style.transform = 'scale(0.9)';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }
    }

    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', cerrarPopup);
    }

    if (popup) {
        popup.addEventListener('click', function (event) {
            if (event.target === popup) {
                cerrarPopup();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && popup && popup.style.display === 'flex') {
            cerrarPopup();
        }
    });
});



// === CARRUSEL DINÁMICO CON VIGENCIA ===
let carruselIniciado = false;

document.addEventListener('DOMContentLoaded', async () => {
  if (carruselIniciado) return;
  carruselIniciado = true;

  try {
    const [noticiasRes, eventosRes, comunicadosRes] = await Promise.all([
      fetch('/api/noticias'),
      fetch('/api/eventos'),
      fetch('/api/comunicados')
    ]);

    const noticias = await noticiasRes.json();
    const eventos = await eventosRes.json();
    const comunicados = await comunicadosRes.json();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Combinar y etiquetar todos los items
    const todosLosItems = [
      ...noticias.map(n => ({ ...n, tipo: 'noticia' })),
      ...eventos.map(e => ({ ...e, tipo: 'evento' })),
      ...comunicados.map(c => ({ ...c, tipo: 'comunicado' }))
    ];

    // Filtrar por vigencia
    const itemsVigentes = todosLosItems.filter(item => {
      if (!item.fecha_vencimiento) return true;
      const fechaVenc = new Date(item.fecha_vencimiento);
      return fechaVenc >= hoy;
    });

    // Ordenar por fecha de publicación (más reciente primero)
    itemsVigentes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Tomar hasta 3
    const slidesData = itemsVigentes.map(item => {
      let url;
      if (item.tipo === 'noticia') url = `/noticia.html?id=${item.id}`;
      else if (item.tipo === 'evento') url = `/evento.html?id=${item.id}`;
      else url = `/comunicado.html?id=${item.id}`;

      return {
        titulo: item.titulo,
        fecha: new Date(item.fecha).toLocaleDateString('es-PE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        imagen: item.imagen || '/img/index/noticia_principal/banner_01.png',
        url
      };
    });

    // Fallback si no hay contenido
    if (slidesData.length === 0) {
      slidesData.push(
        { titulo: 'MATRÍCULA EXTEMPORÁNEA', fecha: 'Jueves 15 de Diciembre', imagen: '/img/index/noticia_principal/banner_01.png', url: '/slides/MATRÍCULA EXTEMPORÁNEA.png' },
        { titulo: 'CONFERENCIA MAGISTRAL', fecha: 'Martes 13 de Diciembre', imagen: '/img/index/noticia_principal/banner_02.png', url: '/slides/CONFERENCIA MAGISTRAL.jpg' },
        { titulo: 'CURSOS DE POSGRADO', fecha: 'Dirigido a Bachilleres', imagen: '/img/index/noticia_principal/banner_03.jpg', url: '/slides/CURSOS POSGRADO.jpg' }
      );
    }

    // Renderizar
    const slidesHTML = slidesData.map((slide, i) => `
      <div class="slide ${i === 0 ? 'active' : ''}">
        <img src="${slide.imagen}" alt="${slide.titulo}">
        <div class="slide-content">
          <h2>${slide.titulo}</h2>
          <p>${slide.fecha}</p>
          <a href="${slide.url}" target="_blank" class="slide-btn">Ver más</a>
        </div>
      </div>
    `).join('');

    const dotsHTML = slidesData.map((_, i) => `
      <span class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>
    `).join('');

    document.querySelector('.slides').innerHTML = slidesHTML;
    document.querySelector('.indicators').innerHTML = dotsHTML;

    // === LÓGICA DE CARRUSEL ===
    let current = 0;
    let intervalId = null;

    const updateSlide = (index) => {
      document.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === index));
      document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
    };

    const startAutoplay = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        current = (current + 1) % slidesData.length;
        updateSlide(current);
      }, 5000);
    };

    const stopAutoplay = () => {
      if (intervalId) clearInterval(intervalId);
    };

    document.querySelector('.prev')?.addEventListener('click', () => {
      stopAutoplay();
      current = (current - 1 + slidesData.length) % slidesData.length;
      updateSlide(current);
      startAutoplay();
    });

    document.querySelector('.next')?.addEventListener('click', () => {
      stopAutoplay();
      current = (current + 1) % slidesData.length;
      updateSlide(current);
      startAutoplay();
    });

    document.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        updateSlide(parseInt(dot.dataset.slide));
        startAutoplay();
      });
    });

    startAutoplay();

    const carouselEl = document.querySelector('.carousel');
    carouselEl?.addEventListener('mouseenter', stopAutoplay);
    carouselEl?.addEventListener('mouseleave', startAutoplay);

  } catch (err) {
    console.error('Error en carrusel:', err);
  }
});







// === CONTADOR ANIMADO ===
window.addEventListener('load', () => {
    const contadores = document.querySelectorAll('.contador');
    contadores.forEach(contador => {
        const actualizar = () => {
            const objetivo = +contador.getAttribute('data-target');
            const actual = +contador.innerText;
            const incremento = Math.ceil(objetivo / 100);
            if (actual < objetivo) {
                contador.innerText = actual + incremento;
                setTimeout(actualizar, 30);
            } else {
                contador.innerText = objetivo;
            }
        };
        actualizar();
    });
});





// === CARRUSEL PREGRADO (3 visibles, 6 reales, sin espacio a la derecha) ===
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('pregrado-carousel');
  if (!carousel) return;

  const cards = Array.from(carousel.children);
  const totalOriginal = cards.length;
  const visible = 3;

  if (totalOriginal === 0) return;

  // ✅ Paso 1: Clonar las primeras tarjetas al final (para loop infinito)
  const clones = [];
  for (let i = 0; i < Math.min(visible, totalOriginal); i++) {
    const clone = cards[i].cloneNode(true);
    clone.setAttribute('data-cloned', 'true');
    clones.push(clone);
    carousel.appendChild(clone);
  }

  // ✅ Paso 2: Recalcular lista (ahora incluye clones)
  const allCards = Array.from(carousel.children);
  let currentIndex = 0;
  let isTransitioning = false;

  // ✅ Obtener ancho + gap de una tarjeta (seguro)
  function getCardOuterWidth() {
    const card = allCards[0];
    const rect = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);
    return rect.width + marginLeft + marginRight;
  }

  // ✅ Desplazar
  function moveToIndex(index) {
    if (isTransitioning) return;
    
    const cardWidth = getCardOuterWidth();
    const translateX = -index * cardWidth;

    isTransitioning = true;
    carousel.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    carousel.style.transform = `translateX(${translateX}px)`;

    // ✅ Loop inteligente: cuando llega al clon, saltar sin animación al original
    setTimeout(() => {
      if (index >= totalOriginal && allCards[index]?.hasAttribute('data-cloned')) {
        // Saltar al principio (sin transición)
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(0px)`;
        currentIndex = 0;
      } else if (index < 0) {
        // Saltar al final (al último grupo original)
        const lastValidIndex = totalOriginal - visible;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(${-lastValidIndex * cardWidth}px)`;
        currentIndex = lastValidIndex;
      }
      isTransitioning = false;
    }, 600);
  }

  // ✅ Funciones públicas
  function next() {
    if (currentIndex < totalOriginal) { // Permitir ir hasta el clon
      currentIndex++;
      moveToIndex(currentIndex);
    }
  }

  function prev() {
    if (currentIndex > 0 || totalOriginal > visible) {
      currentIndex--;
      moveToIndex(currentIndex);
    }
  }

  // ✅ Botones
  const prevBtn = document.querySelector('.prev-pregrado-escuelas');
  const nextBtn = document.querySelector('.next-pregrado-escuelas');
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // ✅ Auto
  let auto = setInterval(next, 4000);
  const pause = () => clearInterval(auto);
  const resume = () => {
    pause();
    auto = setInterval(next, 4000);
  };

  [carousel, prevBtn, nextBtn].forEach(el => {
    el?.addEventListener('mouseenter', pause);
    el?.addEventListener('mouseleave', resume);
  });

  // ✅ Iniciar
  setTimeout(() => {
    moveToIndex(0);
  }, 100);
});







// === BOTÓN MODO OSCURO ===
const boton = document.getElementById('modoBtn');
boton?.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    boton.textContent = document.body.classList.contains('modo-oscuro') ? '☀️' : '🌙';
});

// === CARRUSEL DE NOTICIAS PRINCIPAL ===
console.log('🔍 Fetch de noticias en HOME');
fetch('/api/noticias')
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(noticias => {
        console.log('🔍 Noticias recibidas:', noticias); // ← Log de depuración
        const container = document.getElementById('noticias-carousel');
        const dotsContainer = document.getElementById('dots2');
        if (!container || !dotsContainer) return;

        let index = 0;

        noticias.forEach((noticia, i) => {
            const noticiaEl = document.createElement('div');
            noticiaEl.classList.add('noticia');
            if (i === 0) noticiaEl.classList.add('active');
            noticiaEl.innerHTML = `
                <img src="${noticia.imagen}" alt="${noticia.titulo}">
                <div class="contenido-noticia">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.resumen}</p>                    
                    <a href="noticia.html?id=${noticia.id}" class="btn-vermasN">Ver más</a>                    
                </div>
            `;
            container.insertBefore(noticiaEl, dotsContainer);

            const dot = document.createElement('span');
            dot.classList.add('dot2');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });

        const noticiasEls = document.querySelectorAll('.noticia');
        const dots = document.querySelectorAll('.dot2');

        function showNoticia(i) {
            noticiasEls.forEach((n, idx) => {
                n.classList.toggle('active', idx === i);
                dots[idx].classList.toggle('active', idx === i);
            });
            index = i;
        }

        document.querySelector('.prev2')?.addEventListener('click', () => {
            index = (index - 1 + noticias.length) % noticias.length;
            showNoticia(index);
        });

        document.querySelector('.next2')?.addEventListener('click', () => {
            index = (index + 1) % noticias.length;
            showNoticia(index);
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                showNoticia(parseInt(dot.dataset.index));
            });
        });

        setInterval(() => {
            index = (index + 1) % noticias.length;
            showNoticia(index);
        }, 5000);
    })
    .catch(err => {
        console.error("Error al cargar noticias principales:", err);
        const container = document.getElementById('noticias-carousel');
        if (container) {
            container.innerHTML = '<p style="color:red; text-align:center;">⚠️ Error al cargar noticias.</p>';
        }
    });

// === ÚLTIMAS 3 NOTICIAS ===
fetch('/api/noticias')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('🔍 Últimas noticias recibidas:', data); // ← Log de depuración
        const ultimas = data.slice(0, 3);
        const container = document.getElementById('ultimas-container');
        if (!container) return;

        ultimas.forEach(noticia => {
            const card = document.createElement('div');
            card.classList.add('noticia-card');
            card.innerHTML = `
                <img src="${noticia.imagen}" alt="${noticia.titulo}">
                <h3>${noticia.titulo}</h3>
                <p class="fecha"><i class="fa-regular fa-clock"></i> ${noticia.fecha}</p>
            `;
            container.appendChild(card);
        });
    })
    .catch(err => {
        console.error("Error al cargar últimas noticias:", err);
        const container = document.getElementById('ultimas-container');
        if (container) {
            container.innerHTML = '<p style="color:red; text-align:center;">⚠️ Error al cargar últimas noticias.</p>';
        }
    });

// === CARRUSEL DE POSGRADO (MAESTRÍAS Y DOCTORADOS) ===
function setupCarrusel(id, jsonPath, prevClass, nextClass) {
    const container = document.getElementById(id);
    const prevBtn = document.querySelector("." + prevClass);
    const nextBtn = document.querySelector("." + nextClass);

    if (!container || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let items = [];

    fetch(jsonPath)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            items = data;
            renderCards();

            if (items.length <= 3) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
        })
        .catch(err => {
            console.error("Error al cargar JSON de posgrado:", err);
            container.innerHTML = '<p style="color:red; text-align:center;">⚠️ Error al cargar programas.</p>';
        });

    function renderCards() {
        container.innerHTML = "";
        const visibleItems = items.slice(currentIndex, currentIndex + 3);
        visibleItems.forEach((item, index) => {
            const card = document.createElement("a");
            card.href = item.enlace;
            card.className = "posgrado-card";
            // card.setAttribute("data-aos", "fade-up");
            // card.setAttribute("data-aos-delay", 100 + (index * 200));
            card.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <h3>${item.nombre}</h3>
            `;
            container.appendChild(card);
        });

        // if (typeof AOS !== 'undefined') {
        //     setTimeout(() => AOS.refresh(), 100);
        // }
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : Math.max(0, items.length - 3);
        renderCards();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = currentIndex + 3 < items.length ? currentIndex + 1 : 0;
        renderCards();
    });

    const carouselInterval = setInterval(() => {
        if (items.length <= 3) return;
        currentIndex = currentIndex + 3 < items.length ? currentIndex + 1 : 0;
        renderCards();
    }, 6000);
}

// Inicializar carruseles de posgrado
setupCarrusel("maestrias-carousel", "/api/posgrado/maestrias", "prev-posgrado-maestrias", "next-posgrado-maestrias");
setupCarrusel("doctorados-carousel","/api/posgrado/doctorados", "prev-posgrado-doctorados", "next-posgrado-doctorados");

// === EFECTO SCROLL EN HEADER ===
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }
});

// === SECCIÓN DE EVENTOS ===
function cargarYMostrarEventos() {
    fetch('/api/eventos')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const eventosAMostrar = data.slice(0, 5);
            renderEventosLista(eventosAMostrar);
            if (eventosAMostrar.length > 0) {
                renderEventoDestacado(eventosAMostrar[0]);
            }
        })
        .catch(err => {
            console.error("Error al cargar eventos:", err);
            const listaContenedor = document.getElementById('eventos-lista-js');
            const destacadoContenedor = document.getElementById('evento-destacado-js');
            if (listaContenedor) listaContenedor.innerHTML = '<p style="color:red; text-align:center;">⚠️ No se pudieron cargar los eventos.</p>';
            if (destacadoContenedor) destacadoContenedor.innerHTML = '<p style="color:red; text-align:center;">⚠️ Evento destacado no disponible.</p>';
        });
}

// function renderEventosLista(eventos) {
//   const contenedor = document.getElementById('eventos-lista-js');
//   if (!contenedor) return;
//   contenedor.innerHTML = '';

//   eventos.forEach(evento => {
//     let dia = '', mes = '';
//     if (evento.fecha && typeof evento.fecha === 'string') {
//     const partesFecha = evento.fecha.split(' ');
//     dia = partesFecha[0] || '';
//     mes = partesFecha[1] || '';
//     } else {
//     dia = 'Sin';
//     mes = 'fecha';
//     }

//     const enlace = document.createElement('a');
//     enlace.href = evento.url;
//     enlace.className = 'evento-item-link';
//     enlace.style.textDecoration = 'none';
//     enlace.style.display = 'block';
//     enlace.style.color = 'inherit';

//     enlace.innerHTML = `
//       <div class="evento-item">
//         <span class="fechaE">${dia}<br><small>${mes}</small></span>
//         <p>${evento.titulo}</p>
//       </div>
//     `;

//     enlace.addEventListener('mouseenter', function () {
//       this.style.transform = 'translateY(-5px)';
//       this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
//     });

//     enlace.addEventListener('mouseleave', function () {
//       this.style.transform = 'translateY(0)';
//       this.style.boxShadow = 'none';
//     });

//     contenedor.appendChild(enlace);
//   });
// }

// function renderEventoDestacado(evento) {
//     const contenedor = document.getElementById('evento-destacado-js');
//     if (!contenedor) return;
//     contenedor.innerHTML = `
//         <img src="${evento.imagen}" alt="${evento.titulo}">
//         <div class="evento-info">
//             <h3>${evento.titulo}</h3>
//             <p><i class="fas fa-calendar-alt"></i> ${evento.fecha}</p>
//             <p>${evento.descripcion || 'Próximamente más información.'}</p>
//             <a href="${evento.url}" class="btn-vermasE">Ver más</a>
//         </div>
//     `;
// }

function renderEventosLista(eventos) {
  const contenedor = document.getElementById('eventos-lista-js');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  eventos.forEach(evento => {
    let dia = '', mes = '';
    if (evento.fecha && typeof evento.fecha === 'string') {
      const partesFecha = evento.fecha.split('-');
      dia = partesFecha[2] || '';
      mes = new Date(evento.fecha).toLocaleDateString('es-ES', { month: 'short' });
    }

    const enlace = document.createElement('a');
    enlace.href = `./evento.html?id=${evento.id}`; // ✅ Enlace a detalle
    enlace.className = 'evento-item-link';
    enlace.style.textDecoration = 'none';
    enlace.style.display = 'block';
    enlace.style.color = 'inherit';

    enlace.innerHTML = `
      <div class="evento-item">
        <span class="fechaE">${dia}<br><small>${mes}</small></span>
        <p>${evento.titulo}</p>
      </div>
    `;

    contenedor.appendChild(enlace);
  });
}


function renderEventoDestacado(evento) {
  const contenedor = document.getElementById('evento-destacado-js');
  if (!contenedor) return;

  const fecha = evento.fecha 
    ? new Date(evento.fecha).toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Fecha no disponible';

  contenedor.innerHTML = `
    <img src="${evento.imagen ? '/' + evento.imagen : './img/index/graduacion.png'}" 
         alt="${evento.titulo}" 
         onerror="this.src='./img/index/graduacion.png'">
    <div class="evento-info">
      <h3>${evento.titulo}</h3>
      <p><i class="fas fa-calendar-alt"></i> ${fecha}</p>
      <p>${evento.descripcion?.substring(0, 100)}${evento.descripcion?.length > 100 ? '...' : ''}</p>
      <a href="./evento.html?id=${evento.id}" class="btn-vermasE">Ver más</a> <!-- ✅ Enlace a detalle -->
    </div>
  `;
}


document.addEventListener('DOMContentLoaded', cargarYMostrarEventos);

// === CARRUSEL DE EGRESADOS DESTACADOS ===
document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('egresados-track');
    const indicadoresContainer = document.getElementById('egresados-indicadores');
    const prevButton = document.querySelector('.egresados-prev');
    const nextButton = document.querySelector('.egresados-next');

    if (!track || !indicadoresContainer) return;

    let egresadosData = [];
    let currentIndex = 0;

    fetch('/api/egresados')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            egresadosData = data;
            renderTestimonios();
            createIndicadores();
            updateCarrusel();
            updateIndicadores();
        })
        .catch(error => {
            console.error('Error al cargar egresados:', error);
            track.innerHTML = '<p style="color:red; text-align:center;">⚠️ No se pudieron cargar testimonios.</p>';
        });

    function renderTestimonios() {
        track.innerHTML = '';
        egresadosData.forEach(egresado => {
            const testimonioElement = document.createElement('div');
            testimonioElement.className = 'egresado-testimonio';

            const linkElement = document.createElement('a');
            // 🔥 enlace dinámico al detalle
            linkElement.href = `egresado.html?id=${egresado.id}`;
            linkElement.className = 'egresado-testimonio-link';
            linkElement.style.textDecoration = 'none';
            linkElement.style.color = 'inherit';
            linkElement.style.display = 'block';

            linkElement.innerHTML = `
                <img src="${egresado.imagen}" alt="${egresado.nombre}" class="egresado-imagen" onerror="this.src='https://via.placeholder.com/150';">
                <h3 class="egresado-nombre">${egresado.nombre}</h3>
                <p class="egresado-titulo">${egresado.titulo}</p>
                <p class="egresado-empresa">${egresado.empresa}</p>
                <p class="egresado-testimonio-texto">"${egresado.testimonio}"</p>
            `;

            testimonioElement.appendChild(linkElement);
            track.appendChild(testimonioElement);
        });
    }

    function createIndicadores() {
        indicadoresContainer.innerHTML = '';
        egresadosData.forEach((_, index) => {
            const indicador = document.createElement('div');
            indicador.className = 'egresados-indicador';
            if (index === 0) indicador.classList.add('activo');
            indicador.addEventListener('click', () => goToSlide(index));
            indicadoresContainer.appendChild(indicador);
        });
    }

    function updateCarrusel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function updateIndicadores() {
        document.querySelectorAll('.egresados-indicador').forEach((indicador, index) => {
            indicador.classList.toggle('activo', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarrusel();
        updateIndicadores();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % egresadosData.length;
        updateCarrusel();
        updateIndicadores();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + egresadosData.length) % egresadosData.length;
        updateCarrusel();
        updateIndicadores();
    }

    prevButton?.addEventListener('click', prevSlide);
    nextButton?.addEventListener('click', nextSlide);

    let egresadosInterval = setInterval(nextSlide, 5000);
    // Opcional: Pausar autoplay al interactuar
    // track.addEventListener('mouseenter', () => clearInterval(egresadosInterval));
    // track.addEventListener('mouseleave', () => egresadosInterval = setInterval(nextSlide, 5000));
});









// === FUNCIÓN REUTILIZABLE PARA EL MENÚ HAMBURGUESA ===
function inicializarMenuHamburguesa() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav__list.offcanvas");
    if (!menuToggle || !navList) return;

    // Overlay
    let overlay = document.querySelector(".offcanvas-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("offcanvas-overlay");
        document.body.insertBefore(overlay, document.body.firstChild);
    }

    let menuOpen = false;

    // Toggle menú
    menuToggle.addEventListener("click", () => {
        menuOpen = !menuOpen;
        navList.classList.toggle("show", menuOpen);
        overlay.classList.toggle("show", menuOpen);
        document.body.style.overflow = menuOpen ? "hidden" : "";
    });

    // Cerrar menú al hacer clic en overlay
    overlay.addEventListener("click", (e) => {
        // Solo cerrar si el clic fue directamente en el overlay, no en el menú
        if (e.target === overlay) {
            navList.classList.remove("show");
            overlay.classList.remove("show");
            document.body.style.overflow = "";
            menuOpen = false;
        }
    });

// Cerrar menú al hacer clic en un enlace (solo después de que el enlace funcione)
document.querySelectorAll(".nav__list.offcanvas a").forEach(link => {
    link.addEventListener("click", (e) => {
        // Si es un botón de dropdown, NO cerrar el menú
        if (link.classList.contains("dropbtn")) {
            e.preventDefault(); // Solo despliega el submenú
            return;
        }
        // Si el enlace es externo o tiene target="_blank", deja que navegue primero
        if (link.target === "_blank" || link.href.startsWith("http")) {
            setTimeout(() => {
                navList.classList.remove("show");
                overlay.classList.remove("show");
                document.body.style.overflow = "";
                menuOpen = false;
            }, 100);
        } else {
            // Para enlaces internos, cierra el menú y navega
            navList.classList.remove("show");
            overlay.classList.remove("show");
            document.body.style.overflow = "";
            menuOpen = false;
        }
    });
});

    // Dropdowns en móvil
    document.querySelectorAll(".nav__list.offcanvas .dropdown").forEach(dropdown => {
        const btn = dropdown.querySelector(".dropbtn");
        const content = dropdown.querySelector(".dropdown-content");
        if (btn && content) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                content.classList.toggle("show");
            });
        }
    });

    console.log("✅ Menú hamburguesa inicializado");
}


// === HEADER FIJO EN SCROLL ===
function inicializarHeaderFijo() {
    const header = document.querySelector(".header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    console.log("✅ Header fijo inicializado");
}




// === ANIMACIÓN REINICIABLE PARA SECCIONES CON .scroll-fade-up ===
function animarTarjetas(selector) {
    gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray(selector).forEach((card, i) => {
            gsap.from(card, {
            opacity: 0,
            scale: 0.5,
            rotation: 8,
            duration: 1.2,
            delay: i * 0.3,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "restart none none reverse", // 🔥 siempre reinicia
                preventOverlaps: true,
                fastScrollEnd: true
            },
            clearProps: "scale,rotation,opacity"
            });
        });
}




document.addEventListener('DOMContentLoaded', () => {
    inicializarMenuHamburguesa();
    inicializarHeaderFijo();
    // --- ANIMACIONES REINICIABLES ---
    animarTarjetas(".investigacion-card");
    animarTarjetas(".convocatoria-card");
    animarTarjetas(".enlace-card");


    
});


// === ESTADO DE COMUNICADOS EN LA PÁGINA PRINCIPAL ===
document.addEventListener('DOMContentLoaded', function () {
  const estadoEl = document.getElementById('comunicados-estado');
  if (!estadoEl) return;

  fetch('/api/comunicados')
    .then(res => res.json())
    .then(comunicados => {
      if (Array.isArray(comunicados) && comunicados.length > 0) {
        // Ordenar por fecha descendente y tomar el más reciente
        const sorted = [...comunicados].sort((a, b) => 
          new Date(b.fecha) - new Date(a.fecha)
        );
        const latest = sorted[0];
        const fecha = new Date(latest.fecha).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        estadoEl.className = 'comunicados-estado alerta';
        estadoEl.innerHTML = `
          <i class="fas fa-bell"></i> 
          ¡Atención! Nuevo comunicado: 
          <a href="./comunicado.html?id=${latest.id}" class="link-comunicado">
            <strong>${latest.titulo}</strong>
          </a> (${fecha}).
        `;
      } else {
        estadoEl.className = 'comunicados-estado vacio';
        estadoEl.textContent = 'No hay comunicados por el momento.';
      }
    })
    .catch(err => {
      console.error('Error al cargar comunicados:', err);
      estadoEl.className = 'comunicados-estado vacio';
      estadoEl.textContent = 'No se pudo cargar la información.';
    });
});


// FORMULARIO CONTACTO
// document.getElementById('form-contacto').addEventListener('submit', async (e) => {
//   e.preventDefault(); 

//   const formData = new FormData(e.target);
//   const data = Object.fromEntries(formData);

//   try {
//     const res = await fetch('/api/contacto', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });

//     const result = await res.json();

//     if (result.success) {
//       // Mostrar popup de éxito
//       alert('✅ ¡Mensaje enviado con éxito!\nNos pondremos en contacto contigo pronto.');
//       e.target.reset(); 
//     } else {
//       alert('❌ Error: ' + (result.error || 'No se pudo enviar el mensaje.'));
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     alert('⚠️ Error de conexión. Por favor, inténtalo de nuevo más tarde.');
//   }
// });


// FORMULARIO CONTACTO CON MODAL
document.getElementById('form-contacto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      // Mostrar modal personalizado
      document.getElementById('successModal').classList.add('show');
      e.target.reset();
    } else {
      alert('❌ Error: ' + (result.error || 'No se pudo enviar el mensaje.'));
    }
  } catch (err) {
    console.error('Error:', err);
    alert('⚠️ Error de conexión. Por favor, inténtalo de nuevo más tarde.');
  }
});

// Cerrar modal al hacer clic en la X o fuera del contenido
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('successModal').classList.remove('show');
});

document.getElementById('successModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('successModal')) {
    document.getElementById('successModal').classList.remove('show');
  }
});
