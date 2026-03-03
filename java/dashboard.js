// Theme Synchronization with Shell
// window.addEventListener('message', (event) => {
//     if (event.data === 'theme-light') {
//         document.body.classList.add('light-mode');
//     } else if (event.data === 'theme-dark') {
//         document.body.classList.remove('light-mode');
//     }
// });

// if (localStorage.getItem('theme') === 'light') {
//     document.body.classList.add('light-mode');
// }

// ==========================================
// LIVE COUNTDOWN TIMER FOR UPCOMING MATCH
// ==========================================
let timeLeft = 14 * 60 + 59; 
const timerEl = document.getElementById('matchTimer');

if (timerEl) {
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            timerEl.textContent = `00:${m}:${s}`;
            
            if (timeLeft < 300) {
                timerEl.style.animation = 'pulse 1s infinite';
            }
        } else {
            timerEl.textContent = "00:00:00";
            timerEl.style.color = "var(--success-color)"; 
            timerEl.style.background = "rgba(16, 185, 129, 0.1)";
            timerEl.style.animation = 'none';
        }
    }, 1000);
}

// ==========================================
// AUTO-SLIDING TOURNAMENT BANNER (INFINITE LOOP)
// ==========================================
const promoSlider = document.querySelector('.promo-slideshow');
let autoSlideInterval;
let isTransitioning = false;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        if (!promoSlider || isTransitioning) return;
        
        const firstSlide = promoSlider.firstElementChild;
        if (!firstSlide) return;

        const slideWidth = firstSlide.clientWidth + 20; 
        
        promoSlider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        isTransitioning = true;

        setTimeout(() => {
            promoSlider.style.scrollBehavior = 'auto';
            promoSlider.style.scrollSnapType = 'none';
            
            promoSlider.appendChild(firstSlide);
            promoSlider.scrollLeft -= slideWidth;
            
            void promoSlider.offsetWidth; 
            
            promoSlider.style.scrollBehavior = 'smooth';
            promoSlider.style.scrollSnapType = 'x mandatory';
            
            isTransitioning = false;
        }, 800); 

    }, 3500); 
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

if (promoSlider) {
    startAutoSlide();
    promoSlider.addEventListener('mouseenter', stopAutoSlide);
    promoSlider.addEventListener('mouseleave', startAutoSlide);
    promoSlider.addEventListener('touchstart', stopAutoSlide, {passive: true});
    promoSlider.addEventListener('touchend', startAutoSlide, {passive: true});
}