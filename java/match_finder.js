/* =========================================
   === (match_finder.js) ===
   ========================================= */

const gameOptions = document.querySelectorAll('.game-option');

gameOptions.forEach(option => {
    option.addEventListener('click', () => {
        gameOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

const searchForm = document.getElementById('searchForm');
const radarView = document.getElementById('radarView');
const findMatchBtn = document.getElementById('findMatchBtn');
const cancelSearchBtn = document.getElementById('cancelSearchBtn');
const timerText = document.getElementById('timer');
const matchFoundModal = document.getElementById('matchFoundModal');
const enterLobbyBtn = document.getElementById('enterLobbyBtn');

let searchInterval;
let seconds = 0;
let searchTimeout;

if (findMatchBtn) {
    findMatchBtn.addEventListener('click', () => {
        searchForm.style.display = 'none';
        radarView.style.display = 'flex';
        
        seconds = 0;
        timerText.textContent = "00:00";
        
        searchInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerText.textContent = `${mins}:${secs}`;
        }, 1000);

        searchTimeout = setTimeout(() => {
            clearInterval(searchInterval);
            if (matchFoundModal) {
                matchFoundModal.classList.add('show');
            }
        }, 4000);
    });
}

if (cancelSearchBtn) {
    cancelSearchBtn.addEventListener('click', () => {
        clearInterval(searchInterval);
        clearTimeout(searchTimeout);
        radarView.style.display = 'none';
        searchForm.style.display = 'block';
    });
}

if (enterLobbyBtn) {
    enterLobbyBtn.addEventListener('click', () => {
        alert("Redirecting to secure match lobby...");
        if (matchFoundModal) {
            matchFoundModal.classList.remove('show');
        }
        radarView.style.display = 'none';
        searchForm.style.display = 'block';
    });
}