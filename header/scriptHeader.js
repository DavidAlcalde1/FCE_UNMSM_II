// === MENÚ HAMBURGUESA OFF-CANVAS ===
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav__list');
    const header = document.querySelector('.header');
    const body = document.body;

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
        // overlay.classList.toggle('show');
        
        // Cambiar ícono del botón
        if (navList.classList.contains('show')) {
            menuToggle.innerHTML = '&#10005;'; // Ícono de cierre (X)
            // Añadir clase offcanvas solo cuando se abre
            navList.classList.add('offcanvas');
        } else {
            menuToggle.innerHTML = '&#9776;'; // Ícono de menú (☰)
            // Quitar clase offcanvas después de la animación
            setTimeout(() => {
                if (!navList.classList.contains('show')) {
                    navList.classList.remove('offcanvas');
                }
            }, 300); // Coincide con la duración de la transición CSS
        }
    }

    // Evento para el botón hamburguesa
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // Evento para cerrar menú al hacer clic en overlay
    overlay.addEventListener('click', function() {
        navList.classList.remove('show');
        overlay.classList.remove('show');
        menuToggle.innerHTML = '&#9776;';
        // Quitar clase offcanvas después de la animación
        setTimeout(() => {
            navList.classList.remove('offcanvas');
        }, 300);
    });

    // Funcionalidad para dropdowns en móvil
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            dropbtn.addEventListener('click', function(e) {
                if (window.innerWidth <= 1200) {
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
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && window.innerWidth <= 1200) {
            dropdowns.forEach(dropdown => {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                if (dropdownContent && dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            });
        }
    });
});