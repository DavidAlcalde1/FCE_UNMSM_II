// ================ CONCURSOS JAVASCRIPT ================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const tipoFilter = document.getElementById('tipoFilter');
    const estadoFilter = document.getElementById('estadoFilter');
    const añoFilter = document.getElementById('añoFilter');
    const clearBtn = document.getElementById('clearFilters');
    const añoCards = document.querySelectorAll('.año-card');
    const concursoItems = document.querySelectorAll('.doc-item');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    // Filtros activos
    let activeFilters = {
        search: '',
        tipo: '',
        estado: '',
        año: '',
        añoCard: null
    };

    // ================ FUNCIONES DE FILTRADO ================
    
    function filterConcursos() {
        let visibleCount = 0;
        let añosVisible = new Set();
        
        concursoItems.forEach(item => {
            const matchesSearch = !activeFilters.search || 
                item.querySelector('h3').textContent.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
                item.querySelector('.doc-description').textContent.toLowerCase().includes(activeFilters.search.toLowerCase());
                
            const matchesTipo = !activeFilters.tipo || item.dataset.tipo === activeFilters.tipo;
            const matchesEstado = !activeFilters.estado || item.dataset.estado === activeFilters.estado;
            const matchesAño = !activeFilters.año || item.dataset.año === activeFilters.año;
            
            const isVisible = matchesSearch && matchesTipo && matchesEstado && matchesAño;
            
            if (isVisible) {
                item.style.display = 'block';
                visibleCount++;
                añosVisible.add(item.dataset.año);
            } else {
                item.style.display = 'none';
            }
        });
        
        // Ocultar años que no tienen concursos visibles
        document.querySelectorAll('.año-group').forEach(group => {
            const año = group.dataset.año;
            if (añosVisible.has(año) || activeFilters.search === '') {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
        
        // Actualizar contador
        resultsCount.textContent = visibleCount;
        
        // Mostrar/ocultar mensaje de no resultados
        if (visibleCount === 0 && hasActiveFilters()) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    function hasActiveFilters() {
        return Object.values(activeFilters).some(value => 
            value !== '' && value !== null
        );
    }
    
    function clearAllFilters() {
        searchInput.value = '';
        tipoFilter.value = '';
        estadoFilter.value = '';
        añoFilter.value = '';
        
        // Desactivar todas las tarjetas de año
        añoCards.forEach(card => card.classList.remove('activo'));
        
        // Resetear filtros activos
        activeFilters = {
            search: '',
            tipo: '',
            estado: '',
            año: '',
            añoCard: null
        };
        
        filterConcursos();
        
        // Animar botón de limpiar
        clearBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clearBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    // ================ EVENT LISTENERS ================
    
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', function(e) {
        activeFilters.search = e.target.value.trim();
        filterConcursos();
    });
    
    // Filtro por tipo
    tipoFilter.addEventListener('change', function(e) {
        activeFilters.tipo = e.target.value;
        filterConcursos();
    });
    
    // Filtro por estado
    estadoFilter.addEventListener('change', function(e) {
        activeFilters.estado = e.target.value;
        filterConcursos();
    });
    
    // Filtro por año
    añoFilter.addEventListener('change', function(e) {
        activeFilters.año = e.target.value;
        filterConcursos();
    });
    
    // Botón limpiar filtros
    clearBtn.addEventListener('click', function() {
        clearAllFilters();
    });
    
    // Tarjetas de año
    añoCards.forEach(card => {
        card.addEventListener('click', function() {
            const año = this.dataset.año;
            
            // Si ya está activo, desactivarlo
            if (activeFilters.añoCard === this) {
                this.classList.remove('activo');
                activeFilters.añoCard = null;
                activeFilters.año = '';
            } else {
                // Desactivar todas las tarjetas
                añoCards.forEach(c => c.classList.remove('activo'));
                
                // Activar esta tarjeta
                this.classList.add('activo');
                activeFilters.añoCard = this;
                activeFilters.año = año;
            }
            
            // Sincronizar con el select de año
            añoFilter.value = activeFilters.año;
            
            filterConcursos();
            
            // Scroll suave al contenido
            if (activeFilters.año) {
                setTimeout(() => {
                    const targetYear = document.querySelector(`.año-group[data-año="${activeFilters.año}"]`);
                    if (targetYear) {
                        targetYear.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
    });
    
    // ================ FUNCIONES DE INTERFAZ ================
    
    // Animaciones de entrada
    function animateCards() {
        const cards = document.querySelectorAll('.doc-item');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Función para mostrar notificación
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--azul-principal)' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar animación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    // ================ MEJORAS DE ACCESIBILIDAD ================
    
    // Soporte para teclado
    document.addEventListener('keydown', function(e) {
        // Escape para limpiar filtros
        if (e.key === 'Escape') {
            clearAllFilters();
            showNotification('Filtros limpiados', 'info');
        }
        
        // Ctrl+F para enfocar búsqueda
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
            showNotification('Búsqueda enfocada', 'info');
        }
    });
    
    // Focus management para accesibilidad
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'var(--azul-principal)';
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(54, 93, 139, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '';
        this.parentElement.style.boxShadow = '';
    });
    
    // ================ INICIALIZACIÓN ================
    
    // Aplicar filtros iniciales
    filterConcursos();
    
    // Animar tarjetas al cargar
    setTimeout(animateCards, 300);
    
    // Mensaje de bienvenida
    console.log('🎯 Portal de Concursos Públicos UNMSM cargado correctamente');
    console.log('📊 Filtros disponibles: Búsqueda, Tipo, Estado, Año');
    console.log('⌨️  Atajos de teclado: ESC (limpiar), Ctrl+F (buscar)');
    
    // Contar estadísticas iniciales
    const stats = {
        totalConcursos: concursoItems.length,
        totalAños: añoCards.length,
        tipoDocente: document.querySelectorAll('[data-tipo="docente"]').length,
        tipoAdministrativo: document.querySelectorAll('[data-tipo="administrativo"]').length,
        estadoAbierto: document.querySelectorAll('[data-estado="abierto"]').length,
        estadoEnEvaluacion: document.querySelectorAll('[data-estado="en-evaluacion"]').length,
        estadoCerrado: document.querySelectorAll('[data-estado="cerrado"]').length
    };
    
    console.log('📈 Estadísticas:', stats);
    
    // Mostrar notificación de carga exitosa
    setTimeout(() => {
        showNotification(`Portal cargado: ${stats.totalConcursos} concursos disponibles`, 'success');
    }, 1000);
});

// ================ UTILIDADES GLOBALES ================

// Función para obtener información del filtro actual
function getCurrentFilters() {
    return {
        search: document.getElementById('searchInput').value,
        tipo: document.getElementById('tipoFilter').value,
        estado: document.getElementById('estadoFilter').value,
        año: document.getElementById('añoFilter').value,
        añoSeleccionado: document.querySelector('.año-card.activo')?.dataset.año
    };
}

// Función para imprimir concursos filtrados
function imprimirResultados() {
    const currentFilters = getCurrentFilters();
    const hasFilters = Object.values(currentFilters).some(value => value !== '' && value !== null);
    
    if (hasFilters) {
        showNotification('💡 Consejo: Los filtros actuales afectarán la impresión', 'info');
    }
    
    window.print();
}

// Función para exportar resultados (placeholder)
function exportarResultados() {
    showNotification('🚀 Función de exportación próximamente disponible', 'info');
}

// Agregar funciones al objeto global para debugging
window.portalConcursos = {
    getCurrentFilters,
    imprimirResultados,
    exportarResultados
};