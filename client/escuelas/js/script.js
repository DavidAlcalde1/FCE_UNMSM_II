/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
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

document.addEventListener('DOMContentLoaded', () => {
    inicializarMenuHamburguesa();
    inicializarHeaderFijo();
});