/**
 * API service for fetching product data
 */
class ApiService {
    /**
     * Fetch products from the database
     * @returns {Promise<Array>} - Products array
     */
    async getProducts() {
        try {
            // In a real-world scenario, this would be an actual API endpoint
            const response = await fetch('data/db.json');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
}