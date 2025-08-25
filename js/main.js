// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartCount();
    updateUserInterface();
    setupEventListeners();
    loadContentFromSettings();
    setupMobileMenu();
});

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const adminBtnMobile = document.getElementById('adminBtnMobile');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
    }
    
    // Mobile admin button
    if (adminBtnMobile) {
        adminBtnMobile.addEventListener('click', () => {
            const password = prompt('Enter admin password:');
            if (password === db.getSettings().adminPassword) {
                window.location.href = 'admin.html';
            } else {
                showNotification('Invalid admin password!', 'error');
            }
        });
    }
}

// Load content from settings
function loadContentFromSettings() {
    const settings = db.getSettings();
    
    // Update hero section
    const heroSection = document.getElementById('heroSection');
    if (heroSection && settings.heroTitle) {
        const heroTitle = heroSection.querySelector('h1');
        const heroSubtitle = heroSection.querySelector('p');
        
        if (heroTitle) heroTitle.textContent = settings.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;
        
        if (settings.heroBackgroundImage) {
            heroSection.style.backgroundImage = `url('${settings.heroBackgroundImage}')`;
        }
    }
    
    // Update footer
    const footerDescription = document.getElementById('footerDescription');
    const copyrightText = document.getElementById('copyrightText');
    
    if (footerDescription && settings.footerDescription) {
        footerDescription.textContent = settings.footerDescription;
    }
    if (copyrightText && settings.copyrightText) {
        copyrightText.textContent = settings.copyrightText;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            const password = prompt('Enter admin password:');
            if (password === db.getSettings().adminPassword) {
                window.location.href = 'admin.html';
            } else {
                showNotification('Invalid admin password!', 'error');
            }
        });
    }

    // Cart functionality
    const cartBtn = document.getElementById('cartBtn');
    const closeCartModal = document.getElementById('closeCartModal');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            displayCart();
            document.getElementById('cartModal').classList.remove('hidden');
        });
    }
    
    if (closeCartModal) {
        closeCartModal.addEventListener('click', () => {
            document.getElementById('cartModal').classList.add('hidden');
        });
    }

    // Profile functionality
    const profileBtn = document.getElementById('profileBtn');
    const closeProfileModal = document.getElementById('closeProfileModal');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            if (currentUser) {
                displayUserProfile();
                document.getElementById('profileModal').classList.remove('hidden');
            } else {
                showLoginModal();
            }
        });
    }
    
    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', () => {
            document.getElementById('profileModal').classList.add('hidden');
        });
    }

    // Product modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('productModal').classList.add('hidden');
        });
    }

    // Category filters
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });

    // Filter and sort
    const filterSelect = document.getElementById('filterSelect');
    const sortSelect = document.getElementById('sortSelect');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            filterProducts();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts();
        });
    }
    
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            resetFilters();
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }

    // Customer order modal
    const closeCustomerOrderModal = document.getElementById('closeCustomerOrderModal');
    const cancelCustomerOrder = document.getElementById('cancelCustomerOrder');
    const customerOrderForm = document.getElementById('customerOrderForm');
    
    if (closeCustomerOrderModal) {
        closeCustomerOrderModal.addEventListener('click', () => {
            document.getElementById('customerOrderModal').classList.add('hidden');
        });
    }
    
    if (cancelCustomerOrder) {
        cancelCustomerOrder.addEventListener('click', () => {
            document.getElementById('customerOrderModal').classList.add('hidden');
        });
    }
    
    if (customerOrderForm) {
        customerOrderForm.addEventListener('submit', handleCustomerOrder);
    }

    // Review modal
    const closeReviewModal = document.getElementById('closeReviewModal');
    const cancelReview = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');
    
    if (closeReviewModal) {
        closeReviewModal.addEventListener('click', () => {
            document.getElementById('reviewModal').classList.add('hidden');
        });
    }
    
    if (cancelReview) {
        cancelReview.addEventListener('click', () => {
            document.getElementById('reviewModal').classList.add('hidden');
        });
    }
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
}

