/**
 * JavaScript para la página de Plana Docente
 * Portal de Transparencia UNMSM - Escuela de Economía
 * Funcionalidades: búsqueda, filtros, notificaciones, atajos de teclado
 */

// Variables globales
let docentesOriginales = [];
let resultadosFiltrados = [];

// Elementos del DOM
const elementos = {
    searchInput: null,
    categoriaFilter: null,
    facultadFilter: null,
    especialidadFilter: null,
    clearFilters: null,
    docentesContainer: null,
    resultsCount: null,
    noResults: null,
    notificationContainer: null
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarElementos();
    cargarDocentes();
    configurarEventListeners();
    configurarAtajosTeclado();
    mostrarNotificacion('Portal de Transparencia - Plana Docente cargado correctamente', 'success');
});

// Inicializar elementos del DOM
function inicializarElementos() {
    elementos.searchInput = document.getElementById('searchInput');
    elementos.categoriaFilter = document.getElementById('categoriaFilter');
    elementos.facultadFilter = document.getElementById('facultadFilter');
    elementos.especialidadFilter = document.getElementById('especialidadFilter');
    elementos.clearFilters = document.getElementById('clearFilters');
    elementos.docentesContainer = document.getElementById('docentesContainer');
    elementos.resultsCount = document.getElementById('resultsCount');
    elementos.noResults = document.getElementById('noResults');
    
    // Crear contenedor de notificaciones si no existe
    elementos.notificationContainer = document.querySelector('.notification-container');
    if (!elementos.notificationContainer) {
        elementos.notificationContainer = crearContenedorNotificaciones();
    }
}

// Cargar datos de docentes desde el DOM
function cargarDocentes() {
    const docentesItems = document.querySelectorAll('.docente-item');
    docentesOriginales = Array.from(docentesItems).map(item => {
        const categoria = item.getAttribute('data-categoria');
        const facultad = item.getAttribute('data-facultad');
        const especialidad = item.getAttribute('data-especialidad');
        const nombre = item.querySelector('h3').textContent.trim();
        
        return {
            elemento: item,
            categoria,
            facultad,
            especialidad,
            nombre
        };
    });
    
    resultadosFiltrados = [...docentesOriginales];
    mostrarOcultarDocentes(); // Mostrar todos inicialmente
    actualizarContadorResultados();
}

// Configurar event listeners
function configurarEventListeners() {
    // Búsqueda en tiempo real
    elementos.searchInput?.addEventListener('input', function(e) {
        buscarDocentes(e.target.value);
    });
    
    // Filtros
    elementos.categoriaFilter?.addEventListener('change', aplicarFiltros);
    elementos.facultadFilter?.addEventListener('change', aplicarFiltros);
    elementos.especialidadFilter?.addEventListener('change', aplicarFiltros);
    
    // Limpiar filtros
    elementos.clearFilters?.addEventListener('click', limpiarFiltros);
    
    // Click en las tarjetas de categoría del sidebar
    document.querySelectorAll('.año-card[data-categoria]').forEach(card => {
        card.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            elementos.categoriaFilter.value = categoria;
            aplicarFiltros();
            mostrarNotificacion(`Filtrando por categoría: ${categoria}`, 'info');
        });
    });
}

// Función de búsqueda
function buscarDocentes(termino) {
    const terminoBusqueda = termino.toLowerCase().trim();
    
    // Filtrar los resultados actuales
    resultadosFiltrados = docentesOriginales.filter(docente => {
        if (!terminoBusqueda) return true;
        
        const nombreCompleto = docente.nombre.toLowerCase();
        const elemento = docente.elemento;
        const grado = elemento.querySelector('.docente-grado')?.textContent.toLowerCase() || '';
        const departamento = elemento.querySelector('.meta-item:nth-child(2)')?.textContent.toLowerCase() || '';
        
        return nombreCompleto.includes(terminoBusqueda) ||
               grado.includes(terminoBusqueda) ||
               departamento.includes(terminoBusqueda);
    });
    
    aplicarFiltros();
    
    // Mostrar notificación si hay término de búsqueda
    if (terminoBusqueda) {
        const resultados = resultadosFiltrados.length;
        if (resultados === 0) {
            mostrarNotificacion(`No se encontraron docentes para "${termino}"`, 'warning');
        } else {
            mostrarNotificacion(`Encontrados ${resultados} docentes para "${termino}"`, 'success');
        }
    }
}

