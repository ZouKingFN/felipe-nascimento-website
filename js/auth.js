// js/auth.js - TESTE DE CARREGAMENTO
const supabaseUrl = 'https://pcoiecuuwkrzrfptmkcu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2llY3V1d2tyenJmcHRta2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYxMDksImV4cCI6MjA5MjI3MjEwOX0.-39TA3dCE8xpYiZtcuYobUR2hXiAcGzF2vVK9IXSr0U';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log("SCRIPT AUTH CARREGADO COM SUCESSO!");

async function handleEmailLogin() {
    const emailInput = document.getElementById('userEmail');
    const termsCheck = document.getElementById('termsCheck');
    if (termsCheck && !termsCheck.checked) { alert("Aceite os termos."); return; }
    await supabaseClient.auth.signInWithOtp({ email: emailInput.value, options: { emailRedirectTo: window.location.origin + '/' } });
    document.getElementById('inputState').style.display = 'none';
    document.getElementById('successState').style.display = 'block';
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

supabaseClient.auth.onAuthStateChanged(async (event, session) => {
    if (session?.user) {
        console.log("SESSAO ATIVA PARA:", session.user.email);
        updateUI(session.user);
    }
});

function updateUI(user) {
    const links = document.querySelectorAll('a[href*="login.html"], .action-btn');
    links.forEach(link => {
        const span = link.querySelector('span') || link;
        if (user) {
            span.textContent = user.email.split('@')[0];
            link.href = "#";
            link.onclick = (e) => { e.preventDefault(); handleLogout(); };
        } else {
            // Se não estiver logado, vamos mudar para TESTE só para saber se o script rodou
            span.textContent = "TESTE OK";
        }
    });
}

window.addEventListener('load', async () => {
    const { data } = await supabaseClient.auth.getSession();
    updateUI(data?.session?.user || null);
});
