// js/auth.js - Autenticação Supabase (VERSÃO CORRIGIDA)
const supabaseUrl = 'https://pcoiecuuwkrzrfptmkcu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2llY3V1d2tyenJmcHRta2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYxMDksImV4cCI6MjA5MjI3MjEwOX0.-39TA3dCE8xpYiZtcuYobUR2hXiAcGzF2vVK9IXSr0U';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Login via Magic Link
async function handleEmailLogin() {
    const emailInput = document.getElementById('userEmail');
    const termsCheck = document.getElementById('termsCheck');
    if (termsCheck && !termsCheck.checked) { alert("Aceite os termos."); return; }
    const { error } = await supabaseClient.auth.signInWithOtp({
        email: emailInput.value,
        options: { emailRedirectTo: window.location.origin + '/' }
    });
    if (error) { alert("Erro: " + error.message); return; }
    document.getElementById('inputState').style.display = 'none';
    document.getElementById('successState').style.display = 'block';
}

// Logout
async function handleLogout() {
    await supabaseClient.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Atualiza botão de login com nome do usuário
function updateLoginButton(user) {
    const firstName = user
        ? (user.user_metadata?.full_name || user.email.split('@')[0]).split(' ')[0]
        : null;

    document.querySelectorAll('a[href*="login.html"], .action-btn').forEach(link => {
        const content = link.textContent.toLowerCase();
        // Só altera o botão de Login, não o de Carrinho
        if (link.getAttribute('href')?.includes('login.html') || content.includes('login') || content.includes('log in')) {
            if (firstName) {
                // Preserva o ícone e substitui apenas o texto — sem alterar estilos
                const icon = link.querySelector('i')?.outerHTML || '<i class="ph ph-user"></i>';
                link.innerHTML = `${icon} <span>${firstName}</span>`;
                link.removeAttribute('href'); // Remove href para evitar navegação
                link.onclick = (e) => {
                    e.preventDefault();
                    if (confirm(`Sair da conta de ${firstName}?`)) handleLogout();
                };
            }
        }
    });
}

// Inicialização — espera o DOM estar pronto
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica sessão ativa via SDK v2 (método correto: onAuthStateChange sem "d")
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            await syncProfile(session.user);
            updateLoginButton(session.user);
            if (window.location.pathname.includes('login.html')) {
                window.location.href = '/';
            }
        }
    });

    // Também verifica sessão já existente ao carregar
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
        await syncProfile(session.user);
        updateLoginButton(session.user);
    }
});

// Sincroniza perfil no banco
async function syncProfile(user) {
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    try {
        await supabaseClient.from('profiles').upsert(
            { id: user.id, email: user.email, full_name: name },
            { onConflict: 'id' }
        );
    } catch (e) { console.warn("Sync falhou:", e.message); }
}

// Verifica cursos (página cursos.html)
async function checkCourseAccess(userId) {
    const { data } = await supabaseClient.from('profiles').select('courses').eq('id', userId).single();
    if (!data?.courses) return;

    const courseMap = [
        ["3155650", "pay.hotmart.com/B85068976H", "https://app-vlc.hotmart.com/products/3155650"],
        // Para adicionar novo curso: ["ID_DO_CURSO", "trecho_do_link_de_venda", "link_de_acesso"]
    ];

    courseMap.forEach(([id, saleToken, accessLink]) => {
        if (data.courses.includes(id)) {
            document.querySelectorAll(`a[href*="${saleToken}"]`).forEach(btn => {
                btn.textContent = "Acessar Curso";
                btn.style.background = 'var(--color-secondary)';
                btn.style.color = '#000';
                btn.href = accessLink;
            });
        }
    });
}
