/* =========================================
   === (login.js) ===
   ========================================= */
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Authenticating...';
        btn.style.opacity = '0.8';
        btn.style.cursor = 'not-allowed';
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}