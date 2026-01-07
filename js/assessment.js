/**
 * Assessment Form Logic
 * Multi-step form navigation, validation, and submission
 */

let currentSection = 1;
const totalSections = 3;
let formData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupEventListeners();
});

/**
 * Initialize form
 */
function initializeForm() {
    updateProgress();

    // Set minimum date for preferred date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDateStart').setAttribute('min', today);
    document.getElementById('preferredDateEnd').setAttribute('min', today);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Photo upload preview
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }

    // Preferred gender "other" option
    const preferredGenderRadios = document.querySelectorAll('input[name="preferredGender"]');
    preferredGenderRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            const otherInput = document.getElementById('preferredGenderOther');
            if (this.value === 'other') {
                otherInput.style.display = 'block';
                otherInput.required = true;
            } else {
                otherInput.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            }
        });
    });

    // Form submission
    const form = document.getElementById('assessmentForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

/**
 * Navigate to next section
 */
function nextSection(sectionNumber) {
    // Validate current section before moving forward
    if (!validateSection(currentSection)) {
        return;
    }

    // Save current section data
    saveCurrentSectionData();

    // Hide current section
    document.getElementById(`section${currentSection}`).classList.remove('active');

    // Mark current step as completed
    const currentStep = document.querySelector(`.progress-step[data-step="${currentSection}"]`);
    if (currentStep) {
        currentStep.classList.add('completed');
        currentStep.classList.remove('active');
    }

    // Show next section
    currentSection = sectionNumber;
    document.getElementById(`section${currentSection}`).classList.add('active');

    // Update progress
    const nextStep = document.querySelector(`.progress-step[data-step="${currentSection}"]`);
    if (nextStep) {
        nextStep.classList.add('active');
    }

    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Navigate to previous section
 */
function previousSection(sectionNumber) {
    // Save current section data
    saveCurrentSectionData();

    // Hide current section
    document.getElementById(`section${currentSection}`).classList.remove('active');

    // Remove active from current step
    const currentStep = document.querySelector(`.progress-step[data-step="${currentSection}"]`);
    if (currentStep) {
        currentStep.classList.remove('active');
    }

    // Show previous section
    currentSection = sectionNumber;
    document.getElementById(`section${currentSection}`).classList.add('active');

    // Update progress
    const prevStep = document.querySelector(`.progress-step[data-step="${currentSection}"]`);
    if (prevStep) {
        prevStep.classList.add('active');
    }

    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentSection / totalSections) * 100;
    progressFill.style.width = `${percentage}%`;
}

/**
 * Validate current section
 */
function validateSection(sectionNum) {
    const section = document.getElementById(`section${sectionNum}`);
    const inputs = section.querySelectorAll('input[required], textarea[required]');

    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--color-primary)';

            // Remove highlight after 2 seconds
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });

    // Check radio buttons
    const radioGroups = section.querySelectorAll('input[type="radio"][required]');
    const radioNames = new Set();
    radioGroups.forEach(radio => radioNames.add(radio.name));

    radioNames.forEach(name => {
        const checked = section.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
            isValid = false;
            const radioGroup = section.querySelector(`input[name="${name}"]`).closest('.form-group');
            if (radioGroup) {
                radioGroup.style.borderLeft = '3px solid var(--color-primary)';
                setTimeout(() => {
                    radioGroup.style.borderLeft = '';
                }, 2000);
            }
        }
    });

    // Check checkbox groups (for weekday preferences)
    const checkboxGroups = section.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach(group => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        const isAnyChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        if (!isAnyChecked && checkboxes.length > 0) {
            isValid = false;
            const formGroup = group.closest('.form-group');
            if (formGroup) {
                formGroup.style.borderLeft = '3px solid var(--color-primary)';
                setTimeout(() => {
                    formGroup.style.borderLeft = '';
                }, 2000);
            }
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }

    return isValid;
}

/**
 * Save current section data
 */
function saveCurrentSectionData() {
    const section = document.getElementById(`section${currentSection}`);
    const inputs = section.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else if (input.type === 'checkbox') {
            // Handle checkbox groups (like weekday preferences)
            if (!formData[input.name]) {
                formData[input.name] = [];
            }
            if (input.checked) {
                formData[input.name].push(input.value);
            }
        } else if (input.type === 'file') {
            // File will be handled separately during submission
        } else {
            formData[input.name] = input.value;
        }
    });
}

/**
 * Handle photo upload
 */
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    const fileLabel = event.target.nextElementSibling;

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, or WEBP)');
        event.target.value = '';
        return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        event.target.value = '';
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
        preview.innerHTML = `
            <img src="${e.target.result}" alt="Photo preview">
            <div class="file-preview-info">
                ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
        `;
        preview.classList.add('active');

        // Update file label
        fileLabel.querySelector('.file-text').textContent = 'Photo selected ✓';
    };
    reader.readAsDataURL(file);
}

async function handleSubmit(event) {
    event.preventDefault();

    // Validate final section
    if (!validateSection(currentSection)) {
        return;
    }

    // Save final section data
    saveCurrentSectionData();

    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // Get Firebase database (already initialized by firebase-config.js)
        const db = window.FirebaseDB.getDB();

        if (!db) {
            throw new Error('Firebase not initialized. Please refresh the page.');
        }

        // Get photo file
        const photoInput = document.getElementById('photo');
        const photoFile = photoInput.files[0];

        // Convert photo to base64
        let photoData = null;
        if (photoFile) {
            photoData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(photoFile);
            });
        }

        // Prepare submission data
        const submission = {
            ...formData,
            photoFileName: photoFile ? photoFile.name : null,
            photoFileSize: photoFile ? photoFile.size : null,
            photoData: photoData,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        };

        // Save to Firestore
        await db.collection('submissions').add(submission);

        console.log('✅ Submission saved to Firebase successfully!');

        // Hide form sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show success message
        document.getElementById('successSection').style.display = 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('❌ Submission error:', error);
        alert('There was an error submitting your assessment. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Initiate It';
    }
}

// Make functions globally available
window.nextSection = nextSection;
window.previousSection = previousSection;
