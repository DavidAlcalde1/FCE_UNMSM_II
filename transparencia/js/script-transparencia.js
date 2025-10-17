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