// Controlador del spinner - versión corregida con DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    (function() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        setTimeout(function() {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }, 1500); // Se oculta después de 1.5 segundos
    })();
});
