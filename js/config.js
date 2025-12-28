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
        // For both development and production, use the same credentials
        // In a real production app, these would come from environment variables
        
        this.config = {
            adminEmail: this.getSecureValue('ADMIN_EMAIL', 'sidaeivarc@gmail.com'),
            adminPassword: this.getSecureValue('ADMIN_PASSWORD', 'Siddhant@2005'),
            appName: 'Celestral',
            appEnv: this.isDevelopment() ? 'development' : 'production'
        };
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
        
        return defaultValue;
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
