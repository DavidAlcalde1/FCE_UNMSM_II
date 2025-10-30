/* ====== LOADER - INVESTIGACIÓN ====== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  
  // Asegura que el loader esté visible al inicio
  loader.style.display = 'flex';
  loader.style.opacity = '1';

  // Oculta después de 1.2s + 0.5s de desvanecimiento
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 1200);
});



/* ====== CARGA GRUPOS DESDE JSON ====== */
fetch('./investigacion/json/grupos.json')
  .then(res => res.json())
  .then(data => mostrarGrupos(data))
  .catch(err => console.error('Error al cargar grupos:', err));

  function mostrarGrupos(lista) {
    const contenedor = document.getElementById('grupos-lista');
    contenedor.innerHTML = '';

    lista.forEach((g, index) => {
      const card = document.createElement('div');
      card.className = 'grupo-card';
      card.innerHTML = `
        <h3 class="grupo-nombre">${g.nombre}</h3>
        <p class="grupo-coordinador">Coordinador: ${g.coordinador}</p>
        <p class="grupo-descripcion">${g.descripcion}</p>
        <p class="grupo-miembros">${g.miembros} investigadores</p>        
        <button class="btn-pdf"
                data-nombre="${g.nombre}"
                data-coordinador="${g.coordinador}"
                data-miembros="${g.miembros}"
                data-descripcion="${g.descripcion.replace(/"/g, '&quot;')}">
          Descargar ficha PDF
        </button>
      `;
      contenedor.appendChild(card);
    });
  }

  function generarPDF(nombre, coordinador, miembros, descripcion) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Márgenes y posiciones
    const margenIzq = 20;
    const margenDer = 190;
    const anchoArea = margenDer - margenIzq;

    // COLORES
    const colorPrincipal = '#0d1b2a';
    const colorAcento = '#415a77';
    const colorAmarillo = '#ffb74d';

    // ===== PORTADA =====
    // Logo (opcional - reemplaza con tu base64 o URL pública)
    // doc.addImage(logoBase64, 'PNG', margenIzq, 15, 30, 30);

    // Nombre de la Facultad
    doc.setFontSize(10);
    doc.setTextColor(colorAcento);
    doc.text('Facultad de Ciencias Económicas - UNMSM', margenIzq, 25);

    // Línea decorativa
    doc.setDrawColor(colorAmarillo);
    doc.setLineWidth(0.5);
    doc.line(margenIzq, 30, margenDer, 30);

    // Título centrado
    doc.setFontSize(18);
    doc.setTextColor(colorPrincipal);
    doc.text(`Ficha del Grupo de Investigación`, margenIzq, 45);
    doc.text(`${nombre}`, margenIzq, 55);

    // ===== INFORMACIÓN GENERAL =====
    doc.setFontSize(12);
    doc.setTextColor('#444');
    doc.text('Coordinador: ' + coordinador, margenIzq, 75);
    doc.text('Miembros: ' + miembros + ' investigadores', margenIzq, 85);
    doc.text('Descripción:', margenIzq, 95);
    doc.text(descripcion, margenIzq, 105, { maxWidth: anchoArea });

    // ===== LÍNEAS DE INVESTIGACIÓN (ejemplo fijo, puedes pasarlas por JSON si quieres) =====
    doc.text('Líneas de investigación:', margenIzq, 135);
    doc.setTextColor(colorAcento);
    doc.text('• Políticas públicas y evaluación de impacto', margenIzq + 5, 145);
    doc.text('• Crecimiento económico regional', margenIzq + 5, 155);
    doc.text('• Pobreza y desigualdad', margenIzq + 5, 165);

    // ===== PUBLICACIONES RECIENTES =====
    doc.setTextColor('#444');
    doc.text('Publicaciones recientes:', margenIzq, 185);
    doc.text('2024 - Impacto de la inflación en el consumo de los hogares limeños', margenIzq + 5, 195);

    // ===== FOOTER =====
    doc.setDrawColor(colorAmarillo);
    doc.setLineWidth(0.5);
    doc.line(margenIzq, 270, margenDer, 270);

    doc.setFontSize(9);
    doc.setTextColor('#888');
    doc.text('Facultad de Ciencias Económicas - Universidad Nacional Mayor de San Marcos', margenIzq, 280);

    // ===== GUARDAR =====
    doc.save(`Ficha-${nombre.replace(/\s+/g, '-')}.pdf`);
  }


/* ====== DELEGACIÓN DE EVENTOS PARA BOTONES PDF ====== */
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('btn-pdf')) {
    e.preventDefault(); // evita saltos

    // leemos los atributos data-* que pusimos en el botón
    const nombre   = e.target.dataset.nombre;
    const coord    = e.target.dataset.coordinador;
    const miembros = e.target.dataset.miembros;
    const desc     = e.target.dataset.descripcion;

    generarPDF(nombre, coord, miembros, desc);
  }
});