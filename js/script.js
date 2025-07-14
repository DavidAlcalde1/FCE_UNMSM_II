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