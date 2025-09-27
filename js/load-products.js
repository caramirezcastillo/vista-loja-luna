// Carregamento dinâmico de produtos

// Função para formatar preço
function formatPrice(price) {
    return 'R$ ' + price.toFixed(2).replace('.', ',');
}

// Função para gerar HTML do produto
function generateProductHTML(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="openProductModal('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                    Solicitar no WhatsApp
                </button>
            </div>
        </div>
    `;
}

// Função para carregar produtos no grid
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (productsGrid && window.PRODUCTS_DATA && Array.isArray(window.PRODUCTS_DATA)) {
        productsGrid.innerHTML = window.PRODUCTS_DATA.map(generateProductHTML).join('');
    }
}

// Função para recarregar produtos (útil para filtros ou atualizações)
function reloadProducts() {
    loadProducts();
}

// Inicializar carregamento quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que os scripts foram carregados
    setTimeout(loadProducts, 100);
});

// Exportar funções para uso global
window.loadProducts = loadProducts;
window.reloadProducts = reloadProducts;
