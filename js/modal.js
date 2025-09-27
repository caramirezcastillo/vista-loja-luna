// Gerenciamento do modal de produtos

// Configurar modal
function setupModal() {
    const modal = window.DOMElements.modal;
    const closeModal = window.DOMElements.closeModal;
    
    // Event listener para escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeProductModal();
        }
    });

    // Event listener para fechar modal
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
}

// Abrir modal do produto
function openProductModal(productId) {
    const product = window.PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const modal = window.DOMElements.modal;
    const modalContent = window.DOMElements.modalContent;

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
        if (window.sendWhatsAppMessage) {
            window.sendWhatsAppMessage(product.name, product.price, size);
        }
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
    const modal = window.DOMElements.modal;
    const modalContent = window.DOMElements.modalContent;
    
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

// Exportar funções
window.setupModal = setupModal;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.handleSizeSelection = handleSizeSelection;
