        // 6. LIVE COUNTDOWN TIMER FOR UPCOMING MATCH
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

        