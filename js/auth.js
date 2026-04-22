// js/auth.js - GERENCIAMENTO DE AUTENTICAÇÃO (VERSÃO FINAL - ULTRA ROBUSTA)
const supabaseUrl = 'https://pcoiecuuwkrzrfptmkcu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2llY3V1d2tyenJmcHRta2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYxMDksImV4cCI6MjA5MjI3MjEwOX0.-39TA3dCE8xpYiZtcuYobUR2hXiAcGzF2vVK9IXSr0U';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 1. Diagnóstico Visual
function showDebugNotify(msg) {
    const div = document.createElement('div');
    div.style = "position:fixed; top:10px; left:50%; transform:translateX(-50%); background:gold; color:black; padding:10px 20px; border-radius:50px; z-index:99999; font-weight:bold; box-shadow:0 5px 15px rgba(0,0,0,0.5); font-size:12px;";
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

async function handleEmailLogin() {
    const emailInput = document.getElementById('userEmail');
    const termsCheck = document.getElementById('termsCheck');
    const btn = document.querySelector('#inputState button');
    
    if (termsCheck && !termsCheck.checked) { alert("Aceite os termos."); return; }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> Enviando...';
    }

    const { error } = await supabaseClient.auth.signInWithOtp({
        email: emailInput.value,
        options: { emailRedirectTo: window.location.origin + '/' }
    });

    if (error) {
        alert("Erro: " + error.message);
        if (btn) { btn.disabled = false; btn.textContent = "Enviar Link"; }
    } else {
        document.getElementById('inputState').style.display = 'none';
        document.getElementById('successState').style.display = 'block';
    }
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Escutador Global de Mudança de Estado
supabaseClient.auth.onAuthStateChanged(async (event, session) => {
    if (session?.user) {
        console.log("LOGIN DETECTADO:", session.user.email);
        localStorage.setItem('fnz_user', 'true');
        await syncUserProfile(session.user);
        forceUpdateUI(session.user);
    }
});

async function syncUserProfile(user) {
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    try {
        await supabaseClient.from('profiles').upsert({ id: user.id, email: user.email, full_name: name }, { onConflict: 'id' });
    } catch(e) {}
}

const updateAttemptLimit = 20; 
let attempts = 0;

async function forceUpdateUI(user) {
    if (!user) return;
    
    // Pegar nome
    const profile = JSON.parse(sessionStorage.getItem('fnz_profile') || '{}');
    const displayName = profile.full_name || user.user_metadata?.full_name || user.email.split('@')[0];
    const firstName = displayName.split(/[\s,]+/)[0];

    // Marcar como Logado Visualmente
    if (attempts === 0) showDebugNotify("Sessão Identificada: " + (profile.full_name || user.email));
    attempts++;

    // Localizar por HREF (O jeito mais seguro de todos)
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href') || "";
        // Se aponta para login ou tem a classe de ação ou já foi marcado por nós
        if (href.includes('login.html') || link.classList.contains('action-btn') || link.hasAttribute('data-user-id')) {
            
            // Só altera se for o botão de Login (ignora o de Carrinho se houver)
            const text = link.textContent.toLowerCase();
            if (href.includes('login.html') || text.includes('login') || text.includes('entrar') || link.hasAttribute('data-user-id')) {
                
                link.setAttribute('data-user-id', user.id); // Marca o botão para sempre sabermos que é ele
                link.href = "#";
                
                // Mantém o ícone se ele existir
                const icon = link.querySelector('i') ? link.querySelector('i').outerHTML : '<i class="ph ph-user"></i>';
                
                // Força o HTML sem dó nem piedade
                link.innerHTML = `${icon} <span>${firstName}</span>`;
                
                link.style.color = "var(--color-secondary)";
                link.style.fontWeight = "bold";

                link.onclick = (e) => {
                    e.preventDefault();
                    if (confirm(`Olá ${firstName}, deseja sair da sua conta?`)) handleLogout();
                };
            }
        }
    });

    // Buscar dados reais para refinar o nome se necessário
    if (!profile.full_name && attempts < 5) {
        const { data } = await supabaseClient.from('profiles').select('full_name, courses').eq('id', user.id).single();
        if (data) {
            sessionStorage.setItem('fnz_profile', JSON.stringify(data));
            setTimeout(() => forceUpdateUI(user), 500);
        }
    }
}

// Inicialização
window.addEventListener('load', async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session?.user) {
        forceUpdateUI(data.session.user);
    }
});

// Forçar atualização se o DOM mudar (ex: Google Translate entrando em ação)
const observer = new MutationObserver(() => {
    supabaseClient.auth.getSession().then(({data}) => {
        if (data?.session?.user) forceUpdateUI(data.session.user);
    });
});
observer.observe(document.body, { childList: true, subtree: true });
