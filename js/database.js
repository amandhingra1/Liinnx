// Local Database Implementation (simulating MongoDB structure)
class Database {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('liinnx_products') || '[]');
        this.orders = JSON.parse(localStorage.getItem('liinnx_orders') || '[]');
        this.reviews = JSON.parse(localStorage.getItem('liinnx_reviews') || '[]');
        this.customers = JSON.parse(localStorage.getItem('liinnx_customers') || '[]');
        this.settings = JSON.parse(localStorage.getItem('liinnx_settings') || '{}');
        this.initializeDefaultData();
    }

    initializeDefaultData() {
        if (this.products.length === 0) {
            this.products = [
                {
                    id: 1,
                    name: "Men's Cotton T-Shirt",
                    category: "men",
                    price: 899,
                    originalPrice: 1299,
                    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
                    description: "Comfortable cotton t-shirt perfect for casual wear. Made from 100% premium cotton with a relaxed fit.",
                    brand: "StyleCraft",
                    rating: 4.5,
                    reviews: 156,
                    stock: 50,
                    sizes: ["S", "M", "L", "XL"],
                    colors: ["Black", "White", "Navy"]
                },
                {
                    id: 2,
                    name: "Women's Floral Dress",
                    category: "women",
                    price: 1599,
                    originalPrice: 2299,
                    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
                    description: "Beautiful floral dress perfect for summer occasions. Lightweight fabric with elegant design.",
                    brand: "FloralFashion",
                    rating: 4.7,
                    reviews: 89,
                    stock: 30,
                    sizes: ["XS", "S", "M", "L"],
                    colors: ["Pink", "Blue", "Yellow"]
                },
                {
                    id: 3,
                    name: "Kids' Cartoon Hoodie",
                    category: "kids",
                    price: 799,
                    originalPrice: 1199,
                    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg",
                    description: "Fun cartoon hoodie for kids. Soft and warm material perfect for playtime.",
                    brand: "KidStyle",
                    rating: 4.3,
                    reviews: 67,
                    stock: 25,
                    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
                    colors: ["Red", "Blue", "Green"]
                },
                {
                    id: 4,
                    name: "Organic Face Cream",
                    category: "beauty",
                    price: 1299,
                    originalPrice: 1799,
                    image: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg",
                    description: "Natural organic face cream with anti-aging properties. Suitable for all skin types.",
                    brand: "NaturalGlow",
                    rating: 4.6,
                    reviews: 234,
                    stock: 40,
                    sizes: ["50ml"],
                    colors: ["Natural"]
                },
                {
                    id: 5,
                    name: "Men's Denim Jeans",
                    category: "men",
                    price: 1899,
                    originalPrice: 2599,
                    image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg",
                    description: "Classic denim jeans with modern fit. Durable and comfortable for everyday wear.",
                    brand: "DenimCraft",
                    rating: 4.4,
                    reviews: 178,
                    stock: 35,
                    sizes: ["28", "30", "32", "34", "36"],
                    colors: ["Blue", "Black", "Grey"]
                },
                {
                    id: 6,
                    name: "Women's Silk Saree",
                    category: "women",
                    price: 3999,
                    originalPrice: 5999,
                    image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
                    description: "Elegant silk saree perfect for special occasions. Traditional design with modern touch.",
                    brand: "SilkTradition",
                    rating: 4.8,
                    reviews: 92,
                    stock: 15,
                    sizes: ["Free Size"],
                    colors: ["Red", "Gold", "Green", "Blue"]
                }
            ];
            this.saveProducts();
        }

        if (this.reviews.length === 0) {
            this.reviews = [
                {
                    id: 1,
                    productId: 1,
                    customerId: 1,
                    customerName: "Rahul Sharma",
                    rating: 5,
                    comment: "Excellent quality t-shirt! Very comfortable and fits perfectly.",
                    date: "2024-01-15"
                },
                {
                    id: 2,
                    productId: 1,
                    customerId: 2,
                    customerName: "Priya Singh",
                    rating: 4,
                    comment: "Good quality but could be a bit softer.",
                    date: "2024-01-10"
                },
                {
                    id: 3,
                    productId: 2,
                    customerId: 3,
                    customerName: "Anjali Patel",
                    rating: 5,
                    comment: "Beautiful dress! Perfect for summer parties.",
                    date: "2024-01-12"
                }
            ];
            this.saveReviews();
        }

        if (this.customers.length === 0) {
            this.customers = [
                {
                    id: 1,
                    name: "Rahul Sharma",
                    email: "rahul@example.com",
                    phone: "+919876543210",
                    address: "123 Main St, Mumbai, Maharashtra",
                    password: "rahul123",
                    orders: [],
                    joinDate: "2024-01-01"
                },
                {
                    id: 2,
                    name: "Priya Singh",
                    email: "priya@example.com",
                    phone: "+919876543211",
                    address: "456 Park Ave, Delhi, Delhi",
                    password: "priya123",
                    orders: [],
                    joinDate: "2024-01-05"
                },
                {
                    id: 3,
                    name: "Anjali Patel",
                    email: "anjali@example.com",
                    phone: "+919876543212",
                    address: "789 Garden St, Ahmedabad, Gujarat",
                    password: "anjali123",
                    orders: [],
                    joinDate: "2024-01-08"
                }
            ];
            this.saveCustomers();
        }

        if (Object.keys(this.settings).length === 0) {
            this.settings = {
                heroTitle: "Welcome to Liinnx",
                heroSubtitle: "Discover the latest trends in fashion and lifestyle. Shop from thousands of brands and get the best deals.",
                heroBackgroundImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
                whatsappNumber: "+919834828850",
                contactEmail: "support@liinnx.com",
                adminPassword: "admin123",
                copyrightText: "© 2024 Liinnx. All rights reserved.",
                footerDescription: "Your one-stop destination for fashion and lifestyle products."
            };
            this.saveSettings();
        }
    }

    // Products
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === parseInt(id));
    }

    addProduct(product) {
        product.id = Date.now();
        this.products.push(product);
        this.saveProducts();
        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== parseInt(id));
        this.saveProducts();
    }

    saveProducts() {
        localStorage.setItem('liinnx_products', JSON.stringify(this.products));
    }

    // Customers
    getCustomers() {
        return this.customers;
    }

    getCustomerById(id) {
        return this.customers.find(c => c.id === parseInt(id));
    }

    getCustomerByPhone(phone) {
        return this.customers.find(c => c.phone === phone);
    }

    addCustomer(customer) {
        customer.id = Date.now();
        customer.joinDate = new Date().toISOString().split('T')[0];
        customer.orders = [];
        this.customers.push(customer);
        this.saveCustomers();
        return customer;
    }

    updateCustomer(id, updatedCustomer) {
        const index = this.customers.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            this.customers[index] = { ...this.customers[index], ...updatedCustomer };
            this.saveCustomers();
            return this.customers[index];
        }
        return null;
    }

    saveCustomers() {
        localStorage.setItem('liinnx_customers', JSON.stringify(this.customers));
    }

    // Authentication
    authenticateCustomer(phone, password) {
        const customer = this.getCustomerByPhone(phone);
        return customer && customer.password === password ? customer : null;
    }

    // Orders
    getOrders() {
        return this.orders;
    }

    addOrder(order, customerInfo = null) {
        order.id = Date.now();
        order.date = new Date().toISOString().split('T')[0];
        order.status = 'pending';
        
        if (customerInfo) {
            let customer = this.getCustomerByPhone(customerInfo.phone);
            
            if (!customer) {
                customer = this.addCustomer({
                    name: customerInfo.name,
                    phone: customerInfo.phone,
                    email: customerInfo.email || '',
                    address: customerInfo.address || '',
                    password: customerInfo.password || 'default123'
                });
            }
            
            order.customerId = customer.id;
            order.customerName = customer.name;
            customer.orders.push(order.id);
            this.saveCustomers();
        }
        
        this.orders.push(order);
        this.saveOrders();
        return order;
    }

    updateOrderStatus(id, status) {
        const order = this.orders.find(o => o.id === parseInt(id));
        if (order) {
            order.status = status;
            this.saveOrders();
            return order;
        }
        return null;
    }

    saveOrders() {
        localStorage.setItem('liinnx_orders', JSON.stringify(this.orders));
    }

    // Reviews
    getReviews() {
        return this.reviews;
    }

    getReviewsByProductId(productId) {
        return this.reviews.filter(r => r.productId === parseInt(productId));
    }

    addReview(review) {
        review.id = Date.now();
        review.date = new Date().toISOString().split('T')[0];
        this.reviews.push(review);
        this.saveReviews();
        return review;
    }

    deleteReview(id) {
        this.reviews = this.reviews.filter(r => r.id !== parseInt(id));
        this.saveReviews();
    }

    saveReviews() {
        localStorage.setItem('liinnx_reviews', JSON.stringify(this.reviews));
    }

    // Settings
    getSettings() {
        return this.settings;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        return this.settings;
    }

    saveSettings() {
        localStorage.setItem('liinnx_settings', JSON.stringify(this.settings));
    }

    // Statistics
    getStats() {
        const totalRevenue = this.orders
            .filter(order => order.status === 'delivered')
            .reduce((sum, order) => sum + (order.total || 0), 0);

        return {
            totalProducts: this.products.length,
            totalOrders: this.orders.length,
            totalReviews: this.reviews.length,
            totalCustomers: this.customers.length,
            totalRevenue: totalRevenue
        };
    }
}

// Initialize database
const db = new Database();