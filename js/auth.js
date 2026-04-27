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
    // Extrai nome curto: pega a primeira parte do email (antes de . _ - números)
    // Ex: "felipe.nascimento@..." → "felipe", "fmachadonascimento@..." → "fmachado"
    const rawName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
    const firstName = rawName
        .split(/[\s._\-+0-9]/)[0]  // pega só a primeira parte
        .substring(0, 8)           // limita a 8 caracteres
        .toLowerCase()             // deixa minúsculo para caber melhor
        || null;

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

    // Escuta mudanças de sessão (login via magic link)
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            // Atualiza o botão IMEDIATAMENTE com os dados já disponíveis
            updateLoginButton(session.user);
            // Sincroniza com o banco em segundo plano (não bloqueia a UI)
            syncProfile(session.user);
            if (window.location.pathname.includes('login.html')) {
                setTimeout(() => { window.location.href = '/'; }, 300);
            }
        }
    });

    // Verifica sessão existente ao carregar a página
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
        // Atualiza imediatamente
        updateLoginButton(session.user);
        // Sincroniza com o banco em segundo plano
        syncProfile(session.user);
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
    const { data: profile } = await supabaseClient.from('profiles').select('courses').eq('id', userId).single();
    if (!profile?.courses || profile.courses.length === 0) return;

    // 🔒 SEGURANÇA [VULN-1]: Busca links dinamicamente do banco de dados, protegidos por RLS.
    // O backend do Supabase só vai retornar a linha se o usuário possuir o curso.
    const { data: accessibleCourses, error } = await supabaseClient
        .from('course_links')
        .select('course_id, sale_token, access_link')
        .in('course_id', profile.courses);

    if (error || !accessibleCourses) {
        console.warn("Erro ao buscar links de curso:", error?.message);
        return;
    }

    accessibleCourses.forEach(({ course_id, sale_token, access_link }) => {
        document.querySelectorAll(`a[href*="${sale_token}"]`).forEach(btn => {
            btn.textContent = "Acessar Curso";
            btn.style.background = 'var(--color-secondary)';
            btn.style.color = '#000';
            btn.href = access_link;
        });
    });
}
