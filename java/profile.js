/* =========================================
   === (profile.js) ===
   Logic to render the user's public info
   ========================================= */

// Ensure icons load when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Attempt to pull user data from LocalStorage to dynamically populate the profile 
    // (This links the Settings form to the Public Profile view)
    const savedFName = localStorage.getItem('userFirstName');
    const savedLName = localStorage.getItem('userLastName');
    const savedUsername = localStorage.getItem('userUsername');
    const savedBio = localStorage.getItem('userBio');
    const savedAvatar = localStorage.getItem('userAvatar');

    const profileNameEl = document.getElementById('mainProfileName');
    const profileUsernameEl = document.getElementById('mainProfileUsername');
    const profileBioEl = document.getElementById('mainProfileBio');
    const profileImgEl = document.getElementById('mainProfileImage');

    if (savedFName && savedLName && profileNameEl) {
        profileNameEl.textContent = `${savedFName} ${savedLName}`;
    }

    if (savedUsername && profileUsernameEl) {
        profileUsernameEl.textContent = `@${savedUsername.toLowerCase()}`;
    }

    if (savedBio && profileBioEl) {
        profileBioEl.textContent = savedBio;
    }

    if (savedAvatar && profileImgEl) {
        profileImgEl.src = savedAvatar;
    }

    // Advanced Logo Resolution Logic (Reused from Settings to display correct IDs)
    const idContainers = document.querySelectorAll('.id-icon');
    
    idContainers.forEach(container => {
        const plat = container.getAttribute('data-platform');
        let isSimpleIcon = true;
        let isCustomImage = false;
        let iconRef = ""; 
        let customImgUrl = "";
        let fallbackLucideIcon = "gamepad-2";
        let invertClass = "invert-on-light";
        
        if (plat.includes('playstation') || plat.includes('psn')) iconRef = "playstation";
        else if (plat.includes('xbox')) iconRef = "xbox";
        else if (plat.includes('steam') || plat.includes('pc')) iconRef = "steam";
        else if (plat.includes('riot') || plat.includes('valorant')) iconRef = "riotgames";
        else if (plat.includes('activision') || plat.includes('codm')) iconRef = "activision";
        else if (plat.includes('ea')) iconRef = "ea";
        else if (plat.includes('epic')) iconRef = "epicgames";
        else if (plat.includes('nintendo')) iconRef = "nintendoswitch";
        else if (plat.includes('battle.net')) iconRef = "battledotnet";
        else if (plat.includes('ubisoft')) iconRef = "ubisoft";
        else if (plat.includes('discord')) iconRef = "discord";
        else if (plat.includes('pubg')) {
            isSimpleIcon = false;
            isCustomImage = true;
            customImgUrl = "https://img.icons8.com/ios-filled/50/ffffff/player-unknowns-battlegrounds.png"; 
            fallbackLucideIcon = "crosshair";
        }
        else if (plat.includes('free fire')) {
            isSimpleIcon = false;
            isCustomImage = true;
            customImgUrl = "https://seeklogo.com/images/F/free-fire-logo-5D1A0FE09B-seeklogo.com.png";
            fallbackLucideIcon = "flame";
            invertClass = ""; 
        }
        else {
            isSimpleIcon = false;
            iconRef = "gamepad-2"; 
        }

        let iconHtml = "";
        if (isSimpleIcon) {
            iconHtml = `<img src="https://cdn.simpleicons.org/${iconRef}/white" alt="${plat}" class="${invertClass}" style="width: 20px; height: 20px; object-fit: contain;" onerror="this.outerHTML='<i data-lucide=\\'gamepad-2\\' style=\\'width: 20px; height: 20px; color: var(--text-primary);\\'></i>'; typeof lucide !== 'undefined' && lucide.createIcons();">`;
        } else if (isCustomImage) {
            iconHtml = `<img src="${customImgUrl}" alt="${plat}" class="${invertClass}" style="width: 22px; height: 22px; object-fit: contain;" onerror="this.outerHTML='<i data-lucide=\\'${fallbackLucideIcon}\\' style=\\'width: 20px; height: 20px; color: var(--text-primary);\\'></i>'; typeof lucide !== 'undefined' && lucide.createIcons();">`;
        } else {
             iconHtml = `<i data-lucide="${iconRef}" style="width: 20px; height: 20px; color: var(--text-primary);"></i>`;
        }

        container.innerHTML = iconHtml;
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Logic to handle the "Share Profile" button
window.copyProfileLink = function() {
    // In production, the backend will dynamically insert the actual user's profile URL here
    const profileUrl = "https://uplaygammz.com/u/" + (localStorage.getItem('userUsername') || "emmanuel_o").toLowerCase();
    
    // Fallback copy method to ensure it works inside iframes/Canvas
    const input = document.createElement('textarea');
    input.value = profileUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    
    // Trigger the global toast notification from main.js
    if (typeof showToast === 'function') {
        showToast('Profile link copied to clipboard!');
    } else {
        alert('Profile link copied!');
    }
};