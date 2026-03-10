// 1. Sidebar Active State Logic
const navItems = document.querySelectorAll('.nav-item:not(.logout-item)');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        if (window.innerWidth <= 768) {
            if (typeof toggleMobileSidebar === 'function') toggleMobileSidebar();
        }
    });
});

// 2. Desktop Sidebar Toggle Logic (Safeguarded)
const desktopToggle = document.getElementById('desktopMenuToggle');
const iconCollapse = document.querySelector('.icon-collapse');
const iconExpand = document.querySelector('.icon-expand');
const sidebar = document.getElementById('sidebar');
const sidebarSpacer = document.getElementById('sidebarSpacer');

if (desktopToggle && sidebar) {
    desktopToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (sidebarSpacer) sidebarSpacer.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            if(iconCollapse) iconCollapse.style.display = 'none';
            if(iconExpand) iconExpand.style.display = 'block';
        } else {
            if(iconCollapse) iconCollapse.style.display = 'block';
            if(iconExpand) iconExpand.style.display = 'none';
        }
    });
}

// 3. Mobile Sidebar Toggle Logic (Safeguarded to prevent conflict with landing page)
const mobileToggle = document.getElementById('mobileMenuToggle');
const overlay = document.getElementById('sidebarOverlay');

function toggleMobileSidebar() {
    // Only fire this logic if the dashboard sidebar exists
    if(sidebar) {
        sidebar.classList.toggle('show');
        if(overlay) overlay.classList.toggle('show');
    }
}

if(mobileToggle) mobileToggle.addEventListener('click', toggleMobileSidebar);
// Only bind the overlay click to the dashboard sidebar if we are actually on a dashboard page
if(overlay && sidebar) overlay.addEventListener('click', toggleMobileSidebar);

// 4. Theme Toggle Logic 
const themeToggle = document.getElementById('themeToggle');
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');
const body = document.body;
const settingsThemeToggle = document.getElementById('settingsThemeToggle');

function applyTheme(isLight) {
    if (isLight) {
        body.classList.add('light-mode');
        if(iconSun) iconSun.style.display = 'none';
        if(iconMoon) iconMoon.style.display = 'block';
        localStorage.setItem('theme', 'light');
        if(settingsThemeToggle) settingsThemeToggle.checked = false;
    } else {
        body.classList.remove('light-mode');
        if(iconSun) iconSun.style.display = 'block';
        if(iconMoon) iconMoon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
        if(settingsThemeToggle) settingsThemeToggle.checked = true;
    }
}

applyTheme(localStorage.getItem('theme') === 'light');

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        applyTheme(!body.classList.contains('light-mode'));
    });
}

if(settingsThemeToggle) {
    settingsThemeToggle.addEventListener('change', (e) => {
        applyTheme(!e.target.checked); 
    });
}

// 5. Notifications & Profile Dropdown Logic
const notifToggle = document.getElementById('notifToggle');
const notifDropdown = document.getElementById('notifDropdown');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const notifBadge = document.getElementById('notifBadge');
const notifList = document.querySelector('.notif-list');
const profileToggle = document.getElementById('profileToggle');
const profileDropdown = document.getElementById('profileDropdown');

function updateBadgeCount() {
    if (!notifBadge) return;
    const unreadCount = document.querySelectorAll('.notif-item.unread').length;
    const totalCount = document.querySelectorAll('.notif-item').length;

    if (unreadCount > 0) {
        notifBadge.textContent = unreadCount;
        notifBadge.classList.remove('hidden');
        if(markAllReadBtn) markAllReadBtn.style.display = 'flex';
    } else {
        notifBadge.classList.add('hidden');
        if(markAllReadBtn) markAllReadBtn.style.display = 'none';
    }

    if (totalCount > 0) {
        if(deleteAllBtn) deleteAllBtn.style.display = 'flex';
    } else {
        if(deleteAllBtn) deleteAllBtn.style.display = 'none';
    }
}

updateBadgeCount();

if(notifToggle) {
    notifToggle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if(notifDropdown) notifDropdown.classList.toggle('show');
        if(profileDropdown) profileDropdown.classList.remove('show');
        document.querySelectorAll('.notif-options.show').forEach(opt => opt.classList.remove('show'));
    });
}

if(profileToggle) {
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if(profileDropdown) profileDropdown.classList.toggle('show');
        if(notifDropdown) notifDropdown.classList.remove('show');
    });
}

if(markAllReadBtn) {
    markAllReadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.notif-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        updateBadgeCount();
    });
}

if(deleteAllBtn) {
    deleteAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(notifList) notifList.innerHTML = '<div style="padding: 30px 20px; text-align: center; color: var(--text-secondary); font-size: 14px;">No new notifications</div>';
        updateBadgeCount();
    });
}

