/* =========================================
   === (tournaments.js) ===
   ========================================= */
const searchInput = document.getElementById('searchInput');
const gameFilter = document.getElementById('gameFilter');
const statusFilter = document.getElementById('statusFilter');
const cards = document.querySelectorAll('.tournament-card');
const noResults = document.getElementById('noResults');

function filterTournaments() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGame = gameFilter.value;
    const selectedStatus = statusFilter.value;
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.tournament-title').textContent.toLowerCase();
        const game = card.getAttribute('data-game');
        const status = card.getAttribute('data-status');

        const matchesSearch = title.includes(searchTerm);
        const matchesGame = selectedGame === 'all' || game === selectedGame;
        const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

        if (matchesSearch && matchesGame && matchesStatus) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (gameFilter) gameFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    filterTournaments();
}

if (searchInput) searchInput.addEventListener('input', filterTournaments);
if (gameFilter) gameFilter.addEventListener('change', filterTournaments);
if (statusFilter) statusFilter.addEventListener('change', filterTournaments);

const modal = document.getElementById('paymentModal');
const closeBtn = document.getElementById('closeModalBtn');
const registerBtns = document.querySelectorAll('.register-btn');

const modalTitle = document.getElementById('modalTourneyName');
const modalPrice = document.getElementById('modalTourneyPrice');
const proceedBtn = document.getElementById('proceedPaymentBtn');

const manualBtn = document.getElementById('manualTransferBtn');
const manualDetails = document.getElementById('manualTransferDetails');

const regView = document.getElementById('registrationView');
const successView = document.getElementById('successView');

const receiptUpload = document.getElementById('receiptUpload');
const uploadBox = document.getElementById('uploadBox');
const uploadContent = document.getElementById('uploadContent');
const uploadIconWrapper = document.getElementById('uploadIconWrapper');
const uploadText = document.getElementById('uploadText');
const receiptPreview = document.getElementById('receiptPreview');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const viewFullScreenBtn = document.getElementById('viewFullScreenBtn');
const submitReceiptBtn = document.getElementById('submitReceiptBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitBtnSpinner = document.getElementById('submitBtnSpinner');

const fullScreenModal = document.getElementById('fullScreenModal');
const closeFullScreenBtn = document.getElementById('closeFullScreenBtn');
const fullScreenImg = document.getElementById('fullScreenImg');
const fullScreenPdf = document.getElementById('fullScreenPdf');

let fileObjUrl = null;

if (registerBtns) {
    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            regView.style.display = 'block';
            successView.style.display = 'none';
            manualDetails.classList.remove('show');
            manualBtn.style.display = 'flex';
            
            receiptUpload.value = '';
            fileNameDisplay.style.display = 'none';
            viewFullScreenBtn.style.display = 'none';
            
            if (fileObjUrl) {
                URL.revokeObjectURL(fileObjUrl);
            }
            
            receiptPreview.style.display = 'none';
            receiptPreview.src = '';
            uploadContent.style.display = 'flex';
            uploadBox.style.padding = '20px';
            uploadIconWrapper.innerHTML = '<i data-lucide="upload-cloud" style="width: 24px; height: 24px;"></i>';
            uploadText.innerHTML = 'Click to browse or drag file here';
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            submitReceiptBtn.setAttribute('disabled', 'true');
            submitReceiptBtn.style.opacity = '0.5';
            submitReceiptBtn.style.cursor = 'not-allowed';
            submitBtnText.style.display = 'inline-block';
            submitBtnSpinner.style.display = 'none';

            modalTitle.textContent = btn.getAttribute('data-tourney');
            modalPrice.textContent = btn.getAttribute('data-price');
            proceedBtn.href = btn.getAttribute('data-link'); 

            modal.classList.add('show');
        });
    });
}

if (manualBtn) {
    manualBtn.addEventListener('click', () => {
        manualDetails.classList.add('show');
        manualBtn.style.display = 'none'; 
    });
}

if (receiptUpload) {
    receiptUpload.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            const file = this.files[0];
            fileNameDisplay.textContent = `Selected: ${file.name}`;
            fileNameDisplay.style.display = 'block';
            viewFullScreenBtn.style.display = 'flex';
            
            if (fileObjUrl) {
                URL.revokeObjectURL(fileObjUrl);
            }
            
            fileObjUrl = URL.createObjectURL(file);
            
            if (file.type.startsWith('image/')) {
                receiptPreview.src = fileObjUrl;
                receiptPreview.style.display = 'block';
                uploadContent.style.display = 'none';
                uploadBox.style.padding = '10px'; 
                fullScreenImg.src = fileObjUrl;
                fullScreenImg.style.display = 'block';
                fullScreenPdf.style.display = 'none';
            } else if (file.type === 'application/pdf') {
                receiptPreview.style.display = 'none';
                uploadContent.style.display = 'flex';
                uploadBox.style.padding = '20px';
                uploadIconWrapper.innerHTML = '<i data-lucide="file-text" style="width: 24px; height: 24px; color: var(--danger-color);"></i>';
                uploadText.innerHTML = 'PDF Document Selected <br><span style="font-size: 10px; text-decoration: underline;">Click to change</span>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                fullScreenPdf.src = fileObjUrl;
                fullScreenPdf.style.display = 'block';
                fullScreenImg.style.display = 'none';
            } else {
                receiptPreview.style.display = 'none';
                uploadContent.style.display = 'flex';
                uploadBox.style.padding = '20px';
                uploadIconWrapper.innerHTML = '<i data-lucide="file-text" style="width: 24px; height: 24px;"></i>';
                uploadText.innerHTML = 'Document Selected <br><span style="font-size: 10px; text-decoration: underline;">Click to change</span>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                viewFullScreenBtn.style.display = 'none'; 
            }

            submitReceiptBtn.removeAttribute('disabled');
            submitReceiptBtn.style.opacity = '1';
            submitReceiptBtn.style.cursor = 'pointer';
        } else {
            fileNameDisplay.style.display = 'none';
            viewFullScreenBtn.style.display = 'none';
            
            if (fileObjUrl) {
                URL.revokeObjectURL(fileObjUrl);
            }
            
            receiptPreview.style.display = 'none';
            receiptPreview.src = '';
            uploadContent.style.display = 'flex';
            uploadBox.style.padding = '20px';
            uploadIconWrapper.innerHTML = '<i data-lucide="upload-cloud" style="width: 24px; height: 24px;"></i>';
            uploadText.innerHTML = 'Click to browse or drag file here';
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            submitReceiptBtn.setAttribute('disabled', 'true');
            submitReceiptBtn.style.opacity = '0.5';
            submitReceiptBtn.style.cursor = 'not-allowed';
        }
    });
}

if (viewFullScreenBtn) {
    viewFullScreenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fullScreenModal.classList.add('show');
    });
}

if (closeFullScreenBtn) {
    closeFullScreenBtn.addEventListener('click', () => {
        fullScreenModal.classList.remove('show');
    });
}

if (submitReceiptBtn) {
    submitReceiptBtn.addEventListener('click', function() {
        submitBtnText.style.display = 'none';
        submitBtnSpinner.style.display = 'inline-flex'; 
        this.setAttribute('disabled', 'true');
        
        setTimeout(() => {
            regView.style.display = 'none';
            successView.style.display = 'block';
        }, 2000);
    });
}

window.copyAccountNumber = function() {
    const accNum = document.getElementById('accNumber').textContent;
    const toast = document.getElementById('copyToast');
    
    const input = document.createElement('textarea');
    input.value = accNum;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
};

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
    if (e.target === fullScreenModal) {
        fullScreenModal.classList.remove('show');
    }
});