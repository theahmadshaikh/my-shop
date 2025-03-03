/**
 * Utility functions for the application
 */
class Utils {
    /**
     * Format price with two decimal places
     * @param {number} price - Price to format
     * @returns {string} - Formatted price
     */
    static formatPrice(price) {
        return price.toFixed(2);
    }
    
    /**
     * Format product rating into stars
     * @param {number} rating - Rating value
     * @returns {string} - HTML for star rating
     */
    static formatRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // Add half star if needed
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
    
    /**
     * Show a notification message to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success, error)
     */
    static showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    /**
     * Add CSS for notifications dynamically
     */
    static addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                background-color: var(--primary-color);
                color: white;
                border-radius: var(--border-radius-md);
                box-shadow: 0 4px 12px var(--shadow-color);
                z-index: 1000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 90%;
            }
            
            .notification.success {
                background-color: var(--success-color);
            }
            
            .notification.error {
                background-color: var(--error-color);
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}