let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

// Cambia de slide cada 6 segundos
setInterval(nextSlide, 6000);

document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentSlide);
});



// TAB SECTION
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Quitar clases activas
      buttons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      // Activar botón actual
      btn.classList.add("active");
      const target = btn.getAttribute("data-tab");
      document.getElementById(target).classList.add("active");
    });
  });
});



// FAQ SECTION
document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".faq-item");

    items.forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
        items.forEach((el) => {
            if (el !== item) el.classList.remove("active");
        });
        item.classList.toggle("active");
        });
    });
});
