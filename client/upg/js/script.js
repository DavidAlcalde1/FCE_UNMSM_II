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

/* PESTAÑAS MVV */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

/* CARRUSEL AUTORIDADES */
(function () {
  'use strict';

  let idxAut = 0;
  const slidesAut = document.querySelectorAll('.aut-slide');
  const totalAut = slidesAut.length;
  if (!totalAut) return;          // si no hay slides, no hace nada

  const track   = document.querySelector('.aut-slides');
  const nextBtn = document.querySelector('.next-aut');
  const prevBtn = document.querySelector('.prev-aut');
  const carouselBox = document.querySelector('.autoridades-carousel');

  let autoAut = null;

  /* ---------- FUNCIONES ---------- */
  function showAut(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    slidesAut.forEach(s => s.classList.remove('active'));
    slidesAut[index].classList.add('active');
  }

  function nextAutSlide() {
    idxAut = (idxAut + 1) % totalAut;
    showAut(idxAut);
  }

  function startAutoplay() {
    stopAutoplay();               // evita duplicados
    autoAut = setInterval(nextAutSlide, 4000); // 4 s
  }

  function stopAutoplay() {
    clearInterval(autoAut);
  }

  /* ---------- EVENTOS ---------- */
  nextBtn.addEventListener('click', () => {
    stopAutoplay();
    nextAutSlide();
    startAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoplay();
    idxAut = (idxAut - 1 + totalAut) % totalAut;
    showAut(idxAut);
    startAutoplay();
  });

  /* pausa al hover (opcional) */
  carouselBox.addEventListener('mouseenter', stopAutoplay);
  carouselBox.addEventListener('mouseleave', startAutoplay);

  /* ---------- INICIO ---------- */
  showAut(idxAut);
  startAutoplay();
})();

// === FORMULARIO DE CONTACTO POSGRADO===

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

// Cerrar modal
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('successModal').classList.remove('show');
});
