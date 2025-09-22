
/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});




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


//MODO OSCURO

// const toggle = document.getElementById("darkModeToggle");
// const body = document.body;

//   // Verificar si ya se activó en la sesión previa
// if (localStorage.getItem("darkMode") === "enabled") {
//   body.classList.add("dark-mode");
// }

// toggle.addEventListener("click", () => {
//   body.classList.toggle("dark-mode");
//   const isDark = body.classList.contains("dark-mode");
//   localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
// });



  // const toggle = document.getElementById("darkModeToggle");
  // const icon = document.getElementById("darkModeIcon");
  // const body = document.body;

  // Verificar estado guardado
  // if (localStorage.getItem("darkMode") === "enabled") {
  //   body.classList.add("dark-mode");
  //   icon.classList.remove("fa-moon");
  //   icon.classList.add("fa-sun");
  // }

  // toggle.addEventListener("click", () => {
  //   body.classList.toggle("dark-mode");
  //   const isDark = body.classList.contains("dark-mode");
  //   localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");

    // Cambiar ícono dinámicamente
  //   if (isDark) {
  //     icon.classList.remove("fa-moon");
  //     icon.classList.add("fa-sun");
  //   } else {
  //     icon.classList.remove("fa-sun");
  //     icon.classList.add("fa-moon");
  //   }
  // });