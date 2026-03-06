// Tab Switching Logic for Settings Panels
const settingTabs = document.querySelectorAll('.settings-tab');
const settingPanels = document.querySelectorAll('.settings-panel');

settingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        settingTabs.forEach(t => t.classList.remove('active'));
        settingPanels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding panel
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Handle new avatar upload
const avatarUploadInput = document.getElementById('avatarUploadInput');
if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const base64Image = e.target.result;
                
                // Update large preview
                const avatarPreviewImage = document.getElementById('avatarPreviewImage');
                if(avatarPreviewImage) avatarPreviewImage.src = base64Image;
                
                // Instantly update the small avatars around the app
                const topbarAvatar = document.querySelector('#profileToggle img');
                const sidebarAvatar = document.querySelector('.user-widget img');
                const dropdownAvatar = document.querySelector('.profile-header-info img'); 
                if(topbarAvatar) topbarAvatar.src = base64Image;
                if(sidebarAvatar) sidebarAvatar.src = base64Image;
                if(dropdownAvatar) dropdownAvatar.src = base64Image;
                
                // Save to localStorage so it survives a refresh
                localStorage.setItem('userAvatar', base64Image);
            }
            
            reader.readAsDataURL(file);
        }
    });
}

// Populate Profile Inputs on Load
const usernameInput = document.getElementById('usernameInput');
const fullNameInput = document.getElementById('fullNameInput');
const bioInput = document.getElementById('bioInput');

if(usernameInput) usernameInput.value = localStorage.getItem('userUsername') || 'Emmanuel_O';
if(fullNameInput) fullNameInput.value = localStorage.getItem('userFullName') || 'Emmanuel Ovie';
if(bioInput) bioInput.value = localStorage.getItem('userBio') || '';

// Apply the loading and saving effect to ALL save buttons dynamically
const saveBtns = document.querySelectorAll('.save-action-btn');

saveBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const textSpan = this.querySelector('.btn-text');
        const spinner = this.querySelector('.btn-spinner');
        const originalText = textSpan.textContent;

        // 1. Show loading state
        textSpan.textContent = 'Saving...';
        if(spinner) spinner.style.display = 'inline-block';
        this.disabled = true;
        this.style.opacity = '0.8';
        this.style.cursor = 'not-allowed';

        // 2. Simulate backend API call delay (1.5 seconds)
        setTimeout(() => {
            // Revert button state back to normal
            textSpan.textContent = originalText;
            if(spinner) spinner.style.display = 'none';
            this.disabled = false;
            this.style.opacity = '1';
            this.style.cursor = 'pointer';

            // 3. Trigger Success Toast & Save Data based on which button was clicked
            let msg = 'Settings saved successfully!';
            
            if(originalText.includes('Profile')) {
                msg = 'Profile updated successfully!';
                
                // Save to LocalStorage
                if (usernameInput && fullNameInput && bioInput) {
                    localStorage.setItem('userUsername', usernameInput.value);
                    localStorage.setItem('userFullName', fullNameInput.value);
                    localStorage.setItem('userBio', bioInput.value);
                    
                    // Instantly update UI on current page
                    const sidebarName = document.querySelector('.user-info h4');
                    const dropdownName = document.querySelector('.profile-user-details h4');
                    const dropdownUsername = document.querySelector('.profile-user-details p');
                    if(sidebarName) sidebarName.textContent = fullNameInput.value;
                    if(dropdownName) dropdownName.textContent = fullNameInput.value;
                    if(dropdownUsername) dropdownUsername.textContent = '@' + usernameInput.value.toLowerCase();
                }
            }
            
            if(originalText.includes('Gaming IDs')) msg = 'Gaming IDs saved successfully!';
            if(originalText.includes('Password')) msg = 'Password updated successfully!';
            if(originalText.includes('Payout')) msg = 'Payout details saved successfully!';

            if (typeof showToast === "function") {
                showToast(msg);
            }
        }, 1500);
    });
});