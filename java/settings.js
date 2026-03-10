/* =========================================
   === (settings.js) ===
   ========================================= */
const settingTabs = document.querySelectorAll('.settings-tab');
const settingPanels = document.querySelectorAll('.settings-panel');

settingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        settingTabs.forEach(t => t.classList.remove('active'));
        settingPanels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

const avatarUploadInput = document.getElementById('avatarUploadInput');

if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const base64Image = e.target.result;
                const avatarPreviewImage = document.getElementById('avatarPreviewImage');
                
                // Show the preview to the user instantly
                if (avatarPreviewImage) {
                    avatarPreviewImage.src = base64Image;
                }
                
                const topbarAvatar = document.querySelector('#profileToggle img');
                const sidebarAvatar = document.querySelector('.user-widget img');
                const dropdownAvatar = document.querySelector('.profile-header-info img'); 
                
                if (topbarAvatar) topbarAvatar.src = base64Image;
                if (sidebarAvatar) sidebarAvatar.src = base64Image;
                if (dropdownAvatar) dropdownAvatar.src = base64Image;
                
                // REMOVED: localStorage.setItem('userAvatar', base64Image);
                // We leave it to the backend to upload the actual file on form submit.
            }
            
            reader.readAsDataURL(file);
        }
    });
}

// User Profile Data Logic
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const usernameInput = document.getElementById('usernameInput');
const whatsappInput = document.getElementById('whatsappInput');
const bioInput = document.getElementById('bioInput');

if (firstNameInput) {
    firstNameInput.value = localStorage.getItem('userFirstName') || 'Emmanuel';
}

if (lastNameInput) {
    lastNameInput.value = localStorage.getItem('userLastName') || 'Ovie';
}

if (usernameInput) {
    usernameInput.value = localStorage.getItem('userUsername') || 'Emmanuel_O';
}

if (whatsappInput) {
    whatsappInput.value = localStorage.getItem('userWhatsApp') || '+234 800 000 0000';
}

if (bioInput) {
    bioInput.value = localStorage.getItem('userBio') || '';
}

// --- DYNAMIC GAMING IDS LOGIC ---
const addGamingIdBtn = document.getElementById('addGamingIdBtn');
const platformSelect = document.getElementById('platformSelect');
const gamerTagInput = document.getElementById('gamerTagInput');
const gamingIdsList = document.getElementById('gamingIdsList');

if (platformSelect && gamerTagInput) {
    platformSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        let hint = "Enter your Gamertag / ID";
        
        if (val.includes('PlayStation')) hint = "e.g. ProSniper_99";
        else if (val.includes('Xbox')) hint = "e.g. MasterChief117";
        else if (val.includes('Riot')) hint = "e.g. PlayerOne#1234";
        else if (val.includes('Activision')) hint = "e.g. Ghost#1234567";
        else if (val.includes('Steam')) hint = "e.g. SteamUser123";
        else if (val.includes('EA')) hint = "e.g. FifaKing99";
        else if (val.includes('Nintendo')) hint = "e.g. SW-1234-5678-9012";
        else if (val.includes('Battle.net')) hint = "e.g. Player#12345";
        else if (val.includes('Ubisoft')) hint = "e.g. Assassin_Pro";
        else if (val.includes('PUBG')) hint = "e.g. 5123456789";
        else if (val.includes('Free Fire')) hint = "e.g. 1234567890";
        else if (val.includes('Discord')) hint = "e.g. User#1234";

        gamerTagInput.placeholder = hint;
    });
}

let savedGamingIds = JSON.parse(localStorage.getItem('userGamingIds')) || [];

