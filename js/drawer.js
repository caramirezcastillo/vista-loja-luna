// Drawer functionality for adding products
class ProductDrawer {
    constructor() {
        this.drawer = document.getElementById('addProductDrawer');
        this.overlay = null;
        this.floatingBtn = document.getElementById('floatingAddBtn');
        this.closeBtn = document.getElementById('closeDrawer');
        this.cancelBtn = document.getElementById('cancelAddProduct');
        this.form = document.getElementById('addProductForm');
        this.imageUrlInput = document.getElementById('productImageUrl');
        this.imageFileInput = document.getElementById('productImageFile');
        this.imagePreview = document.getElementById('imagePreview');
        
        this.init();
    }
    
    init() {
        this.createOverlay();
        this.bindEvents();
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'drawer-overlay';
        document.body.appendChild(this.overlay);
    }
    
    bindEvents() {
        // Open drawer
        this.floatingBtn.addEventListener('click', () => this.openDrawer());
        
        // Close drawer
        this.closeBtn.addEventListener('click', () => this.closeDrawer());
        this.cancelBtn.addEventListener('click', () => this.closeDrawer());
        this.overlay.addEventListener('click', () => this.closeDrawer());
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Image preview
        this.imageUrlInput.addEventListener('input', () => this.handleImageUrlChange());
        this.imageFileInput.addEventListener('change', (e) => this.handleImageFileChange(e));
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.closeDrawer();
            }
        });
    }
    
    openDrawer() {
        this.drawer.classList.add('open');
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('productName').focus();
        }, 300);
    }
    
    closeDrawer() {
        this.drawer.classList.remove('open');
        this.overlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form after animation
        setTimeout(() => {
            this.resetForm();
        }, 300);
    }
    
    isOpen() {
        return this.drawer.classList.contains('open');
    }
    
    resetForm() {
        this.form.reset();
        this.imagePreview.innerHTML = '';
        this.imagePreview.classList.add('empty');
    }
    
    handleImageUrlChange() {
        const url = this.imageUrlInput.value.trim();
        if (url && this.isValidImageUrl(url)) {
            this.showImagePreview(url);
        } else {
            this.hideImagePreview();
        }
    }
    
    handleImageFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.showImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            this.hideImagePreview();
        }
    }
    
    isValidImageUrl(url) {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        } catch {
            return false;
        }
    }
    
    showImagePreview(src) {
        this.imagePreview.innerHTML = `<img src="${src}" alt="Preview">`;
        this.imagePreview.classList.remove('empty');
    }
    
    hideImagePreview() {
        this.imagePreview.innerHTML = '';
        this.imagePreview.classList.add('empty');
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        try {
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adicionando...';
            
            // Get form data
            const formData = new FormData(this.form);
            const productData = this.getProductData(formData);
            
            // Validate data
            if (!this.validateProductData(productData)) {
                throw new Error('Por favor, preencha todos os campos obrigatórios corretamente.');
            }
            
            // Add product to the catalog
            await this.addProductToCatalog(productData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Close drawer
            this.closeDrawer();
            
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    getProductData(formData) {
        const imageUrl = formData.get('imageUrl').trim();
        const imageFile = formData.get('imageFile');
        
        return {
            name: formData.get('name').trim(),
            price: parseFloat(formData.get('price')),
            image: imageUrl || (imageFile ? URL.createObjectURL(imageFile) : ''),
            description: formData.get('description').trim(),
            category: formData.get('category')
        };
    }
    
    validateProductData(data) {
        if (!data.name || data.name.length < 2) return false;
        if (!data.price || data.price <= 0) return false;
        if (!data.image) return false;
        if (!data.description || data.description.length < 10) return false;
        if (!data.category) return false;
        
        return true;
    }
    
    async addProductToCatalog(productData) {
        // Generate unique ID
        const id = 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create product object
        const product = {
            id: id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            description: productData.description,
            category: productData.category,
            sizes: ['P', 'M', 'G', 'GG'] // Default sizes
        };
        
        // Add to products array (assuming products are stored globally)
        if (typeof window.products !== 'undefined') {
            window.products.push(product);
        }
        
        // Trigger product reload
        if (typeof window.loadProducts === 'function') {
            window.loadProducts();
        }
        
        // Store in localStorage for persistence
        this.saveProductToStorage(product);
    }
    
    saveProductToStorage(product) {
        try {
            const storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
            storedProducts.push(product);
            localStorage.setItem('customProducts', JSON.stringify(storedProducts));
        } catch (error) {
            console.error('Error saving product to storage:', error);
        }
    }
    
    showSuccessMessage() {
        // Create temporary success message
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Produto adicionado com sucesso!
        `;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
    
    showErrorMessage(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 5000);
    }
}

// Initialize drawer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDrawer();
});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
