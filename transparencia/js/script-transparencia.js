// ===== CARGAR SECCIÓN + AÑO POR PARÁMETRO =====
function mostrarSeccionPorParametro() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const year = params.get('year') || '2025'; // default 2025

  if (!tab) return;

  const seccion = document.getElementById('seccion-dinamica');
  const titulo = document.getElementById('titulo-dinamico');
  const lista = document.getElementById('lista-dinamica');

  // Títulos
  const titulos = {
    matriculados: `Matriculados ${year}`,
    informes: `Informes Económicos ${year}`,
    actas: `Actas ${year}`,
    acuerdos: `Acuerdos de Consejo ${year}`
  };

  titulo.textContent = titulos[tab] || `Documentos ${year}`;
  seccion.classList.remove('hidden');

  // Cargar JSON por año
  cargarJsonPorAnio(tab, year, lista);
}

// ===== FETCH POR AÑO =====
function cargarJsonPorAnio(tab, year, lista) {
  // Mapeo de carpetas
  const carpetas = {
    matriculados: 'matriculados',
    informes: 'informes-economicos',
    actas: 'actas-conciliacion', // o la subcarpeta que uses
    acuerdos: 'acuerdos-consejo'
  };

  const jsonFile = `json/${carpetas[tab]}/${year}.json`;
  console.log('🎯 Intentando cargar:', jsonFile);

  fetch(jsonFile)
    .then(res => {
      if (!res.ok) throw new Error('No se encontró el archivo');
      return res.json();
    })
    .then(data => {
      lista.innerHTML = data.map(item => `
        <li>
          <a href="${item.url}" download>
            ${item.nombre} <i class="fas fa-download"></i>
          </a>
        </li>
      `).join('');
    })
    .catch(err => {
      lista.innerHTML = `<li style="color:red;">No hay documentos para ${year}.</li>`;
      console.error('Error al cargar JSON:', err);
    });
}

// ===== EJECUTAR AL CARGAR =====
document.addEventListener('DOMContentLoaded', () => {
  mostrarSeccionPorParametro();
});