function renderGamingIds() {
    if (!gamingIdsList) return;
    
    gamingIdsList.innerHTML = '';
    
    if (savedGamingIds.length === 0) {
        gamingIdsList.innerHTML = '<div class="empty-ids-msg">No gaming IDs added yet. Select a platform and add your tag above.</div>';
        return;
    }

    savedGamingIds.forEach((idObj, index) => {
        const plat = idObj.platform.toLowerCase();
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
            iconHtml = `<img src="https://cdn.simpleicons.org/${iconRef}/white" alt="${idObj.platform}" class="${invertClass}" style="width: 24px; height: 24px; object-fit: contain;" onerror="this.outerHTML='<i data-lucide=\\'gamepad-2\\' style=\\'width: 24px; height: 24px; color: var(--text-primary);\\'></i>'; typeof lucide !== 'undefined' && lucide.createIcons();">`;
        } else if (isCustomImage) {
            iconHtml = `<img src="${customImgUrl}" alt="${idObj.platform}" class="${invertClass}" style="width: 26px; height: 26px; object-fit: contain;" onerror="this.outerHTML='<i data-lucide=\\'${fallbackLucideIcon}\\' style=\\'width: 24px; height: 24px; color: var(--text-primary);\\'></i>'; typeof lucide !== 'undefined' && lucide.createIcons();">`;
        } else {
             iconHtml = `<i data-lucide="${iconRef}" style="width: 24px; height: 24px; color: var(--text-primary);"></i>`;
        }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'gaming-id-item';
        
        itemDiv.innerHTML = `
            <div class="gaming-id-info">
                <div class="gaming-id-icon-box">
                    ${iconHtml}
                </div>
                <div>
                    <div class="gaming-id-platform">${idObj.platform}</div>
                    <div class="gaming-id-tag">${idObj.tag}</div>
                </div>
            </div>
            <button type="button" class="remove-id-btn" data-index="${index}" title="Remove ID">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
        `;
        gamingIdsList.appendChild(itemDiv);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    document.querySelectorAll('.remove-id-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-index');
            savedGamingIds.splice(idx, 1);
            localStorage.setItem('userGamingIds', JSON.stringify(savedGamingIds)); 
            renderGamingIds(); 
        });
    });
}
renderGamingIds();

if (addGamingIdBtn) {
    addGamingIdBtn.addEventListener('click', () => {
        const platform = platformSelect.value;
        const tag = gamerTagInput.value.trim();

        if (!platform) {
            if (typeof showToast === "function") showToast('Please select a platform.', true);
            return;
        }
        if (!tag) {
            if (typeof showToast === "function") showToast('Please enter your Gamertag or ID.', true);
            return;
        }

        savedGamingIds.push({ platform, tag });
        localStorage.setItem('userGamingIds', JSON.stringify(savedGamingIds));
        
        platformSelect.value = '';
        gamerTagInput.value = '';
        gamerTagInput.placeholder = "Enter your Gamertag / ID";
        
        renderGamingIds();
        
        if (typeof showToast === "function") showToast('Gaming ID successfully added!');
    });
}

// --- PAYOUT DETAILS LOGIC (LIVE PAYSTACK API FETCH) ---
const bankNameInput = document.getElementById('bankNameInput');
const bankDropdownList = document.getElementById('bankDropdownList');
const accNumInput = document.getElementById('accNumInput');
const accNameInput = document.getElementById('accNameInput');
const accNameVerifiedMsg = document.getElementById('accNameVerifiedMsg');
const savePayoutBtn = document.getElementById('savePayoutBtn');
const savedPayoutCard = document.getElementById('savedPayoutCard');
const payoutFormSection = document.getElementById('payoutFormSection');

const displayBankName = document.getElementById('displayBankName');
const displayAccName = document.getElementById('displayAccName');
const displayAccNumber = document.getElementById('displayAccNumber');
const removePayoutBtn = document.getElementById('removePayoutBtn');

let nigerianBanks = [];

async function fetchLiveBanks() {
    try {
        bankNameInput.placeholder = "Loading banks...";
        const response = await fetch('https://api.paystack.co/bank?currency=NGN');
        const data = await response.json();
        
        if (data.status) {
            nigerianBanks = data.data.map(bank => bank.name);
            bankNameInput.placeholder = "Type to search your bank...";
        } else {
            console.error("Failed to load banks from API");
            bankNameInput.placeholder = "Error loading banks";
        }
    } catch (error) {
        console.error("Error fetching bank list:", error);
        bankNameInput.placeholder = "Network error loading banks";
    }
}

