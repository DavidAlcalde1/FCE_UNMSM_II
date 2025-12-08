/* ---------- CARGADOR DINÁMICO DE JSON POR AÑO ---------- */
(() => {
  const grid = document.getElementById('anios-grid');
  const lista = document.getElementById('lista-docs');

  // Detectamos qué tipo de documento es según el nombre del HTML
  const tipo = location.pathname
                .split('/')
                .pop()
                .replace('.html', ''); // actas | acuerdos | concursos...

  const anios = [2022, 2023, 2024, 2025];

  // Crear tarjetas de año
  anios.forEach(anio => {
    const card = document.createElement('a');
    card.href = '#';
    card.className = 'doc-card';
    card.innerHTML = `
      <i class="fas fa-calendar-alt"></i>
      <h3>${anio}</h3>
    `;
    card.addEventListener('click', e => {
      e.preventDefault();
      cargarJson(anio);
    });
    grid.appendChild(card);
  });

  async function cargarJson(anio) {
    try {
      const res = await fetch(`./json/${tipo}/${anio}.json`);
      if (!res.ok) throw new Error('No encontrado');
      const data = await res.json();
      renderLista(data);
    } catch (err) {
      lista.innerHTML = `<li>No hay información disponible para ${anio}</li>`;
    }
  }

  function renderLista(arr) {
    lista.innerHTML = '';
    arr.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${item.url || '#'}" target="_blank" rel="noopener">
          <i class="fas fa-file-pdf"></i> ${item.titulo || item.nombre}
        </a>
      `;
      lista.appendChild(li);
    });
  }
})();







/**
 * JavaScript para Resoluciones - Facultad de Ciencias Económicas
 * Colores: Dorado #d4af37 y Azul #365D8B
 * Funcionalidad completa para manejo de resoluciones por año
 */

// ========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================

// Observador de intersección para animaciones
let scrollObserver = null;

// Configuración de años disponibles
const ANIOS_DISPONIBLES = [2024, 2023, 2022, 2021, 2020];

// Configuración de tipos de documentos
const TIPOS_DOCUMENTOS = {
  'Decreto': { icon: 'fas fa-file-alt', color: '#365D8B' },
  'Acuerdo': { icon: 'fas fa-handshake', color: '#d4af37' },
  'Resolución': { icon: 'fas fa-file-signature', color: '#4a7ba7' },
  'Directiva': { icon: 'fas fa-clipboard-list', color: '#d4af37' },
  'Norma': { icon: 'fas fa-gavel', color: '#365D8B' }
};

// ========================================
// INICIALIZACIÓN PRINCIPAL
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('🏛️ Iniciando aplicación de Resoluciones...');
  
  // Configurar observador de intersección
  configurarScrollObserver();
  
  // Cargar años disponibles
  cargarAnios();
  
  // Configurar eventos
  configurarEventos();
  
  // Cargar preferencia de modo oscuro
  cargarModoOscuro();
  
  // Aplicar animaciones iniciales
  aplicarAnimacionesIniciales();
  
  console.log('✅ Aplicación de Resoluciones inicializada correctamente');
});

// ========================================
// CONFIGURACIÓN DEL OBSERVADOR DE SCROLL
// ========================================

function configurarScrollObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
}

// ========================================
// CARGA DE AÑOS
// ========================================

function cargarAnios() {
  console.log('📅 Cargando años disponibles...');
  const aniosGrid = document.getElementById('anios-grid');
  
  if (!aniosGrid) {
    console.error('❌ No se encontró el contenedor de años');
    return;
  }

  aniosGrid.innerHTML = '';
  
  // Crear cards para cada año
  ANIOS_DISPONIBLES.forEach((anio, index) => {
    const card = document.createElement('div');
    card.className = 'año-card scroll-fade-up';
    card.style.animationDelay = `${index * 0.1}s`;
    card.setAttribute('data-anio', anio);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver resoluciones del año ${anio}`);
    
    card.innerHTML = `
      <i class="fas fa-file-signature icon" aria-hidden="true"></i>
      <h3>${anio}</h3>
      <p>Resoluciones del año ${anio}</p>
    `;
    
    aniosGrid.appendChild(card);
  });

  console.log(`✅ ${ANIOS_DISPONIBLES.length} años cargados`);
}

// ========================================
// CARGA DE RESOLUCIONES
// ========================================

async function cargarResoluciones(anio) {
  console.log(`📄 Cargando resoluciones para el año ${anio}...`);
  
  mostrarCarga();
  
  try {
    // Simular carga desde API (reemplaza con tu lógica real)
    const resoluciones = await obtenerResolucionesPorAnio(anio);
    
    if (resoluciones && resoluciones.length > 0) {
      mostrarResoluciones(resoluciones);
    } else {
      mostrarVacio();
    }
    
    console.log(`✅ ${resoluciones?.length || 0} resoluciones cargadas para ${anio}`);
    
  } catch (error) {
    console.error('❌ Error al cargar resoluciones:', error);
    mostrarError('No se pudieron cargar las resoluciones. Intenta nuevamente.');
  }
}

