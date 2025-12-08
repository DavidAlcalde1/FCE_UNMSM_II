// ================ INFORMES JAVASCRIPT ================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const categoriaFilter = document.getElementById('categoriaFilter');
    const añoFilter = document.getElementById('añoFilter');
    const estadoFilter = document.getElementById('estadoFilter');
    const clearBtn = document.getElementById('clearFilters');
    const categoriaCards = document.querySelectorAll('.category-card');
    const informeItems = document.querySelectorAll('.informe-item');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    // Filtros activos
    let activeFilters = {
        search: '',
        categoria: '',
        año: '',
        estado: '',
        categoriaCard: null
    };

    // ================ FUNCIONES DE FILTRADO ================
    
    function filterInformes() {
        let visibleCount = 0;
        let categoriasVisible = new Set();
        
        informeItems.forEach(item => {
            const matchesSearch = !activeFilters.search || 
                item.querySelector('h3').textContent.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
                item.querySelector('.informe-description').textContent.toLowerCase().includes(activeFilters.search.toLowerCase());
                
            const matchesCategoria = !activeFilters.categoria || item.dataset.categoria === activeFilters.categoria;
            const matchesAño = !activeFilters.año || item.dataset.año === activeFilters.año;
            const matchesEstado = !activeFilters.estado || item.dataset.estado === activeFilters.estado;
            
            const isVisible = matchesSearch && matchesCategoria && matchesAño && matchesEstado;
            
            if (isVisible) {
                item.style.display = 'block';
                visibleCount++;
                categoriasVisible.add(item.dataset.categoria);
            } else {
                item.style.display = 'none';
            }
        });
        
        // Ocultar categorías que no tienen informes visibles
        document.querySelectorAll('.category-group').forEach(group => {
            const categoria = group.dataset.categoria;
            if (categoriasVisible.has(categoria) || activeFilters.search === '') {
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
        categoriaFilter.value = '';
        añoFilter.value = '';
        estadoFilter.value = '';
        
        // Desactivar todas las tarjetas de categoría
        categoriaCards.forEach(card => card.classList.remove('activo'));
        
        // Resetear filtros activos
        activeFilters = {
            search: '',
            categoria: '',
            año: '',
            estado: '',
            categoriaCard: null
        };
        
        filterInformes();
        
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
        filterInformes();
    });
    
    // Filtro por categoría
    categoriaFilter.addEventListener('change', function(e) {
        activeFilters.categoria = e.target.value;
        filterInformes();
    });
    
    // Filtro por año
    añoFilter.addEventListener('change', function(e) {
        activeFilters.año = e.target.value;
        filterInformes();
    });
    
    // Filtro por estado
    estadoFilter.addEventListener('change', function(e) {
        activeFilters.estado = e.target.value;
        filterInformes();
    });
    
    // Botón limpiar filtros
    clearBtn.addEventListener('click', function() {
        clearAllFilters();
    });
    
    // Tarjetas de categoría
    categoriaCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoria = this.dataset.categoria;
            
            // Si ya está activo, desactivarlo
            if (activeFilters.categoriaCard === this) {
                this.classList.remove('activo');
                activeFilters.categoriaCard = null;
                activeFilters.categoria = '';
            } else {
                // Desactivar todas las tarjetas
                categoriaCards.forEach(c => c.classList.remove('activo'));
                
                // Activar esta tarjeta
                this.classList.add('activo');
                activeFilters.categoriaCard = this;
                activeFilters.categoria = categoria;
            }
            
            // Sincronizar con el select de categoría
            categoriaFilter.value = activeFilters.categoria;
            
            filterInformes();
            
            // Scroll suave al contenido
            if (activeFilters.categoria) {
                setTimeout(() => {
                    const targetCategory = document.querySelector(`.category-group[data-categoria="${activeFilters.categoria}"]`);
                    if (targetCategory) {
                        targetCategory.scrollIntoView({ 
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
        const cards = document.querySelectorAll('.informe-item');
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
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
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
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // ================ MEJORAS DE ACCESIBILIDAD ================
    
    // Soporte para teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearAllFilters();
            showNotification('Filtros limpiados', 'info');
        }
        
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
            showNotification('Búsqueda enfocada', 'info');
        }
    });
    
    // Focus management
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'var(--azul-principal)';
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(54, 93, 139, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '';
        this.parentElement.style.boxShadow = '';
    });
    
    // ================ INICIALIZACIÓN ================
    
    filterInformes();
    setTimeout(animateCards, 300);
    
    console.log('📊 Portal de Informes de Gestión UNMSM cargado correctamente');
    console.log('🎯 Filtros disponibles: Búsqueda, Categoría, Año, Estado');
    console.log('⌨️  Atajos de teclado: ESC (limpiar), Ctrl+F (buscar)');
    
    // Estadísticas
    const stats = {
        totalInformes: informeItems.length,
        totalCategorias: categoriaCards.length,
        categoriaPresupuesto: document.querySelectorAll('[data-categoria="presupuesto"]').length,
        categoriaActividades: document.querySelectorAll('[data-categoria="actividades"]').length,
        categoriaAuditoria: document.querySelectorAll('[data-categoria="auditoria"]').length,
        estadoAprobado: document.querySelectorAll('[data-estado="aprobado"]').length,
        estadoEnRevision: document.querySelectorAll('[data-estado="en-revision"]').length,
        estadoPendiente: document.querySelectorAll('[data-estado="pendiente"]').length
    };
    
    console.log('📈 Estadísticas:', stats);
    
    setTimeout(() => {
        showNotification(`Portal cargado: ${stats.totalInformes} informes disponibles`, 'success');
    }, 1000);
});

// ================ UTILIDADES GLOBALES ================

function getCurrentFilters() {
    return {
        search: document.getElementById('searchInput').value,
        categoria: document.getElementById('categoriaFilter').value,
        año: document.getElementById('añoFilter').value,
        estado: document.getElementById('estadoFilter').value,
        categoriaSeleccionada: document.querySelector('.category-card.activo')?.dataset.categoria
    };
}

function imprimirResultados() {
    const currentFilters = getCurrentFilters();
    const hasFilters = Object.values(currentFilters).some(value => value !== '' && value !== null);
    
    if (hasFilters) {
        showNotification('💡 Consejo: Los filtros actuales afectarán la impresión', 'info');
    }
    
    window.print();
}

function exportarResultados() {
    showNotification('🚀 Función de exportación próximamente disponible', 'info');
}

window.portalInformes = {
    getCurrentFilters,
    imprimirResultados,
    exportarResultados
};