// Display products
function displayProducts(productsToShow = null) {
    const products = productsToShow || db.getProducts();
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer';
        
        const reviews = db.getReviewsByProductId(product.id);
        const avgRating = reviews.length > 0 ? 
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-base sm:text-lg mb-2 line-clamp-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-2 line-clamp-2">${product.description}</p>
                <div class="flex items-center mb-2">
                    ${generateStarRating(avgRating)}
                    <span class="text-gray-500 text-sm ml-2">(${reviews.length})</span>
                </div>
                <div class="flex justify-between items-center mb-3">
                    <div>
                        <span class="text-lg sm:text-xl font-bold text-purple-600">₹${product.price}</span>
                        ${product.originalPrice ? `<span class="text-xs sm:text-sm text-gray-500 line-through ml-2">₹${product.originalPrice}</span>` : ''}
                    </div>
                </div>
                <button onclick="showProductDetails(${product.id})" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition text-sm sm:text-base">
                    View Details
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Show product details
function showProductDetails(productId) {
    const product = db.getProductById(productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    const reviews = db.getReviewsByProductId(productId);
    const avgRating = reviews.length > 0 ? 
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    
    modalContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
                <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
            </div>
            <div>
                <h3 class="text-xl lg:text-2xl font-bold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex items-center mb-4">
                    ${generateStarRating(avgRating)}
                    <span class="text-gray-500 ml-2">(${reviews.length} reviews)</span>
                </div>
                <div class="mb-4">
                    <span class="text-2xl lg:text-3xl font-bold text-purple-600">₹${product.price}</span>
                    ${product.originalPrice ? `<span class="text-base lg:text-lg text-gray-500 line-through ml-2">₹${product.originalPrice}</span>` : ''}
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Size:</label>
                    <div class="grid grid-cols-4 sm:flex sm:flex-wrap gap-2" id="sizeOptions">
                        ${product.sizes.map(size => `
                            <button class="size-option px-2 sm:px-3 py-1 border rounded hover:bg-purple-100 transition text-sm" data-size="${size}">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Color:</label>
                    <div class="grid grid-cols-3 sm:flex sm:flex-wrap gap-2" id="colorOptions">
                        ${product.colors.map(color => `
                            <button class="color-option px-2 sm:px-3 py-1 border rounded hover:bg-purple-100 transition text-sm" data-color="${color}">
                                ${color}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="addToCart(${productId})" 
                        class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition mb-4">
                    Add to Cart
                </button>
                
                <button onclick="openReviewModal(${productId})" 
                        class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                    Write a Review
                </button>
            </div>
        </div>
        
        <div class="mt-4 lg:mt-6 border-t pt-4">
            <h3 class="font-semibold mb-4">Customer Reviews:</h3>
            <div id="reviewsList">
                ${reviews.length > 0 ? reviews.map(review => `
                    <div class="border-b pb-3 mb-3 last:border-b-0">
                        <div class="flex items-center mb-1">
                            <span class="font-medium">${review.customerName}</span>
                            <div class="ml-2">${generateStarRating(review.rating)}</div>
                        </div>
                        <p class="text-gray-600 text-sm">${review.comment}</p>
                        <small class="text-gray-400">${new Date(review.date).toLocaleDateString()}</small>
                    </div>
                `).join('') : '<p class="text-gray-500">No reviews yet.</p>'}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    setupProductOptions();
}

// Setup product options
function setupProductOptions() {
    // Size selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(b => {
                b.classList.remove('bg-purple-600', 'text-white');
                b.classList.add('border-gray-300');
            });
            btn.classList.add('bg-purple-600', 'text-white');
            btn.classList.remove('border-gray-300');
        });
    });
    
    // Color selection
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => {
                b.classList.remove('bg-purple-600', 'text-white');
                b.classList.add('border-gray-300');
            });
            btn.classList.add('bg-purple-600', 'text-white');
            btn.classList.remove('border-gray-300');
        });
    });
}

