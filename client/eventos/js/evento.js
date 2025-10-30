/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {              // ← tiempo extra que quieras
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1200); // 1.2s extra 
});
    
    
    
    
    // ---------- UTILIDADES ----------
      /* Obtener parámetro GET */
const params = new URLSearchParams(location.search);
const id     = params.get('id');          // ej: ?id=2
if (!id || isNaN(id))  { muestraError('Falta el parámetro ?id='); }

/* Cargar JSON */
fetch('./json/eventos.json')
    .then(r => r.ok ? r.json() : Promise.reject('Error al cargar eventos'))
    .then(data => {
        const ev = data[parseInt(id)-1];    // array empieza en 0
        if (!ev)  { muestraError('Evento no encontrado'); return; }
        pintaEvento(ev);
        })
    .catch(err => muestraError(err));

// ---------- FUNCIONES ----------
function pintaEvento(ev) {
    document.getElementById('titulo-pagina').textContent = ev.titulo;
    document.getElementById('ev-img').src       = ev.imagen;
    document.getElementById('ev-img').alt       = ev.titulo;
    document.getElementById('ev-titulo').textContent = ev.titulo;
    document.getElementById('ev-fecha').textContent  = ev.fecha;
    document.getElementById('ev-desc').innerHTML     = ev.descripcion || '<p>Próximamente más información.</p>';
    document.getElementById('ev-link').href          = ev.url_inscripcion || '#';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('evento-wrap').style.display = 'block';
}

function muestraError(msg) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display   = 'block';
    document.getElementById('error').textContent     = msg;
}