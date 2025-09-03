// === POP-UP DE TRANSPARENCIA ===
document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('transparencia-popup');
  const cerrarBtn = document.getElementById('cerrar-popup');

  // Mostrar el pop-up al cargar la página (con un pequeño retraso para mejor UX)
  // Se mostrará siempre al recargar, sin verificar localStorage
  if (popup) { // <-- Eliminamos la verificación de localStorage
    setTimeout(() => {
      popup.style.display = 'flex';
    }, 1000); // Se muestra después de 1 segundo
  }

  // ... (el resto del código del pop-up para cerrarlo puede permanecer igual) ...
  // Función para cerrar el pop-up
  function cerrarPopup() {
    if (popup) {
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.9)';
      // Esperar a que termine la animación antes de ocultarlo completamente
      setTimeout(() => {
        popup.style.display = 'none';
        // NO guardamos en localStorage que fue cerrado
        // localStorage.setItem('transparenciaPopupCerrado', 'true'); // <-- Esta línea la comentamos o eliminamos
      }, 300);
    }
  }

  // Cerrar al hacer clic en el botón de cerrar
  if (cerrarBtn) {
    cerrarBtn.addEventListener('click', cerrarPopup);
  }

  // Cerrar al hacer clic fuera del contenido del pop-up
  if (popup) {
    popup.addEventListener('click', function (event) {
      // Si se hace clic directamente en el overlay (no en el contenido)
      if (event.target === popup) {
        cerrarPopup();
      }
    });
  }

  // Opcional: Cerrar con la tecla Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && popup && popup.style.display === 'flex') {
      cerrarPopup();
    }
  });
});


