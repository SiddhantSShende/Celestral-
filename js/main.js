/**
 * Main JavaScript Entry Point
 * Initializes all modules and coordinates functionality
 */

// Import all modules
import * as animations from './animations.js';
import * as navigation from './navigation.js';
import * as interactions from './interactions.js';

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

/**
 * Global unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

/**
 * Utility: Debounce function
 * Limits the rate at which a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 * Ensures a function is called at most once in a specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);

        // Log DOM content loaded time
        const domLoadTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        console.log(`DOM loaded in ${domLoadTime}ms`);
    });
}

/**
 * Initialize all modules
 */
function init() {
    console.log('🚀 Celestral website initializing...');

    // Check for reduced motion preference
    if (prefersReducedMotion()) {
        console.log('⚠️ Reduced motion preference detected - animations will be minimal');
    }

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Initialize all modules
    try {
        animations.init();
        navigation.init();
        interactions.init();

        console.log('✅ All modules initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing modules:', error);
    }

    // Log browser info
    console.log(`Browser: ${navigator.userAgent}`);
    console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
}

/**
 * Start initialization when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}

/**
 * Handle window resize (debounced)
 */
const handleResize = debounce(() => {
    console.log(`Viewport resized: ${window.innerWidth}x${window.innerHeight}`);
    // Add any resize-specific logic here
}, 250);

window.addEventListener('resize', handleResize);

/**
 * Handle visibility change (tab switching)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Tab hidden');
    } else {
        console.log('Tab visible');
    }
});

/**
 * Export utilities for use in other modules
 */
export { init };
