// Admin Dashboard Functionality

function getIconMarkup(iconName) {
  const icons = {
    edit: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 20l4.2-1 9.1-9.1-3.2-3.2L5 15.8 4 20z"></path>
        <path d="M13 6.8l3.2 3.2"></path>
      </svg>
    `,
    trash: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 7h14"></path>
        <path d="M9 7V4h6v3"></path>
        <path d="M8 7l1 13h6l1-13"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
      </svg>
    `,
    user: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="8" r="3.5"></circle>
        <path d="M5 19a7 7 0 0 1 14 0"></path>
      </svg>
    `,
    users: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M16.5 19a4.5 4.5 0 0 0-9 0"></path>
        <circle cx="12" cy="9" r="3"></circle>
        <path d="M20 18a3.5 3.5 0 0 0-4.5-3.3"></path>
        <path d="M17 5.8a2.5 2.5 0 1 1 0 5"></path>
      </svg>
    `,
    admin: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3l7 4v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V7l7-4z"></path>
        <path d="M9.5 12l1.7 1.7 3.3-3.4"></path>
      </svg>
    `,
    shop: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 10h16"></path>
        <path d="M6 10l1-4h10l1 4"></path>
        <path d="M6 10v8h12v-8"></path>
      </svg>
    `,
    add: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </svg>
    `,
    save: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 4h11l3 3v13H5z"></path>
        <path d="M9 4v5h6"></path>
        <path d="M9 20v-6h6v6"></path>
      </svg>
    `,
    orders: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 6h13"></path>
        <path d="M7 12h13"></path>
        <path d="M7 18h13"></path>
        <path d="M4 6h.01"></path>
        <path d="M4 12h.01"></path>
        <path d="M4 18h.01"></path>
      </svg>
    `,
    analytics: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 19V9"></path>
        <path d="M12 19V5"></path>
        <path d="M19 19v-7"></path>
      </svg>
    `,
    site: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8"></circle>
        <path d="M4 12h16"></path>
        <path d="M12 4a12 12 0 0 1 0 16"></path>
        <path d="M12 4a12 12 0 0 0 0 16"></path>
      </svg>
    `,
    search: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="11" cy="11" r="6"></circle>
        <path d="M20 20l-4.2-4.2"></path>
      </svg>
    `,
    close: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6l12 12"></path>
        <path d="M18 6L6 18"></path>
      </svg>
    `
  };

  return icons[iconName] || '';
}

function getIconButtonMarkup(iconName, label) {
  return `${getIconMarkup(iconName)}<span class="button-label">${label}</span>`;
}

// Check if user is admin
function checkAdminAccess() {
  if (!isCurrentUserAdmin()) {
    alert('Access denied. Admin privileges required.');
    window.location.href = '../../index.html';
    return false;
  }
  return true;
}

// Load dashboard data
function loadDashboardData() {
  if (!checkAdminAccess()) return;

  // Load stats
  loadStats();

  // Load recent products
  loadRecentProducts();
}

// Load statistics
function loadStats() {
  // Total products
  const products = getProducts();
  document.getElementById('totalProducts').textContent = products.length;

  // Total users
  const users = JSON.parse(localStorage.getItem('users')) || [];
  document.getElementById('totalUsers').textContent = users.length;

  // Pending orders (simulated - in a real app this would come from a database)
  const pendingOrders = Math.floor(Math.random() * 10) + 1; // Random for demo
  document.getElementById('pendingOrders').textContent = pendingOrders;

  // Total revenue (simulated)
  const totalRevenue = (Math.random() * 5000 + 1000).toFixed(2);
  document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;
}

// Load recent products
function loadRecentProducts() {
  const products = getProducts();
  const recentProductsContainer = document.getElementById('recentProducts');

  // Show last 6 products
  const recentProducts = products.slice(-6).reverse();

  recentProductsContainer.innerHTML = recentProducts.map(product => `
    <div class="product-item">
      <img class="product-thumb" src="${getProductImageSrc(product)}" alt="${product.name}">
      <div class="product-info">
        <h4>${product.name}</h4>
        <p>${product.price}</p>
      </div>
      <div class="product-actions">
        <button class="edit-btn" onclick="editProductFromDashboard(${product.id})" aria-label="Edit ${product.name}" title="Edit ${product.name}">${getIconButtonMarkup('edit', 'Edit')}</button>
        <button class="delete-btn" onclick="deleteProductFromDashboard(${product.id})" aria-label="Delete ${product.name}" title="Delete ${product.name}">${getIconButtonMarkup('trash', 'Delete')}</button>
      </div>
    </div>
  `).join('');
}

// Edit product from dashboard
function editProductFromDashboard(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (product) {
    // Open edit modal
    openProductModal(product);
  }
}

// Delete product from dashboard
function deleteProductFromDashboard(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(id);
    loadDashboardData(); // Refresh dashboard
  }
}

// Open product modal
function openProductModal(product = null) {
  const modal = document.getElementById('adminModal');
  const title = document.querySelector('#adminModal h3');
  const form = document.getElementById('productForm');
  const nameInput = document.getElementById('productName');
  const categoryInput = document.getElementById('productCategory');
  const priceInput = document.getElementById('productPrice');
  const imageInput = document.getElementById('productImage');
  const submitButton = form.querySelector('button[type="submit"]');

  if (product) {
    title.textContent = 'Edit Product';
    nameInput.value = product.name;
    categoryInput.value = product.category || 'inSeason';
    priceInput.value = product.price;
    imageInput.value = product.image || '';
    form.setAttribute('data-product-id', product.id);
    if (submitButton) {
      submitButton.innerHTML = getIconButtonMarkup('save', 'Save changes');
      submitButton.setAttribute('aria-label', 'Save changes');
      submitButton.setAttribute('title', 'Save changes');
    }
  } else {
    title.textContent = 'Quick Add Product';
    form.reset();
    categoryInput.value = 'inSeason';
    imageInput.value = '';
    form.removeAttribute('data-product-id');
    if (submitButton) {
      submitButton.innerHTML = getIconButtonMarkup('add', 'Add product');
      submitButton.setAttribute('aria-label', 'Add product');
      submitButton.setAttribute('title', 'Add product');
    }
  }

  modal.style.display = 'flex';
}

// Make functions global so they can be called from HTML onclick
window.openProductModal = openProductModal;
window.openUsersModal = openUsersModal;
window.toggleUserRole = toggleUserRole;
window.deleteUserFromDashboard = deleteUserFromDashboard;
window.editProductFromDashboard = editProductFromDashboard;
window.deleteProductFromDashboard = deleteProductFromDashboard;
window.handleProductSubmit = handleProductSubmit;

// Handle product form submission
function handleProductSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('productForm');
  const name = document.getElementById('productName').value.trim();
  const category = document.getElementById('productCategory').value;
  let price = document.getElementById('productPrice').value.trim();
  const image = document.getElementById('productImage').value.trim();
  const productId = form.getAttribute('data-product-id');

  if (!name || !category || !price || !image) {
    return;
  }

  if (!price.startsWith('$')) {
    price = `$${price}`;
  }

  if (productId) {
    editProduct(parseInt(productId), name, price, category, image);
  } else {
    addProduct(name, price, category, image);
  }

  form.reset();
  form.removeAttribute('data-product-id');
  document.getElementById('adminModal').style.display = 'none';
  loadDashboardData();
}

// View users
function openUsersModal() {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const usersList = document.getElementById('usersList');
  if (!usersList) {
    return;
  }
  const currentUser = getCurrentUser();

  usersList.innerHTML = users.map(user => `
    <div class="user-item">
      <div class="user-item-main">
        <h4>${user.name}</h4>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Username:</strong> ${user.username || 'N/A'}</p>
        <span class="user-role ${user.role}">${user.role}</span>
        ${currentUser && currentUser.email === user.email ? '<span class="user-self">Current Session</span>' : ''}
      </div>
      <div class="user-management-actions">
        <button
          class="user-action-btn"
          onclick="toggleUserRole('${user.email}')"
          aria-label="${user.role === 'admin' ? `Change ${user.name} to user` : `Change ${user.name} to admin`}"
          title="${user.role === 'admin' ? 'Make User' : 'Make Admin'}"
          ${user.email === 'admin@coldtopic.com' ? 'disabled' : ''}
        >
          ${getIconButtonMarkup(user.role === 'admin' ? 'user' : 'admin', user.role === 'admin' ? 'Make User' : 'Make Admin')}
        </button>
        <button
          class="user-action-btn danger"
          onclick="deleteUserFromDashboard('${user.email}')"
          aria-label="Delete ${user.name}"
          title="Delete ${user.name}"
          ${user.email === 'admin@coldtopic.com' ? 'disabled' : ''}
        >
          ${getIconButtonMarkup('trash', 'Delete')}
        </button>
      </div>
    </div>
  `).join('');

  document.getElementById('usersModal').style.display = 'flex';
}

function toggleUserRole(email) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(entry => entry.email === email);

  if (!user) {
    alert('User not found.');
    return;
  }

  if (user.email === 'admin@coldtopic.com') {
    alert('The default admin account cannot be changed.');
    return;
  }

  const nextRole = user.role === 'admin' ? 'user' : 'admin';
  const result = updateUserRole(email, nextRole);

  if (!result.success) {
    alert(result.message);
    return;
  }

  loadStats();
  openUsersModal();
}

function deleteUserFromDashboard(email) {
  const users = typeof getUsers === 'function' ? getUsers() : [];
  const user = users.find(entry => entry.email === email);

  if (!user) {
    alert('User not found.');
    return;
  }

  if (user.email === 'admin@coldtopic.com') {
    alert('The default admin account cannot be deleted.');
    return;
  }

  if (!confirm(`Delete ${user.name}'s account?`)) {
    return;
  }

  const result = deleteUser(email);

  if (!result.success) {
    alert(result.message);
    return;
  }

  loadStats();
  openUsersModal();
}

