// ==========================================
// ===== ADMIN PAGE LOGIC =====
// ==========================================

// ===== Supabase Config =====
// TODO: USER MUST REPLACE THESE VALUES
const supabaseUrl = 'https://vvksnutgvnqjoxvgpljc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a3NudXRndm5xam94dmdwbGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjMxMjMsImV4cCI6MjA4NTQ5OTEyM30.WOcnngl5gFijUoIUtydSPGFndGNfXxpjCrPG7YoHCPM';

// 🟢 Robust Initialization
// 🟢 Robust Initialization
let supabaseClient = null;
try {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
} catch (e) {
    console.error("Supabase failed to initialize:", e);
}

// Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const adminPinInput = document.getElementById('adminPinInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Form Elements
const addProductForm = document.getElementById('addProductForm');
const imageUploadContainer = document.getElementById('imageUploadContainer');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check Authentication
    const isAuth = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (isAuth) {
        showDashboard();
    }

    // Event Listeners
    setupListeners();
});

function setupListeners() {
    // Login
    loginBtn.addEventListener('click', handleLogin);
    adminPinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        window.location.reload();
    });

    // Image Upload
    imageUploadContainer.addEventListener('click', () => {
        productImageInput.click();
    });

    productImageInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Form Submit
    addProductForm.addEventListener('submit', handleAddProduct);
}

function handleLogin() {
    const pin = adminPinInput.value;
    if (pin === '1234') {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        showDashboard();
    } else {
        loginError.style.display = 'block';
        adminPinInput.value = '';
    }
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function handleAddProduct(e) {
    e.preventDefault();

    const nameEn = document.getElementById('prodNameEn').value;
    const nameAr = document.getElementById('prodNameAr').value;
    const price = document.getElementById('prodPrice').value;
    const category = document.getElementById('prodCategory').value;
    const imageFile = productImageInput.files[0];

    if (!imageFile) {
        alert('Please select an image');
        return;
    }

    // Convert image to Base64
    const reader = new FileReader();
    reader.onload = async function (event) {
        const base64Image = event.target.result;

        // Show loading state
        const originalBtnText = addProductForm.querySelector('button[type="submit"]').textContent;
        addProductForm.querySelector('button[type="submit"]').textContent = 'Adding...';
        addProductForm.querySelector('button[type="submit"]').disabled = true;

        try {
            const { data, error } = await supabaseClient
                .from('products')
                .insert([
                    {
                        category: category,
                        image_url: base64Image, // Storing base64 as requested
                        price: parseInt(price),
                        name_en: nameEn,
                        name_ar: nameAr,
                        featured: false
                    }
                ]);

            if (error) throw error;

            // Success Feedback
            alert('Product Added to Database Successfully!');

            // Reset Form
            addProductForm.reset();
            imagePreview.style.display = 'none';

        } catch (err) {
            console.error('Error adding product:', err);
            alert('Error adding product: ' + err.message);
        } finally {
            // Restore button state
            addProductForm.querySelector('button[type="submit"]').textContent = originalBtnText;
            addProductForm.querySelector('button[type="submit"]').disabled = false;
        }
    };

    reader.readAsDataURL(imageFile);
}