// Aplicar todos los filtros
function aplicarFiltros() {
    const categoria = elementos.categoriaFilter?.value || '';
    const facultad = elementos.facultadFilter?.value || '';
    const especialidad = elementos.especialidadFilter?.value || '';
    
    // Obtener resultados de búsqueda actual
    const resultadosBusqueda = Array.from(elementos.searchInput?.value ? 
        resultadosFiltrados : docentesOriginales);
    
    // Aplicar filtros adicionales
    resultadosFiltrados = resultadosBusqueda.filter(docente => {
        const cumpleCategoria = !categoria || docente.categoria === categoria;
        const cumpleFacultad = !facultad || docente.facultad === facultad;
        const cumpleEspecialidad = !especialidad || docente.especialidad === especialidad;
        
        return cumpleCategoria && cumpleFacultad && cumpleEspecialidad;
    });
    
    // Mostrar/ocultar elementos
    mostrarOcultarDocentes();
    actualizarContadorResultados();
    
    // Mostrar notificación si hay filtros activos
    const filtrosActivos = [categoria, facultad, especialidad].filter(f => f).length;
    if (filtrosActivos > 0) {
        mostrarNotificacion(`Aplicados ${filtrosActivos} filtro(s) - ${resultadosFiltrados.length} resultados`, 'info');
    }
}

// Mostrar/ocultar docentes según filtros
function mostrarOcultarDocentes() {
    // Primero ocultar todos
    docentesOriginales.forEach(docente => {
        docente.elemento.style.display = 'none';
    });
    
    // Mostrar solo los filtrados
    resultadosFiltrados.forEach(docente => {
        docente.elemento.style.display = 'block';
    });
    
    // Mostrar/ocultar secciones de categoría
    const categoriasConResultados = new Set(resultadosFiltrados.map(d => d.facultad));
    document.querySelectorAll('.category-group').forEach(group => {
        const facultad = group.getAttribute('data-facultad');
        if (categoriasConResultados.has(facultad)) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
    
    // Mostrar mensaje de no resultados
    if (resultadosFiltrados.length === 0) {
        elementos.noResults.style.display = 'block';
        elementos.docentesContainer.style.display = 'none';
    } else {
        elementos.noResults.style.display = 'none';
        elementos.docentesContainer.style.display = 'block';
    }
}

// Actualizar contador de resultados
function actualizarContadorResultados() {
    if (elementos.resultsCount) {
        elementos.resultsCount.textContent = resultadosFiltrados.length;
    }
}

// Limpiar todos los filtros
function limpiarFiltros() {
    if (elementos.searchInput) elementos.searchInput.value = '';
    if (elementos.categoriaFilter) elementos.categoriaFilter.value = '';
    if (elementos.facultadFilter) elementos.facultadFilter.value = '';
    if (elementos.especialidadFilter) elementos.especialidadFilter.value = '';
    
    resultadosFiltrados = [...docentesOriginales];
    mostrarOcultarDocentes();
    actualizarContadorResultados();
    
    mostrarNotificacion('Filtros limpiados correctamente', 'success');
}

// Configurar atajos de teclado
function configurarAtajosTeclado() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K: Enfocar búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (elementos.searchInput) {
                elementos.searchInput.focus();
                elementos.searchInput.select();
                mostrarNotificacion('Búsqueda activada (Ctrl+K)', 'info');
            }
        }
        
        // Escape: Limpiar búsqueda y quitar foco
        if (e.key === 'Escape') {
            if (document.activeElement === elementos.searchInput) {
                elementos.searchInput.blur();
                elementos.searchInput.value = '';
                buscarDocentes('');
                mostrarNotificacion('Búsqueda cancelada', 'info');
            }
        }
        
        // Ctrl/Cmd + Shift + C: Limpiar filtros
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            limpiarFiltros();
        }
    });
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    if (!elementos.notificationContainer) {
        elementos.notificationContainer = crearContenedorNotificaciones();
    }
    
    const notificacion = document.createElement('div');
    notificacion.className = `notification notification-${tipo}`;
    
    const iconos = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notificacion.innerHTML = `
        <i class="${iconos[tipo] || iconos.info}"></i>
        <span>${mensaje}</span>
        <button class="notification-close" onclick="cerrarNotificacion(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    elementos.notificationContainer.appendChild(notificacion);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            cerrarNotificacion(notificacion.querySelector('.notification-close'));
        }
    }, 5000);
}

// Cerrar notificación individual
function cerrarNotificacion(boton) {
    const notificacion = boton.closest('.notification');
    if (notificacion) {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }
}

// Crear contenedor de notificaciones si no existe
function crearContenedorNotificaciones() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        pointer-events: none;
    `;
    
    document.body.appendChild(container);
    return container;
}

