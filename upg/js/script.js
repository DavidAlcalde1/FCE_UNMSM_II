// === CARRUSEL PRINCIPAL (BANNERS) ===
document.addEventListener('DOMContentLoaded', function () {
    let current = 0;
    let carouselInterval;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const carouselElement = document.querySelector('.carousel');

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.classList.remove("animar");
            }
            if (i === index) {
                slide.classList.add("active");
                const newContent = slide.querySelector('.slide-content');
                if (newContent) {
                    void newContent.offsetWidth;
                    newContent.classList.add("animar");
                }
            }
        });
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
        current = index;
    }

    function startCarousel() {
        carouselInterval = setInterval(() => {
            showSlide((current + 1) % slides.length);
        }, 4000);
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    startCarousel();

    carouselElement?.addEventListener('mouseenter', stopCarousel);
    carouselElement?.addEventListener('mouseleave', startCarousel);

    prevBtn?.addEventListener("click", () => {
        showSlide((current - 1 + slides.length) % slides.length);
        stopCarousel();
        startCarousel();
    });

    nextBtn?.addEventListener("click", () => {
        showSlide((current + 1) % slides.length);
        stopCarousel();
        startCarousel();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const slideTo = parseInt(dot.dataset.slide);
            showSlide(slideTo);
            stopCarousel();
            startCarousel();
        });
    });
});