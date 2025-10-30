// /componentes/loader.js
// Carga header/footer + inserta espaciador dinámico + inicializa funciones
/* ====== LOADER - INVESTIGACIÓN ====== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  
  // Asegura que el loader esté visible al inicio
  loader.style.display = 'flex';
  loader.style.opacity = '1';

  // Oculta después de 1.2s + 0.5s de desvanecimiento
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 1200);
});



async function cargarPlantilla() {
  try {
    // 1. Cargar header
    const headHTML = await fetch('transparencia/componentes-transparencia/header-transparencia.html').then(r => r.text());
    const headerDiv = document.getElementById('header-transparencia-include');
    if (headerDiv) headerDiv.innerHTML = headHTML;
    

    // 2. Crear e insertar espaciador dinámico
    const spacer = document.createElement('div');
    spacer.className = 'header-spacer';
    headerDiv.after(spacer);

    // 3. Cargar footer
    const footHTML = await fetch('transparencia/componentes-transparencia/footer-transparencia.html').then(r => r.text());
    const footerDiv = document.getElementById('footer-transparencia-include');
    if (footerDiv) footerDiv.innerHTML = footHTML;

    // 4. Inicializar funciones (ahora sí existe el DOM completo)
    inicializarMenuHamburguesa();
    inicializarHeaderFijo();
  } catch (err) {
    console.error('Error cargando plantilla:', err);
  }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cargarPlantilla);
} else {
  cargarPlantilla(); // ya está cargado
}