// Add to cart
function addToCart(productId) {
    const product = db.getProductById(productId);
    if (!product) return;
    
    const selectedSize = document.querySelector('.size-option.bg-purple-600')?.dataset.size;
    const selectedColor = document.querySelector('.color-option.bg-purple-600')?.dataset.color;
    
    if (!selectedSize) {
        showNotification('Please select a size', 'error');
        return;
    }
    
    if (!selectedColor) {
        showNotification('Please select a color', 'error');
        return;
    }
    
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && item.size === selectedSize && item.color === selectedColor
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!', 'success');
    document.getElementById('productModal').classList.add('hidden');
}

// Display cart
function displayCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let cartItemsHtml = '';
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        cartItemsHtml += `
            <div class="flex items-center justify-between p-4 border-b">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                    <div>
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-sm text-gray-500">Size: ${item.size}, Color: ${item.color}</p>
                        <p class="text-sm font-medium text-purple-600">₹${item.price}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <button onclick="updateCartQuantity(${index}, -1)" 
                            class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition">-</button>
                    <span class="mx-3 font-medium">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${index}, 1)" 
                            class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition">+</button>
                    <button onclick="removeFromCart(${index})" 
                            class="ml-3 text-red-500 hover:text-red-700 p-2 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartContent.innerHTML = `
        <div class="max-h-60 sm:max-h-96 overflow-y-auto">
            ${cartItemsHtml}
        </div>
        <div class="border-t pt-4 mt-4 sticky bottom-0 bg-white">
            <div class="flex justify-between items-center mb-4">
                <span class="text-base sm:text-lg font-semibold">Total: ₹${total}</span>
            </div>
            <button onclick="proceedToOrder()" class="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 transition text-sm sm:text-base">
                <i class="fab fa-whatsapp mr-2"></i>Order on WhatsApp
            </button>
        </div>
    `;
}

// Update cart quantity
function updateCartQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

// Remove from cart
function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
        showNotification('Item removed from cart!', 'success');
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Proceed to order
function proceedToOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    document.getElementById('customerOrderModal').classList.remove('hidden');
}

// Handle customer order
function handleCustomerOrder(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    
    let message = `Hello! I would like to order the following items:\n\n`;
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name}\n  Size: ${item.size}, Color: ${item.color}\n  Quantity: ${item.quantity}\n  Price: ₹${itemTotal}\n\n`;
    });
    
    message += `Total: ₹${total}\n\n`;
    message += `Customer Details:\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n`;
    if (customerEmail) message += `Email: ${customerEmail}\n`;
    if (customerAddress) message += `Address: ${customerAddress}\n`;
    
    // Save order
    const order = {
        items: [...cart],
        total: total,
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        customerAddress: customerAddress
    };
    
    db.addOrder(order, {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress
    });
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Close modals
    document.getElementById('customerOrderModal').classList.add('hidden');
    document.getElementById('cartModal').classList.add('hidden');
    
    // Open WhatsApp
    const settings = db.getSettings();
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('Order sent to WhatsApp!', 'success');
}

// Filter by category
function filterByCategory(category) {
    const products = db.getProducts();
    const filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );
    
    displayProducts(filteredProducts);
    
    const productsTitle = document.getElementById('productsTitle');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    
    if (productsTitle) {
        productsTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }
    
    if (resetFilterBtn) {
        resetFilterBtn.classList.remove('hidden');
    }
    
    // Scroll to products section
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

// Filter products
function filterProducts() {
    const filterSelect = document.getElementById('filterSelect');
    const selectedCategory = filterSelect.value;
    
    if (selectedCategory === 'all') {
        displayProducts();
        document.getElementById('resetFilterBtn').classList.add('hidden');
    } else {
        filterByCategory(selectedCategory);
    }
}

