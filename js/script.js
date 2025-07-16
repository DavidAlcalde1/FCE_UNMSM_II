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



  //Carrusel Noticias
  
//  document.addEventListener("DOMContentLoaded", function () {
//   const noticias = document.querySelectorAll(".noticia");
//   const dots = document.querySelectorAll(".dot2");
//   const nextBtn = document.querySelector(".next2");
//   const prevBtn = document.querySelector(".prev2");
//   let currentIndex = 0;

//   function showNoticia(index) {
//     noticias.forEach((noti, i) => {
//       noti.classList.toggle("active", i === index);
//       dots[i].classList.toggle("active", i === index);
//     });
//     currentIndex = index;
//   }

//   nextBtn.addEventListener("click", () => {
//     nextSlide();
//     resetAutoplay();
//   });

//   prevBtn.addEventListener("click", () => {
//     prevSlide();
//     resetAutoplay();
//   });

//   dots.forEach(dot => {
//     dot.addEventListener("click", () => {
//       const index = parseInt(dot.getAttribute("data-index"));
//       showNoticia(index);
//       resetAutoplay();
//     });
//   });

//   function nextSlide() {
//     const nextIndex = (currentIndex + 1) % noticias.length;
//     showNoticia(nextIndex);
//   }

//   function prevSlide() {
//     const prevIndex = (currentIndex - 1 + noticias.length) % noticias.length;
//     showNoticia(prevIndex);
//   }

//   // AUTO-PLAY
//   let autoplay = setInterval(nextSlide, 5000); // cambia cada 5 segundos

//   function resetAutoplay() {
//     clearInterval(autoplay);
//     autoplay = setInterval(nextSlide, 5000);
//   }

//   showNoticia(currentIndex);
// });

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
      container.insertBefore(noticiaEl, container.children[0]);

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


