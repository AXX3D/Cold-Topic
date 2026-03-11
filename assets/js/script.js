const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelector('.navLinks');

// Toggle search bar on icon click
searchToggle.addEventListener('click', (e) => {
  const isActive = searchInput.classList.toggle('active');
  if (isActive) {
    shiftNavLeft();
    searchInput.focus();
    window.addEventListener('resize', shiftNavLeft);
  } else {
    resetNav();
    window.removeEventListener('resize', shiftNavLeft);
  }
  e.stopPropagation(); // prevent triggering document click
});

// Hide search bar when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
    searchInput.classList.remove('active');
    resetNav();
    window.removeEventListener('resize', shiftNavLeft);
  }
});

// Search functionality for shop items
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

function shiftNavLeft() {
  if (!navLinks) return;
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

/* PRODUCT DATA -------------------------------------------------------- */

const allProducts = [
  { name: 'Midnight Winter Jacket', price: '$34.99' },
  { name: 'Raven Thermal Hoodie', price: '$44.99' },
  { name: 'Graveyard Wool Sweater', price: '$54.99' },
  { name: 'Shadowfall Fleece Pants', price: '$39.99' },
  { name: 'Obsidian Beanie Hat', price: '$49.99' },
  { name: 'Nightshade Winter Scarf', price: '$59.99' },
  { name: 'Cursed Vintage T Shirt', price: '$19.99' },
  { name: 'Phantom Denim Jacket', price: '$24.99' },
  { name: 'Hellfire Cargo Pants', price: '$29.99' },
  { name: 'Eclipse Graphic Hoodie', price: '$34.99' },
  { name: 'Void Joggers', price: '$39.99' },
  { name: 'Noir Crop Top', price: '$44.99' },
  { name: 'Gothic Leather Jacket', price: '$49.99' },
  { name: 'Darkside Designer Jeans', price: '$59.99' },
  { name: 'Moonlit Silk Blouse', price: '$69.99' },
  { name: 'Graveyard Cardigan', price: '$54.99' },
  { name: 'Nocturnal Wool Coat', price: '$64.99' },
  { name: 'Eternal Dress Pants', price: '$74.99' },
  { name: 'Haunted Oversized Hoodie', price: '$24.99' },
  { name: 'Reaper Ripped Jeans', price: '$29.99' },
  { name: 'Witchy Crop Tank Top', price: '$34.99' },
  { name: 'Hellish Streetwear Jacket', price: '$39.99' },
  { name: 'Spectral Sweatpants', price: '$44.99' },
  { name: 'Hellfire Graphic T Shirt', price: '$49.99' },
  { name: 'Elegant Business Blazer', price: '$44.99' },
  { name: 'Shadowed Oxford Shirt', price: '$54.99' },
  { name: 'Blackened Chinos', price: '$64.99' },
  { name: 'Twilight Polo Shirt', price: '$49.99' },
  { name: 'Mystique Casual Loafers', price: '$69.99' },
  { name: 'Paramore T Shirt', price: '$39.99' },
  { name: 'My Chemical Romance Hoodie', price: '$49.99' },
  { name: 'Panic! At The Disco Cap', price: '$59.99' },
  { name: 'Fall Out Boy Sweater', price: '$44.99' },
  { name: 'The Killers Jacket', price: '$54.99' },
  { name: 'Imagine Dragons Beanie', price: '$64.99' }
];

function getRandomProducts(count = 3) {
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
      
      if (h3) h3.innerText = product.name;
      if (price) price.innerText = product.price;
    }
  });
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
                     <button class="removeButton" data-index="${index}">&times;</button>`;
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
  clearBtn.textContent = 'Clear Cart';
  clearBtn.addEventListener('click', () => {
    saveCart([]);
    renderCart();
  });
  cartContainer.appendChild(clearBtn);
  const removes = cartContainer.querySelectorAll('.removeButton');
  removes.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
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

// initialize when document ready
document.addEventListener('DOMContentLoaded', () => {
  randomizeHomeProducts();
  setupShopCartButtons();
  setupCheckout();
  renderCart();
});