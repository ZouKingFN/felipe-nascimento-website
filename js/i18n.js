// js/i18n.js - Native Language Redirect

document.addEventListener('DOMContentLoaded', () => {
    const isEnglishPage = window.location.pathname.includes('/en/');

    // Auto-redirect English-language browsers visiting the PT root for the first time
    if (!isEnglishPage) {
        const hasRedirected = localStorage.getItem('lang_redirected');
        if (!hasRedirected) {
            const userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (userLang.startsWith('en')) {
                localStorage.setItem('lang_redirected', 'true');
                // Redirect to the /en/ equivalent of the current page
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                window.location.href = 'en/' + (currentPage || 'index.html');
            }
        }
    }
});
