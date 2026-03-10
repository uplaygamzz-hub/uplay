/* =========================================
   === (friends.js) ===
   ========================================= */

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

const reqCards = document.querySelectorAll('.request-card');
reqCards.forEach(card => {
    const acceptBtn = card.querySelector('.accept');
    const declineBtn = card.querySelector('.decline');
    const tabBadge = document.querySelector('.tab-badge');

    function handleRequest(actionText) {
        card.innerHTML = `<p style="padding: 16px; color: var(--text-secondary); width: 100%; text-align: center; font-weight: 500;">${actionText}</p>`;
        
        setTimeout(() => {
            card.style.display = 'none';
            if (tabBadge) {
                let currentCount = parseInt(tabBadge.textContent);
                if (currentCount > 0) {
                    tabBadge.textContent = currentCount - 1;
                    if (currentCount - 1 === 0) {
                        tabBadge.style.display = 'none';
                    }
                }
            }
        }, 1500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => handleRequest('Friend Request Accepted!'));
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => handleRequest('Request Declined'));
    }
});