// Sort products
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortBy = sortSelect.value;
    const products = db.getProducts();
    
    let sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => {
                const aReviews = db.getReviewsByProductId(a.id);
                const bReviews = db.getReviewsByProductId(b.id);
                const aRating = aReviews.length > 0 ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length : 0;
                const bRating = bReviews.length > 0 ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length : 0;
                return bRating - aRating;
            });
            break;
        default:
            sortedProducts = products;
    }
    
    displayProducts(sortedProducts);
}

// Reset filters
function resetFilters() {
    const filterSelect = document.getElementById('filterSelect');
    const sortSelect = document.getElementById('sortSelect');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const productsTitle = document.getElementById('productsTitle');
    
    if (filterSelect) filterSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'default';
    if (resetFilterBtn) resetFilterBtn.classList.add('hidden');
    if (productsTitle) productsTitle.textContent = 'Featured Products';
    
    displayProducts();
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayProducts();
        return;
    }
    
    const products = db.getProducts();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

// Show login modal
function showLoginModal() {
    // Create login modal HTML if it doesn't exist
    let loginModal = document.getElementById('loginModal');
    if (!loginModal) {
        loginModal = document.createElement('div');
        loginModal.id = 'loginModal';
        loginModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden';
        loginModal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg max-w-md w-full">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Login / Register</h2>
                            <button id="closeLoginModal" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div id="loginFormDiv">
                            <form id="loginForm" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" id="loginPhone" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" id="loginPassword" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                                <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                                    Login
                                </button>
                            </form>
                            <p class="text-center mt-4 text-sm text-gray-600">
                                Don't have an account? 
                                <button id="showRegister" class="text-purple-600 hover:text-purple-700">Register here</button>
                            </p>
                        </div>
                        
                        <div id="registerFormDiv" class="hidden">
                            <form id="registerForm" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" id="registerName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" id="registerPhone" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                                    <input type="email" id="registerEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
                                    <textarea id="registerAddress" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" id="registerPassword" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                                <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                                    Register
                                </button>
                            </form>
                            <p class="text-center mt-4 text-sm text-gray-600">
                                Already have an account? 
                                <button id="showLogin" class="text-purple-600 hover:text-purple-700">Login here</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(loginModal);
        
        // Setup event listeners for login modal
        document.getElementById('closeLoginModal').addEventListener('click', () => {
            loginModal.classList.add('hidden');
        });
        
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
        
        document.getElementById('showRegister').addEventListener('click', () => {
            document.getElementById('loginFormDiv').classList.add('hidden');
            document.getElementById('registerFormDiv').classList.remove('hidden');
        });
        
        document.getElementById('showLogin').addEventListener('click', () => {
            document.getElementById('registerFormDiv').classList.add('hidden');
            document.getElementById('loginFormDiv').classList.remove('hidden');
        });
    }
    
    loginModal.classList.remove('hidden');
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    const customer = db.authenticateCustomer(phone, password);
    
    if (!customer) {
        showNotification('Invalid phone number or password!', 'error');
        return;
    }
    
    currentUser = customer;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    document.getElementById('loginModal').classList.add('hidden');
    updateUserInterface();
    showNotification(`Welcome back, ${currentUser.name}!`, 'success');
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const email = document.getElementById('registerEmail').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    
    // Check if customer already exists
    if (db.getCustomerByPhone(phone)) {
        showNotification('Customer with this phone number already exists!', 'error');
        return;
    }
    
    const customer = db.addCustomer({
        name: name,
        phone: phone,
        email: email,
        address: address,
        password: password
    });
    
    currentUser = customer;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    document.getElementById('loginModal').classList.add('hidden');
    updateUserInterface();
    showNotification(`Welcome, ${currentUser.name}! Your account has been created.`, 'success');
}

