// Manipulação de elementos DOM

// Elementos globais do DOM
let hamburger, navMenu, filterButtons, productCards, modal, modalContent, closeModal;

// Inicializar elementos do DOM
function initializeElements() {
    hamburger = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');
    filterButtons = document.querySelectorAll('.filter-btn');
    productCards = document.querySelectorAll('.product-card');
    modal = document.getElementById('productModal');
    modalContent = document.querySelector('.modal-content');
    closeModal = document.querySelector('.close');
}

// Toggle menu mobile
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Fechar menu mobile
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scrolling para links internos
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efeitos de scroll no header
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(44, 44, 44, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(44, 44, 44, 0.1)';
    }
}

// Lazy loading para imagens
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preloader (opcional)
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Exportar funções e elementos
window.initializeElements = initializeElements;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.setupSmoothScrolling = setupSmoothScrolling;
window.handleHeaderScroll = handleHeaderScroll;
window.setupLazyLoading = setupLazyLoading;
window.hidePreloader = hidePreloader;

// Exportar elementos para uso em outros módulos
window.DOMElements = {
    get hamburger() { return hamburger; },
    get navMenu() { return navMenu; },
    get filterButtons() { return filterButtons; },
    get productCards() { return productCards; },
    get modal() { return modal; },
    get modalContent() { return modalContent; },
    get closeModal() { return closeModal; }
};
