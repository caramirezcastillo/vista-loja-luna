// Configurações globais
const CONFIG = {
    whatsappNumber: '5511999999999', // Substitua pelo número real
    businessName: 'LUNA VISTA LOJA'
};

// Dados dos produtos
const PRODUCTS_DATA = {
    'vestido-floral': {
        name: 'Vestido Floral Elegante',
        price: 149.90,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
        description: 'Vestido floral elegante confeccionado em tecido de alta qualidade. Perfeito para ocasiões especiais, combina sofisticação e feminilidade. Modelagem que valoriza a silhueta feminina.'
    },
    'vestido-midi': {
        name: 'Vestido Midi Clássico',
        price: 189.90,
        image: 'https://images.unsplash.com/photo-1566479179817-c0b2b8b6e7e5?w=400&h=500&fit=crop',
        description: 'Vestido midi clássico e atemporal. Ideal para o dia a dia ou eventos formais. Tecido confortável e modelagem universal que se adapta a diferentes tipos de corpo.'
    },
    'blusa-seda': {
        name: 'Blusa de Seda Premium',
        price: 129.90,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
        description: 'Blusa confeccionada em seda premium, proporcionando máximo conforto e elegância. Peça versátil que pode ser usada em diversas ocasiões, do casual ao formal.'
    },
    'blusa-casual': {
        name: 'Blusa Casual Confortável',
        price: 89.90,
        image: 'https://images.unsplash.com/photo-1564257577-0b8b5b0b8b0b?w=400&h=500&fit=crop',
        description: 'Blusa casual perfeita para o dia a dia. Tecido macio e respirável, ideal para quem busca conforto sem abrir mão do estilo. Combina com diversas peças do guarda-roupa.'
    },
    'calca-jeans': {
        name: 'Calça Jeans Skinny',
        price: 159.90,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        description: 'Calça jeans skinny com modelagem moderna e confortável. Jeans de alta qualidade com elastano para maior flexibilidade. Peça essencial no guarda-roupa feminino.'
    },
    'calca-social': {
        name: 'Calça Social Elegante',
        price: 199.90,
        image: 'https://images.unsplash.com/photo-1506629905607-d5b4c8b5e8b5?w=400&h=500&fit=crop',
        description: 'Calça social elegante para ambientes profissionais e eventos formais. Tecido de alta qualidade com caimento perfeito. Disponível em várias cores.'
    },
    'bolsa-couro': {
        name: 'Bolsa de Couro Premium',
        price: 299.90,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
        description: 'Bolsa confeccionada em couro legítimo premium. Design sofisticado e funcional com múltiplos compartimentos. Acessório indispensável para mulheres modernas.'
    },
    'colar-delicado': {
        name: 'Colar Delicado Dourado',
        price: 79.90,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
        description: 'Colar delicado folheado a ouro com design minimalista. Peça versátil que complementa qualquer look, do casual ao elegante. Hipoalergênico e resistente.'
    }
};

// DOM Elements
let hamburger, navMenu, filterButtons, productCards, modal, modalContent, closeModal;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupSmoothScrolling();
    setupScrollEffects();
    setupProductFiltering();
    setupModal();
    setupWhatsAppForm();
    
    // Animações de entrada
    animateOnScroll();
});

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

// Configurar event listeners
function setupEventListeners() {
    // Menu mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Filtros de produto
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Modal
    if (closeModal) {
        closeModal.addEventListener('click', closeProductModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }

    // Botões de tamanho no modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('size-btn')) {
            handleSizeSelection(e.target);
        }
    });

    // Scroll para header transparente
    window.addEventListener('scroll', handleHeaderScroll);
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

// Filtros de produtos
function setupProductFiltering() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar produtos
            filterProducts(filter);
        });
    });
}

// Filtrar produtos
function filterProducts(filter) {
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
}

// Manipular clique no filtro
function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Remover classe active de todos os botões
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adicionar classe active ao botão clicado
    e.target.classList.add('active');
    
    // Filtrar produtos
    filterProducts(filter);
}

// Configurar modal
function setupModal() {
    // Event listener para escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeProductModal();
        }
    });
}

// Abrir modal do produto
function openProductModal(productId) {
    const product = PRODUCTS_DATA[productId];
    if (!product) return;

    // Preencher dados do modal
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modalDescription').textContent = product.description;

    // Configurar botão WhatsApp do modal
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
    modalWhatsappBtn.onclick = function() {
        const selectedSize = document.querySelector('.size-btn.selected');
        const size = selectedSize ? selectedSize.textContent : 'Não especificado';
        sendWhatsAppMessage(product.name, product.price, size);
    };

    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animação de entrada
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
    }, 10);
}

// Fechar modal
function closeProductModal() {
    modalContent.style.transform = 'scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Resetar seleção de tamanho
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }, 300);
}

// Manipular seleção de tamanho
function handleSizeSelection(button) {
    // Remover seleção anterior
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    button.classList.add('selected');
}

// Adicionar ao carrinho (enviar para WhatsApp)
function addToCart(productId, productName, price) {
    sendWhatsAppMessage(productName, price);
}

// Enviar mensagem para WhatsApp
function sendWhatsAppMessage(productName, price, size = null) {
    let message = `Olá! Tenho interesse no produto:\n\n`;
    message += `📦 *${productName}*\n`;
    message += `💰 Preço: R$ ${price.toFixed(2).replace('.', ',')}\n`;
    
    if (size) {
        message += `📏 Tamanho: ${size}\n`;
    }
    
    message += `\nPoderia me enviar mais informações?\n\n`;
    message += `Obrigada! 😊`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Configurar formulário de contato WhatsApp
function setupWhatsAppForm() {
    const form = document.getElementById('whatsappForm');
    if (form) {
        form.addEventListener('submit', handleWhatsAppFormSubmit);
    }
}

// Manipular envio do formulário
function handleWhatsAppFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Validação básica
    if (!name || !phone) {
        alert('Por favor, preencha seu nome e telefone.');
        return;
    }
    
    // Criar mensagem para WhatsApp
    let whatsappMessage = `Olá! Meu nome é *${name}*\n\n`;
    whatsappMessage += `📱 Telefone: ${phone}\n\n`;
    
    if (message) {
        whatsappMessage += `💬 Mensagem: ${message}\n\n`;
    }
    
    whatsappMessage += `Gostaria de conhecer mais sobre os produtos da ${CONFIG.businessName}!\n\n`;
    whatsappMessage += `Obrigada! 😊`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpar formulário
    e.target.reset();
    
    // Feedback visual
    showFormSuccess();
}

// Mostrar sucesso no formulário
function showFormSuccess() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Redirecionando...';
    submitBtn.style.background = '#28a745';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
    }, 3000);
}

// Utilitários
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\(\)\-\+]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// Performance: Debounce para scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce ao scroll
const debouncedScrollHandler = debounce(handleHeaderScroll, 10);
window.addEventListener('scroll', debouncedScrollHandler);

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

// Executar quando a página estiver totalmente carregada
window.addEventListener('load', function() {
    hidePreloader();
    setupLazyLoading();
});

// Função para analytics (opcional)
function trackEvent(eventName, eventData = {}) {
    // Implementar tracking de eventos aqui
    console.log('Event tracked:', eventName, eventData);
}

// Exportar funções globais necessárias
window.openProductModal = openProductModal;
window.addToCart = addToCart;
window.sendWhatsAppMessage = sendWhatsAppMessage;