// Simular obtención de resoluciones desde API
async function obtenerResolucionesPorAnio(anio) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Datos de ejemplo - reemplazar con llamada real a API
      const resoluciones = generarResolucionesEjemplo(anio);
      resolve(resoluciones);
    }, 800); // Simular delay de red
  });
}

// Generar resoluciones de ejemplo para demostración
function generarResolucionesEjemplo(anio) {
  const resoluciones = [];
  const cantidad = Math.floor(Math.random() * 8) + 3; // 3-10 resoluciones
  
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const tipos = Object.keys(TIPOS_DOCUMENTOS);
  
  for (let i = 1; i <= cantidad; i++) {
    const numero = String(i).padStart(3, '0');
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const mes = meses[Math.floor(Math.random() * meses.length)];
    const dia = Math.floor(Math.random() * 28) + 1;
    
    resoluciones.push({
      id: `${numero}-${anio}-FCE`,
      titulo: `${tipo} N° ${numero}-${anio}-FCE`,
      numero: numero,
      año: anio,
      tipo: tipo,
      fecha: `${dia} de ${mes}`,
      dia: dia,
      mes: mes,
      icon: TIPOS_DOCUMENTOS[tipo].icon,
      color: TIPOS_DOCUMENTOS[tipo].color,
      descripcion: `${tipo} que establece disposiciones para el año ${anio}`,
      url: `/documentos/resoluciones/${anio}/resolucion-${numero}-${anio}.pdf`
    });
  }
  
  return resoluciones;
}

// ========================================
// MOSTRAR RESOLUCIONES
// ========================================

function mostrarResoluciones(resoluciones) {
  const listaDocs = document.getElementById('lista-docs');
  
  if (!listaDocs) {
    console.error('❌ No se encontró el contenedor de documentos');
    return;
  }

  listaDocs.innerHTML = '';
  
  resoluciones.forEach((resolucion, index) => {
    const item = document.createElement('li');
    item.className = 'doc-item scroll-fade-up';
    item.style.animationDelay = `${index * 0.1}s`;
    item.setAttribute('data-id', resolucion.id);
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    
    // Determinar icono y color según tipo
    const configuracionTipo = TIPOS_DOCUMENTOS[resolucion.tipo] || TIPOS_DOCUMENTOS['Resolución'];
    
    item.innerHTML = `
      <i class="${resolucion.icon} icon" style="color: ${resolucion.color}" aria-hidden="true"></i>
      <div class="doc-content">
        <div class="doc-title">${resolucion.titulo}</div>
        <div class="doc-meta">
          <span><i class="fas fa-calendar-alt"></i> ${resolucion.fecha}</span>
          <span><i class="fas fa-tag"></i> ${resolucion.tipo}</span>
          <span><i class="fas fa-file-pdf"></i> PDF</span>
        </div>
      </div>
    `;
    
    // Agregar evento de clic
    item.addEventListener('click', () => abrirDocumento(resolucion));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirDocumento(resolucion);
      }
    });
    
    listaDocs.appendChild(item);
  });
  
  console.log(`📋 ${resoluciones.length} resoluciones mostradas`);
}

// ========================================
// ESTADOS DE INTERFAZ
// ========================================

function mostrarCarga() {
  const listaDocs = document.getElementById('lista-docs');
  if (listaDocs) {
    listaDocs.innerHTML = '<li class="cargando">Cargando resoluciones...</li>';
  }
}

function mostrarError(mensaje = 'Error al cargar las resoluciones') {
  const listaDocs = document.getElementById('lista-docs');
  if (listaDocs) {
    listaDocs.innerHTML = `<li class="error">${mensaje}</li>`;
  }
}

function mostrarVacio() {
  const listaDocs = document.getElementById('lista-docs');
  if (listaDocs) {
    listaDocs.innerHTML = '<li class="vacio">No hay resoluciones disponibles para este año</li>';
  }
}

// ========================================
// MANEJO DE EVENTOS
// ========================================

function configurarEventos() {
  // Manejo de clicks en cards de años
  document.addEventListener('click', function(e) {
    const yearCard = e.target.closest('.año-card');
    if (yearCard) {
      seleccionarAño(yearCard);
    }
  });

  // Manejo de teclado para cards de años
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const yearCard = e.target.closest('.año-card');
      if (yearCard) {
        e.preventDefault();
        seleccionarAño(yearCard);
      }
    }
  });
}

// ========================================
// SELECCIÓN DE AÑO
// ========================================

