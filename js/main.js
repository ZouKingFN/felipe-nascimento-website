document.addEventListener('DOMContentLoaded', () => {
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

    // Floating WhatsApp Widget
    const waFloat = document.createElement('a');
    waFloat.href = 'https://w.app/xwniez';
    waFloat.target = '_blank';
    waFloat.className = 'whatsapp-float';
    waFloat.innerHTML = '<i class="ph-fill ph-whatsapp-logo"></i>';
    document.body.appendChild(waFloat);
});
