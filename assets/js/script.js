const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelector('.navLinks');
const navbar = document.querySelector('.navbar');
const mobileNavMediaQuery = window.matchMedia('(max-width: 640px)');
let navMenuToggle = null;

function getSiteIconMarkup(iconName) {
  const icons = {
    home: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 11.5L12 5l8 6.5"></path>
        <path d="M6.5 10.5V19h11v-8.5"></path>
      </svg>
    `,
    search: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="11" cy="11" r="6"></circle>
        <path d="M20 20l-4.2-4.2"></path>
      </svg>
    `,
    shop: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 10h16"></path>
        <path d="M6 10l1-4h10l1 4"></path>
        <path d="M6 10v8h12v-8"></path>
      </svg>
    `,
    cart: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="9" cy="19" r="1.5"></circle>
        <circle cx="17" cy="19" r="1.5"></circle>
        <path d="M4 5h2l2.2 9h9.3l2-7H7.2"></path>
      </svg>
    `,
    addToCart: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="9" cy="19" r="1.5"></circle>
        <circle cx="17" cy="19" r="1.5"></circle>
        <path d="M4 5h2l2.2 9h9.3l2-7H7.2"></path>
        <path d="M14 8v4"></path>
        <path d="M12 10h4"></path>
      </svg>
    `,
    signup: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="10" cy="8" r="3"></circle>
        <path d="M4.5 18a5.5 5.5 0 0 1 11 0"></path>
        <path d="M18 8v6"></path>
        <path d="M15 11h6"></path>
      </svg>
    `,
    login: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M10 17l5-5-5-5"></path>
        <path d="M15 12H4"></path>
        <path d="M20 5v14"></path>
      </svg>
    `,
    logout: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14 7l5 5-5 5"></path>
        <path d="M19 12H8"></path>
        <path d="M4 5v14"></path>
      </svg>
    `,
    admin: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3l7 4v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V7l7-4z"></path>
        <path d="M9.5 12l1.7 1.7 3.3-3.4"></path>
      </svg>
    `,
    checkout: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 12h14"></path>
        <path d="M13 6l6 6-6 6"></path>
      </svg>
    `,
    cancel: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6l12 12"></path>
        <path d="M18 6L6 18"></path>
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
    `
  };

  return icons[iconName] || '';
}

function getSiteIconButtonMarkup(iconName, label) {
  return `${getSiteIconMarkup(iconName)}<span class="button-label">${label}</span>`;
}

function getSiteIconInlineMarkup(iconName, label) {
  return `${getSiteIconMarkup(iconName).replace('class="btn-icon"', 'class="btn-icon nav-icon"')}<span class="button-label">${label}</span>`;
}

function getNavMenuToggleMarkup(label) {
  return `
    <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 7h16"></path>
      <path d="M4 12h16"></path>
      <path d="M4 17h16"></path>
    </svg>
    <span class="button-label">${label}</span>
  `;
}

function getNavbarIconConfig(element) {
  if (!element || element.hasAttribute('data-nav-icon-applied')) {
    return null;
  }

  const text = element.textContent.trim();
  const lowerText = text.toLowerCase();
  const href = (element.getAttribute('href') || '').toLowerCase();

  if (lowerText.includes('home')) {
    return { icon: 'home', label: text || 'Home' };
  }

  if (lowerText.includes('shop')) {
    return { icon: 'shop', label: text || 'Shop' };
  }

  if (lowerText.includes('cart')) {
    return { icon: 'cart', label: text || 'Cart' };
  }

  if (lowerText.includes('sign in') || lowerText === 'login' || href.includes('login.html')) {
    return { icon: 'login', label: text || 'Sign In' };
  }

  if (lowerText.includes('sign up') || href.includes('signup.html')) {
    return { icon: 'signup', label: text || 'Sign Up' };
  }

  if (lowerText.includes('admin')) {
    return { icon: 'admin', label: text || 'Admin Dashboard' };
  }

  return null;
}

function applyNavbarIcons(root = document) {
  const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
  const navItems = scope.querySelectorAll('.navbar a, .navbar button.accountButton, .auth-elements .admin-link');

  navItems.forEach(item => {
    if (item.closest('.logo')) return;

    const config = getNavbarIconConfig(item);
    if (!config) return;

    item.innerHTML = getSiteIconInlineMarkup(config.icon, config.label);
    item.setAttribute('aria-label', config.label);
    item.setAttribute('title', config.label);
    item.setAttribute('data-nav-icon-applied', 'true');
  });
}

function getContextualButtonConfig(button) {
  if (!button || button.hasAttribute('data-admin-icon')) {
    return null;
  }

  const explicitIcon = button.getAttribute('data-site-icon');
  const explicitLabel = button.getAttribute('data-site-label');
  const text = button.textContent.trim();
  const lowerText = text.toLowerCase();

  if (explicitIcon) {
    return {
      icon: explicitIcon,
      label: explicitLabel || button.getAttribute('aria-label') || button.getAttribute('title') || text || 'Action'
    };
  }

  if (button.classList.contains('searchIcon')) {
    return { icon: 'search', label: text || 'Search' };
  }

  if (button.classList.contains('heroButton')) {
    return { icon: 'shop', label: text || 'Shop now' };
  }

  if (button.classList.contains('productButton')) {
    return { icon: 'addToCart', label: text || 'Add to Cart' };
  }

  if (button.classList.contains('removeButton')) {
    return { icon: 'trash', label: 'Remove' };
  }

  if (button.id === 'clearCart') {
    return { icon: 'trash', label: 'Clear Cart' };
  }

  if (button.classList.contains('checkoutButton')) {
    return { icon: 'checkout', label: text || 'Complete Purchase' };
  }

  if (button.classList.contains('cancelButton')) {
    return { icon: 'cancel', label: text || 'Cancel' };
  }

  if (button.classList.contains('authButton')) {
    if (lowerText.includes('sign up')) {
      return { icon: 'signup', label: text || 'Sign up' };
    }

    return { icon: 'login', label: text || 'Login' };
  }

  if (button.classList.contains('accountButton')) {
    if (lowerText.includes('login')) {
      return { icon: 'login', label: text || 'Login' };
    }

    return { icon: 'signup', label: text || 'Sign up' };
  }

  if (button.classList.contains('logout-btn')) {
    return { icon: 'logout', label: text || 'Logout' };
  }

  return null;
}

function applyContextualIcons(root = document) {
  const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
  const buttons = scope.querySelectorAll('button');

  buttons.forEach(button => {
    const config = getContextualButtonConfig(button);
    if (!config) return;

    button.innerHTML = getSiteIconButtonMarkup(config.icon, config.label);
    button.setAttribute('aria-label', config.label);
    button.setAttribute('title', config.label);
  });
}

window.getSiteIconMarkup = getSiteIconMarkup;
window.getSiteIconButtonMarkup = getSiteIconButtonMarkup;
window.applyNavbarIcons = applyNavbarIcons;
window.applyContextualIcons = applyContextualIcons;

function isMobileNavViewport() {
  return mobileNavMediaQuery.matches;
}

function updateMobileNavToggleLabel() {
  if (!navMenuToggle || !navbar) return;

  const isOpen = navbar.classList.contains('nav-open');
  const label = isOpen ? 'Close' : 'Menu';
  navMenuToggle.innerHTML = getNavMenuToggleMarkup(label);
  navMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  navMenuToggle.setAttribute('aria-expanded', String(isOpen));
  navMenuToggle.setAttribute('title', label);
}

function closeMobileNav() {
  if (!navbar) return;

  navbar.classList.remove('nav-open');
  updateMobileNavToggleLabel();

  if (searchInput) {
    searchInput.classList.remove('active');
  }

  resetNav();
}

function initializeMobileNavbar() {
  if (!navbar) return;

  navMenuToggle = navbar.querySelector('.navMenuToggle');

  if (!navMenuToggle) {
    navMenuToggle = document.createElement('button');
    navMenuToggle.type = 'button';
    navMenuToggle.className = 'navMenuToggle';
    navMenuToggle.setAttribute('data-nav-menu-toggle', 'true');

    const navLeft = navbar.querySelector('.navLeft');
    if (navLeft && navLeft.nextSibling) {
      navbar.insertBefore(navMenuToggle, navLeft.nextSibling);
    } else {
      navbar.appendChild(navMenuToggle);
    }
  }

  updateMobileNavToggleLabel();

  navMenuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    navbar.classList.toggle('nav-open');
    updateMobileNavToggleLabel();

    if (!navbar.classList.contains('nav-open') && searchInput) {
      searchInput.classList.remove('active');
      resetNav();
    }
  });

  const closeTriggers = navbar.querySelectorAll('.navLinks a, .navRight li a, .accountButton, .auth-elements a, .auth-elements button');
  closeTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (isMobileNavViewport()) {
        closeMobileNav();
      }
    });
  });

  mobileNavMediaQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      closeMobileNav();
    }
  });
}

// Toggle search bar on icon click
if (searchToggle && searchInput) {
  searchToggle.addEventListener('click', (e) => {
    const isActive = searchInput.classList.toggle('active');
    if (isActive && !isMobileNavViewport()) {
      shiftNavLeft();
      searchInput.focus();
      window.addEventListener('resize', shiftNavLeft);
    } else {
      resetNav();
      window.removeEventListener('resize', shiftNavLeft);
    }

    if (isActive) {
      searchInput.focus();
    }

    e.stopPropagation();
  });
}

// Hide search bar when clicking outside
document.addEventListener('click', (e) => {
  if (navbar && isMobileNavViewport() && navbar.classList.contains('nav-open') && !navbar.contains(e.target)) {
    closeMobileNav();
  }

  if (!searchInput || !searchToggle) return;

  if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
    searchInput.classList.remove('active');
    resetNav();
    window.removeEventListener('resize', shiftNavLeft);
  }
});

// Search functionality for shop items
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.productCard');
    
    productCards.forEach(card => {
      const productName = card.querySelector('h3');
      if (productName) {
        const name = productName.innerText.toLowerCase();
        if (searchTerm === '' || name.includes(searchTerm)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
}

function shiftNavLeft() {
  if (!navLinks || !searchInput || isMobileNavViewport()) return;
  // shift nav links further left when search is active
  const shift = searchInput.offsetWidth + 120;
  navLinks.style.transition = 'transform 0.3s ease';
  navLinks.style.transform = `translateX(-${shift}px)`;
}

function resetNav() {
  if (!navLinks) return;
  navLinks.style.transform = '';
  navLinks.style.transition = '';
}

initializeMobileNavbar();

/* PRODUCT DATA -------------------------------------------------------- */

const productImageBasePath = window.location.pathname.includes('/pages/') ? '../../assets/img/' : './assets/img/';
const fallbackProductImage = 'nyebe_white.png';

function normalizeProductImage(image) {
  if (!image) {
    return fallbackProductImage;
  }

  if (/^(https?:|data:|\.{0,2}\/|\/)/i.test(image)) {
    return image;
  }

  return `${productImageBasePath}${image}`;
}

function getProductImageSrc(product) {
  return normalizeProductImage(product && product.image);
}

function createProductImageMarkup(product) {
  const imageSrc = getProductImageSrc(product);
  return `<img class="productImage" src="${imageSrc}" alt="${product.name}" onerror="this.onerror=null;this.src='${normalizeProductImage(fallbackProductImage)}';">`;
}

// Default products
const defaultProducts = [
  { id: 1, name: 'Midnight Winter Jacket', price: '$34.99', category: 'inSeason', image: 'midnight_jacket.jpg' },
  { id: 2, name: 'Raven Thermal Hoodie', price: '$44.99', category: 'inSeason', image: 'ravem_thermal_hoodie.jpg' },
  { id: 3, name: 'Graveyard Wool Sweater', price: '$54.99', category: 'inSeason', image: 'Graveyard_Wool.jpg' },
  { id: 4, name: 'Shadowfall Fleece Pants', price: '$39.99', category: 'inSeason', image: 'Shadowfall_Fleece.jpg' },
  { id: 5, name: 'Obsidian Beanie Hat', price: '$49.99', category: 'inSeason', image: 'Obsidian_Beanie.jpg' },
  { id: 6, name: 'Nightshade Winter Scarf', price: '$59.99', category: 'inSeason', image: 'scarf.jpg' },
  { id: 7, name: 'Cursed Vintage T Shirt', price: '$19.99', category: 'onSale', image: 'Cursed_shirt.jpg' },
  { id: 8, name: 'Phantom Denim Jacket', price: '$24.99', category: 'onSale', image: 'denim_jacket.jpg' },
  { id: 9, name: 'Hellfire Cargo Pants', price: '$29.99', category: 'onSale', image: 'hellfire_cargo.jpg' },
  { id: 10, name: 'Eclipse Graphic Hoodie', price: '$34.99', category: 'onSale', image: 'eclypse_hoodie.jpg' },
  { id: 11, name: 'Void Joggers', price: '$39.99', category: 'onSale', image: 'void_jogger.jpg' },
  { id: 12, name: 'Noir Crop Top', price: '$44.99', category: 'onSale', image: 'noir_crop.jpg' },
  { id: 13, name: 'Gothic Leather Jacket', price: '$49.99', category: 'featured', image: 'gothic_jacket.jpg' },
  { id: 14, name: 'Darkside Designer Jeans', price: '$59.99', category: 'featured', image: 'Darkside_Designer_Jeans.webp' },
  { id: 15, name: 'Moonlit Silk Blouse', price: '$69.99', category: 'featured', image: 'moonsilk_blouse.jpg' },
  { id: 16, name: 'Graveyard Cardigan', price: '$54.99', category: 'featured', image: 'Graveyard_Cardigan.jpg' },
  { id: 17, name: 'Nocturnal Wool Coat', price: '$64.99', category: 'featured', image: 'Nocturnal_Coat.jpg' },
  { id: 18, name: 'Eternal Dress Pants', price: '$74.99', category: 'featured', image: 'Eternal_Dress_Pants.png' },
  { id: 19, name: 'Haunted Oversized Hoodie', price: '$24.99', category: 'teens', image: 'Haunted_Hoodie.jpg' },
  { id: 20, name: 'Reaper Ripped Jeans', price: '$29.99', category: 'teens', image: 'Reaper_Jeans.png' },
  { id: 21, name: 'Witchy Crop Tank Top', price: '$34.99', category: 'teens', image: 'witch_crop_top.jpg' },
  { id: 22, name: 'Hellish Streetwear Jacket', price: '$39.99', category: 'teens', image: 'Hellish_Streetwear_Jacket.jpg' },
  { id: 23, name: 'Spectral Sweatpants', price: '$44.99', category: 'teens', image: 'Spectral_Sweatpants.webp' },
  { id: 24, name: 'Hellfire Graphic T Shirt', price: '$49.99', category: 'teens', image: 'Hellfire_Shirt.avif' },
  { id: 25, name: 'Elegant Business Blazer', price: '$44.99', category: 'adults', image: 'Elegant_Business_Blazer.webp' },
  { id: 26, name: 'Shadowed Oxford Shirt', price: '$54.99', category: 'adults', image: 'Shadowed_Oxford_Shirt.webp' },
  { id: 27, name: 'Blackened Chinos', price: '$64.99', category: 'adults', image: 'Blackened_Chinos.webp' },
  { id: 28, name: 'Twilight Polo Shirt', price: '$49.99', category: 'adults', image: 'Twilight_Polo_Shirt.webp' },
  { id: 29, name: 'Mystique Casual Loafers', price: '$69.99', category: 'adults', image: 'Mystique_Casual_Loafers.jpg' },
  { id: 30, name: 'Paramore T Shirt', price: '$39.99', category: 'partner', image: 'Paramore_Shirt.avif' },
  { id: 31, name: 'My Chemical Romance Hoodie', price: '$49.99', category: 'partner', image: 'My_Chemical_Romance_Hoodie.jpg' },
  { id: 32, name: 'Panic! At The Disco Cap', price: '$59.99', category: 'partner', image: 'Panic!_At_The_Disco_Cap.jpg' },
  { id: 33, name: 'Fall Out Boy Sweater', price: '$44.99', category: 'partner', image: 'Fall_Out_Boy_Sweater.avif' },
  { id: 34, name: 'The Killers Jacket', price: '$54.99', category: 'partner', image: 'The_Killers_Jacket.webp' },
  { id: 35, name: 'Imagine Dragons Beanie', price: '$64.99', category: 'partner', image: 'Imagine_Dragons_Beanie.png' }
];

// Initialize products in localStorage
function initializeProducts() {
  const stored = localStorage.getItem('products');
  if (!stored) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return;
  }

  const defaultById = new Map(defaultProducts.map(product => [product.id, product]));
  const products = JSON.parse(stored);
  let hasChanges = false;

  const upgradedProducts = products.map(product => {
    const fallbackProduct = defaultById.get(product.id);
    const upgradedProduct = { ...product };

    if (!upgradedProduct.image && fallbackProduct && fallbackProduct.image) {
      upgradedProduct.image = fallbackProduct.image;
      hasChanges = true;
    }

    return upgradedProduct;
  });

  if (hasChanges) {
    localStorage.setItem('products', JSON.stringify(upgradedProducts));
  }
}

// Read all products from localStorage, seeding defaults on first use.
function getAllProducts() {
  initializeProducts();
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : [...defaultProducts];
}

// Get products by category
function getProductsByCategory(category) {
  const allProducts = getProducts();
  if (category === 'inSeason') {
    return allProducts; // In Season shows all products
  }
  return allProducts.filter(product => product.category === category);
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

// Add new product (admin only)
function addProduct(name, price, category = 'inSeason', image = fallbackProductImage) {
  const products = getAllProducts();
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const newProduct = { id: newId, name, price, category, image };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

// Edit product (admin only)
function editProduct(id, name, price, category, image) {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      name,
      price,
      category,
      image: image || products[index].image || fallbackProductImage
    };
    saveProducts(products);
    return true;
  }
  return false;
}

// Delete product (admin only)
function deleteProduct(id) {
  const products = getAllProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length < products.length) {
    saveProducts(filtered);
    return true;
  }
  return false;
}

// Get products for display (replaces allProducts)
function getProducts() {
  return getAllProducts();
}

function getRandomProducts(count = 3) {
  const allProducts = getProducts();
  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomizeHomeProducts() {
  const productsSection = document.querySelector('section.productsSection');
  if (!productsSection) return;
  
  const productCards = productsSection.querySelectorAll('.productCard');
  const randomProducts = getRandomProducts(3);
  
  productCards.forEach((card, index) => {
    if (index < randomProducts.length) {
      const product = randomProducts[index];
      const h3 = card.querySelector('h3');
      const price = card.querySelector('.productPrice');
      const image = card.querySelector('.productImage');
      
      if (h3) h3.innerText = product.name;
      if (price) price.innerText = product.price;
      if (image) {
        image.outerHTML = createProductImageMarkup(product);
      }
    }
  });

  applyContextualIcons(productsSection);
}

function hydrateExistingProductCards() {
  const cards = document.querySelectorAll('.productCard');
  const productsByName = new Map(getProducts().map(product => [product.name.toLowerCase(), product]));

  cards.forEach(card => {
    const nameElement = card.querySelector('h3');
    const imageElement = card.querySelector('.productImage');
    if (!nameElement || !imageElement) return;

    const product = productsByName.get(nameElement.innerText.trim().toLowerCase());
    if (!product || imageElement.tagName === 'IMG') return;

    imageElement.outerHTML = createProductImageMarkup(product);
  });

  applyContextualIcons(document);
}

/* CART FUNCTIONS -------------------------------------------------------- */

function getCart() {
  const stored = localStorage.getItem('cartItems');
  return stored ? JSON.parse(stored) : [];
}

function saveCart(items) {
  localStorage.setItem('cartItems', JSON.stringify(items));
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  alert('Added to cart');
}

function setupShopCartButtons() {
  const buttons = document.querySelectorAll('.productButton');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.productCard');
      if (!card) return;
      const nameEl = card.querySelector('h3');
      const priceEl = card.querySelector('.productPrice');
      const name = nameEl ? nameEl.innerText : '';
      const price = priceEl ? priceEl.innerText : '';
      addToCart({ name, price });
    });
  });
}

function renderCart() {
  const cartContainer = document.getElementById('cartItems');
  if (!cartContainer) return;
  const cart = getCart();
  cartContainer.innerHTML = '';
  
  const checkoutSection = document.getElementById('checkoutSection');
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    if (checkoutSection) checkoutSection.style.display = 'none';
    return;
  }
  
  // Show checkout section if there are items
  if (checkoutSection) checkoutSection.style.display = 'block';
  
  let total = 0;
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cartItem';
    div.innerHTML = `<span class="cartName">${item.name}</span>
                     <span class="cartPrice">${item.price}</span>
                     <button class="removeButton" data-index="${index}">Remove</button>`;
    cartContainer.appendChild(div);
    const priceVal = parseFloat(item.price.replace(/[^0-9\.]/g, '')) || 0;
    total += priceVal;
  });
  // total row
  const totalDiv = document.createElement('div');
  totalDiv.className = 'cartTotal';
  totalDiv.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;
  cartContainer.appendChild(totalDiv);
  // clear cart button
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clearCart';
  clearBtn.addEventListener('click', () => {
    saveCart([]);
    renderCart();
  });
  cartContainer.appendChild(clearBtn);
  applyContextualIcons(cartContainer);
  const removes = cartContainer.querySelectorAll('.removeButton');
  removes.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const current = getCart();
      current.splice(idx, 1);
      saveCart(current);
      renderCart();
    });
  });
}

function setupCheckout() {
  const checkoutForm = document.getElementById('checkoutForm');
  const cancelCheckout = document.getElementById('cancelCheckout');
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const creditCardSection = document.getElementById('creditCardSection');
  
  if (!checkoutForm) return;
  
  // Toggle payment method details
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'creditCard' && creditCardSection) {
        creditCardSection.style.display = 'block';
      } else if (creditCardSection) {
        creditCardSection.style.display = 'none';
      }
    });
  });
  
  // Format card number input
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
  
  // Format expiry date input
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
  
  // Handle form submission
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    let orderSummary = `Order Confirmation\n\n`;
    orderSummary += `Customer: ${fullName}\n`;
    orderSummary += `Email: ${email}\n`;
    orderSummary += `Address: ${address}, ${city}, ${state} ${zip}\n`;
    orderSummary += `Payment Method: ${paymentMethod.toUpperCase()}\n\n`;
    
    const cart = getCart();
    let total = 0;
    orderSummary += `Items:\n`;
    cart.forEach(item => {
      orderSummary += `- ${item.name}: ${item.price}\n`;
      const priceVal = parseFloat(item.price.replace(/[^0-9\.]/g, '')) || 0;
      total += priceVal;
    });
    
    orderSummary += `\nTotal: $${total.toFixed(2)}`;
    
    alert(orderSummary + '\n\nYour order has been placed successfully!');
    
    // Clear cart and reset form
    saveCart([]);
    checkoutForm.reset();
    renderCart();
    if (creditCardSection) creditCardSection.style.display = 'block';
  });
  
  // Handle cancel checkout
  if (cancelCheckout) {
    cancelCheckout.addEventListener('click', () => {
      checkoutForm.reset();
      const checkoutSection = document.getElementById('checkoutSection');
      if (checkoutSection) checkoutSection.style.display = 'none';
    });
  }
}

/* ADMIN FUNCTIONS -------------------------------------------------------- */

// Check if current user is admin
function isCurrentUserAdmin() {
  // This will be available from auth.js
  return typeof getCurrentUser === 'function' && getCurrentUser() && getCurrentUser().role === 'admin';
}

// Show admin controls for products
function showAdminControls() {
  // Admin controls are now in the dedicated admin dashboard
  // This function is kept for backward compatibility but doesn't show controls on shop page
  return;
}

// Setup admin event listeners
function setupAdminEventListeners() {
  const addBtn = document.getElementById('addProductBtn');
  const modal = document.getElementById('adminModal');
  const closeBtn = document.querySelector('.admin-modal-close');
  const form = document.getElementById('productForm');
  const deleteBtn = document.getElementById('deleteBtn');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openProductModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', handleProductSubmit);
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', handleProductDelete);
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Open product modal for adding
function openProductModal(product = null) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('productForm');
  const nameInput = document.getElementById('productName');
  const priceInput = document.getElementById('productPrice');
  const idInput = document.getElementById('productId');
  const deleteBtn = document.getElementById('deleteBtn');

  if (product) {
    title.textContent = 'Edit Product';
    nameInput.value = product.name;
    priceInput.value = product.price;
    idInput.value = product.id;
    deleteBtn.style.display = 'inline-block';
  } else {
    title.textContent = 'Add Product';
    form.reset();
    idInput.value = '';
    deleteBtn.style.display = 'none';
  }

  modal.style.display = 'block';
}

// Handle product form submission
function handleProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const id = document.getElementById('productId').value;

  if (id) {
    // Edit existing product
    editProduct(parseInt(id), name, price);
  } else {
    // Add new product
    addProduct(name, price);
  }

  document.getElementById('adminModal').style.display = 'none';
  location.reload(); // Refresh to show changes
}

// Handle product deletion
function handleProductDelete() {
  const id = document.getElementById('productId').value;
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(parseInt(id));
    document.getElementById('adminModal').style.display = 'none';
    location.reload(); // Refresh to show changes
  }
}

// Edit product UI
function editProductUI(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (product) {
    openProductModal(product);
  }
}

// Delete product UI
function deleteProductUI(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(id);
    location.reload(); // Refresh to show changes
  }
}

// Render products in shop page
function renderShopProducts() {
  const products = getProducts();
  const shopContainer = document.querySelector('.productsContainer');

  if (!shopContainer) return;

  // Create "All Products" section if it doesn't exist
  let allProductsSection = document.getElementById('inSeason');
  if (!allProductsSection) {
    allProductsSection = document.createElement('div');
    allProductsSection.className = 'categoryContent';
    allProductsSection.id = 'inSeason';
    allProductsSection.innerHTML = '<h2>In Season</h2><div class="productsSection"></div>';
    shopContainer.appendChild(allProductsSection);
  }

  const productsContainer = allProductsSection.querySelector('.productsSection');
  productsContainer.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'productCard';
    productCard.setAttribute('data-product-id', product.id);
    productCard.innerHTML = `
      ${createProductImageMarkup(product)}
      <h3>${product.name}</h3>
      <p class="productPrice">${product.price}</p>
      <button class="productButton">Add to Cart</button>
    `;
    productsContainer.appendChild(productCard);
  });

  // Re-setup cart buttons after rendering
  setupShopCartButtons();
  applyContextualIcons(productsContainer);
}

// Render products for a specific category
function renderCategoryProducts(categoryId) {
  const categoryElement = document.getElementById(categoryId);
  if (!categoryElement) return;

  const productsSection = categoryElement.querySelector('.productsSection');
  if (!productsSection) return;

  const products = getProductsByCategory(categoryId);
  productsSection.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'productCard';
    productCard.setAttribute('data-product-id', product.id);
    productCard.innerHTML = `
      ${createProductImageMarkup(product)}
      <h3>${product.name}</h3>
      <p class="productPrice">${product.price}</p>
      <button class="productButton">Add to Cart</button>
    `;
    productsSection.appendChild(productCard);
  });

  // Re-setup cart buttons after rendering
  setupShopCartButtons();
  applyContextualIcons(productsSection);
}

// initialize when document ready
document.addEventListener('DOMContentLoaded', () => {
  initializeProducts(); // Initialize products first
  applyNavbarIcons();
  applyContextualIcons();
  randomizeHomeProducts();
  hydrateExistingProductCards();
  setupShopCartButtons();
  setupCheckout();
  renderCart();

  // Only render shop products on shop page
  if (document.querySelector('.productsContainer')) {
    renderShopProducts(); // Render products in shop
  }

  showAdminControls(); // Show admin controls if user is admin
});
