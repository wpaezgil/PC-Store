const API_URL = '/api/v1';
let currentCategory = '';

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

// --- PRODUCTOS ---

async function loadProducts(category = '') {
  currentCategory = category;
  const endpoint = category ? `${API_URL}/product?category=${category}` : `${API_URL}/product`;
  const res = await fetch(endpoint);
  const products = await res.json();

  const grid = document.getElementById('productsGrid');
  if (!products.length) {
    grid.innerHTML = '<p class="empty-msg">No hay productos registrados en esta categoría.</p>';
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card">
        <div>
          <span class="badge ${p.category}">${p.category}</span>
          <h3 style="margin-top: 0.5rem;">${p.name}</h3>
        </div>
        <div class="product-price">${formatCOP(p.price)}</div>
        <div class="product-actions">
          <button class="btn-primary" onclick="addToCart('${p._id}')">+ Al Carrito</button>
          <button class="btn-delete-prod" title="Eliminar producto" onclick="deleteProduct('${p._id}')">✕</button>
        </div>
      </article>
    `
    )
    .join('');
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const price = Number(document.getElementById('priceInput').value);
  const category = document.getElementById('categoryInput').value;

  const res = await fetch(`${API_URL}/product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, category }),
  });

  if (res.ok) {
    e.target.reset();
    loadProducts(currentCategory);
  } else {
    const err = await res.json();
    alert(err.message || 'Error al guardar producto');
  }
});

async function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto del catálogo?')) return;
  await fetch(`${API_URL}/product/${id}`, { method: 'DELETE' });
  loadProducts(currentCategory);
}

// Filtros por pestaña
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(btn.dataset.category);
  });
});

// --- CARRITO DE COMPRAS ---

function getUserId() {
  return document.getElementById('userIdInput').value.trim() || 'cliente-1';
}

async function loadCart() {
  const userId = getUserId();
  const res = await fetch(`${API_URL}/cart/${userId}`);
  const cart = await res.json();

  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  totalEl.textContent = formatCOP(cart.total || 0);

  if (!cart.items || cart.items.length === 0) {
    container.innerHTML = '<p class="empty-msg">El carrito está vacío.</p>';
    return;
  }

  container.innerHTML = cart.items
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name} (x${item.quantity})</h4>
          <small>${item.category} • Subtotal: ${formatCOP(item.subtotal)}</small>
        </div>
        <button class="btn-remove-item" title="Quitar ítem" onclick="removeFromCart('${item.productId}')">🗑️</button>
      </div>
    `
    )
    .join('');
}

async function addToCart(productId) {
  const userId = getUserId();
  const res = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, quantity: 1 }),
  });

  if (res.ok) {
    loadCart();
  } else {
    const err = await res.json();
    alert(err.message || 'No se pudo agregar al carrito');
  }
}

async function removeFromCart(productId) {
  const userId = getUserId();
  await fetch(`${API_URL}/cart/${userId}/item/${productId}`, { method: 'DELETE' });
  loadCart();
}

document.getElementById('clearCartBtn').addEventListener('click', async () => {
  const userId = getUserId();
  await fetch(`${API_URL}/cart/${userId}`, { method: 'DELETE' });
  loadCart();
});

document.getElementById('loadCartBtn').addEventListener('click', loadCart);

// Inicializar datos al abrir la página
loadProducts();
loadCart();