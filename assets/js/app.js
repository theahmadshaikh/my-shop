/**
 * Application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize notification styles
    Utils.addNotificationStyles();
    
    // Initialize services
    const apiService = new ApiService();
    const cartManager = new CartManager();
    
    // Initialize product manager
    const productsManager = new ProductsManager(apiService, cartManager);
    
    // Add CSS for error messages dynamically
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            text-align: center;
            padding: var(--spacing-xl);
            color: var(--error-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-md);
        }
        
        .error-message i {
            font-size: 3rem;
        }
        
        .error-message p {
            font-size: var(--font-size-large);
        }
    `;
    document.head.appendChild(style);
});