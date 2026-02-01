// ================================================
// Star Maker Computer Store - JavaScript
// ================================================

// ===== Global State =====
// ===== Global State =====
let currentLanguage = localStorage.getItem('language') === 'en' ? 'en' : 'ar';
let currentTheme = localStorage.getItem('theme') || 'dark';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== Supabase Config =====
const SUPABASE_URL = 'https://vvksnutgvnqjoxvgpljc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a3NudXRndm5xam94dmdwbGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjMxMjMsImV4cCI6MjA4NTQ5OTEyM30.WOcnngl5gFijUoIUtydSPGFndGNfXxpjCrPG7YoHCPM';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Translations Object =====
// ... (Translations remain the same) ...
const translations = {
    en: {
        cartEmpty: "Your cart is empty",
        total: "Total:",
        egp: "EGP",
        selectDevice: "Select device type",
        desktop: "Desktop Computer",
        laptop: "Laptop",
        other: "Other"
    },
    ar: {
        cartEmpty: "سلتك فارغة",
        total: "الإجمالي:",
        egp: "جنيه",
        selectDevice: "اختر نوع الجهاز",
        desktop: "كمبيوتر مكتبي",
        laptop: "لابتوب",
        other: "آخر"
    }
};

// ===== Load Products from Supabase =====
async function loadProducts() {
    console.log('🔄 loadProducts() called');
    console.log('📡 Supabase client:', supabase);

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('📦 Products received:', products);
        console.log('❌ Error:', error);

        if (error) {
            console.error('❌ Error loading products:', error);
            alert('خطأ في تحميل المنتجات: ' + error.message);
            return;
        }

        if (!products || products.length === 0) {
            console.warn('⚠️ No products found in database');
            alert('لا توجد منتجات في قاعدة البيانات');
            return;
        }

        console.log(`✅ Found ${products.length} products`);

        // Display the products
        displayProducts(products);

        // Initialize product card interactions
        initializeProductCards();

    } catch (err) {
        console.error('💥 Error fetching products:', err);
        alert('خطأ في الاتصال بقاعدة البيانات: ' + err.message);
    }
}

// ===== Display Products =====
function displayProducts(products) {
    console.log('🎨 displayProducts() called with', products.length, 'products');

    const container = document.getElementById('products-container');
    console.log('📦 products-container element:', container);

    if (!container) {
        console.log('⚡ No single container, using renderByCategory()');
        // If there's no single container, render by category
        renderByCategory(products);
        return;
    }

    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-price', product.price);
        productCard.setAttribute('data-name-en', product.name_en);
        productCard.setAttribute('data-name-ar', product.name_ar);
        productCard.setAttribute('data-category', product.category);

        // Create product image
        const img = document.createElement('img');
        img.src = product.image_url;
        img.alt = product.name_en;
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';

        // Create product name
        const name = document.createElement('h3');
        name.textContent = currentLanguage === 'en' ? product.name_en : product.name_ar;

        // Create product price
        const price = document.createElement('p');
        price.textContent = `${product.price} ${currentLanguage === 'en' ? 'EGP' : 'جنيه'}`;

        // Create add to cart button
        const button = document.createElement('button');
        button.className = 'btn btn-add-cart';
        button.textContent = currentLanguage === 'en' ? 'Add to Cart' : 'أضف للسلة';

        // Append all elements
        productCard.appendChild(img);
        productCard.appendChild(name);
        productCard.appendChild(price);
        productCard.appendChild(button);

        container.appendChild(productCard);
    });

    console.log('✅ displayProducts() completed');
}

// ===== Render Products by Category =====
function renderByCategory(products) {
    console.log('📂 renderByCategory() called with', products.length, 'products');

    // Group products by category
    const computers = products.filter(p => p.category === 'computers');
    const laptops = products.filter(p => p.category === 'laptops');
    const parts = products.filter(p => p.category === 'parts');
    const accessories = products.filter(p => p.category === 'accessories');

    console.log(`💻 Computers: ${computers.length}`);
    console.log(`💼 Laptops: ${laptops.length}`);
    console.log(`🧩 Parts: ${parts.length}`);
    console.log(`🖨️ Accessories: ${accessories.length}`);

    // Render each category
    renderCategory('computers-grid', computers);
    renderCategory('laptops-grid', laptops);
    renderCategory('parts-grid', parts);
    renderCategory('accessories-grid', accessories);

    console.log('✅ renderByCategory() completed');
}

