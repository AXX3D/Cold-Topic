// Admin Dashboard Functionality

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
        <button class="edit-btn" onclick="editProductFromDashboard(${product.id})">Edit</button>
        <button class="delete-btn" onclick="deleteProductFromDashboard(${product.id})">Delete</button>
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
    if (submitButton) submitButton.textContent = 'Save Changes';
  } else {
    title.textContent = 'Quick Add Product';
    form.reset();
    categoryInput.value = 'inSeason';
    imageInput.value = '';
    form.removeAttribute('data-product-id');
    if (submitButton) submitButton.textContent = 'Add Product';
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
          ${user.email === 'admin@coldtopic.com' ? 'disabled' : ''}
        >
          ${user.role === 'admin' ? 'Make User' : 'Make Admin'}
        </button>
        <button
          class="user-action-btn danger"
          onclick="deleteUserFromDashboard('${user.email}')"
          ${user.email === 'admin@coldtopic.com' ? 'disabled' : ''}
        >
          Delete
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
