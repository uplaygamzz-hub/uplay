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
function setupPasswordToggle(toggleId, inputId) {
    const toggleBtn = document.getElementById(toggleId);
    const passInput = document.getElementById(inputId);

    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', function() {
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
}

setupPasswordToggle('togglePassword', 'passwordInput');
setupPasswordToggle('toggleConfirmPassword', 'confirmPasswordInput');

// Mock Form Submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation for matching passwords
        const pass = document.getElementById('passwordInput').value;
        const confirmPass = document.getElementById('confirmPasswordInput').value;

        if (pass !== confirmPass) {
            alert('Passwords do not match!');
            return;
        }

        const btn = signupForm.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Creating Account...';
        btn.style.opacity = '0.8';
        btn.style.cursor = 'not-allowed';
        lucide.createIcons();

        // Simulate API call
        setTimeout(() => {
            alert('Account created successfully! Redirecting to login...');
            window.location.href = 'login.html';
        }, 1500);
    });
}