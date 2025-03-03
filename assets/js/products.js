/**
 * Products manager class
 */
class ProductsManager {
    constructor(apiService, cartManager) {
        this.apiService = apiService;
        this.cartManager = cartManager;
        this.productsContainer = document.getElementById('productsContainer');
        this.products = [];
        this.init();
    }
    
    /**
     * Initialize products
     */
    async init() {
        try {
            // Load products from API
            this.products = await this.apiService.getProducts();
            
            // Render products
            this.renderProducts();
        } catch (error) {
            console.error('Failed to initialize products:', error);
            this.showError('Failed to load products. Please try again later.');
        }
    }
    
    /**
     * Render products in the container
     */
    renderProducts() {
        // Clear container
        this.productsContainer.innerHTML = '';
        
        // If no products, show message
        if (this.products.length === 0) {
            this.showError('No products available.');
            return;
        }
        
        // Create product cards
        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            this.productsContainer.appendChild(productCard);
        });
    }
    
    /**
     * Create a product card element
     * @param {Object} product - Product data
     * @returns {HTMLElement} - Product card element
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Calculate discount amount from percentage string
        let discountPercent = 0;
        if (product.discount) {
            discountPercent = parseInt(product.discount, 10);
        }
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.discount ? `<div class="product-discount">${product.discount}</div>` : ''}
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-category">${product.category}</div>
                <div class="product-rating">
                    <span class="rating-stars">${Utils.formatRating(product.rating.rate)}</span>
                    <span class="rating-count">(${product.rating.count})</span>
                </div>
                <div class="product-price">$${Utils.formatPrice(product.price)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
        
        // Add event listener to the "Add to Cart" button
        const addToCartButton = card.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => {
            this.cartManager.addToCart(product);
        });
        
        return card;
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.productsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}