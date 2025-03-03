/**
 * Cart manager class
 */
class CartManager {
    constructor() {
        this.cart = [];
        this.sortDirection = 'asc';
        this.init();
    }
    
    /**
     * Initialize cart
     */
    init() {
        // Try to load cart from localStorage
        this.loadFromStorage();
        
        // Initialize UI elements
        this.initializeUI();
        
        // Add event listeners
        this.setupEventListeners();
    }
    
    /**
     * Initialize UI elements
     */
    initializeUI() {
        // Cart DOM elements
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartItems = document.getElementById('cartItems');
        this.cartCount = document.getElementById('cartCount');
        this.totalPriceElement = document.getElementById('totalPrice');
        this.totalItemsElement = document.getElementById('totalItems');
        this.averagePriceElement = document.getElementById('averagePrice');
        
        // Filter modal elements
        this.filterModal = document.getElementById('filterModal');
        this.maxPriceInput = document.getElementById('maxPrice');
        
        // Overlay
        this.overlay = document.getElementById('overlay');
        
        // Update UI
        this.updateCartUI();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Cart icon click
        document.getElementById('cartIcon').addEventListener('click', () => this.toggleCart());
        
        // Close cart button
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart(false));
        
        // Sort button
        document.getElementById('sortBtn').addEventListener('click', () => this.sortCart());
        
        // Filter button
        document.getElementById('filterBtn').addEventListener('click', () => this.showFilterModal());
        
        // Apply filter
        document.getElementById('applyFilterBtn').addEventListener('click', () => this.applyFilter());
        
        // Cancel filter
        document.getElementById('cancelFilterBtn').addEventListener('click', () => this.hideFilterModal());
        
