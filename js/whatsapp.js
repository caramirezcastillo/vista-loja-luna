// Integração com WhatsApp

// Enviar mensagem para WhatsApp
function sendWhatsAppMessage(productName, price, size = null) {
    const message = createWhatsAppMessage(productName, price, size);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${window.CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Criar mensagem para WhatsApp
function createWhatsAppMessage(productName, price, size = null) {
    let message = `Olá! Tenho interesse no produto:\n\n`;
    message += `📦 *${productName}*\n`;
    message += `💰 Preço: R$ ${price.toFixed(2).replace('.', ',')}\n`;
    
    if (size) {
        message += `📏 Tamanho: ${size}\n`;
    }
    
    message += `\nPoderia me enviar mais informações?\n\n`;
    message += `Obrigada! 😊`;

    return message;
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
    const whatsappMessage = createContactMessage(name, phone, message);
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${window.CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpar formulário
    e.target.reset();
    
    // Feedback visual
    showFormSuccess();
}

// Criar mensagem de contato
function createContactMessage(name, phone, message) {
    let whatsappMessage = `Olá! Meu nome é *${name}*\n\n`;
    whatsappMessage += `📱 Telefone: ${phone}\n\n`;
    
    if (message) {
        whatsappMessage += `💬 Mensagem: ${message}\n\n`;
    }
    
    whatsappMessage += `Gostaria de conhecer mais sobre os produtos da ${window.CONFIG.businessName}!\n\n`;
    whatsappMessage += `Obrigada! 😊`;
    
    return whatsappMessage;
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

// Exportar funções
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.setupWhatsAppForm = setupWhatsAppForm;
window.handleWhatsAppFormSubmit = handleWhatsAppFormSubmit;
