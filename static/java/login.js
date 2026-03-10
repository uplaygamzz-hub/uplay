// Inherits mobile menu logic from the index page
const landingMobileMenuToggle = document.getElementById('landingMobileMenuToggle');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarOverlayForLanding = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');

function toggleLandingMobileSidebar() {
    if (mobileSidebar && sidebarOverlayForLanding) {
        mobileSidebar.classList.toggle('show');
        sidebarOverlayForLanding.classList.toggle('show');
    }
}

if (landingMobileMenuToggle) {
    landingMobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLandingMobileSidebar();
    });
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', toggleLandingMobileSidebar);
}

if (sidebarOverlayForLanding) {
    sidebarOverlayForLanding.addEventListener('click', toggleLandingMobileSidebar);
}

// Password Visibility Toggle Logic
const togglePasswordBtn = document.getElementById('togglePassword');
const passInput = document.getElementById('passwordInput');

if (togglePasswordBtn && passInput) {
    togglePasswordBtn.addEventListener('click', function() {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        
        if (type === 'password') {
            this.innerHTML = '<i data-lucide="eye"></i>';
        } else {
            this.innerHTML = '<i data-lucide="eye-off"></i>';
        }
        lucide.createIcons();
    });
}

// Mock Form Submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Authenticating...';
        btn.style.opacity = '0.8';
        btn.style.cursor = 'not-allowed';
        lucide.createIcons();

        // Simulate API call
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}