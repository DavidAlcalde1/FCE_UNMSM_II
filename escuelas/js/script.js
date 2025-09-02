document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");

  // Toggle del menú hamburguesa
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Control de "Enlaces Destacados" SOLO en escritorio
  const enlacesDestacados = document.querySelector(".has-submenu");
  if (enlacesDestacados) {
    const btn = enlacesDestacados.querySelector(".dropbtn");
    if (btn) {
      btn.addEventListener("click", (e) => {
        // Solo en pantallas grandes (>=1200px), en móviles ya lo sacaste como "extra-link"
        if (window.innerWidth >= 1200) {
          e.preventDefault();
          enlacesDestacados.classList.toggle("active");
        }
      });
    }
  }
});
