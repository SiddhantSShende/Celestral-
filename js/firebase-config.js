/**
 * Firebase Configuration
 * Cloud database and storage for Celestral
 */

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1bjJXkKLG0dImuT8jtNYQZhfwW1ghm24",
    authDomain: "celestral-3c102.firebaseapp.com",
    projectId: "celestral-3c102",
    storageBucket: "celestral-3c102.firebasestorage.app",
    messagingSenderId: "711727177592",
    appId: "1:711727177592:web:e7662a23b2b7643b2c328d",
    measurementId: "G-ETJEW3GKM5"
};

// Initialize Firebase (will be done after loading Firebase SDK)
let db = null;
let storage = null;

// Function to initialize Firebase
function initializeFirebase() {
    try {
        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);

        // Initialize Firestore
        db = firebase.firestore();

        // Initialize Storage (optional, for future use)
        // storage = firebase.storage();

        console.log('✅ Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        return false;
    }
}

// Export for use in other files
window.FirebaseDB = {
    getDB: () => db,
    getStorage: () => storage,
    initialize: initializeFirebase
};

// Auto-initialize Firebase when script loads
document.addEventListener('DOMContentLoaded', function () {
    if (!db) {
        initializeFirebase();
    }
});
