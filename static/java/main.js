// Render all icons on initial page load
lucide.createIcons();

// ==========================================
// 1. Sidebar Active State Logic
// ==========================================
const navItems = document.querySelectorAll('.nav-item:not(.logout-item)');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // Auto-close sidebar on mobile after clicking a link
        if (window.innerWidth <= 768) {
            toggleMobileSidebar();
        }
    });
});

// ==========================================
// 2. Desktop Sidebar Toggle Logic
// ==========================================
const desktopToggle = document.getElementById('desktopMenuToggle');
const iconCollapse = document.querySelector('.icon-collapse');
const iconExpand = document.querySelector('.icon-expand');
const sidebar = document.getElementById('sidebar');
const sidebarSpacer = document.getElementById('sidebarSpacer');

desktopToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarSpacer.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        iconCollapse.style.display = 'none';
        iconExpand.style.display = 'block';
    } else {
        iconCollapse.style.display = 'block';
        iconExpand.style.display = 'none';
    }
});

// ==========================================
// 3. Theme Toggle Logic (Communicates with iframe!)
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');
const body = document.body;
// const iframe = document.getElementById('content-frame');

function applyTheme(isLight) {
    if (isLight) {
        body.classList.add('light-mode');
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
        localStorage.setItem('theme', 'light');
        // Post message to iframe so it knows to change its theme too
        // if (iframe.contentWindow) iframe.contentWindow.postMessage('theme-light', '*');
    } else {
        body.classList.remove('light-mode');
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
        // Post message to iframe so it knows to change its theme too
        // if (iframe.contentWindow) iframe.contentWindow.postMessage('theme-dark', '*');
    }
}

applyTheme(localStorage.getItem('theme') === 'light');

themeToggle.addEventListener('click', () => {
    applyTheme(!body.classList.contains('light-mode'));
});

// Re-send theme signal when the iframe finishes loading a new page
// iframe.onload = function() {
//     if (body.classList.contains('light-mode')) {
//         iframe.contentWindow.postMessage('theme-light', '*');
//     } else {
//         iframe.contentWindow.postMessage('theme-dark', '*');
//     }
// };

// ==========================================
// 4. Mobile Sidebar Toggle Logic
// ==========================================
const mobileToggle = document.getElementById('mobileMenuToggle');
const overlay = document.getElementById('sidebarOverlay');

function toggleMobileSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
}

mobileToggle.addEventListener('click', toggleMobileSidebar);
overlay.addEventListener('click', toggleMobileSidebar);

// ==========================================
// 5. Notifications & Profile Dropdown Logic
// ==========================================
const notifToggle = document.getElementById('notifToggle');
const notifDropdown = document.getElementById('notifDropdown');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const notifBadge = document.getElementById('notifBadge');
const notifList = document.querySelector('.notif-list');

const profileToggle = document.getElementById('profileToggle');
const profileDropdown = document.getElementById('profileDropdown');

// Sync badge count with unread items and toggle action icons
function updateBadgeCount() {
    const unreadCount = document.querySelectorAll('.notif-item.unread').length;
    const totalCount = document.querySelectorAll('.notif-item').length;

    if (unreadCount > 0) {
        notifBadge.textContent = unreadCount;
        notifBadge.classList.remove('hidden');
        markAllReadBtn.style.display = 'flex';
    } else {
        notifBadge.classList.add('hidden');
        markAllReadBtn.style.display = 'none';
    }

    if (totalCount > 0) {
        deleteAllBtn.style.display = 'flex';
    } else {
        deleteAllBtn.style.display = 'none';
    }
}

updateBadgeCount();

// Toggle notifications dropdown
notifToggle.addEventListener('click', (e) => {
    e.stopPropagation(); 
    notifDropdown.classList.toggle('show');
    profileDropdown.classList.remove('show');
    document.querySelectorAll('.notif-options.show').forEach(opt => opt.classList.remove('show'));
});

// Toggle profile dropdown
profileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
    notifDropdown.classList.remove('show');
});

// Mark all as read
markAllReadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    updateBadgeCount();
});

// Delete all
deleteAllBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifList.innerHTML = '<div style="padding: 30px 20px; text-align: center; color: var(--text-secondary); font-size: 14px;">No new notifications</div>';
    updateBadgeCount();
});

// Event Delegation for Notification Items (3-dots, mark read/unread, delete)
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
        optBtn.closest('.notif-options').classList.remove('show');
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

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    document.querySelectorAll('.notif-options.show').forEach(opt => opt.classList.remove('show'));
    if (!notifDropdown.contains(e.target) && !notifToggle.contains(e.target)) {
        notifDropdown.classList.remove('show');
    }
    if (!profileDropdown.contains(e.target) && !profileToggle.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
});

// Added specific fix: Close profile dropdown when clicking a link inside it
const profileLinks = document.querySelectorAll('.profile-link-item');
profileLinks.forEach(link => {
    link.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });
});