function renderCategory(elementId, products) {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-price', product.price);
        productCard.setAttribute('data-name-en', product.name_en);
        productCard.setAttribute('data-name-ar', product.name_ar);
        productCard.setAttribute('data-category', product.category);

        // Create product image
        const img = document.createElement('img');
        img.src = product.image_url;
        img.alt = product.name_en;
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';

        // Create product name
        const name = document.createElement('h3');
        name.textContent = currentLanguage === 'en' ? product.name_en : product.name_ar;
        name.className = 'product-name';

        // Create product price
        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = `${product.price} ${currentLanguage === 'en' ? 'EGP' : 'جنيه'}`;

        // Create add to cart button
        const button = document.createElement('button');
        button.className = 'btn btn-add-cart';
        button.textContent = currentLanguage === 'en' ? 'Add to Cart' : 'أضف للسلة';

        // Append all elements
        productCard.appendChild(img);
        productCard.appendChild(name);
        productCard.appendChild(price);
        productCard.appendChild(button);

        container.appendChild(productCard);
    });
}

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
// ... (DOM elements remain same) ...
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', async () => {
    initializeTheme();
    initializeLanguage();
    initializeScrollAnimations();
    initializeNavigation();
    updateCartUI();
    initializeBookingForm();

    // Load and display products from Supabase
    await loadProducts();
});

// ===== Theme Handling =====
function initializeTheme() {
    // 🟢 Solution 3: Fix Theme Logic using classList
    applyTheme(currentTheme);
    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
            updateThemeIcon();
        });
    }
}

function applyTheme(theme) {
    // Use classList toggle as requested for cleaner CSS support
    // body.light-theme is what CSS expects
    document.body.classList.toggle('light-theme', theme === 'light');
    // Keep data attribute for consistency if other CSS uses it, but class is primary
    document.documentElement.setAttribute('data-theme', theme);
}

function updateThemeIcon() {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    // ... (rest remains same)
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// ===== Language Handling =====
function initializeLanguage() {
    updateLanguageUI();

    if (langToggle) {
        langToggle.addEventListener('click', async () => {
            currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
            localStorage.setItem('language', currentLanguage);
            updateLanguageUI();

            // Re-render content
            await loadProducts();
            updateCartUI();
        });
    }
}

function updateLanguageUI() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'en' ? 'ltr' : 'rtl';

    // Toggle Button Text
    const langText = document.querySelector('.lang-text');
    if (langText) langText.textContent = currentLanguage === 'en' ? 'AR' : 'EN';

    // Update Text Elements
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            // Safe update for text-only elements or specific containers
            if (element.children.length === 0 || element.classList.contains('nav-link')) {
                element.textContent = text;
            }
        }
    });
}

// ===== Navigation =====
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== Scroll Actions =====
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== Product Card Interaction =====

function initializeProductCards() {
    // We need to re-select buttons because they are now dynamic
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const productCards = document.querySelectorAll('.product-card');


    // ===== Add to cart via button =====
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // مهم علشان ما يتحسبش ضغطتين

            const card = e.target.closest('.product-card');
            const product = {
                name: card.getAttribute(`data-name-${currentLanguage}`),
                nameEn: card.getAttribute('data-name-en'),
                nameAr: card.getAttribute('data-name-ar'),
                price: parseInt(card.getAttribute('data-price')),
                quantity: 1
            };

            addToCart(product);

            // Visual feedback
            button.textContent = currentLanguage === 'en' ? '✓ Added!' : '✓ تمت الإضافة!';
            button.style.background = '#00dd77';

            setTimeout(() => {
                button.textContent = currentLanguage === 'en' ? 'Add to Cart' : 'أضف للسلة';
                button.style.background = '';
            }, 1500);
        });
    });

    // ===== Add to cart via clicking the whole card =====
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const product = {
                name: card.getAttribute(`data-name-${currentLanguage}`),
                nameEn: card.getAttribute('data-name-en'),
                nameAr: card.getAttribute('data-name-ar'),
                price: parseInt(card.getAttribute('data-price')),
                quantity: 1
            };

            addToCart(product);
        });
    });
}


