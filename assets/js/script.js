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
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
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

// initialize when document ready
document.addEventListener('DOMContentLoaded', () => {
  setupShopCartButtons();
  renderCart();
});