// Gerenciamento de animações e efeitos visuais

// Configurar efeitos de scroll
function setupScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.product-card, .feature, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animações na entrada da página
function animateOnScroll() {
    const elements = document.querySelectorAll('.hero-content > *');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Aplicar debounce ao scroll para otimização
function setupScrollOptimization() {
    const debouncedScrollHandler = window.debounce(window.handleHeaderScroll, 10);
    window.addEventListener('scroll', debouncedScrollHandler);
}

// Exportar funções
window.setupScrollEffects = setupScrollEffects;
window.animateOnScroll = animateOnScroll;
window.setupScrollOptimization = setupScrollOptimization;
