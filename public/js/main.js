// Universal Frontend Logic

// Global Auth State
let currentUser = null;

// On DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// App Initialization
async function initApp() {
  await checkAuthStatus();
  updateHeader();
  initCartBadge();
  
  // Route-specific initializers based on present elements
  if (document.getElementById('product-list')) {
    initProductList();
  }
  if (document.getElementById('product-detail')) {
    initProductDetail();
  }
  if (document.getElementById('cart-page')) {
    initCartPage();
  }
  if (document.getElementById('checkout-page')) {
    initCheckoutPage();
  }
  if (document.getElementById('login-form')) {
    initLoginForm();
  }
  if (document.getElementById('register-form')) {
    initRegisterForm();
  }
}

// Authentication Functions
async function checkAuthStatus() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
    } else {
      currentUser = null;
    }
  } catch (err) {
    console.error('Session check failed:', err);
    currentUser = null;
  }
}

function updateHeader() {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  const cartCount = getCartItemCount();

  let html = `
    <li><a href="/">Home</a></li>
    <li class="cart-icon-container">
      <a href="/cart.html">Cart</a>
      <span class="cart-badge" id="cart-badge">${cartCount}</span>
    </li>
  `;

  if (currentUser) {
    html += `
      <li class="user-email">${currentUser.email}</li>
      <li><button class="btn-logout" id="btn-logout">Logout</button></li>
    `;
  } else {
    html += `
      <li><a href="/login.html">Login</a></li>
      <li><a href="/register.html">Register</a></li>
    `;
  }

  navLinks.innerHTML = html;

  // Bind logout action if authenticated
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

async function handleLogout() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      currentUser = null;
      localStorage.removeItem('cart'); // Optional: clear cart on logout, or keep it. Let's keep cart to mimic typical e-commerce, or clear it. Usually keeping it is nice. We will keep it.
      window.location.href = '/';
    }
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

// LocalStorage Cart Functions
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateHeader();
}

function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function initCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = getCartItemCount();
  }
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.productId === product._id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  saveCart(cart);
  alert(`Added ${product.name} to cart!`);
}

// 1. Home Page: Product Listing
async function initProductList() {
  const listContainer = document.getElementById('product-list');
  const trendingContainer = document.getElementById('trending-list');
  const offersContainer = document.getElementById('offers-list');

  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    
    const products = await res.json();
    
    if (products.length === 0) {
      if (listContainer) listContainer.innerHTML = '<p>No products found.</p>';
      return;
    }
    
    // Filter products by tags
    const featuredProducts = products.filter(p => p.tag === 'featured' || !p.tag);
    const trendingProducts = products.filter(p => p.tag === 'trending');
    const offerProducts = products.filter(p => p.tag === 'offer');

    // Render Featured Products
    if (listContainer) {
      listContainer.innerHTML = featuredProducts.map(prod => renderProductCard(prod, false)).join('');
    }

    // Render Trending Products
    if (trendingContainer) {
      trendingContainer.innerHTML = trendingProducts.map(prod => renderProductCard(prod, false)).join('');
    }

    // Render Top Sales / Offers Products
    if (offersContainer) {
      offersContainer.innerHTML = offerProducts.map(prod => renderProductCard(prod, true)).join('');
    }
  } catch (err) {
    console.error(err);
    if (listContainer) listContainer.innerHTML = '<p class="alert alert-danger">Error loading products.</p>';
  }
}

// Helper to render a product card
function renderProductCard(prod, isOffer) {
  return `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img src="${prod.image}" alt="${prod.name}">
      </div>
      <div class="product-info">
        <span class="product-category">${prod.category || 'General'}</span>
        <a href="/product.html?id=${prod._id}" class="product-name">${prod.name}</a>
        <div class="product-price-row">
          <span class="product-price">${prod.price.toLocaleString('en-IN')}</span>
          ${isOffer && prod.originalPrice ? `
            <span class="product-original-price">₹${prod.originalPrice.toLocaleString('en-IN')}</span>
            <span class="product-discount">${Math.round((prod.originalPrice - prod.price) / prod.originalPrice * 100)}% off</span>
          ` : ''}
        </div>
        <a href="/product.html?id=${prod._id}" class="product-btn">View Details</a>
      </div>
    </div>
  `;
}