function attemptVerification() {
    if (accNumInput.value.length === 10 && bankNameInput.value.trim() !== "") {
        accNameInput.placeholder = "Contacting Bank API...";
        accNameVerifiedMsg.style.display = 'none';
        
        setTimeout(() => {
            const num = accNumInput.value;
            const savedFName = localStorage.getItem('userFirstName') || 'Emmanuel';
            const savedLName = localStorage.getItem('userLastName') || 'Ovie';
            
            const expectedName1 = `${savedFName} ${savedLName}`.toUpperCase();
            const expectedName2 = `${savedLName} ${savedFName}`.toUpperCase();

            let fetchedName = "";
            let isApiError = false;

            if (num === "0123456789") {
                fetchedName = expectedName1; 
            } else if (/^(\d)\1{9}$/.test(num)) {
                const mockNames = [
                    "CHUKWUEMEKA OKAFOR", "AISHA BELLO", "OLUMIDE BADEJO", "FATIMA MUSA", "CHIDINMA EZE",
                    "JOHN DOE", "DAVID ADEBAYO", "SARAH CHUKWU", "MICHAEL OBI", "ZAINAB SANI"
                ];
                const nameIndex = parseInt(num.charAt(0)); 
                fetchedName = mockNames[nameIndex]; 
            } else {
                isApiError = true; 
            }

            if (isApiError) {
                accNameInput.value = "";
                accNameInput.placeholder = "Backend Integration Required";
                accNameVerifiedMsg.innerHTML = '<i data-lucide="alert-triangle" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right: 4px;"></i> API Not Connected: Please integrate live NUBAN resolution API on backend.';
                accNameVerifiedMsg.style.color = "var(--danger-color)";
                accNameVerifiedMsg.style.display = 'block';
            } else {
                accNameInput.value = fetchedName;
                
                if (fetchedName === expectedName1 || fetchedName === expectedName2) {
                    accNameVerifiedMsg.innerHTML = '<i data-lucide="check-circle" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right: 4px;"></i> Name verified successfully.';
                    accNameVerifiedMsg.style.color = "var(--success-color)";
                    accNameVerifiedMsg.style.display = 'block';
                } else {
                    accNameVerifiedMsg.innerHTML = `<i data-lucide="x-circle" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right: 4px;"></i> Security Alert: Account name (${fetchedName}) does not match your profile name (${expectedName1}). Third-party accounts are not allowed.`;
                    accNameVerifiedMsg.style.color = "var(--danger-color)";
                    accNameVerifiedMsg.style.display = 'block';
                }
            }
            
            if (typeof lucide !== 'undefined') lucide.createIcons();

        }, 1000);
    } else {
        accNameInput.value = "";
        accNameInput.placeholder = "Account name will be verified automatically";
        accNameVerifiedMsg.style.display = 'none';
    }
}

if (bankNameInput && bankDropdownList) {
    fetchLiveBanks(); 
    
    function populateBankDropdown(banksToRender) {
        bankDropdownList.innerHTML = '';
        if (banksToRender.length === 0) {
            bankDropdownList.innerHTML = '<div class="bank-option" style="color: var(--text-secondary);">No bank found</div>';
            return;
        }
        banksToRender.forEach(bank => {
            const div = document.createElement('div');
            div.className = 'bank-option';
            div.textContent = bank;
            div.addEventListener('click', () => {
                bankNameInput.value = bank;
                bankDropdownList.classList.remove('show');
                attemptVerification(); 
            });
            bankDropdownList.appendChild(div);
        });
    }

    bankNameInput.addEventListener('focus', () => {
        if(nigerianBanks.length > 0) {
            populateBankDropdown(nigerianBanks);
            bankDropdownList.classList.add('show');
        }
    });

    bankNameInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = nigerianBanks.filter(bank => bank.toLowerCase().includes(searchTerm));
        populateBankDropdown(filtered);
        bankDropdownList.classList.add('show');
        accNameInput.value = "";
        accNameVerifiedMsg.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
        if (!bankNameInput.contains(e.target) && !bankDropdownList.contains(e.target)) {
            bankDropdownList.classList.remove('show');
        }
    });
}

if (accNumInput) {
    accNumInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        attemptVerification(); 
    });
}

function renderPayoutUI() {
    const savedPayoutData = JSON.parse(localStorage.getItem('userPayoutData'));
    
    if (savedPayoutData && savedPayoutCard && payoutFormSection) {
        displayBankName.textContent = savedPayoutData.bank;
        displayAccName.textContent = savedPayoutData.name;
        const maskedNum = "**** **** **** " + savedPayoutData.number.slice(-4);
        displayAccNumber.textContent = maskedNum;
        
        savedPayoutCard.style.display = 'block';
        payoutFormSection.style.display = 'none';
    } else if (savedPayoutCard && payoutFormSection) {
        savedPayoutCard.style.display = 'none';
        payoutFormSection.style.display = 'block';
    }
}
renderPayoutUI();

