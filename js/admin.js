// Admin Dashboard JavaScript

let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    setupAdminEventListeners();
    showSection('dashboard');
    loadDashboardStats();
    loadCharts();
});

function setupAdminEventListeners() {
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            showSection(section);
            
            // Update active state
            sidebarItems.forEach(si => si.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Back to homepage button
    const backToHomepage = document.getElementById('backToHomepage');
    if (backToHomepage) {
        backToHomepage.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Product management
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductForm());
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    const closeProductForm = document.getElementById('closeProductForm');
    const cancelProductForm = document.getElementById('cancelProductForm');
    
    if (closeProductForm) closeProductForm.addEventListener('click', closeProductFormModal);
    if (cancelProductForm) cancelProductForm.addEventListener('click', closeProductFormModal);

    // Content management
    const updateHeroBtn = document.getElementById('updateHeroBtn');
    const updateContactBtn = document.getElementById('updateContactBtn');
    const updateFooterBtn = document.getElementById('updateFooterBtn');
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');

    if (updateHeroBtn) updateHeroBtn.addEventListener('click', updateHeroSection);
    if (updateContactBtn) updateContactBtn.addEventListener('click', updateContactInfo);
    if (updateFooterBtn) updateFooterBtn.addEventListener('click', updateFooterContent);
    if (updatePasswordBtn) updatePasswordBtn.addEventListener('click', updatePassword);

    // Search and filter functionality
    setupSearchAndFilters();
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.add('hidden'));

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                loadDashboardStats();
                loadCharts();
                break;
            case 'products':
                loadProductsTable();
                break;
            case 'orders':
                loadOrdersTable();
                break;
            case 'reviews':
                loadReviewsTable();
                break;
            case 'customers':
                loadCustomersTable();
                break;
            case 'content':
                loadContentSettings();
                break;
            case 'settings':
                loadAdminSettings();
                break;
        }
    }
}

function loadDashboardStats() {
    const stats = db.getStats();
    
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('totalReviews').textContent = stats.totalReviews;
    document.getElementById('totalCustomers').textContent = stats.totalCustomers;
    document.getElementById('totalRevenue').textContent = `₹${stats.totalRevenue.toLocaleString()}`;
}

function loadCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && typeof Chart !== 'undefined') {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx && typeof Chart !== 'undefined') {
        const products = db.getProducts();
        const categoryData = {};
        
        products.forEach(product => {
            categoryData[product.category] = (categoryData[product.category] || 0) + 1;
        });

        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
                }]
            },
            options: {
                responsive: true
            }
        });
    }
}

function loadProductsTable() {
    const products = db.getProducts();
    const productsTable = document.getElementById('productsTable');
    
    productsTable.innerHTML = `
        <table class="min-w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${products.map(product => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img src="${product.image}" alt="${product.name}" class="h-10 w-10 rounded-full object-cover">
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${product.name}</div>
                                    <div class="text-sm text-gray-500">${product.brand || 'No Brand'}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                ${product.category}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${product.price}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock || 0}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="editProduct(${product.id})" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                            <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadOrdersTable() {
    const orders = db.getOrders();
    const ordersTable = document.getElementById('ordersTable');
    
    ordersTable.innerHTML = `
        <table class="min-w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${orders.length > 0 ? orders.map(order => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${order.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.customerName || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${order.total || 0}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <select onchange="updateOrderStatus(${order.id}, this.value)" class="text-sm border rounded px-2 py-1">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.date}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="viewOrderDetails(${order.id})" class="text-indigo-600 hover:text-indigo-900">View</button>
                        </td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-gray-500">No orders found</td>
                    </tr>
                `}
            </tbody>
        </table>
    `;
}