if(notifList) {
    notifList.addEventListener('click', (e) => {
        const item = e.target.closest('.notif-item');
        if (!item) return;

        const moreBtn = e.target.closest('.more-btn');
        if (moreBtn) {
            e.stopPropagation();
            document.querySelectorAll('.notif-options.show').forEach(opt => {
                if (opt !== moreBtn.nextElementSibling) opt.classList.remove('show');
            });
            moreBtn.nextElementSibling.classList.toggle('show');
            return;
        }

        const optBtn = e.target.closest('.opt-btn');
        if (optBtn) {
            e.stopPropagation();
            if (optBtn.classList.contains('mark-read-opt')) {
                item.classList.remove('unread');
            } else if (optBtn.classList.contains('mark-unread-opt')) {
                item.classList.add('unread');
            } else if (optBtn.classList.contains('delete-opt')) {
                item.remove();
                if (notifList.children.length === 0) {
                    notifList.innerHTML = '<div style="padding: 30px 20px; text-align: center; color: var(--text-secondary); font-size: 14px;">No new notifications</div>';
                }
            }
            if(optBtn.closest('.notif-options')) optBtn.closest('.notif-options').classList.remove('show');
            updateBadgeCount();
            return;
        }

        if (e.target.closest('.notif-options')) {
            e.stopPropagation();
            return;
        }

        if (item.classList.contains('unread')) {
            item.classList.remove('unread');
            updateBadgeCount();
        }
    });
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.notif-options.show').forEach(opt => opt.classList.remove('show'));
    if (notifDropdown && notifToggle && !notifDropdown.contains(e.target) && !notifToggle.contains(e.target)) {
        notifDropdown.classList.remove('show');
    }
    if (profileDropdown && profileToggle && !profileDropdown.contains(e.target) && !profileToggle.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
});

const profileLinks = document.querySelectorAll('.profile-link-item');
profileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(profileDropdown) profileDropdown.classList.remove('show');
    });
});

// 6. GLOBAL AVATAR PERSIST LOGIC
const topbarAvatar = document.querySelector('#profileToggle img');
const sidebarAvatar = document.querySelector('.user-widget img');
const dropdownAvatar = document.querySelector('.profile-header-info img'); 

const savedAvatar = localStorage.getItem('userAvatar');
if (savedAvatar) {
    if(topbarAvatar) topbarAvatar.src = savedAvatar;
    if(sidebarAvatar) sidebarAvatar.src = savedAvatar;
    if(dropdownAvatar) dropdownAvatar.src = savedAvatar;
    
    const avatarPreviewImage = document.getElementById('avatarPreviewImage');
    if(avatarPreviewImage) avatarPreviewImage.src = savedAvatar;
}

// 7. GLOBAL PROFILE TEXT PERSIST LOGIC
const savedFullName = localStorage.getItem('userFullName') || 'Emmanuel Ovie';
const savedUsername = localStorage.getItem('userUsername') || 'Emmanuel_O';

const sidebarName = document.getElementById('sidebarNameDisplay');
if(sidebarName) sidebarName.textContent = savedFullName;

const dropdownName = document.querySelector('.dropdown-name-display');
const dropdownUsername = document.querySelector('.dropdown-username-display');
if(dropdownName) dropdownName.textContent = savedFullName;
if(dropdownUsername) dropdownUsername.textContent = '@' + savedUsername.toLowerCase();

// 8. GLOBAL TOAST NOTIFICATION LOGIC
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');
const toastIconWrapper = document.getElementById('toastIconWrapper');

function showToast(message, isError = false) {
    if (!toastNotification) return;

    toastMessage.textContent = message;
    if (isError) {
        toastNotification.style.backgroundColor = 'var(--danger-color)';
        if(toastIconWrapper) toastIconWrapper.innerHTML = '<i data-lucide="x-circle"></i>';
    } else {
        toastNotification.style.backgroundColor = 'var(--success-color)';
        if(toastIconWrapper) toastIconWrapper.innerHTML = '<i data-lucide="check-circle"></i>';
    }
    
    lucide.createIcons();
    toastNotification.classList.add('show');
    
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// 9. AUTO-SLIDING TOURNAMENT BANNER
const promoSlider = document.getElementById('promoSlider');
let autoSlideInterval;
let isTransitioning = false;

function startAutoSlide() {
    if (!promoSlider) return;
    autoSlideInterval = setInterval(() => {
        if (!promoSlider || isTransitioning) return;
        
        const firstSlide = promoSlider.firstElementChild;
        if (!firstSlide) return;

        const slideWidth = firstSlide.clientWidth + 20; 
        
        promoSlider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        isTransitioning = true;

        setTimeout(() => {
            promoSlider.style.scrollBehavior = 'auto';
            promoSlider.style.scrollSnapType = 'none';
            
            promoSlider.appendChild(firstSlide);
            promoSlider.scrollLeft -= slideWidth;
            
            void promoSlider.offsetWidth; 
            
            promoSlider.style.scrollBehavior = 'smooth';
            promoSlider.style.scrollSnapType = 'x mandatory';
            
            isTransitioning = false;
        }, 800); 

    }, 3500); 
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

if (promoSlider) {
    startAutoSlide();
    promoSlider.addEventListener('mouseenter', stopAutoSlide);
    promoSlider.addEventListener('mouseleave', startAutoSlide);
    promoSlider.addEventListener('touchstart', stopAutoSlide, {passive: true});
    promoSlider.addEventListener('touchend', startAutoSlide, {passive: true});
}