// js/auth.js - Gerenciamento de Autenticação Supabase (E-mail / Magic Link)

const supabaseUrl = 'https://pcoiecuuwkrzrfptmkcu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2llY3V1d2tyenJmcHRta2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYxMDksImV4cCI6MjA5MjI3MjEwOX0.-39TA3dCE8xpYiZtcuYobUR2hXiAcGzF2vVK9IXSr0U';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Função para lidar com o login por E-mail (Magic Link)
 */
async function handleEmailLogin() {
    const emailInput = document.getElementById('userEmail');
    const termsCheck = document.getElementById('termsCheck');
    const errorMsg = document.getElementById('errorMsg');

    if (termsCheck && !termsCheck.checked) {
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }

    if (!emailInput || !emailInput.value) {
        alert("Por favor, digite seu e-mail.");
        return;
    }

    if (errorMsg) errorMsg.style.display = 'none';

    const { data, error } = await supabase.auth.signInWithOtp({
        email: emailInput.value,
        options: {
            emailRedirectTo: window.location.href.replace('login.html', 'index.html')
        }
    });

    if (error) {
        console.error("Erro no login:", error.message);
        alert("Erro ao enviar link: " + error.message);
    } else {
        alert("Sucesso! Verifique sua caixa de entrada. Enviamos um link de acesso para " + emailInput.value);
    }
}

/**
 * Função para Logout
 */
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
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
supabase.auth.onAuthStateChanged((event, session) => {
    const user = session?.user;
    updateUI(user);
    
    if (user) {
        localStorage.setItem('fnz_user', 'true');
        syncUserProfile(user);
    } else {
        localStorage.removeItem('fnz_user');
    }
});

/**
 * Sincroniza dados do usuário logado na tabela 'profiles'
 */
async function syncUserProfile(user) {
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    const avatar = user.user_metadata?.avatar_url || "";

    const { error } = await supabase
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
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        const span = btn.querySelector('span');
        if (!span) return;

        const isLoginBtn = span.getAttribute('data-pt') === 'Login' || span.textContent.trim() === 'Login' || btn.getAttribute('href') === 'login.html';

        if (user && isLoginBtn) {
            btn.setAttribute('href', '#');
            const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
            span.textContent = displayName.split(' ')[0];
            span.removeAttribute('data-pt');
            span.removeAttribute('data-en');
            
            if (!document.getElementById('logout-trigger')) {
                btn.id = 'logout-trigger';
                btn.title = 'Clique para sair';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Deseja sair da sua conta?')) {
                        handleLogout();
                    }
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
    
    const { data, error } = await supabase
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
