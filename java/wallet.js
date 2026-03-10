/* =========================================
   === (wallet.js) ===
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- BALANCE HIDE/SHOW LOGIC ---
    const toggleBalanceBtn = document.getElementById('toggleBalanceBtn');
    const mainBalanceDisplay = document.getElementById('mainBalanceDisplay');
    const bonusBalanceDisplay = document.getElementById('bonusBalanceDisplay');

    if (toggleBalanceBtn && mainBalanceDisplay && bonusBalanceDisplay) {
        // Check memory for user preference
        const isHidden = localStorage.getItem('hideWalletBalance') === 'true';
        
        const rawMain = mainBalanceDisplay.getAttribute('data-raw-value');
        const rawBonus = bonusBalanceDisplay.getAttribute('data-raw-value');

        function applyBalanceState(hide) {
            if (hide) {
                mainBalanceDisplay.textContent = '****';
                bonusBalanceDisplay.textContent = '****';
                toggleBalanceBtn.innerHTML = '<i data-lucide="eye-off" style="width: 18px; height: 18px;"></i>';
            } else {
                mainBalanceDisplay.textContent = rawMain;
                bonusBalanceDisplay.textContent = rawBonus;
                toggleBalanceBtn.innerHTML = '<i data-lucide="eye" style="width: 18px; height: 18px;"></i>';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // Apply initial state
        applyBalanceState(isHidden);

        // Toggle on click
        toggleBalanceBtn.addEventListener('click', () => {
            const currentlyHidden = localStorage.getItem('hideWalletBalance') === 'true';
            const newState = !currentlyHidden;
            localStorage.setItem('hideWalletBalance', newState);
            applyBalanceState(newState);
        });
    }

    // --- MODAL LOGIC ---
    const depositModal = document.getElementById('depositModal');
    const withdrawModal = document.getElementById('withdrawModal');
    
    const openDepositBtn = document.getElementById('openDepositBtn');
    const closeDepositBtn = document.getElementById('closeDepositBtn');
    
    const openWithdrawBtn = document.getElementById('openWithdrawBtn');
    const closeWithdrawBtn = document.getElementById('closeWithdrawBtn');

    if (openDepositBtn && depositModal) {
        openDepositBtn.addEventListener('click', () => {
            depositModal.classList.add('show');
        });
    }

    if (closeDepositBtn && depositModal) {
        closeDepositBtn.addEventListener('click', () => {
            depositModal.classList.remove('show');
        });
    }

    if (openWithdrawBtn && withdrawModal) {
        openWithdrawBtn.addEventListener('click', () => {
            withdrawModal.classList.add('show');
        });
    }

    if (closeWithdrawBtn && withdrawModal) {
        closeWithdrawBtn.addEventListener('click', () => {
            withdrawModal.classList.remove('show');
        });
    }

    // Close Modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === depositModal) depositModal.classList.remove('show');
        if (e.target === withdrawModal) withdrawModal.classList.remove('show');
    });

    // --- DEPOSIT LOGIC (Mock Paystack flow) ---
    const depositForm = document.getElementById('depositForm');
    const depositAmountInput = document.getElementById('depositAmount');
    const quickAmtBtns = document.querySelectorAll('.quick-amt-btn');
    const confirmDepositBtn = document.getElementById('confirmDepositBtn');
    const depositBtnText = document.getElementById('depositBtnText');
    const depositSpinner = document.getElementById('depositSpinner');

    quickAmtBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (depositAmountInput) {
                depositAmountInput.value = btn.getAttribute('data-val');
            }
        });
    });

    if (depositForm) {
        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const amt = depositAmountInput.value;
            if (amt < 500) {
                if (typeof showToast === 'function') showToast('Minimum deposit is ₦500', true);
                else alert('Minimum deposit is ₦500');
                return;
            }

            confirmDepositBtn.disabled = true;
            confirmDepositBtn.style.opacity = '0.8';
            confirmDepositBtn.style.cursor = 'not-allowed';
            depositBtnText.textContent = 'Connecting to Paystack...';
            depositSpinner.style.display = 'inline-block';

            // Simulate API call to Paystack
            setTimeout(() => {
                confirmDepositBtn.disabled = false;
                confirmDepositBtn.style.opacity = '1';
                confirmDepositBtn.style.cursor = 'pointer';
                depositBtnText.textContent = 'Proceed to Paystack';
                depositSpinner.style.display = 'none';
                
                depositModal.classList.remove('show');
                
                if (typeof showToast === 'function') showToast('Redirecting to secure gateway...');
                else alert('Redirecting to secure gateway...');
                
                depositAmountInput.value = '';
            }, 2000);
        });
    }

    // --- WITHDRAW LOGIC ---
    const withdrawForm = document.getElementById('withdrawForm');
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    const confirmWithdrawBtn = document.getElementById('confirmWithdrawBtn');
    const withdrawBtnText = document.getElementById('withdrawBtnText');
    const withdrawSpinner = document.getElementById('withdrawSpinner');

    if (withdrawForm) {
        withdrawForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const amt = withdrawAmountInput.value;
            // Note: 12500 is hardcoded for mock purposes based on the HTML
            if (amt > 12500) {
                if (typeof showToast === 'function') showToast('Insufficient funds.', true);
                else alert('Insufficient funds.');
                return;
            }

            confirmWithdrawBtn.disabled = true;
            confirmWithdrawBtn.style.opacity = '0.8';
            confirmWithdrawBtn.style.cursor = 'not-allowed';
            withdrawBtnText.textContent = 'Processing...';
            withdrawSpinner.style.display = 'inline-block';

            // Simulate withdrawal API call
            setTimeout(() => {
                confirmWithdrawBtn.disabled = false;
                confirmWithdrawBtn.style.opacity = '1';
                confirmWithdrawBtn.style.cursor = 'pointer';
                withdrawBtnText.textContent = 'Request Withdrawal';
                withdrawSpinner.style.display = 'none';
                
                withdrawModal.classList.remove('show');
                
                if (typeof showToast === 'function') showToast('Withdrawal request submitted successfully!');
                else alert('Withdrawal request submitted successfully!');
                
                withdrawAmountInput.value = '';
            }, 2000);
        });
    }

    // --- TRANSACTION TABS FILTERING ---
    const txTabs = document.querySelectorAll('.tx-tab');
    const txItems = document.querySelectorAll('.tx-item');

    txTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state from all tabs
            txTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterType = tab.getAttribute('data-filter');

            txItems.forEach(item => {
                const itemType = item.getAttribute('data-type');
                
                if (filterType === 'all' || itemType === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});