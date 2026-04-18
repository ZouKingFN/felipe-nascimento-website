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
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    } // Fim de verificações Lenis

    // Nota: A lógica de tradução PT<->EN agora está em js/i18n.js

});

document.addEventListener('DOMContentLoaded', () => {
    // Destacar o menu atual (corrigido para funcionar com/sem .html)
    let currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath.endsWith('index.html')) currentPath = 'index.html';
    
    document.querySelectorAll('.desktop-menu a, .fullscreen-menu a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return;
        
        const cleanHref = linkHref.replace('.html', '');
        const cleanPath = currentPath.replace('.html', '');
        
        if (cleanPath.endsWith(cleanHref) || (cleanPath === '/' && linkHref === 'index.html')) {
            link.style.color = 'var(--color-secondary)';
            link.style.fontWeight = 'bold';
            link.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
        }
    });

    // Estado do Login
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

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 500); // 500ms delay for a better premium feeling
    }
});

// FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
