// Utilitários gerais da aplicação

// Formatação de preços
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Validação de telefone
function validatePhone(phone) {
    const phoneRegex = /^[\d\s\(\)\-\+]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}

// Validação de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce para otimização de performance
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

// Tracking de eventos (para analytics)
function trackEvent(eventName, eventData = {}) {
    // Implementar tracking de eventos aqui
    console.log('Event tracked:', eventName, eventData);
}

// Exportar utilitários
window.formatPrice = formatPrice;
window.validatePhone = validatePhone;
window.validateEmail = validateEmail;
window.debounce = debounce;
window.trackEvent = trackEvent;
