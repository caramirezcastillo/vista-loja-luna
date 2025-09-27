// Arquivo principal - inicialização e coordenação dos módulos

// Configurar event listeners principais
function setupEventListeners() {
    const hamburger = window.DOMElements.hamburger;
    const navMenu = window.DOMElements.navMenu;
    const filterButtons = window.DOMElements.filterButtons;

    // Menu mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', window.toggleMobileMenu);
    }

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', window.closeMobileMenu);
    });

    // Filtros de produto
    filterButtons.forEach(button => {
        button.addEventListener('click', window.handleFilterClick);
    });
}

// Inicialização principal
function initializeApp() {
    // Inicializar elementos DOM
    window.initializeElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar funcionalidades
    window.setupSmoothScrolling();
    window.setupScrollEffects();
    window.setupProductFiltering();
    window.setupModal();
    window.setupWhatsAppForm();
    window.setupScrollOptimization();
    
    // Animações de entrada
    window.animateOnScroll();
}

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Executar quando a página estiver totalmente carregada
window.addEventListener('load', function() {
    window.hidePreloader();
    window.setupLazyLoading();
});

// Exportar função de inicialização para uso externo
window.initializeApp = initializeApp;