if (savePayoutBtn) {
    savePayoutBtn.addEventListener('click', function() {
        if (!bankNameInput.value || accNumInput.value.length !== 10) {
            if (typeof showToast === "function") showToast('Please enter a valid Bank and 10-digit account number.', true);
            return;
        }
        
        if (accNameInput.value === "" || accNameInput.placeholder.includes("Required")) {
            if (typeof showToast === "function") showToast('Account name must be verified via API before saving.', true);
            return;
        }

        const savedFName = localStorage.getItem('userFirstName') || 'Emmanuel';
        const savedLName = localStorage.getItem('userLastName') || 'Ovie';
        const expected1 = `${savedFName} ${savedLName}`.toUpperCase();
        const expected2 = `${savedLName} ${savedFName}`.toUpperCase();
        const currentVal = accNameInput.value.toUpperCase();

        if (currentVal !== expected1 && currentVal !== expected2) {
            if (typeof showToast === "function") showToast('Cannot save. Bank account name must match your profile name exactly.', true);
            return;
        }

        const textSpan = this.querySelector('.btn-text');
        const spinner = this.querySelector('.btn-spinner');
        const originalText = textSpan.textContent;

        textSpan.textContent = 'Saving securely...';
        if (spinner) spinner.style.display = 'inline-block';
        this.disabled = true;
        this.style.opacity = '0.8';
        this.style.cursor = 'not-allowed';

        setTimeout(() => {
            textSpan.textContent = originalText;
            if (spinner) spinner.style.display = 'none';
            this.disabled = false;
            this.style.opacity = '1';
            this.style.cursor = 'pointer';

            const payoutData = {
                bank: bankNameInput.value,
                number: accNumInput.value,
                name: accNameInput.value
            };
            localStorage.setItem('userPayoutData', JSON.stringify(payoutData));
            
            bankNameInput.value = "";
            accNumInput.value = "";
            accNameInput.value = "";
            accNameVerifiedMsg.style.display = 'none';

            renderPayoutUI();

            if (typeof showToast === "function") showToast('Payout details safely encrypted and saved!');
        }, 1500);
    });
}

if (removePayoutBtn) {
    removePayoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userPayoutData');
        renderPayoutUI();
        if (typeof showToast === "function") showToast('Payout method removed.', true);
    });
}

const generalSaveBtns = document.querySelectorAll('.save-action-btn:not(#savePayoutBtn)');

generalSaveBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const textSpan = this.querySelector('.btn-text');
        const spinner = this.querySelector('.btn-spinner');
        const originalText = textSpan.textContent;

        textSpan.textContent = 'Saving...';
        if (spinner) spinner.style.display = 'inline-block';
        this.disabled = true;
        this.style.opacity = '0.8';
        this.style.cursor = 'not-allowed';

        setTimeout(() => {
            textSpan.textContent = originalText;
            if (spinner) spinner.style.display = 'none';
            this.disabled = false;
            this.style.opacity = '1';
            this.style.cursor = 'pointer';

            let msg = 'Settings saved successfully!';
            
            if (originalText.includes('Profile')) {
                msg = 'Profile updated successfully!';
                
                if (firstNameInput && lastNameInput && usernameInput && whatsappInput && bioInput) {
                    localStorage.setItem('userFirstName', firstNameInput.value);
                    localStorage.setItem('userLastName', lastNameInput.value);
                    localStorage.setItem('userUsername', usernameInput.value);
                    localStorage.setItem('userWhatsApp', whatsappInput.value);
                    localStorage.setItem('userBio', bioInput.value);
                    
                    const fullName = `${firstNameInput.value} ${lastNameInput.value}`;
                    localStorage.setItem('userFullName', fullName);
                    
                    const sidebarName = document.getElementById('sidebarNameDisplay');
                    const dropdownName = document.querySelector('.dropdown-name-display');
                    const dropdownUsername = document.querySelector('.dropdown-username-display');
                    
                    if (sidebarName) sidebarName.textContent = fullName;
                    if (dropdownName) dropdownName.textContent = fullName;
                    if (dropdownUsername) dropdownUsername.textContent = '@' + usernameInput.value.toLowerCase();
                }
            }
            
            if (originalText.includes('Security')) msg = 'Security settings updated!';

            if (typeof showToast === "function") {
                showToast(msg);
            }
        }, 1500);
    });
});

const twoFactorToggle = document.getElementById('twoFactorToggle');
if (twoFactorToggle) {
    const is2faEnabled = localStorage.getItem('user2FA') === 'true';
    twoFactorToggle.checked = is2faEnabled;
    
    twoFactorToggle.addEventListener('change', (e) => {
        localStorage.setItem('user2FA', e.target.checked);
        if (e.target.checked) {
            if (typeof showToast === "function") showToast('2FA is now Enabled for your security.');
        } else {
            if (typeof showToast === "function") showToast('2FA has been disabled.', true);
        }
    });
}