// Update user interface
function updateUserInterface() {
    const profileBtn = document.getElementById('profileBtn');
    
    if (currentUser) {
        profileBtn.innerHTML = '<i class="fas fa-user-check text-green-500 text-xl"></i>';
        profileBtn.title = `Logged in as ${currentUser.name}`;
    } else {
        profileBtn.innerHTML = '<i class="fas fa-user text-xl"></i>';
        profileBtn.title = 'Login / Register';
    }
}

// Display user profile
function displayUserProfile() {
    if (!currentUser) return;
    
    const profileContent = document.getElementById('profileContent');
    const customerOrders = db.getOrders().filter(order => order.customerId === currentUser.id);
    const customerReviews = db.getReviews().filter(review => review.customerId === currentUser.id);
    
    profileContent.innerHTML = `
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-semibold mb-3">Personal Information</h3>
                <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Name:</strong> ${currentUser.name}</p>
                    <p><strong>Phone:</strong> ${currentUser.phone}</p>
                    <p><strong>Email:</strong> ${currentUser.email || 'Not provided'}</p>
                    <p><strong>Address:</strong> ${currentUser.address || 'Not provided'}</p>
                    <p><strong>Member since:</strong> ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div>
                <h3 class="text-lg font-semibold mb-3">Order History (${customerOrders.length})</h3>
                <div class="max-h-60 overflow-y-auto space-y-2">
                    ${customerOrders.length > 0 ? customerOrders.map(order => `
                        <div class="border p-3 rounded-lg">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-medium">Order #${order.id}</span>
                                <span class="text-sm text-gray-500">${new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <p class="text-sm text-gray-600">${order.items ? order.items.length : 0} items - ₹${order.total || 0}</p>
                            <span class="inline-block px-2 py-1 text-xs rounded ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }">${order.status}</span>
                        </div>
                    `).join('') : '<p class="text-gray-500">No orders yet</p>'}
                </div>
            </div>
            
            <div>
                <h3 class="text-lg font-semibold mb-3">My Reviews (${customerReviews.length})</h3>
                <div class="max-h-40 overflow-y-auto space-y-2">
                    ${customerReviews.length > 0 ? customerReviews.map(review => {
                        const product = db.getProductById(review.productId);
                        return `
                            <div class="border p-3 rounded-lg">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-medium">${product ? product.name : 'Product not found'}</span>
                                    <div>${generateStarRating(review.rating)}</div>
                                </div>
                                <p class="text-sm text-gray-600">${review.comment}</p>
                                <small class="text-gray-400">${new Date(review.date).toLocaleDateString()}</small>
                            </div>
                        `;
                    }).join('') : '<p class="text-gray-500">No reviews yet</p>'}
                </div>
            </div>
            
            <button onclick="logout()" class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                Logout
            </button>
        </div>
    `;
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    document.getElementById('profileModal').classList.add('hidden');
    showNotification('Logged out successfully', 'success');
}

// Open review modal
function openReviewModal(productId) {
    if (!currentUser) {
        showNotification('Please login to write a review', 'error');
        showLoginModal();
        return;
    }
    
    document.getElementById('reviewProductId').value = productId;
    document.getElementById('reviewModal').classList.remove('hidden');
    setupReviewStars();
}

// Setup review stars
function setupReviewStars() {
    let selectedRating = 0;
    
    document.querySelectorAll('.star-rating').forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            document.getElementById('selectedRating').value = selectedRating;
            updateStarDisplay(selectedRating);
        });
        
        star.addEventListener('mouseover', () => {
            updateStarDisplay(parseInt(star.dataset.rating));
        });
    });
    
    document.getElementById('reviewModal').addEventListener('mouseleave', () => {
        updateStarDisplay(selectedRating);
    });
    
    function updateStarDisplay(rating) {
        document.querySelectorAll('.star-rating').forEach((star, index) => {
            const icon = star.querySelector('i');
            if (index < rating) {
                icon.className = 'fas fa-star text-2xl text-yellow-400';
            } else {
                icon.className = 'far fa-star text-2xl text-yellow-400';
            }
        });
    }
}

