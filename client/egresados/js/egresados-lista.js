/* Oculta loader cuando todo esté listo + retardo  */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {              
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1200); 
});


const BASE_PATH = location.href.includes('github') ? './' : '/';

fetch(BASE_PATH + 'json/egresados.json')
    .then(r => r.json())
    .then(data => {
        const contenedor = document.getElementById('lista-egresados');
        data.forEach(egr => {
        const card = document.createElement('a');
        card.href = `egresado.html?id=${egr.id}`;
        card.className = 'egresado-card scroll-fade-up';
        card.innerHTML = `
            <img src="${egr.imagen}" alt="${egr.nombre}" onerror="this.src='https://via.placeholder.com/150';">
            <h3>${egr.nombre}</h3>
            <p>${egr.titulo}</p>
            <p>${egr.empresa}</p>
        `;
        contenedor.appendChild(card);
        });
    });