$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# 1. Update all HTML files (menu translations, google translate remove, padding, domain)
$replacementsMenu = [ordered]@{
    '<li><a href="index.html">Início</a></li>' = '<li><a href="index.html" data-pt="Início" data-en="Home">Início</a></li>'
    '<li><a href="cursos.html">Cursos</a></li>' = '<li><a href="cursos.html" data-pt="Cursos" data-en="Courses">Cursos</a></li>'
    '<li><a href="loja.html">Loja</a></li>' = '<li><a href="loja.html" data-pt="Loja" data-en="Store">Loja</a></li>'
    '<li><a href="aulas.html">Aulas Particulares</a></li>' = '<li><a href="aulas.html" data-pt="Aulas Particulares" data-en="Private Lessons">Aulas Particulares</a></li>'
    '<li><a href="dj.html">Sets de DJ</a></li>' = '<li><a href="dj.html" data-pt="Sets de DJ" data-en="DJ Sets">Sets de DJ</a></li>'
    '<li><a href="sobre.html">Sobre</a></li>' = '<li><a href="sobre.html" data-pt="Sobre" data-en="About">Sobre</a></li>'
    '<li><a href="contrate-me.html" style="color: var(--color-secondary); font-weight: 800;">Contrate-me</a></li>' = '<li><a href="contrate-me.html" style="color: var(--color-secondary); font-weight: 800;" data-pt="Contrate-me" data-en="Hire Me">Contrate-me</a></li>'
    '<a href="login.html" class="action-btn"><i class="ph ph-user"></i> <span>Login</span></a>' = '<a href="login.html" class="action-btn"><i class="ph ph-user"></i> <span data-pt="Login" data-en="Log In">Login</span></a>'
    '<a href="#" class="action-btn"><i class="ph ph-shopping-cart"></i> <span>Cart</span></a>' = '<a href="#" class="action-btn"><i class="ph ph-shopping-cart"></i> <span data-pt="Carrinho" data-en="Cart">Cart</span></a>'
}

$googleTranslateRegex = '(?s)<!-- Google Translate Widget \(Oculto\) -->.*?cb=googleTranslateElementInit"></script>'

Get-ChildItem -Filter *.html | ForEach-Object {
    $content = [IO.File]::ReadAllText($_.FullName, $utf8NoBom)
    $modified = $false
    
    foreach ($k in $replacementsMenu.Keys) {
        if ($content.Contains($k)) {
            $content = $content.Replace($k, $replacementsMenu[$k])
            $modified = $true
        }
    }
    
    if ($content -match $googleTranslateRegex) {
        $content = [Text.RegularExpressions.Regex]::Replace($content, $googleTranslateRegex, '')
        $modified = $true
    }
    
    if ($content.Contains('padding-top: 10rem;')) {
        $content = $content.Replace('padding-top: 10rem;', 'padding-top: 7rem;')
        $modified = $true
    }
    
    if ($content.Contains('felipenascimento.com.br')) {
        $content = $content.Replace('felipenascimento.com.br', 'fnzouk.com.br')
        $modified = $true
    }
    
    if ($_.Name -eq 'index.html' -and $content.Contains('poster="assets/felipe.jpeg"')) {
        $content = $content.Replace('poster="assets/felipe.jpeg"', '')
        $modified = $true
    }

    if ($modified) {
        [IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
    }
}

# 2. Add Swiper to index.html
$index = [IO.File]::ReadAllText("index.html", $utf8NoBom)
$index = $index.Replace('</head>', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
</head>')

$swiperScript = @"
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var swiper = new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: { delay: 3000, disableOnInteraction: true },
                breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
                grabCursor: true
            });
        });
    </script>
</body>
"@
$index = $index.Replace('</body>', $swiperScript)

$newTestimonials = @"
    <!-- Testimonials Section -->
    <section class="section section-light-alt" style="overflow: hidden;">
        <div class="container fade-in-section">
            <h2 style="text-align: center; color: var(--color-secondary); margin-bottom: 3rem;" data-pt="O que dizem os alunos" data-en="Student Testimonials">O que dizem os alunos</h2>
            <div class="swiper mySwiper" style="padding-bottom: 2rem;">
                <div class="swiper-wrapper">
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"As aulas do Felipe mudaram completamente a minha conexão na dança."</p><span class="testimonial-author">@aluno_exemplo_1</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Incrível como a técnica da Lambada é explicada de forma simples e visceral."</p><span class="testimonial-author">@aluno_exemplo_2</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Além de um professor incrível, o Felipe é um DJ que entende a pista."</p><span class="testimonial-author">@aluno_exemplo_3</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Uma experiência transformadora para a minha dança!"</p><span class="testimonial-author">@aluno_4</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Aulas muito dinâmicas e focadas na essência do movimento."</p><span class="testimonial-author">@aluno_5</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Didática impecável, super recomendo os cursos online."</p><span class="testimonial-author">@aluno_6</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Melhorei muito a minha musicalidade só acompanhando os sets."</p><span class="testimonial-author">@aluno_7</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Melhor investimento que fiz para a minha evolução na dança."</p><span class="testimonial-author">@aluno_8</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Atenção aos detalhes que fazem toda a diferença."</p><span class="testimonial-author">@aluno_9</span></div></div>
                    <div class="swiper-slide"><div class="testimonial-card"><p class="testimonial-text">"Mudei minha percepção sobre condução e resposta na dança a dois."</p><span class="testimonial-author">@aluno_10</span></div></div>
                </div>
            </div>
        </div>
    </section>

"@
$index = [Text.RegularExpressions.Regex]::Replace($index, '(?s)<!-- Testimonials Section -->.*?<!-- Footer -->', $newTestimonials + '    <!-- Footer -->')
[IO.File]::WriteAllText("index.html", $index, $utf8NoBom)

# 3. Update login.html logic
$login = [IO.File]::ReadAllText("login.html", $utf8NoBom)
$login = [Text.RegularExpressions.Regex]::Replace($login, "(?s)let msg.*alert\(msg\);", "localStorage.setItem('fnz_user', 'true'); window.location.href = 'index.html';")
[IO.File]::WriteAllText("login.html", $login, $utf8NoBom)

# 4. Update main.js
$mainjs = [IO.File]::ReadAllText("js/main.js", $utf8NoBom)
$jsappend = @"

    // Destacar o menu atual
    const paths = window.location.pathname.split('/');
    let currentPage = paths[paths.length - 1];
    if (!currentPage || currentPage === '') currentPage = 'index.html';
    
    document.querySelectorAll('.desktop-menu a, .fullscreen-menu a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.style.color = 'var(--color-secondary)';
        }
    });

    // Estado de Login
    if (localStorage.getItem('fnz_user') === 'true') {
        document.querySelectorAll('.action-btn').forEach(btn => {
            if (btn.getAttribute('href') === 'login.html') {
                btn.setAttribute('href', 'index.html');
                const span = btn.querySelector('span');
                if (span) {
                    span.textContent = 'Meu Perfil';
                    span.removeAttribute('data-pt');
                    span.removeAttribute('data-en');
                }
            }
        });
    }
"@
$mainjs = $mainjs.Replace("});", "$jsappend`n});")
[IO.File]::WriteAllText("js/main.js", $mainjs, $utf8NoBom)
