// ================ MATRICULADOS JAVASCRIPT ================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const semestreFilter = document.getElementById('semestreFilter');
    const escuelaFilter = document.getElementById('escuelaFilter');
    const cicloFilter = document.getElementById('cicloFilter');
    const clearBtn = document.getElementById('clearFilters');
    const semestreCards = document.querySelectorAll('.año-card');
    const studentRows = document.querySelectorAll('.matriculados-table tbody tr');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const table = document.getElementById('matriculadosTable');
    
    // Filtros activos
    let activeFilters = {
        search: '',
        semestre: '',
        escuela: '',
        ciclo: '',
        semestreCard: null
    };

    // ================ FUNCIONES DE FILTRADO ================
    
    function filterStudents() {
        let visibleCount = 0;
        let semestresVisible = new Set();
        
        studentRows.forEach(row => {
            const studentName = row.querySelector('.student-name')?.textContent.toLowerCase() || '';
            const matchesSearch = !activeFilters.search || 
                studentName.includes(activeFilters.search.toLowerCase()) ||
                row.cells[0]?.textContent.includes(activeFilters.search);
                
            const matchesSemestre = !activeFilters.semestre || row.dataset.semestre === activeFilters.semestre;
            const matchesEscuela = !activeFilters.escuela || row.dataset.escuela === activeFilters.escuela;
            const matchesCiclo = !activeFilters.ciclo || row.dataset.ciclo === activeFilters.ciclo;
            
            const isVisible = matchesSearch && matchesSemestre && matchesEscuela && matchesCiclo;
            
            if (isVisible) {
                row.style.display = '';
                visibleCount++;
                semestresVisible.add(row.dataset.semestre);
            } else {
                row.style.display = 'none';
            }
        });
        
        // Actualizar contador
        resultsCount.textContent = visibleCount.toLocaleString();
        
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
        semestreFilter.value = '';
        escuelaFilter.value = '';
        cicloFilter.value = '';
        
        // Desactivar todas las tarjetas de semestre
        semestreCards.forEach(card => card.classList.remove('activo'));
        
        // Resetear filtros activos
        activeFilters = {
            search: '',
            semestre: '',
            escuela: '',
            ciclo: '',
            semestreCard: null
        };
        
        filterStudents();
        
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
        filterStudents();
    });
    
    // Filtro por semestre
    semestreFilter.addEventListener('change', function(e) {
        activeFilters.semestre = e.target.value;
        filterStudents();
    });
    
    // Filtro por escuela
    escuelaFilter.addEventListener('change', function(e) {
        activeFilters.escuela = e.target.value;
        filterStudents();
    });
    
    // Filtro por ciclo
    cicloFilter.addEventListener('change', function(e) {
        activeFilters.ciclo = e.target.value;
        filterStudents();
    });
    
    // Botón limpiar filtros
    clearBtn.addEventListener('click', function() {
        clearAllFilters();
    });
    
    // Tarjetas de semestre
    semestreCards.forEach(card => {
        card.addEventListener('click', function() {
            const semestre = this.dataset.semestre;
            
            // Si ya está activo, desactivarlo
            if (activeFilters.semestreCard === this) {
                this.classList.remove('activo');
                activeFilters.semestreCard = null;
                activeFilters.semestre = '';
            } else {
                // Desactivar todas las tarjetas
                semestreCards.forEach(c => c.classList.remove('activo'));
                
                // Activar esta tarjeta
                this.classList.add('activo');
                activeFilters.semestreCard = this;
                activeFilters.semestre = semestre;
            }
            
            // Sincronizar con el select de semestre
            semestreFilter.value = activeFilters.semestre;
            
            filterStudents();
            
            // Scroll suave a la tabla
            setTimeout(() => {
                table.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    });
    
    // ================ FUNCIONES DE INTERFAZ ================
    
    // Animaciones de entrada para las filas
    function animateTableRows() {
        const visibleRows = Array.from(studentRows).filter(row => row.style.display !== 'none');
        
        visibleRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.5s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 50);
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
    
    // ================ FUNCIONES DE TABLA ================
    
    // Función para ordenar tabla
    function sortTable(columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const isAscending = table.getAttribute('data-sort-direction') !== 'asc';
        table.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');
        
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex]?.textContent.trim() || '';
            const bValue = b.cells[columnIndex]?.textContent.trim() || '';
            
            if (columnIndex === 0) { // Código numérico
                return isAscending ? 
                    parseInt(aValue) - parseInt(bValue) : 
                    parseInt(bValue) - parseInt(aValue);
            } else {
                return isAscending ? 
                    aValue.localeCompare(bValue) : 
                    bValue.localeCompare(aValue);
            }
        });
        
        // Reordenar filas en el DOM
        rows.forEach(row => tbody.appendChild(row));
        
        // Actualizar indicadores de ordenamiento
        updateSortIndicators(columnIndex, isAscending);
        
        showNotification(`Tabla ordenada ${isAscending ? 'ascendente' : 'descendente'}`, 'info');
    }
    
    // Función para actualizar indicadores de ordenamiento
    function updateSortIndicators(activeColumn, isAscending) {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            const icon = header.querySelector('i');
            if (index === activeColumn) {
                icon.className = isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
                header.style.background = 'var(--azul-oscuro)';
            } else {
                icon.className = 'fas fa-sort';
                header.style.background = 'var(--gradiente-azul)';
            }
        });
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
    
    // Headers de tabla ordenables
    const tableHeaders = table.querySelectorAll('th');
    tableHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => sortTable(index));
        header.title = 'Haga clic para ordenar';
    });
    
    // ================ INICIALIZACIÓN ================
    
    filterStudents();
    setTimeout(animateTableRows, 300);
    
    console.log('🎓 Portal de Matriculados UNMSM cargado correctamente');
    console.log('👥 Filtros disponibles: Búsqueda, Semestre, Escuela, Ciclo');
    console.log('⌨️  Atajos de teclado: ESC (limpiar), Ctrl+F (buscar)');
    console.log('📊 Funciones de tabla: Ordenamiento por columnas');
    
    // Estadísticas
    const stats = {
        totalEstudiantes: studentRows.length,
        totalSemestres: semestreCards.length,
        semestre2024_2: document.querySelectorAll('[data-semestre="2024-2"]').length,
        semestre2024_1: document.querySelectorAll('[data-semestre="2024-1"]').length,
        escuelaMedicina: document.querySelectorAll('[data-escuela="medicina"]').length,
        escuelaIngenieria: document.querySelectorAll('[data-escuela="ingenieria"]').length,
        cicloPregrado: document.querySelectorAll('[data-ciclo="pregrado"]').length,
        cicloMaestria: document.querySelectorAll('[data-ciclo="maestria"]').length,
        estadoActivo: document.querySelectorAll('.estado-activo').length,
        estadoGraduado: document.querySelectorAll('.estado-graduado').length
    };
    
    console.log('📈 Estadísticas:', stats);
    
    setTimeout(() => {
        showNotification(`Portal cargado: ${stats.totalEstudiantes.toLocaleString()} estudiantes registrados`, 'success');
    }, 1000);
});

// ================ UTILIDADES GLOBALES ================

function getCurrentFilters() {
    return {
        search: document.getElementById('searchInput').value,
        semestre: document.getElementById('semestreFilter').value,
        escuela: document.getElementById('escuelaFilter').value,
        ciclo: document.getElementById('cicloFilter').value,
        semestreSeleccionado: document.querySelector('.año-card.activo')?.dataset.semestre
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

function mostrarEstadisticas() {
    const table = document.getElementById('matriculadosTable');
    const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => 
        row.style.display !== 'none'
    );
    
    showNotification(`Mostrando ${visibleRows.length.toLocaleString()} estudiantes de ${visibleRows.length.toLocaleString()} total`, 'info');
}

window.portalMatriculados = {
    getCurrentFilters,
    imprimirResultados,
    exportarResultados,
    mostrarEstadisticas
};