function seleccionarAño(yearCard) {
  const anio = yearCard.getAttribute('data-anio');
  
  if (!anio) {
    console.error('❌ No se pudo obtener el año de la card');
    return;
  }
  
  console.log(`🎯 Año seleccionado: ${anio}`);
  
  // Remover clase activo de todas las cards
  document.querySelectorAll('.año-card').forEach(card => {
    card.classList.remove('activo');
  });
  
  // Agregar clase activo a la card seleccionada
  yearCard.classList.add('activo');
  
  // Cargar resoluciones del año seleccionado
  cargarResoluciones(anio);
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

function abrirDocumento(resolucion) {
  console.log(`📖 Abriendo documento: ${resolucion.titulo}`);
  
  // Aquí puedes implementar diferentes opciones:
  // 1. Abrir en nueva ventana
  window.open(resolucion.url, '_blank');
  
  // 2. Abrir modal con vista previa
  // mostrarModalPreview(resolucion);
  
  // 3. Descargar directamente
  // descargarDocumento(resolucion);
}

function descargarDocumento(resolucion) {
  console.log(`⬇️ Descargando: ${resolucion.titulo}`);
  
  const link = document.createElement('a');
  link.href = resolucion.url;
  link.download = `resolucion-${resolucion.numero}-${resolucion.año}.pdf`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleModoOscuro() {
  document.body.classList.toggle('modo-oscuro');
  
  const isDark = document.body.classList.contains('modo-oscuro');
  localStorage.setItem('darkMode', isDark.toString());
  
  console.log(isDark ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado');
}

function cargarModoOscuro() {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    document.body.classList.add('modo-oscuro');
    console.log('🌙 Modo oscuro cargado desde configuración');
  }
}

// ========================================
// ANIMACIONES Y EFECTOS
// ========================================

function aplicarAnimacionesIniciales() {
  // Observar todos los elementos con animación
  const animatedElements = document.querySelectorAll('.scroll-fade-up');
  animatedElements.forEach(el => {
    scrollObserver.observe(el);
  });
  
  console.log('✨ Animaciones configuradas');
}

// Función para resaltar texto en búsqueda
function resaltarTexto(elemento, texto) {
  if (!texto) return;
  
  const contenido = elemento.innerHTML;
  const regex = new RegExp(`(${texto})`, 'gi');
  elemento.innerHTML = contenido.replace(regex, '<mark>$1</mark>');
}

// ========================================
// BÚSQUEDA Y FILTRADO
// ========================================

function buscarResoluciones(termino) {
  const items = document.querySelectorAll('.doc-item');
  let coincidencias = 0;
  
  items.forEach(item => {
    const titulo = item.querySelector('.doc-title').textContent.toLowerCase();
    const tipo = item.querySelector('.doc-meta').textContent.toLowerCase();
    
    if (titulo.includes(termino.toLowerCase()) || tipo.includes(termino.toLowerCase())) {
      item.style.display = 'flex';
      item.style.opacity = '1';
      coincidencias++;
    } else {
      item.style.opacity = '0.3';
    }
  });
  
  console.log(`🔍 Búsqueda "${termino}": ${coincidencias} coincidencias`);
  return coincidencias;
}

function limpiarBusqueda() {
  const items = document.querySelectorAll('.doc-item');
  items.forEach(item => {
    item.style.display = 'flex';
    item.style.opacity = '1';
  });
}

// ========================================
// FUNCIONES DE EXPORTACIÓN
// ========================================

// Exportar funciones para uso global
window.ResolucionesApp = {
  // Funciones principales
  cargarAnios,
  cargarResoluciones,
  seleccionarAño,
  abrirDocumento,
  descargarDocumento,
  
  // Estados de interfaz
  mostrarCarga,
  mostrarError,
  mostrarVacio,
  
  // Utilidades
  toggleModoOscuro,
  buscarResoluciones,
  limpiarBusqueda,
  resaltarTexto,
  
  // Datos
  ANIOS_DISPONIBLES,
  TIPOS_DOCUMENTOS,
  
  // Configuración
  configurarScrollObserver,
  aplicarAnimacionesIniciales
};

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================

window.addEventListener('error', function(e) {
  console.error('❌ Error global:', e.error);
  // En producción, aquí podrías enviar el error a un servicio de logging
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('❌ Promise rechazada:', e.reason);
  // En producción, aquí podrías enviar el error a un servicio de logging
});

// ========================================
// DEBUGGING Y DESARROLLO
// ========================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🛠️ Modo desarrollo activado');
  console.log('📊 ResolucionesApp disponible globalmente');
  
  // Agregar funciones de debug al objeto global
  window.debugResoluciones = {
    generarResolucionesEjemplo,
    obtenerResolucionesPorAnio,
    toggleModoOscuro,
    scrollObserver
  };
}