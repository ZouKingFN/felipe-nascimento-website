/**
 * i18n.js — Motor de tradução PT <-> EN
 * Funciona lendo atributos data-pt e data-en nos elementos HTML.
 * O idioma ativo é salvo no localStorage para persistir entre páginas.
 */

const I18N_KEY = 'fnz_lang';

/**
 * Aplica o idioma especificado a todos os elementos com data-pt / data-en.
 * @param {'pt'|'en'} lang
 */
function applyLang(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

    document.querySelectorAll('[data-pt]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text !== null) {
            // Preserva filhos que não sejam nós de texto (ex: ícones <i>)
            const children = Array.from(el.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
            el.textContent = text;
            // Re-insere filhos anteriores no início (ex: ícone do botão)
            children.forEach(child => el.prepend(child));
        }
    });

    // Atualiza o botão de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.innerHTML = lang === 'en'
            ? '<i class="ph ph-globe"></i> PT'
            : '<i class="ph ph-globe"></i> EN';
        btn.title = lang === 'en' ? 'Voltar para Português' : 'Translate to English';
    });
}

/**
 * Inicializa o sistema de tradução:
 * - Lê o idioma salvo no localStorage
 * - Aplica o idioma
 * - Conecta o evento de clique nos botões .lang-btn
 */
function initI18n() {
    const savedLang = localStorage.getItem(I18N_KEY) || 'pt';
    applyLang(savedLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentLang = localStorage.getItem(I18N_KEY) || 'pt';
            const newLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem(I18N_KEY, newLang);
            applyLang(newLang);
        });
    });
}

// Auto-inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
