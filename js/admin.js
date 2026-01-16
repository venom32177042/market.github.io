// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadStoreData();
    setupNavigation();
    setupEventListeners();
    updateCategorySelect(); // تحديث قائمة الفئات عند التحميل
    displayProducts();
    displayCategories();
    displayStoreSettings();
});

// تحميل بيانات المتجر
function loadStoreData() {
    const savedData = localStorage.getItem('storeData');
    if (savedData) {
        window.storeData = JSON.parse(savedData);
    } else {
        window.storeData = {
            phone: "+963 123 456 789",
            whatsapp: "https://wa.me/963123456789",
            facebook: "https://facebook.com/ourstore",
            categories: ["إلكترونيات", "ملابس", "أجهزة منزلية", "ألعاب", "كتب"],
            products: []
        };
    }
    
    // التأكد من وجود مصفوفة الفئات
    if (!window.storeData.categories) {
        window.storeData.categories = ["إلكترونيات", "ملابس", "أجهزة منزلية", "ألعاب", "كتب"];
    }
    
    // التأكد من وجود مصفوفة المنتجات
    if (!window.storeData.products) {
        window.storeData.products = [];
    }
}

// حفظ بيانات المتجر
function saveStoreData() {
    localStorage.setItem('storeData', JSON.stringify(window.storeData));
    if (window.storeApp) {
        window.storeApp.updateStoreData(window.storeData);
    }
}

// تحديث قائمة الفئات في نموذج المنتج
function updateCategorySelect() {
    const categorySelect = document.getElementById('product-category');
    if (!categorySelect) return;
    
    const currentValue = categorySelect.value;
    categorySelect.innerHTML = '<option value="">-- اختر الفئة --</option>';
    
    if (window.storeData.categories && window.storeData.categories.length > 0) {
        window.storeData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = "عام";
        option.textContent = "عام";
        categorySelect.appendChild(option);
    }
    
    if (currentValue && Array.from(categorySelect.options).some(opt => opt.value === currentValue)) {
        categorySelect.value = currentValue;
    }
}

// عرض المنتجات في لوحة التحكم
function displayProducts() {
    const productsTableBody = document.getElementById('products-table-body');
    productsTableBody.innerHTML = '';
    
    if (!window.storeData.products || window.storeData.products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">
                    <p>لا توجد منتجات حالياً. قم بإضافة منتج جديد.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    window.storeData.products.forEach(product => {
        const imagePath = `images/products/${product.image}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagePath}" alt="${product.name}" class="product-image-admin" onerror="this.onerror=null; this.src='https://via.placeholder.com/60?text=صورة'">
            </td>
            <td>${product.name}</td>
            <td>${formatPrice(product.price)} ل.س</td>
            <td><span class="category-tag">${product.category}</span></td>
            <td class="action-buttons">
                <button class="btn btn-primary edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

// تنسيق السعر
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// عرض الفئات في لوحة التحكم
function displayCategories() {
    const categoriesContainer = document.getElementById('categories-list-container');
    categoriesContainer.innerHTML = '';
    
    if (!window.storeData.categories || window.storeData.categories.length === 0) {
        categoriesContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                <p>لا توجد فئات حالياً. قم بإضافة فئة جديدة.</p>
            </div>
        `;
        return;
    }
    
    window.storeData.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item-admin';
        categoryElement.style.cssText = `
            display: inline-block;
            background-color: #e8f4fc;
            color: #3498db;
            padding: 10px 15px;
            border-radius: 20px;
            margin: 5px;
            font-weight: 600;
        `;
        categoryElement.textContent = category;
        categoriesContainer.appendChild(categoryElement);
    });
}

// عرض إعدادات المتجر
function displayStoreSettings() {
    document.getElementById('current-phone').textContent = window.storeData.phone;
    document.getElementById('current-whatsapp').textContent = window.storeData.whatsapp;
    document.getElementById('current-facebook').textContent = window.storeData.facebook;
    
    document.getElementById('store-phone').value = window.storeData.phone;
    document.getElementById('store-whatsapp').value = window.storeData.whatsapp;
    document.getElementById('store-facebook').value = window.storeData.facebook;
}