function addToCart(product) {
    const existingProduct = cart.find(item => item.nameEn === product.nameEn);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(productNameEn) {
    cart = cart.filter(item => item.nameEn !== productNameEn);
    saveCart();
    updateCartUI();
}

function updateQuantity(productNameEn, change) {
    const product = cart.find(item => item.nameEn === productNameEn);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productNameEn);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    if (totalItems === 0) {
        cartBadge.style.display = 'none';
    } else {
        cartBadge.style.display = 'flex';
    }

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>${translations[currentLanguage].cartEmpty}</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => {
            const name = currentLanguage === 'en' ? item.nameEn : item.nameAr;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)} ${translations[currentLanguage].egp}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${item.nameEn}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.nameEn}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-remove" onclick="removeFromCart('${item.nameEn}')">×</button>
                </div>
            `;
        }).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `${formatPrice(total)} <span>${translations[currentLanguage].egp}</span>`;

    // Update checkout button
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => checkout();
    }
}

function formatPrice(price) {
    return price.toLocaleString('en-US');
}

function checkout() {
    if (cart.length === 0) return;

    // Create WhatsApp message
    let message = currentLanguage === 'en'
        ? `Hello! I would like to order:\n\n`
        : `مرحباً! أود طلب:\n\n`;

    cart.forEach(item => {
        const name = currentLanguage === 'en' ? item.nameEn : item.nameAr;
        message += `${name} x${item.quantity} - ${formatPrice(item.price * item.quantity)} ${translations[currentLanguage].egp}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n${translations[currentLanguage].total} ${formatPrice(total)} ${translations[currentLanguage].egp}`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/201146294772?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
}

// Cart modal controls
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Make functions globally accessible
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

// ===== Booking Form =====
function initializeBookingForm() {
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            deviceType: document.getElementById('deviceType').value,
            problem: document.getElementById('problem').value,
            appointmentTime: document.getElementById('appointmentTime').value
        };

        // Hide form and show success message
        bookingForm.style.display = 'none';
        bookingSuccess.style.display = 'block';

        // Send to WhatsApp (optional)
        const message = currentLanguage === 'en'
            ? `Maintenance Booking:\n\nName: ${formData.name}\nPhone: ${formData.phone}\nDevice: ${formData.deviceType}\nProblem: ${formData.problem}\nTime: ${formData.appointmentTime}`
            : `حجز صيانة:\n\nالاسم: ${formData.name}\nالهاتف: ${formData.phone}\nالجهاز: ${formData.deviceType}\nالمشكلة: ${formData.problem}\nالوقت: ${formData.appointmentTime}`;

        // Auto-send to WhatsApp after 2 seconds
        setTimeout(() => {
            const whatsappUrl = `https://wa.me/201146294772?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }, 2000);

        // Reset form after 5 seconds
        setTimeout(() => {
            bookingForm.reset();
            bookingForm.style.display = 'block';
            bookingSuccess.style.display = 'none';
        }, 5000);
    });
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // ESC to close cart
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
        closeCart();
    }

    // Ctrl/Cmd + K to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        themeToggle.click();
    }

    // Ctrl/Cmd + L to toggle language
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        langToggle.click();
    }
});

// ===== Performance Optimization =====
// Lazy load images (if we add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ===== Console Easter Egg =====
console.log(`
%c⭐ Star Maker Computer Store ⭐
%cBuilt with ❤️ using vanilla HTML, CSS & JavaScript
%cLooking for a developer? Contact us!
`,
    'color: #00B4D8; font-size: 20px; font-weight: bold;',
    'color: #00FF88; font-size: 14px;',
    'color: #B0B8C8; font-size: 12px;'
);

// ==========================================
// ===== ADMIN LOGIC REMOVED =====
// Logic moved to admin.html & js/admin.js
// ==========================================
