// js/auth.js - Gerenciamento de Autenticação Supabase (E-mail / Magic Link)

const supabaseUrl = 'https://pcoiecuuwkrzrfptmkcu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2llY3V1d2tyenJmcHRta2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYxMDksImV4cCI6MjA5MjI3MjEwOX0.-39TA3dCE8xpYiZtcuYobUR2hXiAcGzF2vVK9IXSr0U';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Função para lidar com o login por E-mail (Magic Link)
 */
async function handleEmailLogin() {
    const emailInput = document.getElementById('userEmail');
    const termsCheck = document.getElementById('termsCheck');
    const errorMsg = document.getElementById('errorMsg');
    const inputState = document.getElementById('inputState');
    const successState = document.getElementById('successState');

    if (termsCheck && !termsCheck.checked) {
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }

    if (!emailInput || !emailInput.value) {
        alert("Por favor, digite seu e-mail.");
        return;
    }

    if (errorMsg) errorMsg.style.display = 'none';

    // Desativar botão para evitar cliques múltiplos
    const btn = document.querySelector('#inputState button');
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Enviando...";
    }

    const { data, error } = await supabaseClient.auth.signInWithOtp({
        email: emailInput.value,
        options: {
            emailRedirectTo: window.location.origin + '/'
        }
    });

    if (error) {
        console.error("Erro no login:", error.message);
        alert("Erro ao enviar link: " + error.message);
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Enviar Link de Acesso";
        }
    } else {
        if (inputState) inputState.style.display = 'none';
        if (successState) successState.style.display = 'block';
    }
}

/**
 * Função para Logout
 */
async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        localStorage.removeItem('fnz_user');
        window.location.href = 'index.html';
    } else {
        console.error("Erro ao sair:", error);
    }
}

/**
 * Observador de estado de autenticação
 */
supabaseClient.auth.onAuthStateChanged((event, session) => {
    const user = session?.user;
    if (user) {
        localStorage.setItem('fnz_user', 'true');
        syncUserProfile(user);
        startUIProtection(user);
        
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    } else {
        localStorage.removeItem('fnz_user');
    }
});

// Forçar captura de sessão no carregamento
window.addEventListener('load', async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) {
        startUIProtection(data.session.user);
    }
});

/**
 * Mantém a UI atualizada com o nome do usuário, combatendo scripts de tradução/redirecionamento
 */
function startUIProtection(user) {
    if (!user) return;
    
    // Executa imediatamente
    updateUI(user);
    
    // Repete a cada 500ms pelos primeiros 5 segundos para garantir que o nome "vença"
    let attempts = 0;
    const interval = setInterval(() => {
        updateUI(user);
        attempts++;
        if (attempts > 10) clearInterval(interval);
    }, 500);
}

/**
 * Sincroniza dados do usuário logado na tabela 'profiles'
 */
async function syncUserProfile(user) {
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    const avatar = user.user_metadata?.avatar_url || "";

    const { error } = await supabaseClient
        .from('profiles')
        .upsert({ 
            id: user.id, 
            email: user.email, 
            full_name: name,
            avatar_url: avatar,
            updated_at: new Date()
        }, { onConflict: 'id' });
    
    if (error) console.error("Erro ao sincronizar perfil:", error.message);
}

/**
 * Atualiza elementos da interface com base no estado do usuário
 */
function updateUI(user) {
    if (!user) return;

    // Procura todos os botões que levam para a página de login ou têm a classe action-btn
    const authElements = document.querySelectorAll('.action-btn, a[href*="login.html"]');
    
    authElements.forEach(btn => {
        const span = btn.querySelector('span') || btn;
        const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
        const firstName = displayName.split(' ')[0];

        // Só atualiza se ainda não estiver com o nome ou se for um botão de login
        if (span.textContent.trim() === 'Login' || span.getAttribute('data-pt') === 'Login' || btn.getAttribute('href') === 'login.html') {
            btn.setAttribute('href', '#');
            span.textContent = firstName;
            
            // Remove atributos de tradução para que o i18n não mude de volta
            span.removeAttribute('data-pt');
            span.removeAttribute('data-en');
            
            // Adiciona evento de logout se não tiver
            if (btn.id !== 'logout-trigger') {
                btn.id = 'logout-trigger';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Deseja sair da sua conta?')) handleLogout();
                });
            }
        }
    });

    if (window.location.pathname.includes('cursos.html')) {
        updateCourseButtons(user);
    }
}

/**
 * Verifica acesso a cursos específicos na tabela 'profiles'
 */
async function updateCourseButtons(user) {
    if (!user) return;
    const socialMasterId = "3155650";
    const { data } = await supabaseClient
        .from('profiles')
        .select('courses')
        .eq('id', user.id)
        .single();
    
    if (data && data.courses && data.courses.includes(socialMasterId)) {
        const buyBtns = document.querySelectorAll(`a[href*="pay.hotmart.com/B85068976H"]`);
        buyBtns.forEach(btn => {
            btn.textContent = "Acessar Curso";
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
            btn.style.backgroundColor = 'var(--color-secondary)';
            btn.style.color = '#000';
            btn.href = "https://app-vlc.hotmart.com/products/3155650";
        });
    }
}
