// Fetch products from db.json and display them
function fetchProducts() {
    fetch('db.json') // Fetch the db.json file
        .then(response => response.json()) // Parse the JSON data
        .then(data => {
            const products = data.products; // Access the products array
            displayProducts(products); // Display the products
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Display products dynamically
function displayProducts(products) {
    console.log("products",products)
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // Clear any existing content

    products.forEach(product => {
        // Limit the description to 150 characters
        const truncatedDescription = product.description.length > 150
            ? product.description.substring(0, 150) + '...' // Add ellipsis if truncated
            : product.description;

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${truncatedDescription}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">
                Add to Cart
            </button>
        `;
        productGrid.appendChild(productCard);
    });
}

let cart = []; // Initialize cart as an empty array

// Add to Cart
function addToCart(id, title, price, image) {
    const existingProduct = cart.find(product => product.id === id);

    if (existingProduct) {
        // If the product already exists in the cart, increment its quantity
        existingProduct.quantity += 1;
    } else {
        // If the product is not in the cart, add it with quantity 1
        cart.push({
            id: id,
            title: title,
            price: price,
            image: image,
            quantity: 1
        });
    }
    updateCartDisplay(); // Update the cart display with the full cart
    updateCartCount(); // Update the cart count
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(product => product.id !== id); // Remove the product
    updateCartDisplay(); // Update cart display with the updated cart
    updateCartCount(); // Update cart count
}

// Function to calculate and return the average price
function getAveragePrice() {
    let total = 0;
    let totalQuantity = 0;

    cart.forEach(product => {
        total += product.price * product.quantity;
        totalQuantity += product.quantity;
    });

    return totalQuantity > 0 ? (total / totalQuantity).toFixed(2) : "0.00";
}

// Function to sort products in ascending order by price
function sortCartAscending() {
    cart.sort((a, b) => a.price - b.price);
    updateCartDisplay();
}

// Function to sort products in descending order by price
function sortCartDescending() {
    cart.sort((a, b) => b.price - a.price);
    updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartAverageElement = document.getElementById('cartAverage');

    cartItemsContainer.innerHTML = ''; // Clear previous cart items

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)} x ${product.quantity}</p>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);

        total += product.price * product.quantity;
        totalQuantity += product.quantity;
    });

    // Update total and average price
    cartTotalElement.textContent = total.toFixed(2);
    cartAverageElement.textContent = getAveragePrice();
}

// Update Cart Count
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Open Cart Sidebar
function openCart() {
    updateCartDisplay(); // Refresh cart display before opening
    const cartSidebar = document.querySelector('.cart-sidebar');
    cartSidebar.classList.add('open');
}

// Close Cart Sidebar
function closeCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    cartSidebar.classList.remove('open');
}

// Clear Cart Functionality
function clearCart() {
    cart = []; // Reset cart array
    updateCartDisplay(); // Refresh cart display
    updateCartCount(); // Update cart count
    document.getElementById("emptyCartMessage").style.display = "block";
}
// Function to filter cart items by price range
function applyPriceFilter() {
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    // Get all cart items
     cart = cart.filter((product)=>product.price>=minPrice && product.price<=maxPrice)
    // console.log(filteredProducts)
    // displayProducts(filteredProducts)
    updateCartDisplay()
}


// Fetch and display products when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount(); // Initialize cart count on page load
});

// Add event listener to cart icon to open the cart sidebar
document.querySelector('.cart-icon').addEventListener('click', openCart);

// Add sorting event listeners
document.getElementById('sortAsc').addEventListener('click', sortCartAscending);
document.getElementById('sortDesc').addEventListener('click', sortCartDescending);
