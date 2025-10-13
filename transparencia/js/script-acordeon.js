// ===== ACORDEÓN POR AÑO (CORREGIDO) =====
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.acordeon-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const content = document.getElementById(target);

      // 🔒 Cerrar TODOS los demás
      document.querySelectorAll('.acordeon-content').forEach(c => {
        if (c !== content) {
          c.classList.remove('open');
          c.previousElementSibling.classList.remove('active');
        }
      });

      // ✅ Toggle actual
      const isOpen = content.classList.contains('open');
      content.classList.toggle('open', !isOpen);
      btn.classList.toggle('active', !isOpen);

      // 📥 Cargar JSON (CORREGIDO)
      if (!content.dataset.loaded) {
        cargarAcordeonPorAnio(target, content);
        content.dataset.loaded = 'true';
      }
    });
  });

  // ===== CARGAR JSON POR AÑO (CORREGIDO) =====
  function cargarAcordeonPorAnio(id, content) {
    const year = id.split('-')[1]; // "actas-2025" → "2025"
    const seccion = window.location.pathname
  .split('/').pop()           // "actas-2025.html"
  .split('-')[0]              // "actas"
  .replace('.html', '');      // "actas"

 // 🔍 DEPURACIÓN: ver qué estás construyendo
  console.log('🎯 ID del botón:', id);
  console.log('📅 Año:', year);
  console.log('🏷️ Sección:', seccion);
  console.log('📂 Ruta construida:', `json/${seccion}/${year}.json`);


    const lista = content.querySelector('.download-list');
    const jsonFile = `json/${seccion}/${year}.json`;

    fetch(jsonFile)
      .then(res => res.json())
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
        console.error('❌ Error al cargar JSON:', err);
      });
  }

  // ===== ANIMACIÓN SUAVE =====
  gsap.utils.toArray('.download-list li').forEach(li => {
    gsap.from(li, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: li,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });
});