// Funciones de utilidad para exportación/descarga
function exportarDocentes() {
    const datos = resultadosFiltrados.map(docente => {
        const elemento = docente.elemento;
        const nombre = elemento.querySelector('h3').textContent;
        const grado = elemento.querySelector('.docente-grado').textContent;
        const categoria = elemento.querySelector('.meta-item:nth-child(1)').textContent;
        const departamento = elemento.querySelector('.meta-item:nth-child(2)').textContent;
        const email = elemento.querySelector('.meta-item:nth-child(4)').textContent;
        
        return {
            nombre,
            grado,
            categoria,
            departamento,
            email
        };
    });
    
    const csv = convertirACSV(datos);
    descargarArchivo(csv, 'docentes_escuelas_economia.csv', 'text/csv');
    
    mostrarNotificacion('Lista de docentes exportada correctamente', 'success');
}

function convertirACSV(datos) {
    const encabezados = ['Nombre', 'Grado', 'Categoría', 'Departamento', 'Email'];
    const filas = datos.map(fila => [
        fila.nombre,
        fila.grado,
        fila.categoria,
        fila.departamento,
        fila.email
    ]);
    
    return [encabezados, ...filas].map(fila => fila.map(campo => `"${campo}"`).join(',')).join('\n');
}

function descargarArchivo(contenido, nombreArchivo, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Funciones de interactividad adicionales
function mostrarPerfilCompleto(nombreDocente) {
    mostrarNotificacion(`Abriendo perfil completo de ${nombreDocente}...`, 'info');
    // Aquí se implementaría la lógica para mostrar el perfil completo
}

function descargarCV(nombreDocente) {
    mostrarNotificacion(`Descargando CV de ${nombreDocente}...`, 'info');
    // Aquí se implementaría la lógica para descargar el CV
}

// Eventos de clicks en los botones de acción
document.addEventListener('click', function(e) {
    // Botón Ver CV
    if (e.target.closest('.btn-action.btn-primary')) {
        const docenteItem = e.target.closest('.docente-item');
        if (docenteItem) {
            const nombre = docenteItem.querySelector('h3').textContent;
            descargarCV(nombre);
        }
    }
    
    // Botón Perfil Completo
    if (e.target.closest('.btn-action.btn-secondary')) {
        const docenteItem = e.target.closest('.docente-item');
        if (docenteItem) {
            const nombre = docenteItem.querySelector('h3').textContent;
            mostrarPerfilCompleto(nombre);
        }
    }
});

// Funciones de accesibilidad
function navegarConTeclado(e) {
    const docentesItems = document.querySelectorAll('.docente-item');
    const docenteActual = Array.from(docentesItems).find(item => 
        item.classList.contains('keyboard-focus'));
    
    let siguienteItem = null;
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            const indiceActual = Array.from(docentesItems).indexOf(docenteActual);
            if (indiceActual >= 0 && indiceActual < docentesItems.length - 1) {
                siguienteItem = docentesItems[indiceActual + 1];
            } else if (indiceActual === -1) {
                siguienteItem = docentesItems[0];
            }
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            const indice = Array.from(docentesItems).indexOf(docenteActual);
            if (indice > 0) {
                siguienteItem = docentesItems[indice - 1];
            }
            break;
            
        case 'Enter':
        case ' ':
            if (docenteActual) {
                e.preventDefault();
                const nombre = docenteActual.querySelector('h3').textContent;
                mostrarPerfilCompleto(nombre);
            }
            break;
    }
    
    if (siguienteItem) {
        if (docenteActual) {
            docenteActual.classList.remove('keyboard-focus');
        }
        siguienteItem.classList.add('keyboard-focus');
        siguienteItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Agregar navegación por teclado
document.addEventListener('keydown', function(e) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        navegarConTeclado(e);
    }
});

// Agregar estilos CSS dinámicos para navegación por teclado
const estilosTeclado = `
    .keyboard-focus {
        outline: 2px solid var(--azul-claro);
        outline-offset: 2px;
        background-color: rgba(74, 111, 179, 0.1);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = estilosTeclado;
document.head.appendChild(styleSheet);