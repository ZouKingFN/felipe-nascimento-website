document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    
    if (menuToggle && fullscreenMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            fullscreenMenu.classList.toggle('open');
            // Prevent body scroll when menu is open
            document.body.style.overflow = fullscreenMenu.classList.contains('open') ? 'hidden' : '';
        
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
});
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    
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
});

    // Intersection Observer for scroll animations (fade in elements)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        
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
});
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));

    // Initialize premium smooth scrolling (Lenis)
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false, // Maintain native touch behavior on mobile
        
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
});

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    } // Fim de verificações Lenis

    // Nota: A lógica de tradução PT<->EN agora está em js/i18n.js


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
});
