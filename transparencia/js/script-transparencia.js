// ===== TABS PRINCIPALES =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Botones activos
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Paneles activos
        tabPanels.forEach(p => {
            p.classList.remove('active');
            if (p.id === target) p.classList.add('active');
        });

        // Cargar archivos si no se ha hecho
        const panel = document.getElementById(target);
        if (!panel.dataset.loaded) {
            loadFiles(panel);
            panel.dataset.loaded = 'true';
            }
        });
});

// ===== SUB-TABS (DOCENTES / ACTAS) =====
document.addEventListener('click', e => {
    if (e.target.classList.contains('sub-tab-btn')) {
        const parent = e.target.closest('.tab-panel');
        const sub = e.target.dataset.sub;

        // Botones
        parent.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Listas
        parent.querySelectorAll('.download-list').forEach(l => l.classList.add('hidden'));
        const targetList = parent.querySelector(`.download-list[data-sub="${sub}"]`);
        if (targetList) targetList.classList.remove('hidden');
    }
});

// ===== SELECTORES DE AÑO =====
document.addEventListener('change', e => {
    if (e.target.classList.contains('year-selector')) {
        const year = e.target.value;
        const panel = e.target.closest('.tab-panel');
        const folder = panel.querySelector('.download-list:not(.hidden)')?.dataset.folder;
        const sub = panel.querySelector('.download-list:not(.hidden)')?.dataset.sub || '';
        if (folder) loadFiles(panel, folder, sub, year);
    }
});

// ===== CARGAR ARCHIVOS SIMULADOS (puedes cambiar por fetch real) =====
function loadFiles(panel, folder, sub = '', year = '2025') {
    const list = panel.querySelector(`.download-list[data-folder="${folder}"]${sub ? `[data-sub="${sub}"]` : ''}[data-year="${year}"]`);
    if (!list) return;

    // Simulación de archivos (reemplaza con fetch a tu JSON o carpeta real)
    const files = [
        { name: `Archivo ${year} - ${folder}${sub ? '-' + sub : ''}.pdf`, url: `pdf/${folder}/${year}/${sub || 'default'}.pdf` }
    ];

    list.innerHTML = files.map(f => `
        <li><a href="${f.url}" download>${f.name} <i class="fas fa-download"></i></a></li>
    `).join('');
}

// ===== ANIMACIÓN SUAVE AL ENTRAR =====
gsap.utils.toArray('.tab-panel').forEach(panel => {
    gsap.from(panel, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
        }
    });
});