// Handle review submit
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('reviewProductId').value;
    const reviewerName = document.getElementById('reviewerName').value;
    const rating = document.getElementById('selectedRating').value;
    const comment = document.getElementById('reviewComment').value;
    
    if (!rating) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    const review = {
        productId: parseInt(productId),
        customerId: currentUser.id,
        customerName: reviewerName,
        rating: parseInt(rating),
        comment: comment
    };
    
    db.addReview(review);
    showNotification('Review submitted successfully!', 'success');
    
    document.getElementById('reviewModal').classList.add('hidden');
    document.getElementById('reviewForm').reset();
    
    // Refresh product details if modal is open
    if (!document.getElementById('productModal').classList.contains('hidden')) {
        showProductDetails(productId);
    }
}

// Generate star rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-yellow-400"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-yellow-400"></i>';
    }
    
    return starsHtml;
}

// Utility functions
function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

function scrollToHero() {
    document.getElementById('heroSection').scrollIntoView({ behavior: 'smooth' });
}

function contactWhatsApp() {
    const settings = db.getSettings();
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=Hello! I would like to get in touch with Liinnx.`;
    window.open(whatsappUrl, '_blank');
}

function openSizeGuide() {
    document.getElementById('sizeGuideModal').classList.remove('hidden');
}

function closeSizeGuide() {
    document.getElementById('sizeGuideModal').classList.add('hidden');
}

function openReturnPolicy() {
    document.getElementById('infoModalTitle').textContent = 'Return Policy';
    document.getElementById('infoModalContent').innerHTML = `
        <div class="space-y-4">
            <h3 class="font-semibold">Easy Returns</h3>
            <p>We offer hassle-free returns within 7 days of delivery.</p>
            <h3 class="font-semibold">Return Process</h3>
            <ol class="list-decimal list-inside space-y-2">
                <li>Contact us via WhatsApp with your order details</li>
                <li>Pack the item in original packaging</li>
                <li>We'll arrange pickup from your location</li>
                <li>Refund will be processed within 3-5 business days</li>
            </ol>
            <h3 class="font-semibold">Conditions</h3>
            <ul class="list-disc list-inside space-y-1">
                <li>Item must be unused and in original condition</li>
                <li>Original tags and packaging must be intact</li>
                <li>Beauty products cannot be returned for hygiene reasons</li>
            </ul>
        </div>
    `;
    document.getElementById('infoModal').classList.remove('hidden');
}

function openShippingInfo() {
    document.getElementById('infoModalTitle').textContent = 'Shipping Information';
    document.getElementById('infoModalContent').innerHTML = `
        <div class="space-y-4">
            <h3 class="font-semibold">Delivery Time</h3>
            <p>We deliver within 3-7 business days across India.</p>
            <h3 class="font-semibold">Shipping Charges</h3>
            <ul class="list-disc list-inside space-y-1">
                <li>Free shipping on orders above ₹999</li>
                <li>₹99 shipping charges for orders below ₹999</li>
                <li>Express delivery available for ₹199 extra</li>
            </ul>
            <h3 class="font-semibold">Delivery Areas</h3>
            <p>We deliver to all major cities and towns across India. Remote areas may take additional 2-3 days.</p>
        </div>
    `;
    document.getElementById('infoModal').classList.remove('hidden');
}

function trackOrder() {
    const orderNumber = prompt('Enter your order number:');
    if (orderNumber) {
        const settings = db.getSettings();
        const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=Hi! I would like to track my order number: ${orderNumber}`;
        window.open(whatsappUrl, '_blank');
    }
}

function closeInfoModal() {
    document.getElementById('infoModal').classList.add('hidden');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}