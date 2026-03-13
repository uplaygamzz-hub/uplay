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
            }
            
            reader.readAsDataURL(file);
        }
    });
}

// Intercept form submissions for settings forms
const forms = document.querySelectorAll('.settings-panel form');

forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('.save-action-btn');
        const textSpan = btn ? btn.querySelector('.btn-text') : null;
        const spinner = btn ? btn.querySelector('.btn-spinner') : null;
        const originalText = textSpan ? textSpan.textContent : 'Save';

        // 1. Show loading state
        if (btn) {
            if (textSpan) textSpan.textContent = 'Saving...';
            if (spinner) spinner.style.display = 'inline-block';
            btn.disabled = true;
            btn.style.opacity = '0.8';
            btn.style.cursor = 'not-allowed';
        }

        const formData = new FormData(this);
        const actionUrl = this.getAttribute('action');
        
        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Revert button state
            if (btn) {
                if (textSpan) textSpan.textContent = originalText;
                if (spinner) spinner.style.display = 'none';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }

            if (data.success) {
                // Show toast notification
                const toast = document.getElementById('toastNotification');
                if (toast) {
                    const toastMsg = document.getElementById('toastMessage');
                    if (toastMsg) toastMsg.textContent = data.message || 'Saved successfully!';
                    
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000); // Hide after 3 seconds
                } else {
                    alert(data.message || 'Saved successfully!');
                }
            } else {
                alert(data.message || 'Error saving settings.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (btn) {
                if (textSpan) textSpan.textContent = originalText;
                if (spinner) spinner.style.display = 'none';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
            alert('An error occurred. Please try again.');
        });
    });
});