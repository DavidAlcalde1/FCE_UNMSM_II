/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});


/* ====== CARGA PUBLICACIONES DESDE JSON ====== */
fetch('./investigacion/json/publicaciones.json')
  .then(res => {
    // console.log('📡 Respuesta recibida:', res);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    return res.json();
  })
  .then(data => {
    console.log('✅ JSON parseado:', data);
    mostrarPublicaciones(data);
  })
  .catch(err => {
    console.error('❌ Error al cargar publicaciones:', err);
    document.getElementById('publicaciones-lista').innerHTML =
      `<p style="color:red;">Error al cargar publicaciones: ${err.message}</p>`;
  });

/* ====== MOSTRAR TARJETAS ====== */
function mostrarPublicaciones(lista) {
  // console.log('📝 Mostrando publicaciones...', lista);
  const contenedor = document.getElementById('publicaciones-lista');
  contenedor.innerHTML = '';

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = '<p>No hay publicaciones disponibles.</p>';
    return;
  }

  lista.forEach((p, index) => {
    // console.log(`🧾 Tarjeta ${index + 1}:`, p);
    const autoresTexto = p.autores?.join(', ') || 'Autor no especificado';

    const card = document.createElement('div');
    card.className = 'publicacion-card';
    card.innerHTML = `
      <div class="publicacion-header">
        <span class="publicacion-tipo">${p.tipo || 'Sin tipo'}</span>
        <span class="publicacion-fecha">${p.fecha || 'Sin fecha'}</span>
      </div>
      <h3 class="publicacion-titulo">${p.titulo || 'Sin título'}</h3>
      <p class="publicacion-autores">${autoresTexto}</p>
      <p class="publicacion-resumen">${p.resumen || 'Sin resumen'}</p>
      <div class="publicacion-meta">
        ${p.issn ? `<span class="publicacion-issn">ISSN: ${p.issn}</span>` : ''}
        ${p.isbn ? `<span class="publicacion-isbn">ISBN: ${p.isbn}</span>` : ''}
      </div>
      <a href="${p.url || '#'}" class="publicacion-btn" target="_blank">Ver publicación</a>
      <button class="btn-pdf"
              data-titulo="${p.titulo}"
              data-autores="${autoresTexto}"
              data-fecha="${p.fecha}"
              data-tipo="${p.tipo}"
              data-resumen="${(p.resumen || '').replace(/"/g, '&quot;')}">
        Descargar PDF
      </button>
    `;
    contenedor.appendChild(card);
  });

  console.log('✅ Tarjetas insertadas');
}

/* ====== GENERAR PDF ====== */
function generarPDF(titulo, autores, fecha, tipo, resumen) {
  if (typeof window.jspdf === 'undefined') {
    alert('❌ jsPDF aún no está cargado. Por favor espera unos segundos o recarga la página.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  const margen = 20;
  const ancho = 170;

  // Portada
  doc.setFontSize(18);
  doc.setTextColor('#0d1b2a');
  doc.text('Publicación de Investigación', margen, 30);

  doc.setFontSize(14);
  doc.setTextColor('#415a77');
  doc.text(titulo, margen, 45, { maxWidth: ancho });

  // Datos
  doc.setFontSize(11);
  doc.setTextColor('#444');
  doc.text(`Tipo: ${tipo}`, margen, 65);
  doc.text(`Fecha: ${fecha}`, margen, 75);
  doc.text(`Autores: ${autores}`, margen, 85);
  doc.text('Resumen:', margen, 100);
  doc.text(resumen, margen, 110, { maxWidth: ancho });

  // Footer institucional
  doc.setDrawColor('#ffb74d');
  doc.setLineWidth(0.5);
  doc.line(margen, 270, 190, 270);
  doc.setFontSize(9);
  doc.setTextColor('#888');
  doc.text('Facultad de Ciencias Económicas - UNMSM', margen, 280);

  // Guardar
  doc.save(`Publicacion-${titulo.replace(/[^a-z0-9]/gi, '-')}.pdf`);
}

/* ====== DELEGACIÓN DE EVENTOS PARA BOTONES PDF ====== */
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('btn-pdf')) {
    e.preventDefault();
    const titulo = e.target.dataset.titulo;
    const autores = e.target.dataset.autores;
    const fecha = e.target.dataset.fecha;
    const tipo = e.target.dataset.tipo;
    const resumen = e.target.dataset.resumen;

    generarPDF(titulo, autores, fecha, tipo, resumen);
  }
});


