/**
 * Admin Portal Logic
 * Clerk authentication with submission management
 */

let allSubmissions = [];
let filteredSubmissions = [];

// Note: Authentication is handled by Clerk (see admin.html)
// This file only handles the dashboard functionality after successful authentication

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin dashboard initialized');
    // Clerk handles authentication - loadSubmissions will be called from admin.html after auth
});

/**
 * Load submissions from Firebase Firestore
 */
async function loadSubmissions() {
    try {
        // Get Firebase database (already initialized by firebase-config.js)
        const db = window.FirebaseDB.getDB();

        if (!db) {
            throw new Error('Firebase not initialized');
        }

        // Get all submissions from Firestore
        const snapshot = await db.collection('submissions')
            .orderBy('submittedAt', 'desc')
            .get();

        // Convert to array
        allSubmissions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamp to ISO string
            submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || doc.data().submittedAt
        }));

        filteredSubmissions = [...allSubmissions];

        console.log(`✅ Loaded ${allSubmissions.length} submissions from Firebase`);

        updateStats();
        displaySubmissions();
    } catch (error) {
        console.error('❌ Error loading submissions:', error);
        // Fallback to localStorage if Firebase fails
        allSubmissions = JSON.parse(localStorage.getItem('celestral_submissions') || '[]');
        filteredSubmissions = [...allSubmissions];
        updateStats();
        displaySubmissions();
    }
}

/**
 * Refresh data
 */
function refreshData() {
    loadSubmissions();
}

/**
 * Update statistics
 */
function updateStats() {
    const total = allSubmissions.length;
    const pending = allSubmissions.filter(s => s.status === 'pending').length;

    document.getElementById('totalSubmissions').textContent = total;
    document.getElementById('pendingSubmissions').textContent = pending;
}

/**
 * Filter submissions
 */
function filterSubmissions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const genderFilter = document.getElementById('genderFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredSubmissions = allSubmissions.filter(submission => {
        // Search filter
        const matchesSearch = !searchTerm ||
            submission.fullName?.toLowerCase().includes(searchTerm) ||
            submission.email?.toLowerCase().includes(searchTerm) ||
            submission.location?.toLowerCase().includes(searchTerm);

        // Gender filter
        const matchesGender = !genderFilter || submission.gender === genderFilter;

        // Status filter
        const matchesStatus = !statusFilter || submission.status === statusFilter;

        return matchesSearch && matchesGender && matchesStatus;
    });

    displaySubmissions();
}

/**
 * Display submissions
 */
