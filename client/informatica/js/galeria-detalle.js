/**
 * Script para la Página de Detalle de Galería
 * Carga los datos desde un archivo JSON externo
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configurar lightbox
    // if (typeof lightbox !== 'undefined') {
    //     lightbox.option({
    //         'resizeDuration': 300,
    //         'wrapAround': true,
    //         'showImageNumberLabel': true,
    //         'alwaysShowNavOnTouchDevices': true
    //     });
    // }

    // Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const workId = urlParams.get('id');

    if (!workId) {
        mostrarError('No se ha especificado un trabajo.');
        return;
    }

    // Cargar datos desde JSON
    cargarTrabajo(workId);
});

/**
 * Cargar los datos desde el archivo JSON
 */
async function cargarTrabajo(id) {
    try {
        const response = await fetch('./informatica/json/trabajos.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        
        const data = await response.json();
        const trabajo = data.trabajos.find(t => t.id == id);
        
        if (!trabajo) {
            mostrarError(`No se encontró el trabajo con ID: ${id}`);
            return;
        }
        
        // Actualizar el título de la página
        document.title = `${trabajo.titulo} - Unidad de Estadística e Informática UNMSM`;
        
        // Actualizar información del trabajo
        document.getElementById('gallery-title').textContent = trabajo.titulo;
        document.getElementById('gallery-subtitle').textContent = trabajo.fecha;
        document.getElementById('work-title').textContent = trabajo.titulo;
        document.getElementById('work-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${trabajo.fecha}`;
        document.getElementById('work-description').textContent = trabajo.descripcion;
        
        // Cargar imágenes
        cargarImagenes(trabajo.imagenes);
        
        // Actualizar navegación
        actualizarNavegacion(id, data.trabajos);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los datos del trabajo.');
    }
}

/**
 * Cargar las imágenes en el grid
 */
function cargarImagenes(imagenes) {
    const grid = document.getElementById('photos-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!imagenes || imagenes.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.innerHTML = '';
    emptyState.style.display = 'none';
    
    imagenes.forEach((imagen, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <a href="./img/informatica/trabajos/${imagen}" data-lightbox="gallery" data-title="Imagen ${index + 1}">
                <img src="./img/informatica/trabajos/${imagen}" alt="Imagen ${index + 1}" loading="lazy">
                <div class="photo-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </a>
        `;
        grid.appendChild(photoItem);
    });
}

/**
 * Actualizar los enlaces de navegación
 */
function actualizarNavegacion(id, trabajos) {
    const prevLink = document.getElementById('prev-work');
    const nextLink = document.getElementById('next-work');
    
    const currentIndex = trabajos.findIndex(t => t.id == id);
    const prevId = currentIndex - 1;
    const nextId = currentIndex + 1;
    
    // Trabajar anterior
    if (prevId >= 0) {
        prevLink.href = `galeria-detalle.html?id=${trabajos[prevId].id}`;
        prevLink.classList.remove('disabled');
    } else {
        prevLink.classList.add('disabled');
        prevLink.removeAttribute('href');
    }
    
    // Siguiente trabajo
    if (nextId < trabajos.length) {
        nextLink.href = `galeria-detalle.html?id=${trabajos[nextId].id}`;
        nextLink.classList.remove('disabled');
    } else {
        nextLink.classList.add('disabled');
        nextLink.removeAttribute('href');
    }
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    const grid = document.getElementById('photos-grid');
    const emptyState = document.getElementById('empty-state');
    const workInfo = document.querySelector('.work-info');
    
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error</h3>
        <p>${mensaje}</p>
    `;
    
    if (workInfo) {
        workInfo.style.display = 'none';
    }
}
