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



// === CARRUSEL PRINCIPAL (BANNERS) ===
document.addEventListener('DOMContentLoaded', function () {
    let current = 0;
    let carouselInterval;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const carouselElement = document.querySelector('.carousel');

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.classList.remove("animar");
            }
            if (i === index) {
                slide.classList.add("active");
                const newContent = slide.querySelector('.slide-content');
                if (newContent) {
                    void newContent.offsetWidth;
                    newContent.classList.add("animar");
                }
            }
        });
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
        current = index;
    }

    function startCarousel() {
        carouselInterval = setInterval(() => {
            showSlide((current + 1) % slides.length);
        }, 4000);
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    startCarousel();

    carouselElement?.addEventListener('mouseenter', stopCarousel);
    carouselElement?.addEventListener('mouseleave', startCarousel);

    prevBtn?.addEventListener("click", () => {
        showSlide((current - 1 + slides.length) % slides.length);
        stopCarousel();
        startCarousel();
    });

    nextBtn?.addEventListener("click", () => {
        showSlide((current + 1) % slides.length);
        stopCarousel();
        startCarousel();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const slideTo = parseInt(dot.dataset.slide);
            showSlide(slideTo);
            stopCarousel();
            startCarousel();
        });
    });
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

function renderEventosLista(eventos) {
  const contenedor = document.getElementById('eventos-lista-js');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  eventos.forEach(evento => {
    let dia = '', mes = '';
    if (evento.fecha && typeof evento.fecha === 'string') {
    const partesFecha = evento.fecha.split(' ');
    dia = partesFecha[0] || '';
    mes = partesFecha[1] || '';
    } else {
    dia = 'Sin';
    mes = 'fecha';
    }

    const enlace = document.createElement('a');
    enlace.href = evento.url;
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

    enlace.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });

    enlace.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });

    contenedor.appendChild(enlace);
  });
}

function renderEventoDestacado(evento) {
    const contenedor = document.getElementById('evento-destacado-js');
    if (!contenedor) return;
    contenedor.innerHTML = `
        <img src="${evento.imagen}" alt="${evento.titulo}">
        <div class="evento-info">
            <h3>${evento.titulo}</h3>
            <p><i class="fas fa-calendar-alt"></i> ${evento.fecha}</p>
            <p>${evento.descripcion || 'Próximamente más información.'}</p>
            <a href="${evento.url}" class="btn-vermasE">Ver más</a>
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

// === CARRUSEL DE PREGRADO ===
document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.getElementById('cards-container');
    const cardBoxes = document.querySelectorAll('.card-box');
    if (!cardsContainer || cardBoxes.length === 0) {
        console.warn("Carrusel de Pregrado: No se encontraron tarjetas.");
        return;
    }

    window.shiftLeft = function () {
        const firstCard = cardsContainer.firstElementChild;
        if (firstCard) {
            firstCard.classList.add('move-out-from-left');
            setTimeout(() => {
                cardsContainer.removeChild(firstCard);
                cardsContainer.appendChild(firstCard);
                firstCard.classList.remove('move-out-from-left');
            }, 500);
        }
    };

    window.shiftRight = function () {
        const lastCard = cardsContainer.lastElementChild;
        if (lastCard) {
            lastCard.classList.add('move-out-from-right');
            setTimeout(() => {
                cardsContainer.removeChild(lastCard);
                cardsContainer.insertBefore(lastCard, cardsContainer.firstChild);
                lastCard.classList.remove('move-out-from-right');
            }, 500);
        }
    };

    let autoplayInterval = setInterval(shiftRight, 4000);
    const carouselWrapper = document.querySelector('.cards-wrapper');
    carouselWrapper?.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselWrapper?.addEventListener('mouseleave', () => autoplayInterval = setInterval(shiftRight, 4000));

    console.log("Carrusel de Pregrado: Inicializado con", cardBoxes.length, "tarjetas.");
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


