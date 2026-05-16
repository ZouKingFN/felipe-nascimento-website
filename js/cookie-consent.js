/**
 * FNZ Cookie Consent Logic
 * Handles LGPD compliant cookie management
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'fnz_cookie_consent';
        this.bannerId = 'cookie-banner';
        this.settingsModalId = 'cookie-settings-modal';
        this.init();
    }

    init() {
        if (!this.getConsent()) {
            this.showBanner();
        }
        this.setupEventListeners();
    }

    getConsent() {
        const consent = localStorage.getItem(this.cookieName);
        return consent ? JSON.parse(consent) : null;
    }

    setConsent(preferences) {
        localStorage.setItem(this.cookieName, JSON.stringify({
            ...preferences,
            timestamp: new Date().getTime()
        }));
        this.hideBanner();
        this.hideSettings();
        
        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
    }

    showBanner() {
        const banner = document.getElementById(this.bannerId);
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideBanner() {
        const banner = document.getElementById(this.bannerId);
        if (banner) {
            banner.classList.remove('show');
        }
    }

    showSettings() {
        const modal = document.getElementById(this.settingsModalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideSettings() {
        const modal = document.getElementById(this.settingsModalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'accept-all-cookies') {
                this.setConsent({ essential: true, analytics: true, marketing: true });
            } else if (e.target.id === 'reject-all-cookies') {
                this.setConsent({ essential: true, analytics: false, marketing: false });
            } else if (e.target.id === 'customize-cookies') {
                this.showSettings();
            } else if (e.target.id === 'save-cookie-settings') {
                const analytics = document.getElementById('cookie-analytics').checked;
                const marketing = document.getElementById('cookie-marketing').checked;
                this.setConsent({ essential: true, analytics, marketing });
            } else if (e.target.classList.contains('close-cookie-settings')) {
                this.hideSettings();
            }
        });
    }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fnzCookieConsent = new CookieConsent();
});
