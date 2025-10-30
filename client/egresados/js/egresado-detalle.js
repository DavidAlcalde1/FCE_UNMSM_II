/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {              
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1200); 
});


const BASE_PATH = location.href.includes('github') ? './' : '/';

const params = new URLSearchParams(location.search);
const id = params.get('id');

fetch(BASE_PATH + 'json/egresados.json')
    .then(r => r.json())
    .then(data => {
        const egresado = data.find(e => e.id == id);
        const box = document.getElementById('testimonio-box');

        if (!egresado) {
        box.innerHTML = '<p>Egresado no encontrado.</p>';
        return;
        }

        box.innerHTML = `
        <div class="testimonio-card">
            <img src="${egresado.imagen}" alt="${egresado.nombre}" onerror="this.src='https://via.placeholder.com/150';">
            <h2>${egresado.nombre}</h2>
            <p class="titulo">${egresado.titulo}</p>
            <p class="empresa">${egresado.empresa}</p>
            <blockquote>“${egresado.testimonio}”</blockquote>
            <a href="egresados-lista.html" class="btn-volver">← Ver todos los egresados</a>
        </div>
        `;
    });