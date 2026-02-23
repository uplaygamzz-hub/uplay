// Initialization
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Add hover effects or simple interactions
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            // Animate click
            card.style.transform = "scale(0.95)";
            setTimeout(() => card.style.transform = "translateY(-5px)", 150);
        });
    });
});

// Tab Switching Logic
function switchTab(tabName) {
    // 1. Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // 2. Add active class to clicked item (in a real app you'd identify unique IDs)
    // For demo purposes, we just highlight the clicked element logic
    event.currentTarget.classList.add('active');

    // 3. You can add logic here to swap the #content-area HTML
    console.log("Switched to tab:", tabName);
}