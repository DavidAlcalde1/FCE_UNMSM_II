// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // --- 1. ELEMENTOS DEL DOM ---
    const cardsContainer = document.getElementById('cards-container');
    const cardBoxes = document.querySelectorAll('.card-box');
    const totalCards = cardBoxes.length;

    // Verificación básica
    if (!cardsContainer || totalCards === 0) {
        console.warn("Carrusel de Pregrado: No se encontraron tarjetas o contenedor.");
        return; // Salir si no hay elementos
    }

    // --- 2. ESTADO DEL CARRUSEL ---
    // En un carrusel infinito, no necesitamos un índice fijo.
    // Nos basaremos en el orden del DOM.

    // --- 3. FUNCIONES DEL CARRUSEL ---

    /**
     * Mueve la tarjeta más a la izquierda al final (simula avanzar a la derecha)
     */
    window.shiftLeft = function() {
        const firstCard = cardsContainer.firstElementChild;
        if (firstCard) {
            // Aplicar clase de animación de salida
            firstCard.classList.add('move-out-from-left');
            
            // Esperar a que termine la animación antes de mover el elemento
            setTimeout(() => {
                cardsContainer.removeChild(firstCard);
                cardsContainer.appendChild(firstCard);
                firstCard.classList.remove('move-out-from-left');
                // Re-aplicar posiciones estáticas si es necesario
                // (En este caso, las posiciones se derivan del orden del DOM)
            }, 500); // Coincide con la duración de la animación CSS
        }
    };

    /**
     * Mueve la tarjeta más a la derecha al principio (simula retroceder a la izquierda)
     */
    window.shiftRight = function() {
        const lastCard = cardsContainer.lastElementChild;
        if (lastCard) {
            // Aplicar clase de animación de salida
            lastCard.classList.add('move-out-from-right');
            
            // Esperar a que termine la animación antes de mover el elemento
            setTimeout(() => {
                cardsContainer.removeChild(lastCard);
                cardsContainer.insertBefore(lastCard, cardsContainer.firstChild);
                lastCard.classList.remove('move-out-from-right');
                // Re-aplicar posiciones estáticas si es necesario
            }, 500); // Coincide con la duración de la animación CSS
        }
    };

    // --- AUTOPLAY ---   

    
    let autoplayInterval;
    const AUTOPLAY_DELAY = 4000; // 4 segundos

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            shiftRight(); // Avanza automáticamente
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Iniciar autoplay
    startAutoplay();

    // Pausar autoplay al pasar el mouse por encima del carrusel (opcional)
    const carouselWrapper = document.querySelector('.cards-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoplay);
        carouselWrapper.addEventListener('mouseleave', startAutoplay);
     }
    

    // --- 5. LOG DE INICIALIZACIÓN ---
    console.log("Carrusel de Pregrado: Inicializado con", totalCards, "tarjetas.");
});