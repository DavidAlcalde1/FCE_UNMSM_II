/**
 * RESOLUCIONES.JS
 * Facultad de Ciencias Económicas - UNMSM
 * Sistema de gestión de resoluciones por año
 */

(function() {
    'use strict';

    // Variables globales
    let aniosDisponibles = [];
    let resolucionActual = null;

    // Configuración de años disponibles
    const config = {
        anios: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
        animacionDelay: 100,
        timeoutCarga: 1500
    };

    // Función de inicialización
    function inicializar() {
        console.log('Inicializando Resoluciones App...');
        
        // Verificar que el DOM esté listo
        const aniosGrid = document.getElementById('anios-grid');
        console.log('Contenedor de años encontrado:', aniosGrid);
        
        if (!aniosGrid) {
            console.error('No se encontró el contenedor anios-grid en el HTML');
            return;
        }
        
        // Cargar años disponibles
        cargarAnios();
        
        // Configurar observador de intersección para animaciones
        configurarAnimaciones();
        
        // Configurar eventos
        configurarEventos();
        
        // Cargar preferencia de modo oscuro
        cargarModoOscuro();
        
        console.log('Resoluciones App inicializada correctamente');
    }

    // Configurar animaciones de scroll
    function configurarAnimaciones() {
        // Función simplificada para evitar interferencias
        console.log('Animaciones configuradas (modo simplificado)');
    }

    // Configurar eventos globales
    function configurarEventos() {
        // Manejo de clicks en cards de años
        document.addEventListener('click', function(e) {
            const yearCard = e.target.closest('.año-card');
            if (yearCard) {
                const anio = parseInt(yearCard.querySelector('h3').textContent);
                manejarClickAnio(yearCard, anio);
            }
        });

        // Manejo de clicks en documentos
        document.addEventListener('click', function(e) {
            const docItem = e.target.closest('.doc-item');
            if (docItem && !docItem.classList.contains('cargando') && !docItem.classList.contains('error') && !docItem.classList.contains('vacio')) {
                manejarClickDocumento(docItem);
            }
        });

        // Eventos de teclado
        document.addEventListener('keydown', function(e) {
            // Escape para cerrar modales o volver
            if (e.key === 'Escape') {
                window.history.back();
            }
            
            // Ctrl+H para ir al inicio
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                window.location.href = 'index.html';
            }
        });
    }

    // Cargar años disponibles
    function cargarAnios() {
        const aniosGrid = document.getElementById('anios-grid');
        
        if (!aniosGrid) {
            console.error('No se encontró el contenedor de años');
            return;
        }

        try {
            aniosDisponibles = [...config.anios];
            renderizarAnios();
        } catch (error) {
            console.error('Error al cargar años:', error);
            mostrarErrorAnios('Error al cargar los años disponibles');
        }
    }

    // Mostrar estado de carga para años
    function mostrarCargaAnios() {
        const aniosGrid = document.getElementById('anios-grid');
        aniosGrid.innerHTML = `
            <div class="cargando" style="grid-column: 1 / -1; margin: 40px 0;">
                <div class="cargando-content">
                    <i class="fas fa-spinner"></i>
                    <h3>Cargando años disponibles...</h3>
                </div>
            </div>
        `;
    }

    // Mostrar error al cargar años
    function mostrarErrorAnios(mensaje) {
        const aniosGrid = document.getElementById('anios-grid');
        aniosGrid.innerHTML = `
            <div class="error" style="grid-column: 1 / -1; margin: 40px 0;">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${mensaje}</h3>
                </div>
            </div>
        `;
    }

    // Renderizar años en la interfaz
    function renderizarAnios() {
        const aniosGrid = document.getElementById('anios-grid');
        
        if (aniosDisponibles.length === 0) {
            console.error('No hay años disponibles para mostrar');
            return;
        }

        aniosGrid.innerHTML = '';
        
        aniosDisponibles.forEach((anio, index) => {
            const card = crearCardAnio(anio, index);
            aniosGrid.appendChild(card);
        });
        
        console.log(`Se cargaron ${aniosDisponibles.length} años:`, aniosDisponibles);
    }

    // Crear card de año
    function crearCardAnio(anio, index) {
        const card = document.createElement('div');
        card.className = 'año-card';
        card.setAttribute('data-anio', anio);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver resoluciones del año ${anio}`);
        
        card.innerHTML = `
            <i class="fas fa-calendar-check"></i>
            <h3>${anio}</h3>
            <p>Resoluciones del año ${anio}</p>
        `;

        // Agregar eventos de teclado
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                manejarClickAnio(card, anio);
            }
        });

        return card;
    }

    // Manejar click en año
    function manejarClickAnio(card, anio) {
        // Remover clase activo de todas las cards
        document.querySelectorAll('.año-card').forEach(c => c.classList.remove('activo'));
        
        // Agregar clase activo a la card seleccionada
        card.classList.add('activo');
        
        // Marcar como seleccionable para accesibilidad
        document.querySelectorAll('.año-card').forEach(c => {
            c.setAttribute('aria-selected', 'false');
        });
        card.setAttribute('aria-selected', 'true');
        
        // Cargar resoluciones del año seleccionado
        cargarResoluciones(anio);
        
        // Scroll suave hacia la lista
        setTimeout(() => {
            const listaSection = document.querySelector('.lista-documentos');
            if (listaSection) {
                listaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Asegurar que las resoluciones sean visibles
                setTimeout(() => {
                    const listaDocs = document.getElementById('lista-docs');
                    if (listaDocs) {
                        listaDocs.style.opacity = '1';
                        listaDocs.style.visibility = 'visible';
                        console.log('Forzando visibilidad de resoluciones');
                    }
                }, 1000);
            }
        }, 300);
    }

    // Cargar resoluciones por año
    function cargarResoluciones(anio) {
        resolucionActual = anio;
        mostrarCargaResoluciones();
        
        // Simular carga de datos desde servidor
        setTimeout(() => {
            try {
                const resoluciones = generarResolucionesSimuladas(anio);
                mostrarResoluciones(resoluciones);
            } catch (error) {
                console.error('Error al cargar resoluciones:', error);
                mostrarErrorResoluciones('No se pudieron cargar las resoluciones');
            }
        }, config.timeoutCarga);
    }

    // Generar resoluciones simuladas
    function generarResolucionesSimuladas(anio) {
        const tiposResolucion = [
            { tipo: 'Decreto', icon: 'fas fa-file-alt', color: '#365D8B' },
            { tipo: 'Acuerdo', icon: 'fas fa-handshake', color: '#283593' },
            { tipo: 'Resolución', icon: 'fas fa-file-signature', color: '#1a237e' },
            { tipo: 'Directiva', icon: 'fas fa-clipboard-list', color: '#4a6fb3' }
        ];

        const resoluciones = [];
        const cantidadResoluciones = Math.floor(Math.random() * 8) + 5; // 5-12 resoluciones

        for (let i = 1; i <= cantidadResoluciones; i++) {
            const tipo = tiposResolucion[Math.floor(Math.random() * tiposResolucion.length)];
            const mes = Math.floor(Math.random() * 12) + 1;
            const dia = Math.floor(Math.random() * 28) + 1;
            
            resoluciones.push({
                numero: i.toString().padStart(3, '0'),
                titulo: `Resolución N° ${i.toString().padStart(3, '0')}-${anio}-FCE`,
                fecha: `${dia.toString().padStart(2, '0')} de ${obtenerNombreMes(mes)} de ${anio}`,
                mes: mes,
                dia: dia,
                tipo: tipo.tipo,
                icon: tipo.icon,
                descripcion: `${tipo.tipo} del Consejo de Facultad - ${anio}`,
                estado: Math.random() > 0.1 ? 'Vigente' : 'Derogada'
            });
        }

        // Ordenar por fecha (más reciente primero)
        return resoluciones.sort((a, b) => {
            if (a.anio !== b.anio) return b.anio - a.anio;
            if (a.mes !== b.mes) return b.mes - a.mes;
            return b.dia - a.dia;
        });
    }

    // Obtener nombre del mes
    function obtenerNombreMes(mes) {
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        return meses[mes - 1];
    }

    // Mostrar estado de carga para resoluciones
    function mostrarCargaResoluciones() {
        const listaDocs = document.getElementById('lista-docs');
        listaDocs.style.opacity = '1';
        listaDocs.style.visibility = 'visible';
        listaDocs.style.display = 'block';
        listaDocs.innerHTML = `
            <li class="cargando">
                <div class="cargando-content">
                    <i class="fas fa-spinner"></i>
                    <h3>Cargando resoluciones de ${resolucionActual}...</h3>
                </div>
            </li>
        `;
        console.log(`Mostrando estado de carga para resoluciones de ${resolucionActual}`);
    }

    // Mostrar error en resoluciones
    function mostrarErrorResoluciones(mensaje = 'Error al cargar las resoluciones') {
        const listaDocs = document.getElementById('lista-docs');
        listaDocs.style.opacity = '1';
        listaDocs.style.visibility = 'visible';
        listaDocs.style.display = 'block';
        listaDocs.innerHTML = `
            <li class="error">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${mensaje}</h3>
                    <p>Por favor, intenta nuevamente</p>
                    <button onclick="location.reload()" class="btn-retry" style="margin-top: 15px; padding: 8px 16px; background: var(--azul-principal); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-redo"></i> Reintentar
                    </button>
                </div>
            </li>
        `;
        console.log('Mostrando error de resoluciones:', mensaje);
    }

    // Mostrar estado vacío
    function mostrarVacioResoluciones() {
        const listaDocs = document.getElementById('lista-docs');
        listaDocs.style.opacity = '1';
        listaDocs.style.visibility = 'visible';
        listaDocs.style.display = 'block';
        listaDocs.innerHTML = `
            <li class="vacio">
                <div class="vacio-content">
                    <i class="fas fa-folder-open"></i>
                    <h3>No hay resoluciones disponibles para ${resolucionActual}</h3>
                    <p>Selecciona otro año para ver más documentos</p>
                </div>
            </li>
        `;
        console.log('Mostrando estado vacío para resoluciones de', resolucionActual);
    }

    // Mostrar las resoluciones
    function mostrarResoluciones(resoluciones) {
        const listaDocs = document.getElementById('lista-docs');
        
        if (resoluciones.length === 0) {
            mostrarVacioResoluciones();
            return;
        }

        // Forzar visibilidad
        listaDocs.style.opacity = '1';
        listaDocs.style.visibility = 'visible';
        listaDocs.style.display = 'block';
        
        listaDocs.innerHTML = '';
        
        resoluciones.forEach((resolucion, index) => {
            const item = crearItemResolucion(resolucion, index);
            // Forzar visibilidad en cada item
            item.style.opacity = '1';
            item.style.visibility = 'visible';
            item.style.display = 'flex';
            listaDocs.appendChild(item);
        });

        console.log(`Mostrando ${resoluciones.length} resoluciones con visibilidad forzada`);
        // Actualizar contador
        actualizarContador(resoluciones.length);
    }

    // Crear item de resolución
    function crearItemResolucion(resolucion, index) {
        const item = document.createElement('li');
        item.className = 'doc-item scroll-fade-up';
        item.setAttribute('data-numero', resolucion.numero);
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Abrir ${resolucion.titulo}`);
        
        item.innerHTML = `
            <i class="${resolucion.icon}"></i>
            <div class="doc-content">
                <div class="doc-title">${resolucion.titulo}</div>
                <div class="doc-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${resolucion.fecha}</span>
                    <span><i class="fas fa-tag"></i> ${resolucion.tipo}</span>
                    <span><i class="fas fa-info-circle"></i> ${resolucion.estado}</span>
                </div>
            </div>
        `;

        // Agregar eventos de teclado
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                manejarClickDocumento(item);
            }
        });

        // Agregar animación delay
        setTimeout(() => {
            item.style.animationDelay = `${index * config.animacionDelay}ms`;
        }, 100);

        return item;
    }

    // Manejar click en documento
    function manejarClickDocumento(item) {
        const numero = item.getAttribute('data-numero');
        const titulo = item.querySelector('.doc-title').textContent;
        
        // Simular apertura de documento
        console.log(`Abriendo resolución: ${titulo}`);
        
        // Aquí iría la lógica real para abrir el documento
        // Por ejemplo: window.open(`/documentos/resoluciones/${resolucionActual}/${numero}.pdf`);
        
        // Mostrar notificación de éxito
        mostrarNotificacion(`Abriendo ${titulo}`, 'success');
    }

    // Actualizar contador de resultados
    function actualizarContador(cantidad) {
        // Esta función podría actualizar un contador en la interfaz si fuera necesario
        console.log(`Mostrando ${cantidad} resoluciones`);
    }

    // Mostrar notificación
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notification notification-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${getIconByType(tipo)}"></i>
            <span>${mensaje}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Agregar al contenedor de notificaciones
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notificacion);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        }, 5000);
    }

    // Obtener icono por tipo de notificación
    function getIconByType(tipo) {
        const iconos = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return iconos[tipo] || 'info-circle';
    }

    // Cargar preferencia de modo oscuro
    function cargarModoOscuro() {
        const darkMode = localStorage.getItem('darkModeResoluciones');
        if (darkMode === 'true') {
            document.body.classList.add('modo-oscuro');
        }
    }

    // Alternar modo oscuro
    function toggleDarkMode() {
        document.body.classList.toggle('modo-oscuro');
        const isDark = document.body.classList.contains('modo-oscuro');
        localStorage.setItem('darkModeResoluciones', isDark);
        
        mostrarNotificacion(
            `Modo ${isDark ? 'oscuro' : 'claro'} activado`,
            'info'
        );
    }

    // Función para buscar resoluciones
    function buscarResoluciones(termino) {
        if (!termino || termino.trim() === '') {
            // Mostrar todas las resoluciones
            document.querySelectorAll('.doc-item').forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }

        const terminoLower = termino.toLowerCase();
        
        document.querySelectorAll('.doc-item').forEach(item => {
            const titulo = item.querySelector('.doc-title').textContent.toLowerCase();
            const tipo = item.querySelector('.doc-meta').textContent.toLowerCase();
            
            if (titulo.includes(terminoLower) || tipo.includes(terminoLower)) {
                item.style.display = 'flex';
                // Resaltar término encontrado
                resaltarTermino(item, termino);
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Resaltar término de búsqueda
    function resaltarTermino(elemento, termino) {
        // Esta función podría implementar resaltado de texto
        console.log(`Resaltando término: ${termino} en el elemento`);
    }

    // Función para exportar resoluciones
    function exportarResoluciones(formato = 'csv') {
        if (!resolucionActual) {
            mostrarNotificacion('Selecciona un año primero', 'warning');
            return;
        }

        mostrarNotificacion(`Exportando resoluciones de ${resolucionActual} en formato ${formato.toUpperCase()}...`, 'info');
        
        // Aquí iría la lógica real de exportación
        setTimeout(() => {
            mostrarNotificacion('Exportación completada', 'success');
        }, 2000);
    }

    // Función para imprimir resoluciones
    function imprimirResoluciones() {
        if (!resolucionActual) {
            mostrarNotificacion('Selecciona un año primero', 'warning');
            return;
        }

        window.print();
        mostrarNotificacion('Preparando impresión...', 'info');
    }

    // Exponer funciones globalmente para compatibilidad
    window.ResolucionesApp = {
        // Funciones principales
        cargarAnios: cargarAnios,
        cargarResoluciones: cargarResoluciones,
        
        // Funciones de utilidad
        buscarResoluciones: buscarResoluciones,
        exportarResoluciones: exportarResoluciones,
        imprimirResoluciones: imprimirResoluciones,
        toggleDarkMode: toggleDarkMode,
        
        // Estados
        getAnioActual: () => resolucionActual,
        getAniosDisponibles: () => [...aniosDisponibles]
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    // Manejar errores globales
    window.addEventListener('error', function(e) {
        console.error('Error en Resoluciones App:', e.error);
        mostrarNotificacion('Ha ocurrido un error inesperado', 'error');
    });

    // Log de inicialización
    console.log('Resoluciones.js cargado correctamente');

})();