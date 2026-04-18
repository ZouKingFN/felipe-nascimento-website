// js/i18n.js - Tradução Automática Universal (Invisível)

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt', 
        includedLanguages: 'en,pt', 
        autoDisplay: false
    }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Injetar a div oculta do Google Tradutor
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);

    // 2. Injetar o script do Google Tradutor nativo
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    // 3. Detectar a linguagem atual baseada no cookie 'googtrans'
    function getCurrentLang() {
        if (document.cookie.includes('googtrans=/pt/en') || document.cookie.includes('googtrans=/auto/en')) {
            return 'EN';
        }
        return 'PT';
    }

    const currentLang = getCurrentLang();

    // 4. Configurar os botões de idioma do site
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        // Se a página estiver em PT, o botão mostra a opção de EN. 
        // Se estiver em EN, mostra a opção de voltar pra PT.
        btn.innerHTML = `<i class="ph ph-globe"></i> ${currentLang === 'EN' ? 'PT' : 'EN'}`;
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (currentLang === 'PT') {
                // Mudar para o Inglês
                document.cookie = "googtrans=/pt/en; path=/";
                document.cookie = `googtrans=/pt/en; path=/; domain=${window.location.hostname}`;
            } else {
                // Voltar para Português (limpar cookies)
                document.cookie = "googtrans=/pt/pt; path=/";
                document.cookie = `googtrans=/pt/pt; path=/; domain=${window.location.hostname}`;
                
                // Excluir os cookies para forçar o fallback natural orgânico
                document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            }
            
            // Recarregar a página para o script do Google ler o novo cookie e traduzir 100% da DOM
            window.location.reload();
        });
    });
});
