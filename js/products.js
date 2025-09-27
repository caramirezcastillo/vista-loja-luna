// Gerenciamento de produtos e filtros

// Filtros de produtos
function setupProductFiltering() {
    // Atualizar filterButtons para garantir que temos os elementos mais recentes
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Remover event listeners antigos para evitar duplicação
    filterButtons.forEach(button => {
        button.removeEventListener('click', handleFilterClick);
        button.addEventListener('click', handleFilterClick);
    });
    
    // Atualizar o objeto DOMElements para manter consistência
    if (window.DOMElements) {
        window.DOMElements.filterButtons = filterButtons;
    }
}

// Filtrar produtos
function filterProducts(filter) {
    // Atualizar productCards para garantir que temos os elementos mais recentes
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.classList.add('hidden');
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Atualizar o objeto DOMElements para manter consistência
    if (window.DOMElements) {
        window.DOMElements.productCards = productCards;
    }
}

// Manipular clique no filtro
function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Atualizar filterButtons para garantir que temos os elementos mais recentes
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Remover classe active de todos os botões
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adicionar classe active ao botão clicado
    e.target.classList.add('active');
    
    // Filtrar produtos
    filterProducts(filter);
    
    // Atualizar o objeto DOMElements para manter consistência
    if (window.DOMElements) {
        window.DOMElements.filterButtons = filterButtons;
    }
}

// Adicionar ao carrinho (enviar para WhatsApp)
function addToCart(productId, productName, price) {
    if (window.sendWhatsAppMessage) {
        window.sendWhatsAppMessage(productName, price);
    } else {
        console.error('Função sendWhatsAppMessage não encontrada');
    }
}

// Exportar funções
window.setupProductFiltering = setupProductFiltering;
window.filterProducts = filterProducts;
window.handleFilterClick = handleFilterClick;
window.addToCart = addToCart;
