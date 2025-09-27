// Carregamento dinâmico de produtos

// Função para formatar preço
function formatPrice(price) {
    // Garantir que o preço seja um número
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
        return 'R$ 0,00';
    }
    return 'R$ ' + numericPrice.toFixed(2).replace('.', ',');
}

// Função para gerar HTML do produto
function generateProductHTML(product) {
    // Escapar caracteres especiais para evitar problemas no HTML
    const escapedName = product.name.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    const escapedDescription = product.description ? product.description.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
    
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${escapedName}" loading="lazy">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="openProductModal('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapedName}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${escapedName}', ${product.price})">
                    Solicitar no WhatsApp
                </button>
            </div>
        </div>
    `;
}

// Função para carregar produtos no grid
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (productsGrid) {
        let allProducts = [];
        
        // Carregar produtos padrão
        if (window.PRODUCTS_DATA && Array.isArray(window.PRODUCTS_DATA)) {
            allProducts = [...window.PRODUCTS_DATA];
        }
        
        // Carregar produtos customizados do localStorage
        try {
            const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
            allProducts = [...allProducts, ...customProducts];
        } catch (error) {
            console.error('Erro ao carregar produtos customizados:', error);
        }
        
        // Renderizar todos os produtos
        productsGrid.innerHTML = allProducts.map(generateProductHTML).join('');
        
        // Atualizar array global de produtos
        window.products = allProducts;
        
        // Atualizar elementos DOM para filtros
        updateDOMElements();
        
        // Garantir que os filtros funcionem após carregar
        if (typeof window.setupProductFiltering === 'function') {
            window.setupProductFiltering();
        }
    }
}

// Função para atualizar elementos DOM após carregar produtos
function updateDOMElements() {
    // Atualizar productCards
    if (window.DOMElements) {
        window.DOMElements.productCards = document.querySelectorAll('.product-card');
    }
    
    // Reconfigurar event listeners dos produtos
    setupProductEventListeners();
    
    // Reconfigurar filtros para garantir que funcionem com os novos produtos
    if (typeof window.setupProductFiltering === 'function') {
        window.setupProductFiltering();
    }
    
    // Garantir que os filtros funcionem após atualizar elementos
    if (typeof window.filterProducts === 'function') {
        // Aplicar filtro ativo se houver um
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filter = activeFilter.getAttribute('data-filter');
            window.filterProducts(filter);
        }
    }
}

// Função para configurar event listeners dos produtos
function setupProductEventListeners() {
    // Event listeners para botões de visualização rápida
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        // Remover event listeners antigos para evitar duplicação
        btn.removeEventListener('click', handleQuickViewClick);
        btn.addEventListener('click', handleQuickViewClick);
    });
    
    // Event listeners para botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        // Remover event listeners antigos para evitar duplicação
        btn.removeEventListener('click', handleAddToCartClick);
        btn.addEventListener('click', handleAddToCartClick);
    });
    
    // Garantir que os filtros funcionem após configurar event listeners
    if (typeof window.setupProductFiltering === 'function') {
        window.setupProductFiltering();
    }
}

// Função para lidar com clique no botão de visualização rápida
function handleQuickViewClick() {
    const onclick = this.getAttribute('onclick');
    if (onclick) {
        const matches = onclick.match(/openProductModal\('([^']+)'\)/);
        if (matches && window.openProductModal) {
            window.openProductModal(matches[1]);
        }
    }
}

// Função para lidar com clique no botão de adicionar ao carrinho
function handleAddToCartClick() {
    const onclick = this.getAttribute('onclick');
    if (onclick) {
        const matches = onclick.match(/addToCart\('([^']+)',\s*'([^']+)',\s*([^)]+)\)/);
        if (matches && window.addToCart) {
            window.addToCart(matches[1], matches[2], parseFloat(matches[3]));
        }
    }
}

// Função para recarregar produtos (útil para filtros ou atualizações)
function reloadProducts() {
    loadProducts();
    
    // Garantir que os filtros funcionem após recarregar
    if (typeof window.setupProductFiltering === 'function') {
        window.setupProductFiltering();
    }
    
    // Garantir que os filtros funcionem após recarregar
    if (typeof window.filterProducts === 'function') {
        // Aplicar filtro ativo se houver um
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filter = activeFilter.getAttribute('data-filter');
            window.filterProducts(filter);
        }
    }
}

// Inicializar carregamento quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que os scripts foram carregados
    setTimeout(() => {
        loadProducts();
        
        // Garantir que os filtros funcionem após carregar
        if (typeof window.setupProductFiltering === 'function') {
            window.setupProductFiltering();
        }
    }, 100);
});

// Exportar funções para uso global
window.loadProducts = loadProducts;
window.reloadProducts = reloadProducts;
