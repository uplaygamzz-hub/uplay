        // 1. Sidebar Active State Logic
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

        // 2. Desktop Sidebar Toggle Logic
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

        // 3. Mobile Sidebar Toggle Logic
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const overlay = document.getElementById('sidebarOverlay');

        function toggleMobileSidebar() {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        }

        mobileToggle.addEventListener('click', toggleMobileSidebar);
        overlay.addEventListener('click', toggleMobileSidebar);

        // 4. Theme Toggle Logic 
        const themeToggle = document.getElementById('themeToggle');
        const iconSun = document.querySelector('.icon-sun');
        const iconMoon = document.querySelector('.icon-moon');
        const body = document.body;
        
        // Also grab the toggle inside the settings preferences panel
        const settingsThemeToggle = document.getElementById('settingsThemeToggle');

        function applyTheme(isLight) {
            if (isLight) {
                body.classList.add('light-mode');
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
                localStorage.setItem('theme', 'light');
                if(settingsThemeToggle) settingsThemeToggle.checked = false;
            } else {
                body.classList.remove('light-mode');
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
                localStorage.setItem('theme', 'dark');
                if(settingsThemeToggle) settingsThemeToggle.checked = true;
            }
        }

        applyTheme(localStorage.getItem('theme') === 'light');

        themeToggle.addEventListener('click', () => {
            applyTheme(!body.classList.contains('light-mode'));
        });
        
        // Listen to the toggle switch inside settings too
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

        // Close profile dropdown when clicking a link inside it
        const profileLinks = document.querySelectorAll('.profile-link-item');
        profileLinks.forEach(link => {
            link.addEventListener('click', () => {
                profileDropdown.classList.remove('show');
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
            
            // Also update settings preview if we are on the settings page
            const avatarPreviewImage = document.getElementById('avatarPreviewImage');
            if(avatarPreviewImage) avatarPreviewImage.src = savedAvatar;
        }

        // 7. GLOBAL PROFILE TEXT PERSIST LOGIC
        const savedFullName = localStorage.getItem('userFullName') || 'Emmanuel Ovie';
        const savedUsername = localStorage.getItem('userUsername') || 'Emmanuel_O';

        // Update Sidebar
        const sidebarName = document.querySelector('.user-info h4');
        if(sidebarName) sidebarName.textContent = savedFullName;

        // Update Dropdown
        const dropdownName = document.querySelector('.profile-user-details h4');
        const dropdownUsername = document.querySelector('.profile-user-details p');
        if(dropdownName) dropdownName.textContent = savedFullName;
        if(dropdownUsername) dropdownUsername.textContent = '@' + savedUsername.toLowerCase();

        // 8. GLOBAL TOAST NOTIFICATION LOGIC
        const toastNotification = document.getElementById('toastNotification');
        const toastMessage = document.getElementById('toastMessage');
        const toastIconWrapper = document.getElementById('toastIconWrapper');

        function showToast(message, isError = false) {
            if (!toastNotification) return;

            toastMessage.textContent = message;
            
            // Safely update the icon HTML so lucide.createIcons doesn't break
            if (isError) {
                toastNotification.style.backgroundColor = 'var(--danger-color)';
                toastIconWrapper.innerHTML = '<i data-lucide="x-circle"></i>';
            } else {
                toastNotification.style.backgroundColor = 'var(--success-color)';
                toastIconWrapper.innerHTML = '<i data-lucide="check-circle"></i>';
            }
            
            // Render the new icon
            lucide.createIcons();
            
            toastNotification.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000);
        }

        // 9. AUTO-SLIDING TOURNAMENT BANNER (INFINITE LOOP)
        const promoSlider = document.querySelector('.promo-slideshow');
        let autoSlideInterval;
        let isTransitioning = false;

        function startAutoSlide() {
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