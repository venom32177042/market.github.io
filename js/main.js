// بيانات المتجر الافتراضية بالليرة السورية
let storeData = {
    phone: "+963 123 456 789",
    whatsapp: "https://wa.me/963123456789",
    facebook: "https://facebook.com/ourstore",
    categories: ["إلكترونيات", "ملابس", "أجهزة منزلية", "ألعاب", "كتب"],
    products: [
        {
            id: 1,
            name: "هاتف ذكي متطور",
            price: 250000,
            description: "هاتف ذكي بمواصفات عالية مع كاميرا ممتازة وبطارية تدوم طويلاً.",
            image: "phone.jpg",
            category: "إلكترونيات"
        },
        {
            id: 2,
            name: "قميص رجالي أنيق",
            price: 35000,
            description: "قميص قطني عالي الجودة بتصميم عصري يناسب جميع المناسبات.",
            image: "shirt.jpg",
            category: "ملابس"
        },
        {
            id: 3,
            name: "خلاط طعام متعدد الوظائف",
            price: 85000,
            description: "خلاط طعام قوي مع العديد من الملحقات لتحضير مختلف أنواع الأطعمة.",
            image: "blender.jpg",
            category: "أجهزة منزلية"
        },
        {
            id: 4,
            name: "لعبة أطفال تعليمية",
            price: 25000,
            description: "لعبة تعليمية ممتعة تساعد الأطفال على تنمية مهاراتهم الذهنية.",
            image: "toy.jpg",
            category: "ألعاب"
        },
        {
            id: 5,
            name: "رواية عالمية مشهورة",
            price: 15000,
            description: "رواية أدبية رائعة من تأليف كاتب عالمي معروف بأسلوبه المميز.",
            image: "book.jpg",
            category: "كتب"
        },
        {
            id: 6,
            name: "سماعات لاسلكية عالية الجودة",
            price: 120000,
            description: "سماعات لاسلكية مع عزل ضجيج ممتاز وجودة صوت عالية.",
            image: "headphones.jpg",
            category: "إلكترونيات"
        }
    ]
};

// تهيئة المتجر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadStoreData();
    updateContactInfo();
    displayCategories();
    displayProducts();
    setupEventListeners();
});

// تحميل بيانات المتجر من localStorage
function loadStoreData() {
    const savedData = localStorage.getItem('storeData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // التأكد من وجود جميع الخصائص المطلوبة
        storeData = {
            phone: parsedData.phone || "+963 123 456 789",
            whatsapp: parsedData.whatsapp || "https://wa.me/963123456789",
            facebook: parsedData.facebook || "https://facebook.com/ourstore",
            categories: parsedData.categories || ["إلكترونيات", "ملابس", "أجهزة منزلية", "ألعاب", "كتب"],
            products: parsedData.products || []
        };
    }
}

// حفظ بيانات المتجر إلى localStorage
function saveStoreData() {
    localStorage.setItem('storeData', JSON.stringify(storeData));
}

// تحديث معلومات الاتصال في الواجهة
function updateContactInfo() {
    document.getElementById('store-phone').textContent = storeData.phone;
    document.getElementById('footer-phone').textContent = storeData.phone;
    
    const whatsappLink = document.getElementById('whatsapp-link');
    const footerWhatsapp = document.getElementById('footer-whatsapp');
    whatsappLink.href = storeData.whatsapp;
    footerWhatsapp.href = storeData.whatsapp;
    
    const facebookLink = document.getElementById('facebook-link');
    const footerFacebook = document.getElementById('footer-facebook');
    facebookLink.href = storeData.facebook;
    footerFacebook.href = storeData.facebook;
}

// عرض الفئات
function displayCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    const categoryFilter = document.getElementById('category-filter');
    
    categoriesContainer.innerHTML = '';
    categoryFilter.innerHTML = '<option value="all">جميع الفئات</option>';
    
    const allCategory = document.createElement('div');
    allCategory.className = 'category-item active';
    allCategory.textContent = 'الكل';
    allCategory.dataset.category = 'all';
    categoriesContainer.appendChild(allCategory);
    
    storeData.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.textContent = category;
        categoryElement.dataset.category = category;
        categoriesContainer.appendChild(categoryElement);
        
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            displayProducts(category);
            document.getElementById('category-filter').value = category;
        });
    });
}

// عرض المنتجات
function displayProducts(category = 'all') {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    let filteredProducts = storeData.products;
    if (category !== 'all') {
        filteredProducts = storeData.products.filter(product => product.category === category);
    }
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <h3>لا توجد منتجات في هذه الفئة حالياً</h3>
                <p>يرجى الاطلاع على الفئات الأخرى أو العودة لاحقاً</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const imagePath = `images/products/${product.image}`;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${imagePath}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=صورة+غير+متوفرة'">
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-category">${product.category}</div>
                <button class="view-product-btn" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    const viewButtons = document.querySelectorAll('.view-product-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            showProductDetails(productId);
        });
    });
}

// تنسيق السعر
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// عرض تفاصيل المنتج في النافذة المنبثقة
function showProductDetails(productId) {
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;
    
    const imagePath = `images/products/${product.image}`;
    
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = formatPrice(product.price);
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-category').textContent = product.category;
    document.getElementById('modal-product-image').src = imagePath;
    document.getElementById('modal-product-image').alt = product.name;
    
    const whatsappBtn = document.getElementById('whatsapp-contact');
    whatsappBtn.onclick = function() {
        const message = `مرحباً، أرغب في طلب المنتج التالي:\n\n${product.name}\nالسعر: ${formatPrice(product.price)} ل.س\n\n${product.description}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`${storeData.whatsapp}?text=${encodedMessage}`, '_blank');
    };
    
    const phoneBtn = document.getElementById('phone-contact');
    phoneBtn.onclick = function() {
        window.open(`tel:${storeData.phone.replace(/\s+/g, '')}`, '_blank');
    };
    
    const facebookBtn = document.getElementById('facebook-contact');
    facebookBtn.onclick = function() {
        window.open(storeData.facebook, '_blank');
    };
    
    document.getElementById('product-modal-overlay').style.display = 'flex';
}

// إعداد معالجات الأحداث
function setupEventListeners() {
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('product-modal-overlay').style.display = 'none';
    });
    
    document.getElementById('product-modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    document.getElementById('category-filter').addEventListener('change', function() {
        const category = this.value;
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === category) {
                item.classList.add('active');
            }
        });
        displayProducts(category);
    });
    
    document.getElementById('all-products').addEventListener('click', function(e) {
        e.preventDefault();
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === 'all') {
                item.classList.add('active');
            }
        });
        displayProducts('all');
        document.getElementById('category-filter').value = 'all';
        document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
    });
}

// دالة مساعدة لتحديث بيانات المتجر
function updateStoreData(newData) {
    storeData = newData;
    saveStoreData();
    updateContactInfo();
    displayCategories();
    displayProducts();
}

// جعل الدوال متاحة عالمياً
window.storeApp = {
    updateStoreData,
    getStoreData: () => storeData
};