function displaySubmissions() {
    const container = document.getElementById('submissionsTable');
    const emptyState = document.getElementById('emptyState');

    if (filteredSubmissions.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = filteredSubmissions.map((submission, index) => `
        <div class="submission-card" onclick="viewSubmission(${allSubmissions.indexOf(submission)})">
            <div class="submission-header">
                <div class="submission-name">${submission.fullName || 'N/A'}</div>
                <div class="submission-badge ${submission.status || 'pending'}">
                    ${submission.status || 'pending'}
                </div>
            </div>
            <div class="submission-info">
                <div class="info-item">
                    <div class="info-label">Gender</div>
                    <div class="info-value">${submission.gender || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Age</div>
                    <div class="info-value">${submission.age || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Location</div>
                    <div class="info-value">${submission.location || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${submission.email || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Contact</div>
                    <div class="info-value">${submission.contactNumber || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Submitted</div>
                    <div class="info-value">${formatDate(submission.submittedAt)}</div>
                </div>
            </div>
            <div class="submission-actions" onclick="event.stopPropagation()">
                <button class="btn-action" onclick="viewSubmission(${allSubmissions.indexOf(submission)})">
                    👁️ View Details
                </button>
                <button class="btn-action delete" onclick="deleteSubmission(${allSubmissions.indexOf(submission)})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Delete submission
 */
function deleteSubmission(index) {
    const submission = allSubmissions[index];

    // Confirm deletion
    const confirmDelete = confirm(
        `Are you sure you want to delete this submission?\n\n` +
        `Name: ${submission.fullName}\n` +
        `Email: ${submission.email}\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmDelete) {
        return;
    }

    // Remove from array
    allSubmissions.splice(index, 1);

    // Update localStorage
    localStorage.setItem('celestral_submissions', JSON.stringify(allSubmissions));

    // Refresh display
    loadSubmissions();

    // Show success message
    alert('Submission deleted successfully!');
}

/**
 * View submission details
 */
function viewSubmission(index) {
    const submission = allSubmissions[index];
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <!-- Section 1: Personal Information -->
        <div class="modal-section">
            <h3 class="modal-section-title">Personal Information</h3>
            
            <div class="modal-field">
                <div class="modal-field-label">Full Name</div>
                <div class="modal-field-value">${submission.fullName || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Gender</div>
                <div class="modal-field-value">${submission.gender || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Age</div>
                <div class="modal-field-value">${submission.age || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Height</div>
                <div class="modal-field-value">${submission.height || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Location</div>
                <div class="modal-field-value">${submission.location || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Email</div>
                <div class="modal-field-value">${submission.email || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Contact Number (WhatsApp)</div>
                <div class="modal-field-value">${submission.contactNumber || 'N/A'}</div>
            </div>
            
            ${submission.photoData ? `
                <div class="modal-field">
                    <div class="modal-field-label">Photo</div>
                    <img src="${submission.photoData}" alt="User photo" class="modal-photo">
                </div>
            ` : ''}
        </div>
        
        <!-- Section 2: Questionnaire -->
        <div class="modal-section">
            <h3 class="modal-section-title">Questionnaire Responses</h3>
            
            <div class="modal-field">
                <div class="modal-field-label">1. Have you ever been on a date?</div>
                <div class="modal-field-value">${submission.question1 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">2. What was the best gift you ever got?</div>
                <div class="modal-field-value">${submission.question2 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">3. Tell me about the best day of your life?</div>
                <div class="modal-field-value">${submission.question3 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">4. What's the most heart-warming thing someone can do for you?</div>
                <div class="modal-field-value">${submission.question4 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">5. You are an absolute angel and princess/prince, what can be done to make you feel that?</div>
                <div class="modal-field-value">${submission.question5 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">6. What's the best way you ever thought someone could get treated?</div>
                <div class="modal-field-value">${submission.question6 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">7. What are the most interesting things you do to pass or kill your time?</div>
                <div class="modal-field-value">${submission.question7 || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">8. If you wanna show that you are the craziest person in the room, what will you do to prove that?</div>
                <div class="modal-field-value">${submission.question8 || 'N/A'}</div>
            </div>
        </div>
        
        <!-- Section 3: Preferences -->
        <div class="modal-section">
            <h3 class="modal-section-title">Date Preferences</h3>
            
            <div class="modal-field">
                <div class="modal-field-label">Date Code Name</div>
                <div class="modal-field-value">${submission.dateCodeName || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Preferred Gender</div>
                <div class="modal-field-value">${submission.preferredGender || 'N/A'}${submission.preferredGenderOther ? ` (${submission.preferredGenderOther})` : ''}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Preferred Height Range</div>
                <div class="modal-field-value">${submission.preferredHeightMin || 'N/A'} to ${submission.preferredHeightMax || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Preferred Age Range</div>
                <div class="modal-field-value">${submission.preferredAgeMin || 'N/A'} to ${submission.preferredAgeMax || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Preferred Date Range</div>
                <div class="modal-field-value">${formatDate(submission.preferredDateStart)} to ${formatDate(submission.preferredDateEnd)}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Preferred Time Range</div>
                <div class="modal-field-value">${submission.preferredTimeStart || 'N/A'} to ${submission.preferredTimeEnd || 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Preferred Weekdays</div>
                <div class="modal-field-value">${submission.preferredWeekdays && Array.isArray(submission.preferredWeekdays) ? submission.preferredWeekdays.join(', ') : 'N/A'}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Expectations or Demands</div>
                <div class="modal-field-value">${submission.expectations || 'N/A'}</div>
            </div>
        </div>
        
        <!-- Metadata -->
        <div class="modal-section">
            <h3 class="modal-section-title">Submission Info</h3>
            
            <div class="modal-field">
                <div class="modal-field-label">Submitted At</div>
                <div class="modal-field-value">${formatDateTime(submission.submittedAt)}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label">Status</div>
                <div class="modal-field-value">
                    <span class="submission-badge ${submission.status || 'pending'}">
                        ${submission.status || 'pending'}
                    </span>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');

    // Store current index for delete button
    modal.dataset.currentIndex = index;
}

/**
 * Close modal
 */
function closeModal(event) {
    const modal = document.getElementById('detailModal');

    // Close if clicking outside modal content or on close button
    if (!event || event.target === modal || event.type === 'click') {
        modal.classList.remove('active');
        delete modal.dataset.currentIndex;
    }
}

/**
 * Delete from modal
 */
function deleteFromModal() {
    const modal = document.getElementById('detailModal');
    const index = parseInt(modal.dataset.currentIndex);

    if (index >= 0) {
        closeModal();
        deleteSubmission(index);
    }
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format date and time
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make functions globally available
window.handleLogin = handleLogin;
window.handleSignOut = handleSignOut;
window.filterSubmissions = filterSubmissions;
window.refreshData = refreshData;
window.viewSubmission = viewSubmission;
window.closeModal = closeModal;
window.deleteSubmission = deleteSubmission;
window.deleteFromModal = deleteFromModal;
