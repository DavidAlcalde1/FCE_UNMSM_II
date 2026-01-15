
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

  // FORMULARIO CONTACTO

  document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contactoForm');
        const modal = document.getElementById('successModal');
        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');
        const submitBtn = form.querySelector('.btn-enviar');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar estado de carga
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/api/contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Mostrar modal de éxito
                    modal.style.display = 'flex';
                    form.reset();
                } else {
                    alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Por favor verifica tu conexión a internet.');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    });

    function closeModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
    }

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('successModal');
        if (event.target === modal) {
            closeModal();
        }
    }