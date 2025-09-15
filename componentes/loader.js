// /componentes/loader.js
// Carga header/footer + inserta espaciador dinámico + inicializa funciones

async function cargarPlantilla() {
  try {
    // 1. Cargar header
    const headHTML = await fetch('componentes/header.html').then(r => r.text());
    const headerDiv = document.getElementById('header-include');
    if (headerDiv) headerDiv.innerHTML = headHTML;
    

    // 2. Crear e insertar espaciador dinámico
    const spacer = document.createElement('div');
    spacer.className = 'header-spacer';
    headerDiv.after(spacer);

    // 3. Cargar footer
    const footHTML = await fetch('componentes/footer.html').then(r => r.text());
    const footerDiv = document.getElementById('footer-include');
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