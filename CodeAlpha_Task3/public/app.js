// Simple client-side cart and page-specific logic for VulnerableShopApp

async function getJSON(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const cart = {
  items: [],
  add(product) {
    const existing = this.items.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.render();
  },
  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
  render() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!countEl || !itemsEl || !totalEl) return;

    const totalCount = this.items.reduce((sum, i) => sum + i.quantity, 0);
    countEl.textContent = totalCount;

    if (this.items.length === 0) {
      itemsEl.innerHTML = '<p class="hint">Your cart is empty. Add some juices!</p>';
      totalEl.textContent = '$0.00';
      return;
    }

    itemsEl.innerHTML = this.items
      .map(
        (i) => `
          <div class="cart-item">
            <div class="cart-item-main">
              <div class="cart-item-title">${i.name}</div>
              <div class="cart-item-meta">${i.quantity} × $${i.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-total">$${(i.price * i.quantity).toFixed(2)}</div>
          </div>
        `
      )
      .join('');
    totalEl.textContent = `$${this.total().toFixed(2)}`;
  }
};

// Very simple front-end "session" using localStorage
const storageKey = 'vsUser';

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(user));
  } catch {
    // ignore
  }
}

function clearCurrentUser() {
  localStorage.removeItem(storageKey);
}

function renderUserPill() {
  const user = getCurrentUser();
  const pill = document.getElementById('user-pill');
  const loginLink = document.querySelector('[data-nav-login]');
  if (!pill) return;

  if (user) {
    pill.style.display = 'inline-flex';
    pill.textContent = `Hi, ${user.name} (${user.role})`;
    pill.title = 'Click to clear fake login session';
    if (loginLink) {
      loginLink.textContent = 'Login';
    }
  } else {
    pill.style.display = 'none';
    if (loginLink) {
      loginLink.textContent = 'Login';
    }
  }
}

// Simple toast popup for success/error messages
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.textContent = type === 'success' ? '✅' : '⚠️';

  const msg = document.createElement('div');
  msg.className = 'toast-message';
  msg.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => {
    container.removeChild(toast);
  });

  toast.appendChild(icon);
  toast.appendChild(msg);
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const heroHighlight = document.getElementById('hero-highlight');

  // Homepage product loading
  if (productGrid) {
    getJSON('/api/products').then((products) => {
      if (!Array.isArray(products)) return;
      if (products.length && heroHighlight) {
        const featured = products[1] || products[0];
        heroHighlight.textContent = `${featured.name} · $${featured.price.toFixed(2)} · ${featured.rating.toFixed(
          1
        )}★`;
      }
      productGrid.innerHTML = products
        .map(
          (p) => `
          <article class="card">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="tag-row">
              <span class="price">$${p.price.toFixed(2)}</span>
              <span class="rating"><i class="fa-solid fa-star"></i> ${p.rating.toFixed(1)}</span>
            </div>
            <div class="tag-row">
              <span class="tag tag-success">In stock</span>
              <button
                class="btn btn-primary"
                data-add-cart
                data-id="${p.id}"
                data-name="${p.name}"
                data-price="${p.price}"
              >
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </article>
        `
        )
        .join('');

      productGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-cart]');
        if (!btn) return;
        const product = {
          id: Number(btn.dataset.id),
          name: btn.dataset.name,
          price: Number(btn.dataset.price)
        };
        cart.add(product);
      });
    });
  }

  // Cart drawer handling
  const cartPill = document.getElementById('cart-pill');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cartPill && cartDrawer) {
    cartPill.addEventListener('click', () => {
      cartDrawer.classList.toggle('open');
      cart.render();
    });
  }
  if (cartClose && cartDrawer) {
    cartClose.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
    });
  }
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      const body = { items: cart.items, total: cart.total() };
      const res = await getJSON('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      alert('Fake checkout complete. Response logged in console.');
      // eslint-disable-next-line no-console
      console.log('Checkout response', res);
    });
  }

  // User pill logout behavior
  const userPill = document.getElementById('user-pill');
  if (userPill) {
    userPill.addEventListener('click', () => {
      clearCurrentUser();
      renderUserPill();
      alert('Fake session cleared. You are logged out on this browser.');
    });
  }

  // Initial user pill render
  renderUserPill();

  // Login page logic (SQLi endpoint)
  const loginForm = document.getElementById('login-form');
  const loginResult = document.getElementById('login-result');
  if (loginForm && loginResult) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = loginForm.elements.username.value;
      const password = loginForm.elements.password.value;
      loginResult.textContent = 'Loading...';
      try {
        const json = await getJSON('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        loginResult.textContent = JSON.stringify(json, null, 2);

        // Store fake "session" client-side when backend login says success
        if (json && json.success && json.user) {
          showToast(`Congratulations, ${json.user.name}! You logged in successfully.`, 'success');
          setCurrentUser(json.user);
          renderUserPill();
          // Redirect to profile page for a more realistic flow
          if (json.user.id) {
            setTimeout(() => {
              window.location.href = `/profile?userId=${encodeURIComponent(json.user.id)}`;
            }, 900);
          }
        } else {
          showToast('Login failed. Please check your email, password, or try a SQL injection payload.', 'error');
        }
      } catch (err) {
        loginResult.textContent = String(err);
        showToast('Login request failed. Please try again.', 'error');
      }
    });
  }

  // Profile helper form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userId = profileForm.elements.userId.value;
      window.location.href = `/profile?userId=${encodeURIComponent(userId)}`;
    });
  }

  // Admin config form (eval-based deserialization)
  const adminForm = document.getElementById('admin-form');
  const adminResult = document.getElementById('admin-result');
  if (adminForm && adminResult) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const config = adminForm.elements.config.value;
      adminResult.textContent = 'Loading...';
      const json = await getJSON('/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      adminResult.textContent = JSON.stringify(json, null, 2);
    });
  }
});