// 2. Product Details Page
async function initProductDetail() {
  const detailContainer = document.getElementById('product-detail');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    detailContainer.innerHTML = '<p class="alert alert-danger">Product ID is missing.</p>';
    return;
  }
  
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error('Product not found');
    
    const product = await res.json();
    
    const isOffer = product.tag === 'offer';
    
    detailContainer.innerHTML = `
      <div class="detail-layout">
        <div class="detail-img-container">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-info">
          <span class="detail-category">${product.category || 'General'}</span>
          <h1 class="detail-name">${product.name}</h1>
          
          <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px;">
            <span class="detail-price" style="margin-bottom: 0;">${product.price.toLocaleString('en-IN')}</span>
            ${isOffer && product.originalPrice ? `
              <span style="font-size: 18px; color: var(--text-muted); text-decoration: line-through;">₹${product.originalPrice.toLocaleString('en-IN')}</span>
              <span style="font-size: 16px; color: var(--text-green); font-weight: 600;">${Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}% off</span>
            ` : ''}
          </div>
          
          <h3 class="detail-desc-title">Description</h3>
          <p class="detail-desc">${product.description}</p>
          
          <div class="action-row">
            <button class="product-btn btn-add-cart" id="btn-add-to-cart">Add to Cart</button>
            <a href="/" class="btn-back">Back to Catalog</a>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('btn-add-to-cart').addEventListener('click', () => {
      addToCart(product);
    });
  } catch (err) {
    console.error(err);
    detailContainer.innerHTML = '<p class="alert alert-danger">Product could not be loaded.</p>';
  }
}

// 3. Shopping Cart Page
function initCartPage() {
  renderCart();
}

function renderCart() {
  const cartPage = document.getElementById('cart-page');
  const cart = getCart();
  
  if (cart.length === 0) {
    cartPage.innerHTML = `
      <div class="empty-cart-message">
        <h3>Your Cart is Empty</h3>
        <p>Explore our latest products and add them to your cart.</p>
        <a href="/" class="product-btn btn" style="display: inline-block; width: auto;">Shop Now</a>
      </div>
    `;
    return;
  }
  
  let itemsHtml = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <a href="/product.html?id=${item.productId}" class="cart-item-name">${item.name}</a>
        <div class="cart-item-price">${item.price.toLocaleString('en-IN')}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="qty-btn" onclick="adjustQty('${item.productId}', -1)">-</button>
          <div class="qty-val">${item.quantity}</div>
          <button class="qty-btn" onclick="adjustQty('${item.productId}', 1)">+</button>
        </div>
        <button class="btn-remove" onclick="removeCartItem('${item.productId}')">Remove</button>
      </div>
    </div>
  `).join('');
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 5000 ? 'FREE' : '₹150';
  const deliveryNum = subtotal > 5000 ? 0 : 150;
  const total = subtotal + deliveryNum;

  cartPage.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-panel">
        <h2 class="cart-title">Shopping Cart (${cart.length} items)</h2>
        ${itemsHtml}
      </div>
      <div class="price-summary-panel">
        <h2 class="summary-title">Price Details</h2>
        <div class="summary-row">
          <span>Price (${getCartItemCount()} items)</span>
          <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row">
          <span>Delivery Charges</span>
          <span style="color: var(--text-green); font-weight: 600;">${delivery}</span>
        </div>
        <div class="summary-row total">
          <span>Total Amount</span>
          <span>₹${total.toLocaleString('en-IN')}</span>
        </div>
        <button class="checkout-btn" onclick="goToCheckout()">Proceed to Checkout</button>
      </div>
    </div>
  `;
}

// Global actions exposed to window for onclick handlers
window.adjustQty = (productId, amount) => {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      removeCartItem(productId);
      return;
    }
    saveCart(cart);
    renderCart();
  }
};

window.removeCartItem = (productId) => {
  let cart = getCart();
  cart = cart.filter(item => item.productId !== productId);
  saveCart(cart);
  renderCart();
};

window.goToCheckout = () => {
  if (!currentUser) {
    alert('Please log in or register to complete your order.');
    window.location.href = '/login.html?redirect=checkout.html';
    return;
  }
  window.location.href = '/checkout.html';
};

// 4. Checkout Page
function initCheckoutPage() {
  // Ensure user is logged in
  if (!currentUser) {
    window.location.href = '/login.html?redirect=checkout.html';
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = '/cart.html';
    return;
  }

  // Display Order Summary
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryNum = subtotal > 5000 ? 0 : 150;
  const total = subtotal + deliveryNum;

  document.getElementById('checkout-items').innerHTML = cart.map(item => `
    <div style="display:flex; justify-content:space-between; margin-bottom: 12px; font-size: 14px;">
      <span>${item.name} (x${item.quantity})</span>
      <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('checkout-delivery').textContent = deliveryNum === 0 ? 'FREE' : `₹${deliveryNum.toLocaleString('en-IN')}`;
  document.getElementById('checkout-total').textContent = `₹${total.toLocaleString('en-IN')}`;

  // Form submission
  const checkoutForm = document.getElementById('checkout-form');
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('address').value;
    
    if (!address.trim()) {
      showError('Please enter a valid shipping address.');
      return;
    }

    const payload = {
      items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
      shippingAddress: address
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        // Clear local cart
        localStorage.removeItem('cart');
        updateHeader();
        
        // Show success screen
        showOrderSuccess(data.orderId);
      } else {
        showError(data.message || 'Order failed.');
      }
    } catch (err) {
      console.error(err);
      showError('An error occurred. Please try again.');
    }
  });
}

function showOrderSuccess(orderId) {
  const container = document.getElementById('checkout-page');
  container.innerHTML = `
    <div class="success-container">
      <div class="success-icon">✓</div>
      <h2>Order Successful!</h2>
      <p>Thank you for shopping with us. Your order ID is <strong>${orderId}</strong>.</p>
      <a href="/" class="product-btn">Continue Shopping</a>
    </div>
  `;
}

// 5. Login Page
function initLoginForm() {
  const form = document.getElementById('login-form');
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect') || '/';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showError('All fields are required.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = redirect;
      } else {
        showError(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      showError('Connection error.');
    }
  });
}

// 6. Register Page
function initRegisterForm() {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!email || !password || !confirmPassword) {
      showError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Logging you in...');
        window.location.href = '/';
      } else {
        showError(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      showError('Connection error.');
    }
  });
}

// Shared Error Helper
function showError(msg) {
  let errBox = document.getElementById('error-box');
  if (!errBox) {
    errBox = document.createElement('div');
    errBox.id = 'error-box';
    errBox.className = 'alert alert-danger';
    const form = document.querySelector('form');
    if (form) {
      form.insertBefore(errBox, form.firstChild);
    } else {
      document.querySelector('.container').insertBefore(errBox, document.querySelector('.container').firstChild);
    }
  }
  errBox.textContent = msg;
  errBox.scrollIntoView({ behavior: 'smooth' });
}