// View orders (placeholder)
function viewOrders() {
  alert('Order management feature coming soon!');
}

// View analytics (placeholder)
function viewAnalytics() {
  alert('Analytics feature coming soon!');
}

// Setup event listeners
function setupAdminEventListeners() {
  document.querySelectorAll('[data-admin-icon]').forEach(button => {
    const iconName = button.getAttribute('data-admin-icon');
    const label = button.getAttribute('aria-label') || button.getAttribute('title') || 'Action';
    if (button.classList.contains('quick-btn')) {
      button.innerHTML = `<span class="quick-icon" aria-hidden="true">${getIconMarkup(iconName)}</span><span class="button-label">${label}</span>`;
      return;
    }

    button.innerHTML = getIconButtonMarkup(iconName, label);
  });

  const quickAddBtn = document.getElementById('quickAddProduct');

  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      openProductModal();
    });
  }

  const productForm = document.getElementById('productForm');

  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }

  // View users
  const viewUsersBtn = document.getElementById('viewUsersBtn');
  if (viewUsersBtn) {
    viewUsersBtn.addEventListener('click', openUsersModal);
  }

  // View orders
  const viewOrdersBtn = document.getElementById('viewOrders');
  if (viewOrdersBtn) {
    viewOrdersBtn.addEventListener('click', viewOrders);
  }

  // View analytics
  const viewAnalyticsBtn = document.getElementById('viewAnalytics');
  if (viewAnalyticsBtn) {
    viewAnalyticsBtn.addEventListener('click', viewAnalytics);
  }

  // Modal close buttons
  document.querySelectorAll('.admin-modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      document.querySelectorAll('.admin-modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });

    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeBtn.click();
      }
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('admin-modal')) {
      e.target.style.display = 'none';
    }
  });
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (checkAdminAccess()) {
    loadDashboardData();
    setupAdminEventListeners();
  }
});
