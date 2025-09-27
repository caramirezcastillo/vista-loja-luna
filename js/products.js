// Gerenciamento de produtos e filtros

// Filtros de produtos
function setupProductFiltering() {
    const filterButtons = window.DOMElements.filterButtons;
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
    const productCards = window.DOMElements.productCards;
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
    const filterButtons = window.DOMElements.filterButtons;
    
    // Remover classe active de todos os botões
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adicionar classe active ao botão clicado
    e.target.classList.add('active');
    
    // Filtrar produtos
    filterProducts(filter);
}

// Adicionar ao carrinho (enviar para WhatsApp)
function addToCart(productId, productName, price) {
    if (window.sendWhatsAppMessage) {
        window.sendWhatsAppMessage(productName, price);
    }
}

// Exportar funções
window.setupProductFiltering = setupProductFiltering;
window.filterProducts = filterProducts;
window.handleFilterClick = handleFilterClick;
window.addToCart = addToCart;