// إعداد معالجات الأحداث
function setupEventListeners() {
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    document.getElementById('cancel-edit').addEventListener('click', cancelEdit);
    
    document.getElementById('add-category').addEventListener('click', addNewCategory);
    
    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveStoreSettings();
    });
    
    document.getElementById('products-table-body').addEventListener('click', function(e) {
        if (e.target.closest('.edit-product')) {
            const productId = parseInt(e.target.closest('.edit-product').dataset.id);
            editProduct(productId);
        }
        
        if (e.target.closest('.delete-product')) {
            const productId = parseInt(e.target.closest('.delete-product').dataset.id);
            deleteProduct(productId);
        }
    });
}

// إعداد التنقل بين الأقسام
function setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav li');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            
            sections.forEach(section => {
                section.classList.remove('active-section');
                section.style.display = 'none';
            });
            
            const activeSection = document.getElementById(sectionId);
            activeSection.classList.add('active-section');
            activeSection.style.display = 'block';
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            if (sectionId === 'products-section') {
                displayProducts();
                updateCategorySelect();
            } else if (sectionId === 'categories-section') {
                displayCategories();
            } else if (sectionId === 'settings-section') {
                displayStoreSettings();
            }
        });
    });
    
    const activeSection = document.querySelector('.admin-section.active-section');
    if (activeSection) {
        activeSection.style.display = 'block';
        if (activeSection.id === 'products-section') {
            updateCategorySelect();
        }
    }
}

// حفظ المنتج
function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const category = document.getElementById('product-category').value;
    
    if (!name || !price || !image || !category) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    const product = {
        id: productId ? parseInt(productId) : generateProductId(),
        name,
        price,
        description,
        image,
        category
    };
    
    if (productId) {
        const index = window.storeData.products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            window.storeData.products[index] = product;
        }
    } else {
        window.storeData.products.push(product);
    }
    
    saveStoreData();
    displayProducts();
    resetProductForm();
    alert(productId ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
}

// إنشاء معرف فريد للمنتج
function generateProductId() {
    const maxId = window.storeData.products.length > 0 
        ? Math.max(...window.storeData.products.map(p => p.id)) 
        : 0;
    return maxId + 1;
}

// تعديل منتج
function editProduct(productId) {
    const product = window.storeData.products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-category').value = product.category;
    
    document.getElementById('form-title').textContent = 'تعديل المنتج';
    document.getElementById('cancel-edit').style.display = 'inline-block';
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
}

// إلغاء التعديل
function cancelEdit() {
    resetProductForm();
}

// إعادة تعيين نموذج المنتج
function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').textContent = 'إضافة منتج جديد';
    document.getElementById('cancel-edit').style.display = 'none';
    
    if (window.storeData.categories && window.storeData.categories.length > 0) {
        document.getElementById('product-category').value = window.storeData.categories[0];
    }
}

// حذف منتج
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        window.storeData.products = window.storeData.products.filter(p => p.id !== productId);
        saveStoreData();
        displayProducts();
        alert('تم حذف المنتج بنجاح');
    }
}

// إضافة فئة جديدة
function addNewCategory() {
    const newCategoryInput = document.getElementById('new-category');
    const categoryName = newCategoryInput.value.trim();
    
    if (!categoryName) {
        alert('يرجى إدخال اسم الفئة');
        return;
    }
    
    if (window.storeData.categories.includes(categoryName)) {
        alert('هذه الفئة موجودة بالفعل');
        return;
    }
    
    window.storeData.categories.push(categoryName);
    saveStoreData();
    displayCategories();
    updateCategorySelect();
    newCategoryInput.value = '';
    alert('تم إضافة الفئة بنجاح');
}

// حفظ إعدادات المتجر
function saveStoreSettings() {
    const phone = document.getElementById('store-phone').value.trim();
    const whatsapp = document.getElementById('store-whatsapp').value.trim();
    const facebook = document.getElementById('store-facebook').value.trim();
    
    if (!phone || !whatsapp || !facebook) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    window.storeData.phone = phone;
    window.storeData.whatsapp = whatsapp;
    window.storeData.facebook = facebook;
    
    saveStoreData();
    displayStoreSettings();
    alert('تم حفظ إعدادات المتجر بنجاح');
                          }
