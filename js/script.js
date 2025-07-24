console.log("Inicio de JS")
// Carrusel automático
let current = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");


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

setInterval(() => {
  showSlide((current + 1) % slides.length);
}, 4000);


// Botones flecha
prevBtn.addEventListener("click", () => {
  showSlide((current - 1 + slides.length) % slides.length);
});

nextBtn.addEventListener("click", () => {
  showSlide((current + 1) % slides.length);
});

// Clic en los indicadores
dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const slideTo = parseInt(dot.dataset.slide);
    showSlide(slideTo);
  });

});

// Menú responsive
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav__list").classList.toggle("show");
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
      renderCards();

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
    visibleItems.forEach(item => {
      const card = document.createElement("a");
      card.href = item.enlace;
      card.className = "posgrado-card";
      card.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
      `;
      container.appendChild(card);
    });
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

  setInterval(() => {
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




// const container = document.getElementById("posgrado-items");
// let currentIndex = 0;
// let allPosgrados = [];

// Promise.all([
//     fetch('../upg/data/maestrias.json').then(r => r.json()),
//     fetch('../upg/data/doctorados.json').then(r => r.json())
// ])
// .then(([maestrias, doctorados]) => {
//     allPosgrados = [...maestrias, ...doctorados];
//     renderCards();
// });

// function renderCards() {
//     container.innerHTML = "";
//     const visible = allPosgrados.slice(currentIndex, currentIndex + 3);
//     visible.forEach(item => {
//         const card = document.createElement("a");
//         card.href = item.enlace;
//         card.className = "posgrado-card";
//         card.innerHTML = `
//             <img src="${item.imagen}" alt="${item.nombre}">
//             <h3>${item.nombre}</h3>
//             `;
//             container.appendChild(card);
//     });
// }

// document.querySelector(".next-posgrado").addEventListener("click", () => {
//     if (currentIndex + 3 < allPosgrados.length) {
//         currentIndex++;
//     } else {
//         currentIndex = 0;
//     }
//     renderCards();
// });

// document.querySelector(".prev-posgrado").addEventListener("click", () => {
//     if (currentIndex > 0) {
//         currentIndex--;
//     } else {
//         currentIndex = Math.max(0, allPosgrados.length - 3);
//     }
//     renderCards();
// });

// // Auto-slide cada 6 segundos
// setInterval(() => {
//     if (currentIndex + 3 < allPosgrados.length) {
//         currentIndex++;
//     } else {
//         currentIndex = 0;
//     }
//     renderCards();
// }, 6000);