        // Clear cart
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCart());
        
        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        
        // Overlay click (to close modals)
        this.overlay.addEventListener('click', () => {
            this.toggleCart(false);
            this.hideFilterModal();
        });
    }
    
    /**
     * Toggle cart sidebar
     * @param {boolean} [show] - Force show/hide cart
     */
    toggleCart(show) {
        const isVisible = typeof show === 'boolean' ? show : !this.cartSidebar.classList.contains('active');
        
        if (isVisible) {
            this.cartSidebar.classList.add('active');
            this.overlay.style.display = 'block';
        } else {
            this.cartSidebar.classList.remove('active');
            this.overlay.style.display = 'none';
        }
    }
    
    /**
     * Show filter modal
     */
    showFilterModal() {
        this.filterModal.style.display = 'block';
        this.overlay.style.display = 'block';
    }
    
    /**
     * Hide filter modal
     */
    hideFilterModal() {
        this.filterModal.style.display = 'none';
        
        // Only hide overlay if cart is not visible
        if (!this.cartSidebar.classList.contains('active')) {
            this.overlay.style.display = 'none';
        }
    }
    
    /**
     * Add product to cart
     * @param {Object} product - Product to add
     */
    addToCart(product) {
        // Check if product already exists in cart
        const existingProduct = this.cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            // Increment quantity
            existingProduct.quantity += 1;
            Utils.showNotification(`Increased quantity for ${product.title}`, 'success');
        } else {
            // Add new product with quantity 1
            this.cart.push({
                ...product,
                quantity: 1
            });
            Utils.showNotification(`${product.title} added to cart`, 'success');
        }
        
        // Update UI and storage
        this.updateCartUI();
        this.saveToStorage();
    }
    
    /**
     * Remove product from cart
     * @param {number} productId - Product ID to remove
     */
    removeFromCart(productId) {
        const productIndex = this.cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
            const product = this.cart[productIndex];
            this.cart.splice(productIndex, 1);
            
            Utils.showNotification(`${product.title} removed from cart`, 'success');
            
            // Update UI and storage
            this.updateCartUI();
            this.saveToStorage();
        }
    }
    
    /**
     * Update product quantity
     * @param {number} productId - Product ID to update
     * @param {number} change - Quantity change (1 or -1)
     */
    updateQuantity(productId, change) {
        const product = this.cart.find(item => item.id === productId);
        
        if (product) {
            // Update quantity
            product.quantity += change;
            
            // Remove product if quantity is 0
            if (product.quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            
            // Update UI and storage
            this.updateCartUI();
            this.saveToStorage();
        }
    }
    
    /**
     * Calculate total price of items in cart
     * @returns {number} - Total price
     */
    calculateTotalPrice() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    /**
     * Calculate average price of items in cart
     * @returns {number} - Average price
     */
    calculateAveragePrice() {
        if (this.cart.length === 0) return 0;
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = this.calculateTotalPrice();
        
        return totalPrice / totalItems;
    }
    
    /**
     * Filter products based on maximum price
     * @param {number} maxPrice - Maximum price
     * @returns {Array} - Filtered cart
     */
    filterProducts(maxPrice) {
        return this.cart.filter(item => item.price <= maxPrice);
    }
    
    /**
     * Apply price filter
     */
    applyFilter() {
        const maxPrice = parseFloat(this.maxPriceInput.value);
        
        if (isNaN(maxPrice)) {
            Utils.showNotification('Please enter a valid price', 'error');
            return;
        }
        
        const filteredProducts = this.filterProducts(maxPrice);
        
        if (filteredProducts.length === 0) {
            Utils.showNotification('No products match the filter criteria', 'error');
        } else {
            Utils.showNotification(`Found ${filteredProducts.length} products under $${maxPrice}`, 'success');
            
            // Temporarily show only filtered products
            this.renderCartItems(filteredProducts);
        }
        
        this.hideFilterModal();
    }
    
    /**
     * Sort cart by price
     */
    sortCart() {
        // Toggle sort direction
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        
        // Sort cart
        this.cart.sort((a, b) => {
            if (this.sortDirection === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
        
        // Update UI
        Utils.showNotification(`Sorted by price (${this.sortDirection === 'asc' ? 'Low to High' : 'High to Low'})`, 'success');
        this.updateCartUI();
    }
    
    /**
     * Clear cart
     */
    clearCart() {
        this.cart = [];
        Utils.showNotification('Your cart is empty', 'success');
        
        // Update UI and storage
        this.updateCartUI();
        this.saveToStorage();
    }
    
    /**
     * Update cart UI
     */
    updateCartUI() {
        // Update cart count
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        // Render cart items
        this.renderCartItems(this.cart);
        
        // Update summary info
        this.totalItemsElement.textContent = totalItems;
        this.totalPriceElement.textContent = Utils.formatPrice(this.calculateTotalPrice());
        this.averagePriceElement.textContent = Utils.formatPrice(this.calculateAveragePrice());
    }
    
    /**
     * Render cart items in the sidebar
     * @param {Array} items - Items to render
     */
    renderCartItems(items) {
        // Clear cart items
        this.cartItems.innerHTML = '';
        
        if (items.length === 0) {
            // Show empty cart message
            const emptyCartMessage = document.createElement('div');
            emptyCartMessage.className = 'empty-cart-message';
            emptyCartMessage.textContent = 'Your cart is empty';
            this.cartItems.appendChild(emptyCartMessage);
        } else {
            // Render each item
            items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${Utils.formatPrice(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-btn">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-btn">+</button>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                `;
                
                // Add event listeners
                const decreaseBtn = cartItem.querySelector('.decrease-btn');
                const increaseBtn = cartItem.querySelector('.increase-btn');
                const removeBtn = cartItem.querySelector('.remove-item');
                
                decreaseBtn.addEventListener('click', () => this.updateQuantity(item.id, -1));
                increaseBtn.addEventListener('click', () => this.updateQuantity(item.id, 1));
                removeBtn.addEventListener('click', () => this.removeFromCart(item.id));
                
                this.cartItems.appendChild(cartItem);
            });
        }
    }
    
    /**
     * Save cart to localStorage
     */
    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    /**
     * Load cart from localStorage
     */
    loadFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
                this.cart = [];
            }
        }
    }
    
    /**
     * Checkout process
     */
    checkout() {
        if (this.cart.length === 0) {
            Utils.showNotification('Your cart is empty', 'error');
            return;
        }
        
        // In a real application, this would redirect to a checkout page
        // or trigger a checkout process
        Utils.showNotification('Proceeding to checkout...', 'success');
        
        // For this demo, just clear the cart
        setTimeout(() => {
            this.clearCart();
            this.toggleCart(false);
        }, 1500);
    }
}