function loadReviewsTable() {
    const reviews = db.getReviews();
    const reviewsTable = document.getElementById('reviewsTable');
    
    reviewsTable.innerHTML = `
        <table class="min-w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${reviews.map(review => {
                    const product = db.getProductById(review.productId);
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${review.customerName}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product ? product.name : 'Unknown'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex text-yellow-400">
                                    ${generateStars(review.rating)}
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">${review.comment}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${review.date}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="deleteReview(${review.id})" class="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function loadCustomersTable() {
    const customers = db.getCustomers();
    const customersTable = document.getElementById('customersTable');
    
    customersTable.innerHTML = `
        <table class="min-w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${customers.map(customer => {
                    const customerOrders = db.getOrders().filter(order => order.customerId === customer.id);
                    const customerReviews = db.getReviews().filter(review => review.customerId === customer.id);
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-user text-purple-600"></i>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">${customer.name}</div>
                                        <div class="text-sm text-gray-500">${customer.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.phone}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-mono bg-gray-100 px-2 py-1 rounded">${customer.password || 'N/A'}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customerOrders.length}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customerReviews.length}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.joinDate}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="viewCustomerDetails(${customer.id})" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                                <button onclick="resetCustomerPassword(${customer.id})" class="text-yellow-600 hover:text-yellow-900 mr-4">Reset Password</button>
                                <button onclick="deleteCustomer(${customer.id})" class="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function viewCustomerDetails(customerId) {
    const customer = db.getCustomerById(customerId);
    const customerOrders = db.getOrders().filter(order => order.customerId === customerId);
    const customerReviews = db.getReviews().filter(review => review.customerId === customerId);
    
    const ordersList = customerOrders.map(order => `Order #${order.id} - ₹${order.total || 0} - ${order.status} (${order.date})`).join('\n');
    const reviewsList = customerReviews.map(review => {
        const product = db.getProductById(review.productId);
        return `${product ? product.name : 'Unknown Product'} - ${review.rating} stars - "${review.comment}" (${review.date})`;
    }).join('\n');
    
    alert(`Customer Details:
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${customer.address}
Password: ${customer.password}
Total Orders: ${customerOrders.length}
Total Reviews: ${customerReviews.length}
Member Since: ${customer.joinDate}

Orders:
${ordersList || 'No orders yet'}

Reviews:
${reviewsList || 'No reviews yet'}`);
}

function resetCustomerPassword(customerId) {
    const newPassword = prompt('Enter new password for customer:');
    if (newPassword && newPassword.length >= 6) {
        const customer = db.getCustomerById(customerId);
        if (customer) {
            customer.password = newPassword;
            db.saveCustomers();
            showNotification('Customer password reset successfully!', 'success');
            loadCustomersTable();
        }
    } else if (newPassword !== null) {
        showNotification('Password must be at least 6 characters long!', 'error');
    }
}

function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer? This will also delete their orders and reviews.')) {
        const customers = db.getCustomers();
        const updatedCustomers = customers.filter(c => c.id !== customerId);
        localStorage.setItem('liinnx_customers', JSON.stringify(updatedCustomers));
        
        loadCustomersTable();
        loadDashboardStats();
        showNotification('Customer deleted successfully!', 'success');
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function openProductForm(productId = null) {
    const modal = document.getElementById('productFormModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');
    
    if (productId) {
        const product = db.getProductById(productId);
        if (product) {
            title.textContent = 'Edit Product';
            
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productOriginalPrice').value = product.originalPrice || '';
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productBrand').value = product.brand || '';
            document.getElementById('productStock').value = product.stock || '';
            document.getElementById('productSizes').value = product.sizes ? product.sizes.join(', ') : '';
            document.getElementById('productColors').value = product.colors ? product.colors.join(', ') : '';
        }
    } else {
        title.textContent = 'Add Product';
        form.reset();
        document.getElementById('productId').value = '';
    }
    
    modal.classList.remove('hidden');
}

function closeProductFormModal() {
    document.getElementById('productFormModal').classList.add('hidden');
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const sizesInput = document.getElementById('productSizes').value;
    const colorsInput = document.getElementById('productColors').value;
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: parseFloat(document.getElementById('productOriginalPrice').value) || null,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        brand: document.getElementById('productBrand').value || '',
        stock: parseInt(document.getElementById('productStock').value) || 0,
        rating: 4.0,
        reviews: 0,
        sizes: sizesInput ? sizesInput.split(',').map(s => s.trim()) : ["S", "M", "L", "XL"],
        colors: colorsInput ? colorsInput.split(',').map(c => c.trim()) : ["Black", "White", "Blue"]
    };
    
    const productId = document.getElementById('productId').value;
    
    if (productId) {
        db.updateProduct(productId, productData);
        showNotification('Product updated successfully!', 'success');
    } else {
        db.addProduct(productData);
        showNotification('Product added successfully!', 'success');
    }
    
    closeProductFormModal();
    loadProductsTable();
    loadDashboardStats();
}

