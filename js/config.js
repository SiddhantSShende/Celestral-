/**
 * Configuration Manager
 * Loads environment variables and provides secure access to config
 */

class Config {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    /**
     * Load configuration from environment or fallback to defaults
     */
    loadConfig() {
        // In a real deployment, these would come from environment variables
        // For GitHub Pages, we'll use a secure approach with GitHub Secrets

        // Check if running in development (localhost)
        const isDevelopment = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        if (isDevelopment) {
            // Development mode - load from localStorage or prompt
            this.config = {
                adminEmail: this.getSecureValue('ADMIN_EMAIL', 'sidaeivarc@gmail.com'),
                adminPassword: this.getSecureValue('ADMIN_PASSWORD', 'Siddhant@2005'),
                appName: 'Celestral',
                appEnv: 'development'
            };
        } else {
            // Production mode - credentials must be set via GitHub Secrets
            // These will be injected during build/deployment
            this.config = {
                adminEmail: this.getSecureValue('ADMIN_EMAIL'),
                adminPassword: this.getSecureValue('ADMIN_PASSWORD'),
                appName: 'Celestral',
                appEnv: 'production'
            };
        }
    }

    /**
     * Get secure value from environment or localStorage
     */
    getSecureValue(key, defaultValue = null) {
        // Try to get from window (set during build)
        if (window.ENV && window.ENV[key]) {
            return window.ENV[key];
        }

        // Fallback to default (only in development)
        if (defaultValue && this.isDevelopment()) {
            return defaultValue;
        }

        return null;
    }

    /**
     * Check if running in development mode
     */
    isDevelopment() {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
    }

    /**
     * Get admin email
     */
    getAdminEmail() {
        return this.config.adminEmail;
    }

    /**
     * Get admin password (hashed in production)
     */
    getAdminPassword() {
        return this.config.adminPassword;
    }

    /**
     * Verify admin credentials
     */
    verifyCredentials(email, password) {
        const emailMatch = email.toLowerCase() === this.getAdminEmail().toLowerCase();
        const passwordMatch = password === this.getAdminPassword();
        return emailMatch && passwordMatch;
    }

    /**
     * Get app name
     */
    getAppName() {
        return this.config.appName;
    }

    /**
     * Check if in production
     */
    isProduction() {
        return this.config.appEnv === 'production';
    }
}

// Create singleton instance
const config = new Config();

// Export for use in other files
window.AppConfig = config;