// === MENÚ HAMBURGUESA OFF-CANVAS ===
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.querySelector('.nav__list');
  const header = document.querySelector('.header');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav__list a');

  if (!menuToggle || !navList || !header) {
    console.warn("Menú hamburguesa: No se encontraron elementos necesarios");
    return;
  }

  // Crear overlay para cerrar menú al hacer clic fuera
  const overlay = document.createElement('div');
  overlay.className = 'offcanvas-overlay';
  body.appendChild(overlay);

  // Función para abrir/cerrar el menú
  function toggleMenu() {
    navList.classList.toggle('show');
    overlay.classList.toggle('show');

    if (navList.classList.contains('show')) {
      menuToggle.innerHTML = '&#10005;'; // X
      navList.classList.add('offcanvas');
    } else {
      menuToggle.innerHTML = '&#9776;'; // ☰
      setTimeout(() => {
        if (!navList.classList.contains('show')) {
          navList.classList.remove('offcanvas');
        }
      }, 300);
    }
  }

  // Evento para el botón hamburguesa
  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  // Evento para cerrar menú al hacer clic en overlay
  overlay.addEventListener('click', function () {
    navList.classList.remove('show');
    overlay.classList.remove('show');
    menuToggle.innerHTML = '&#9776;';
    setTimeout(() => {
      navList.classList.remove('offcanvas');
    }, 300);
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('show');
      overlay.classList.remove('show');
      menuToggle.innerHTML = '&#9776;';
      setTimeout(() => {
        navList.classList.remove('offcanvas');
      }, 300);
    });
  });

  // Funcionalidad para dropdowns en móvil
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const dropbtn = dropdown.querySelector('.dropbtn');
    if (dropbtn) {
      dropbtn.addEventListener('click', function (e) {
        if (window.innerWidth <= 1020) { // breakpoint
          e.preventDefault();
          const dropdownContent = this.nextElementSibling;
          if (dropdownContent) {
            dropdownContent.classList.toggle('show');
          }
        }
      });
    }
  });

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 1020) {
      dropdowns.forEach(dropdown => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        if (dropdownContent && dropdownContent.classList.contains('show')) {
          dropdownContent.classList.remove('show');
        }
      });
    }
  });
});








  // Carrusel automático con pausa al hover
  let current = 0;
  let carouselInterval; // Variable para almacenar el ID del intervalo
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const carouselElement = document.querySelector('.carousel'); // Selecciona el contenedor del carrusel

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      // Oculta animaciones anteriores
      const content = slide.querySelector('.slide-content');
      if (content) {
        content.classList.remove("animar");
      }
      if (i === index) {
        slide.classList.add("active");
        // Fuerza reflow para reiniciar animación
        const newContent = slide.querySelector('.slide-content');
        if (newContent) {
          void newContent.offsetWidth; // reinicia animación CSS
          newContent.classList.add("animar");
        }
      }
    });
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
    current = index;
  }

  // Función para iniciar el autoplay
  function startCarousel() {
    carouselInterval = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, 4000);
  }

  // Función para detener el autoplay
  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  // Iniciar el carrusel automáticamente
  startCarousel();

  // Pausar el carrusel cuando el mouse entra
  carouselElement.addEventListener('mouseenter', stopCarousel);

  // Reanudar el carrusel cuando el mouse sale
  carouselElement.addEventListener('mouseleave', startCarousel);

  // Botones flecha - también detienen el autoplay temporalmente y lo reinician
  prevBtn.addEventListener("click", () => {
    showSlide((current - 1 + slides.length) % slides.length);
    // Reiniciar el intervalo después de la interacción manual
    stopCarousel();
    startCarousel();
  });

  nextBtn.addEventListener("click", () => {
    showSlide((current + 1) % slides.length);
    // Reiniciar el intervalo después de la interacción manual
    stopCarousel();
    startCarousel();
  });

  // Clic en los indicadores - también detienen el autoplay temporalmente y lo reinician
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const slideTo = parseInt(dot.dataset.slide);
      showSlide(slideTo);
      // Reiniciar el intervalo después de la interacción manual
      stopCarousel();
      startCarousel();
    });
  });




  // Menú responsive
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.querySelector(".nav__list").classList.toggle("show");
  });

  // Opcional: Cerrar el menú al hacer clic en un enlace
  document.querySelectorAll('.nav__list a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector(".nav__list").classList.remove("show");
    });
  });


  // Contador animado cuando se ve en pantalla
  const contadores = document.querySelectorAll('.contador');
  let yaAnimado = false;

  function animarContadores() {
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
  }

  // Detecta si sección está en pantalla
  function esVisible(elemento) {
    const rect = elemento.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }

  window.addEventListener('load', () => {
    animarContadores();
  });


  const boton = document.getElementById('modoBtn');
  boton.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    boton.textContent = document.body.classList.contains('modo-oscuro') ? '☀️' : '🌙';
  });



  fetch('noticias.json')
    .then(res => res.json())
    .then(noticias => {
      const container = document.getElementById('noticias-carousel');
      const dotsContainer = document.getElementById('dots2');
      let index = 0;

      // Crear las noticias
      noticias.forEach((noticia, i) => {
        const noticiaEl = document.createElement('div');
        noticiaEl.classList.add('noticia');
        if (i === 0) noticiaEl.classList.add('active');
        noticiaEl.innerHTML = `
        <img src="${noticia.imagen}" alt="${noticia.titulo}">
        <div class="contenido-noticia">
          <h3>${noticia.titulo}</h3>
          <p>${noticia.resumen}</p>
          <a href="${noticia.enlace}" class="btn-vermasN">Ver más</a>
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

      document.querySelector('.prev2').addEventListener('click', () => {
        index = (index - 1 + noticias.length) % noticias.length;
        showNoticia(index);
      });

      document.querySelector('.next2').addEventListener('click', () => {
        index = (index + 1) % noticias.length;
        showNoticia(index);
      });

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          showNoticia(parseInt(dot.dataset.index));
        });
      });

      // Auto-slide
      setInterval(() => {
        index = (index + 1) % noticias.length;
        showNoticia(index);
      }, 5000);
    });


  fetch('./noticias.json')
    .then(response => response.json())
    .then(data => {
      const ultimas = data.slice(0, 3); // Últimas 3 noticias
      const container = document.getElementById('ultimas-container');

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
    });



  // COMUNICADOS
  // fetch('comunicados.json')
  //   .then(res => res.json())
  //   .then(data => {
  //     const contenedor = document.getElementById('lista-comunicados');

  //     // Tomar los últimos 3 comunicados
  //     const ultimos = data.slice(0, 3);

  //     ultimos.forEach(com => {
  //       const div = document.createElement('div');
  //       div.style.marginBottom = '15px';
  //       div.innerHTML = `
  //         <h4 style="margin: 5px 0; color: #fff;">📢 ${com.titulo}</h4>
  //         <small style="color: #ccc;">${new Date(com.fecha).toLocaleDateString('es-PE')}</small>
  //       `;
  //       contenedor.appendChild(div);
  //     });
  // });





  // Carrusel de posgrado con desplazamiento automático
  function setupCarrusel(id, jsonPath, prevClass, nextClass) {
    const container = document.getElementById(id);
    const prevBtn = document.querySelector("." + prevClass);
    const nextBtn = document.querySelector("." + nextClass);

    let currentIndex = 0;
    let items = [];

    fetch(jsonPath)
      .then(res => res.json())
      .then(data => {
        items = data;
        renderCards(); // Llamada inicial

        if (items.length <= 3) {
          prevBtn.style.display = "none";
          nextBtn.style.display = "none";
        }
      })
      .catch(err => {
        console.error("Error al cargar JSON:", err);
      });

    function renderCards() {
      container.innerHTML = "";

      const visibleItems = items.slice(currentIndex, currentIndex + 3);
      // Definir un delay base para el primer elemento
      let delayBase = 100; // Puedes empezar desde 100ms
      visibleItems.forEach((item, index) => {
        const card = document.createElement("a");
        card.href = item.enlace;
        card.className = "posgrado-card";
        // Añadir los atributos de AOS
        card.setAttribute("data-aos", "fade-up");
        // Incrementar el delay para cada elemento (100, 200, 300, etc.)
        card.setAttribute("data-aos-delay", delayBase + (index * 200));
        card.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
      `;
        container.appendChild(card);
      });

      // Opcional pero recomendado: Refresca AOS para que reconozca los nuevos elementos
      // Asegúrate de que AOS esté completamente cargado antes de llamar a refresh
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = Math.max(0, items.length - 3);
      }
      renderCards();
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex + 3 < items.length) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      renderCards();
    });

    // Guarda el ID del intervalo si necesitas detenerlo después
    const carouselInterval = setInterval(() => {
      if (items.length <= 3) return; // no hacer carrusel si hay <=3
      if (currentIndex + 3 < items.length) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      renderCards();
    }, 6000);
  }

  // Llamadas
  setupCarrusel("maestrias-carousel", "./upg/data/maestrias.json", "prev-posgrado-maestrias", "next-posgrado-maestrias");
  setupCarrusel("doctorados-carousel", "./upg/data/doctorados.json", "prev-posgrado-doctorados", "next-posgrado-doctorados");


  // Efecto de scrool en el Header
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });




  //SECCIÓN DE EVENTOS CON JSON
  // Función para cargar y mostrar los eventos desde el JSON
  function cargarYMostrarEventos() {
    // Usamos la ruta absoluta desde la raíz
    fetch('/eventos.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error HTTP! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Tomar solo los primeros 5 eventos
        const eventosAMostrar = data.slice(0, 5);

        // Renderizar la lista de eventos
        renderEventosLista(eventosAMostrar);

        // Renderizar el evento destacado (el primero de los 5)
        if (eventosAMostrar.length > 0) {
          renderEventoDestacado(eventosAMostrar[0]);
        }
      })
      .catch(err => {
        console.error("Error al cargar JSON de eventos:", err);
        // Manejo de errores: mostrar mensaje en la página
        const listaContenedor = document.getElementById('eventos-lista-js');
        const destacadoContenedor = document.getElementById('evento-destacado-js');

        if (listaContenedor) {
          listaContenedor.innerHTML = '<p style="color: red; text-align: center;">No se pudieron cargar los eventos.</p>';
        }
        if (destacadoContenedor) {
          destacadoContenedor.innerHTML = '<p style="color: red; text-align: center;">Evento destacado no disponible.</p>';
        }
      });
  }

  // Función para renderizar la lista de eventos
  function renderEventosLista(eventos) {
    const contenedor = document.getElementById('eventos-lista-js');
    if (!contenedor) return;

    contenedor.innerHTML = ''; // Limpiar contenido previo

    eventos.forEach(evento => {
      const enlace = document.createElement('a');
      enlace.href = evento.url;
      enlace.className = 'evento-item-link';
      enlace.style.textDecoration = 'none';
      enlace.style.display = 'block';
      enlace.style.color = 'inherit';
      enlace.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'; // !important si es necesario

      // Asumiendo que la fecha en el JSON es un string como "05 abr"
      const partesFecha = evento.fecha.split(' ');
      const dia = partesFecha[0];
      const mes = partesFecha[1] || '';

      enlace.innerHTML = `
            <div class="evento-item">
                <span class="fechaE">${dia}<br><small>${mes}</small></span>
                <p>${evento.titulo}</p>
            </div>
        `;

      // Añadir efecto hover al enlace contenedor
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

  // Función para renderizar el evento destacado
  function renderEventoDestacado(evento) {
    const contenedor = document.getElementById('evento-destacado-js');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <img src="${evento.imagen}" alt="${evento.titulo}">
        <div class="evento-info">
            <h3>${evento.titulo}</h3>
            <p><i class="fas fa-calendar-alt"></i> ${evento.fecha}</p>
            <p>${evento.descripcion || 'Próximamente más información sobre este evento.'}</p>
            <a href="${evento.url}" class="btn-vermasE">Ver más</a>
        </div>
    `;
  }

  // Cargando los eventos cuando la página esté lista
  document.addEventListener('DOMContentLoaded', function () {
    cargarYMostrarEventos();
  });






  // === CARRUSEL DE EGRESADOS DESTACADOS ===
  document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const track = document.getElementById('egresados-track');
    const indicadoresContainer = document.getElementById('egresados-indicadores');
    const prevButton = document.querySelector('.egresados-prev');
    const nextButton = document.querySelector('.egresados-next');

    // Variables del carrusel
    let egresadosData = [];
    let currentIndex = 0;

    // Cargar datos desde el JSON
    fetch('/egresados.json') // Ajusta la ruta si es necesario
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP! status: ${response.status}`);
        }
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
        console.error('Error al cargar los egresados:', error);
        // Manejo de errores: mostrar mensaje en la página
        if (track) {
          track.innerHTML = '<p style="color: red; text-align: center; width: 100%;">No se pudieron cargar los testimonios de egresados.</p>';
        }
      });

    // Función para renderizar los testimonios
    function renderTestimonios() {
      if (!track) return;

      track.innerHTML = ''; // Limpiar contenido previo

      egresadosData.forEach(egresado => {
        const testimonioElement = document.createElement('div');
        testimonioElement.className = 'egresado-testimonio';

        // Crear enlace alrededor de todo el contenido del testimonio
        const linkElement = document.createElement('a');
        linkElement.href = egresado.url;
        linkElement.className = 'egresado-testimonio-link';
        linkElement.style.textDecoration = 'none';
        linkElement.style.color = 'inherit';
        linkElement.style.display = 'block';
        linkElement.style.height = '100%';
        linkElement.style.width = '100%';
        // Evitar que el enlace interfiera con los botones del carrusel
        linkElement.addEventListener('click', function (e) {
          // Si el clic fue en un botón del carrusel, no navegar
          if (e.target.closest('button')) {
            e.preventDefault();
          }
        });

        linkElement.innerHTML = `
                <img src="${egresado.imagen}" alt="${egresado.nombre}" class="egresado-imagen" onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
                <h3 class="egresado-nombre">${egresado.nombre}</h3>
                <p class="egresado-titulo">${egresado.titulo}</p>
                <p class="egresado-empresa">${egresado.empresa}</p>
                <p class="egresado-testimonio-texto">"${egresado.testimonio}"</p>
            `;

        testimonioElement.appendChild(linkElement);
        track.appendChild(testimonioElement);
      });
    }

    // Función para crear los indicadores
    function createIndicadores() {
      if (!indicadoresContainer) return;

      indicadoresContainer.innerHTML = ''; // Limpiar contenido previo

      egresadosData.forEach((_, index) => {
        const indicador = document.createElement('div');
        indicador.className = 'egresados-indicador';
        if (index === 0) indicador.classList.add('activo');

        indicador.addEventListener('click', () => {
          goToSlide(index);
        });

        indicadoresContainer.appendChild(indicador);
      });
    }

    // Función para actualizar la posición del carrusel
    function updateCarrusel() {
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    }

    // Función para actualizar los indicadores activos
    function updateIndicadores() {
      const indicadores = document.querySelectorAll('.egresados-indicador');
      indicadores.forEach((indicador, index) => {
        if (index === currentIndex) {
          indicador.classList.add('activo');
        } else {
          indicador.classList.remove('activo');
        }
      });
    }

    // Función para ir a un slide específico
    function goToSlide(index) {
      currentIndex = index;
      updateCarrusel();
      updateIndicadores();
    }

    // Función para ir al slide siguiente
    function nextSlide() {
      currentIndex = (currentIndex + 1) % egresadosData.length;
      updateCarrusel();
      updateIndicadores();
    }

    // Función para ir al slide anterior
    function prevSlide() {
      currentIndex = (currentIndex - 1 + egresadosData.length) % egresadosData.length;
      updateCarrusel();
      updateIndicadores();
    }

    // Event Listeners para los botones
    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }

    // Opcional: Auto-play 

    let egresadosInterval;
    function startAutoPlay() {
      egresadosInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
    }

    function stopAutoPlay() {
      clearInterval(egresadosInterval);
    }

    // Iniciar auto-play
    startAutoPlay();

    // Pausar auto-play al interactuar con el carrusel
    // const egresadosSection = document.querySelector('.egresados-section');
    // if (egresadosSection) {
    //     egresadosSection.addEventListener('mouseenter', stopAutoPlay);
    //     egresadosSection.addEventListener('mouseleave', startAutoPlay);
    // }
  });


  // Esperar a que el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', function () {
    // --- 1. ELEMENTOS DEL DOM ---
    const cardsContainer = document.getElementById('cards-container');
    const cardBoxes = document.querySelectorAll('.card-box');
    const totalCards = cardBoxes.length;

    // Verificación básica
    if (!cardsContainer || totalCards === 0) {
      console.warn("Carrusel de Pregrado: No se encontraron tarjetas o contenedor.");
      return; // Salir si no hay elementos
    }

    // --- 2. ESTADO DEL CARRUSEL ---
    // En un carrusel infinito, no necesitamos un índice fijo.
    // Nos basaremos en el orden del DOM.

    // --- 3. FUNCIONES DEL CARRUSEL ---

    /**
     * Mueve la tarjeta más a la izquierda al final (simula avanzar a la derecha)
     */
    window.shiftLeft = function () {
      const firstCard = cardsContainer.firstElementChild;
      if (firstCard) {
        // Aplicar clase de animación de salida
        firstCard.classList.add('move-out-from-left');

        // Esperar a que termine la animación antes de mover el elemento
        setTimeout(() => {
          cardsContainer.removeChild(firstCard);
          cardsContainer.appendChild(firstCard);
          firstCard.classList.remove('move-out-from-left');
          // Re-aplicar posiciones estáticas si es necesario
          // (En este caso, las posiciones se derivan del orden del DOM)
        }, 500); // Coincide con la duración de la animación CSS
      }
    };

    /**
     * Mueve la tarjeta más a la derecha al principio (simula retroceder a la izquierda)
     */
    window.shiftRight = function () {
      const lastCard = cardsContainer.lastElementChild;
      if (lastCard) {
        // Aplicar clase de animación de salida
        lastCard.classList.add('move-out-from-right');

        // Esperar a que termine la animación antes de mover el elemento
        setTimeout(() => {
          cardsContainer.removeChild(lastCard);
          cardsContainer.insertBefore(lastCard, cardsContainer.firstChild);
          lastCard.classList.remove('move-out-from-right');
          // Re-aplicar posiciones estáticas si es necesario
        }, 500); // Coincide con la duración de la animación CSS
      }
    };

    // --- AUTOPLAY ---   


    let autoplayInterval;
    const AUTOPLAY_DELAY = 4000; // 4 segundos

    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        shiftRight(); // Avanza automáticamente
      }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Iniciar autoplay
    startAutoplay();

    // Pausar autoplay al pasar el mouse por encima del carrusel (opcional)
    const carouselWrapper = document.querySelector('.cards-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', stopAutoplay);
      carouselWrapper.addEventListener('mouseleave', startAutoplay);
    }


    // --- LOG DE INICIALIZACIÓN ---
    console.log("Carrusel de Pregrado: Inicializado con", totalCards, "tarjetas.");
  });