function editProduct(productId) {
    openProductForm(productId);
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        db.deleteProduct(productId);
        loadProductsTable();
        loadDashboardStats();
        showNotification('Product deleted successfully!', 'success');
    }
}

function updateOrderStatus(orderId, status) {
    db.updateOrderStatus(orderId, status);
    showNotification('Order status updated!', 'success');
}

function viewOrderDetails(orderId) {
    const order = db.getOrders().find(o => o.id === parseInt(orderId));
    if (order) {
        let details = `Order #${order.id}\n`;
        details += `Customer: ${order.customerName}\n`;
        details += `Phone: ${order.customerPhone || 'N/A'}\n`;
        details += `Email: ${order.customerEmail || 'N/A'}\n`;
        details += `Address: ${order.customerAddress || 'N/A'}\n`;
        details += `Total: ₹${order.total}\n`;
        details += `Status: ${order.status}\n`;
        details += `Date: ${order.date}\n\n`;
        
        if (order.items && order.items.length > 0) {
            details += `Items:\n`;
            order.items.forEach(item => {
                details += `- ${item.name} (${item.size}, ${item.color}) x${item.quantity} = ₹${item.price * item.quantity}\n`;
            });
        }
        
        alert(details);
    }
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        db.deleteReview(reviewId);
        loadReviewsTable();
        loadDashboardStats();
        showNotification('Review deleted successfully!', 'success');
    }
}

function loadContentSettings() {
    const settings = db.getSettings();
    
    document.getElementById('heroTitle').value = settings.heroTitle || '';
    document.getElementById('heroSubtitle').value = settings.heroSubtitle || '';
    document.getElementById('heroBackgroundImage').value = settings.heroBackgroundImage || '';
    document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    document.getElementById('contactEmail').value = settings.contactEmail || '';
    document.getElementById('footerDescription').value = settings.footerDescription || '';
    document.getElementById('copyrightText').value = settings.copyrightText || '';
}

function updateHeroSection() {
    const heroTitle = document.getElementById('heroTitle').value;
    const heroSubtitle = document.getElementById('heroSubtitle').value;
    const heroBackgroundImage = document.getElementById('heroBackgroundImage').value;
    
    db.updateSettings({
        heroTitle: heroTitle,
        heroSubtitle: heroSubtitle,
        heroBackgroundImage: heroBackgroundImage
    });
    
    showNotification('Hero section updated successfully!', 'success');
}

function updateContactInfo() {
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    const contactEmail = document.getElementById('contactEmail').value;
    
    db.updateSettings({
        whatsappNumber: whatsappNumber,
        contactEmail: contactEmail
    });
    
    showNotification('Contact information updated successfully!', 'success');
}

function updateFooterContent() {
    const footerDescription = document.getElementById('footerDescription').value;
    const copyrightText = document.getElementById('copyrightText').value;
    
    db.updateSettings({
        footerDescription: footerDescription,
        copyrightText: copyrightText
    });
    
    showNotification('Footer content updated successfully!', 'success');
}

function loadAdminSettings() {
    document.getElementById('adminPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function updatePassword() {
    const currentPassword = document.getElementById('adminPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const settings = db.getSettings();
    
    if (currentPassword !== settings.adminPassword) {
        showNotification('Current password is incorrect!', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    db.updateSettings({ adminPassword: newPassword });
    showNotification('Password updated successfully!', 'success');
    loadAdminSettings();
}

function setupSearchAndFilters() {
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
    
    const reviewSearch = document.getElementById('reviewSearch');
    if (reviewSearch) {
        reviewSearch.addEventListener('input', filterReviews);
    }
    
    const ratingFilter = document.getElementById('ratingFilter');
    if (ratingFilter) {
        ratingFilter.addEventListener('change', filterReviews);
    }
}

function filterProducts() {
    loadProductsTable();
}

function filterOrders() {
    loadOrdersTable();
}

function filterReviews() {
    loadReviewsTable();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
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