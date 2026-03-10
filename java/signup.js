/* =========================================
   === (signup.js) ===
   ========================================= */
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
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
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            alert('Account created successfully! Redirecting to login...');
            window.location.href = 'login.html';
        }, 1500);
    });
}