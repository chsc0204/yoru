// ===== 상품 데이터 (기존 30개 상품 유지 + category/description/badge/discountPrice 추가, 상품별 어울리는 사진으로 교체) =====
const products = [
  { id: 1,  name: '실리콘 범퍼 케이스',       price: 12900, image: 'https://images.unsplash.com/photo-1743670827800-61375c99e7a7?w=500&h=500&fit=crop', category: 'SILICONE',  badge: 'BEST', discountPrice: null,  description: '부드러운 실리콘 소재로 그립감이 뛰어나고 모서리 충격을 확실하게 흡수합니다.' },
  { id: 2,  name: '투명 젤리 케이스',         price: 9900,  image: 'https://images.unsplash.com/photo-1700757889144-dc593518094c?w=500&h=500&fit=crop', category: 'CLEAR',     badge: 'BEST', discountPrice: null,  description: '투명한 소재로 제품 본연의 색상을 그대로 살려주는 데일리 케이스입니다.' },
  { id: 3,  name: '가죽 플립 케이스',         price: 19900, image: 'https://images.unsplash.com/photo-1587743654986-787b7e7ce14b?w=500&h=500&fit=crop', category: 'ETC',       badge: null,   discountPrice: 16900, description: '고급 인조가죽 플립 커버로 화면까지 안전하게 보호합니다.' },
  { id: 4,  name: '카드 수납 케이스',         price: 15900, image: 'https://images.unsplash.com/photo-1588367941115-17cece88d036?w=500&h=500&fit=crop', category: 'ETC',       badge: null,   discountPrice: null,  description: '카드 2장을 수납할 수 있어 지갑 없이도 가볍게 외출할 수 있습니다.' },
  { id: 5,  name: '매트 하드 케이스',         price: 11900, image: 'https://images.unsplash.com/photo-1562204319-29a25e008e0f?w=500&h=500&fit=crop', category: 'HARD',      badge: null,   discountPrice: null,  description: '지문이 남지 않는 매트 마감으로 깔끔한 그립감을 제공합니다.' },
  { id: 6,  name: '그라데이션 케이스',        price: 13900, image: 'https://images.unsplash.com/photo-1584881768304-0b093b4f0261?w=500&h=500&fit=crop', category: 'ETC',       badge: null,   discountPrice: null,  description: '은은한 그라데이션 컬러로 세련된 무드를 더해주는 케이스입니다.' },
  { id: 7,  name: '플라워 패턴 케이스',       price: 14900, image: 'https://images.unsplash.com/photo-1769596722470-bf56e96b9aff?w=500&h=500&fit=crop', category: 'CHARACTER', badge: null,   discountPrice: null,  description: '화사한 플라워 패턴으로 봄 감성을 담은 케이스입니다.' },
  { id: 8,  name: '미니멀 화이트 케이스',     price: 10900, image: 'https://images.unsplash.com/photo-1758218112859-f96701f214a4?w=500&h=500&fit=crop', category: 'HARD',      badge: null,   discountPrice: null,  description: '군더더기 없는 화이트 컬러로 어떤 스타일에도 잘 어울립니다.' },
  { id: 9,  name: '카본 파이버 케이스',       price: 17900, image: 'https://images.unsplash.com/photo-1625641936123-59d5bcc1edb8?w=500&h=500&fit=crop', category: 'HARD',      badge: 'BEST', discountPrice: null,  description: '카본 패턴과 견고한 소재로 남성적인 그립감을 완성합니다.' },
  { id: 10, name: '네온 글로우 케이스',       price: 16900, image: 'https://images.unsplash.com/photo-1721864429288-f77b22fdc9ea?w=500&h=500&fit=crop', category: 'ETC',       badge: null,   discountPrice: null,  description: '은은하게 빛나는 네온 컬러로 개성을 표현할 수 있습니다.' },
  { id: 11, name: '우드 텍스처 케이스',       price: 18900, image: 'https://images.unsplash.com/photo-1623393884989-cb3663e431c5?w=500&h=500&fit=crop', category: 'ETC',       badge: null,   discountPrice: null,  description: '우드 질감의 프린팅으로 자연스러운 분위기를 연출합니다.' },
  { id: 12, name: '마블 스톤 케이스',         price: 15900, image: 'https://images.unsplash.com/photo-1584881768304-0b093b4f0261?w=500&h=500&fit=crop', category: 'HARD',      badge: null,   discountPrice: null,  description: '고급스러운 마블 패턴으로 클래식한 매력을 더합니다.' },
  { id: 13, name: '스포츠 아머 케이스',       price: 21900, image: 'https://images.unsplash.com/photo-1625641936123-59d5bcc1edb8?w=500&h=500&fit=crop', category: 'HARD',      badge: 'NEW',  discountPrice: 18900, description: '이중 구조 범퍼로 강력한 충격 보호 기능을 제공합니다.' },
  { id: 14, name: '캐릭터 프린트 케이스',     price: 13900, image: 'https://images.unsplash.com/photo-1766326789373-6f30e149f1ef?w=500&h=500&fit=crop', category: 'CHARACTER', badge: null,   discountPrice: null,  description: '귀여운 캐릭터 프린팅으로 매일 다른 기분을 연출해보세요.' },
  { id: 15, name: '메탈릭 실버 케이스',       price: 19900, image: 'https://images.unsplash.com/photo-1721864429288-f77b22fdc9ea?w=500&h=500&fit=crop', category: 'HARD',      badge: null,   discountPrice: null,  description: '메탈릭 광택으로 고급스러운 인상을 주는 케이스입니다.' },
  { id: 16, name: '반투명 매트 케이스',       price: 11900, image: 'https://images.unsplash.com/photo-1700757889144-dc593518094c?w=500&h=500&fit=crop', category: 'CLEAR',     badge: null,   discountPrice: null,  description: '은은하게 비치는 반투명 소재로 깔끔한 느낌을 살렸습니다.' },
  { id: 17, name: '레더 스트랩 케이스',       price: 22900, image: 'https://images.unsplash.com/photo-1587743654986-787b7e7ce14b?w=500&h=500&fit=crop', category: 'ETC',       badge: 'NEW',  discountPrice: 19900, description: '손목 스트랩이 포함되어 있어 휴대성이 뛰어난 케이스입니다.' },
  { id: 18, name: '아크릴 글리터 케이스',     price: 14900, image: 'https://images.unsplash.com/photo-1769596722470-bf56e96b9aff?w=500&h=500&fit=crop', category: 'CLEAR',     badge: null,   discountPrice: null,  description: '은은한 글리터 입자가 빛에 반짝이는 화려한 케이스입니다.' },
  { id: 19, name: '방수 실리콘 케이스',       price: 16900, image: 'https://images.unsplash.com/photo-1743670827800-61375c99e7a7?w=500&h=500&fit=crop', category: 'SILICONE',  badge: 'BEST', discountPrice: null,  description: '생활 방수 기능을 더해 야외 활동에도 안심하고 사용할 수 있습니다.' },
  { id: 20, name: '핸드드로잉 케이스',        price: 17900, image: 'https://images.unsplash.com/photo-1766326789373-6f30e149f1ef?w=500&h=500&fit=crop', category: 'CHARACTER', badge: 'NEW',  discountPrice: null,  description: '손그림 느낌의 일러스트로 감성적인 무드를 완성합니다.' },
  { id: 21, name: '벨벳 터치 케이스',         price: 13900, image: 'https://images.unsplash.com/photo-1562204319-29a25e008e0f?w=500&h=500&fit=crop', category: 'SILICONE',  badge: null,   discountPrice: null,  description: '벨벳처럼 부드러운 촉감으로 손에 착 감기는 그립감을 제공합니다.' },
  { id: 22, name: '체크 패턴 케이스',         price: 12900, image: 'https://images.unsplash.com/photo-1584881768304-0b093b4f0261?w=500&h=500&fit=crop', category: 'CHARACTER', badge: null,   discountPrice: null,  description: '클래식한 체크 패턴으로 캐주얼한 분위기를 연출합니다.' },
  { id: 23, name: '네이처 프린트 케이스',     price: 14900, image: 'https://images.unsplash.com/photo-1623393884989-cb3663e431c5?w=500&h=500&fit=crop', category: 'CHARACTER', badge: null,   discountPrice: null,  description: '자연에서 영감을 받은 프린팅으로 싱그러운 느낌을 줍니다.' },
  { id: 24, name: '슬림 핏 케이스',           price: 9900,  image: 'https://images.unsplash.com/photo-1708430633913-033362b8b91a?w=500&h=500&fit=crop', category: 'HARD',      badge: null,   discountPrice: null,  description: '얇고 가벼운 슬림 핏으로 휴대성을 극대화했습니다.' },
  { id: 25, name: 'LED 라이트업 케이스',      price: 24900, image: 'https://images.unsplash.com/photo-1611791484238-bab3ae16ee39?w=500&h=500&fit=crop', category: 'ETC',       badge: 'NEW',  discountPrice: 21900, description: '터치 시 LED가 반짝이는 독특한 디자인의 케이스입니다.' },
  { id: 26, name: '듀얼 레이어 케이스',       price: 15900, image: 'https://images.unsplash.com/photo-1708430633913-033362b8b91a?w=500&h=500&fit=crop', category: 'HARD',      badge: null,   discountPrice: null,  description: '이중 레이어 구조로 스타일과 보호력을 동시에 잡았습니다.' },
  { id: 27, name: '클래식 블랙 케이스',       price: 10900, image: 'https://images.unsplash.com/photo-1562204319-29a25e008e0f?w=500&h=500&fit=crop', category: 'SILICONE',  badge: null,   discountPrice: null,  description: '어디에나 잘 어울리는 클래식 블랙 컬러 케이스입니다.' },
  { id: 28, name: '페일 핑크 케이스',         price: 12900, image: 'https://images.unsplash.com/photo-1769596722470-bf56e96b9aff?w=500&h=500&fit=crop', category: 'SILICONE',  badge: null,   discountPrice: null,  description: '은은한 페일 톤 핑크로 사랑스러운 무드를 연출합니다.' },
  { id: 29, name: '오션 블루 케이스',         price: 12900, image: 'https://images.unsplash.com/photo-1727093493796-56ef1b2f6af5?w=500&h=500&fit=crop', category: 'SILICONE',  badge: null,   discountPrice: null,  description: '청량한 오션 블루 컬러로 시원한 느낌을 줍니다.' },
  { id: 30, name: '프리미엄 골드 케이스',     price: 29900, image: 'https://images.unsplash.com/photo-1611791484238-bab3ae16ee39?w=500&h=500&fit=crop', category: 'HARD',      badge: 'NEW',  discountPrice: 25900, description: '고급스러운 골드 컬러와 마감으로 프리미엄 무드를 완성합니다.' },
];

const SHIPPING_FEE = 3000;
const CART_STORAGE_KEY = 'phonecase_cart';
const THEME_STORAGE_KEY = 'phonecase_theme';

// ===== 장바구니 (localStorage에서 복원) =====
let cart = loadCart();

// ===== 상태 =====
let currentCategory = 'ALL';
let currentSearch = '';
let modalQty = 1;

// ===== DOM 요소 =====
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const productsPage = document.getElementById('products-page');
const productsGrid = document.getElementById('products-grid');
const bestSellersGrid = document.getElementById('best-sellers-grid');
const noResults = document.getElementById('no-results');
const categoryFilters = document.getElementById('category-filters');

const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartCountEls = document.querySelectorAll('.cart-count');
const cartToggleBtn = document.getElementById('cart-toggle');
const cartCloseBtn = document.getElementById('cart-close');
const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

const navToggleBtn = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const searchToggleBtn = document.getElementById('search-toggle');
const searchBox = document.getElementById('search-box');
const searchInput = document.getElementById('search-input');
const themeToggleBtn = document.getElementById('theme-toggle');

const productModal = document.getElementById('product-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');

const checkoutForm = document.getElementById('checkout-form');
const checkoutSummary = document.getElementById('checkout-summary');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');

const toastContainer = document.getElementById('toast-container');

// ===== 다크 모드 =====
function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
}

applyTheme(getPreferredTheme());
themeToggleBtn.addEventListener('click', toggleTheme);

// ===== 유틸 =====
function formatPrice(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function getProduct(id) {
  return products.find(p => p.id === id);
}

function badgeHTML(product) {
  if (!product.badge) return '';
  const cls = product.badge === 'NEW' ? 'badge-new' : 'badge-best';
  return `<span class="badge ${cls}">${product.badge}</span>`;
}

function priceHTML(product) {
  if (product.discountPrice) {
    return `
      <div class="product-price has-discount">
        <span class="price-original">${formatPrice(product.price)}</span>
        <span class="price-final">${formatPrice(product.discountPrice)}</span>
      </div>`;
  }
  return `<div class="product-price"><span class="price-final">${formatPrice(product.price)}</span></div>`;
}

// ===== 페이지 전환 =====
function showPage(pageName) {
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`${pageName}-page`);
  if (target) target.classList.add('active');

  navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === pageName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileNav();
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;

    if (link.dataset.scrollTo) {
      showPage('home');
      setTimeout(() => {
        const el = document.getElementById(link.dataset.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    showPage(page);
  });
});

document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(el.dataset.goto);
  });
});

document.querySelectorAll('[data-scroll-to]:not(.nav-link)').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
    setTimeout(() => {
      const target = document.getElementById(el.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  });
});

// ===== 모바일 네비게이션 =====
function closeMobileNav() {
  navMenu.classList.remove('open');
  navToggleBtn.setAttribute('aria-expanded', 'false');
}

navToggleBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggleBtn.setAttribute('aria-expanded', String(isOpen));
});

// ===== 검색창 토글(모바일) =====
searchToggleBtn.addEventListener('click', () => {
  searchBox.classList.toggle('open');
  if (searchBox.classList.contains('open')) searchInput.focus();
});

// ===== 카테고리 필터 렌더링 =====
function renderCategoryFilters() {
  const categories = ['ALL', ...new Set(products.map(p => p.category))];
  categoryFilters.innerHTML = categories.map(cat => `
    <button type="button" class="filter-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');

  categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      renderCategoryFilters();
      renderProducts();
    });
  });
}

// ===== 검색 =====
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.trim().toLowerCase();
  if (!productsPage.classList.contains('active')) showPage('products');
  renderProducts();
});

// ===== 상품 카드 생성 =====
function productCardHTML(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        ${badgeHTML(product)}
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-overlay">
          <button type="button" class="btn btn-view" data-detail="${product.id}">상세보기</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        ${priceHTML(product)}
        <button type="button" class="btn add-to-cart" data-id="${product.id}" aria-label="${product.name} 장바구니 담기">장바구니 담기</button>
      </div>
    </div>
  `;
}

function bindProductCardEvents(container) {
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.id), 1);
    });
  });

  container.querySelectorAll('[data-detail]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductModal(parseInt(btn.dataset.detail));
    });
  });

  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(parseInt(card.dataset.id)));
  });
}

// ===== 상품 목록 렌더링 =====
function renderProducts() {
  let list = products;

  if (currentCategory !== 'ALL') {
    list = list.filter(p => p.category === currentCategory);
  }

  if (currentSearch) {
    list = list.filter(p => p.name.toLowerCase().includes(currentSearch));
  }

  if (list.length === 0) {
    productsGrid.innerHTML = '';
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;
  productsGrid.innerHTML = list.map(productCardHTML).join('');
  bindProductCardEvents(productsGrid);
}

// ===== 베스트셀러 렌더링 =====
function renderBestSellers() {
  const best = products.filter(p => p.badge === 'BEST').slice(0, 4);
  bestSellersGrid.innerHTML = best.map(productCardHTML).join('');
  bindProductCardEvents(bestSellersGrid);
}

// ===== 상품 상세 모달 =====
function openProductModal(id) {
  const product = getProduct(id);
  if (!product) return;

  modalQty = 1;

  modalBody.innerHTML = `
    <div class="modal-image-wrap">
      ${badgeHTML(product)}
      <img src="${product.image}" alt="${product.name}" class="modal-image">
    </div>
    <div class="modal-info">
      <div class="product-category">${product.category}</div>
      <h2 class="modal-name">${product.name}</h2>
      ${priceHTML(product)}
      <p class="modal-description">${product.description}</p>

      <div class="qty-control">
        <span class="qty-label" id="qty-label">수량</span>
        <div class="qty-buttons" role="group" aria-labelledby="qty-label">
          <button type="button" class="qty-btn" id="modal-qty-minus" aria-label="수량 감소">−</button>
          <span class="qty-value" id="modal-qty-value">1</span>
          <button type="button" class="qty-btn" id="modal-qty-plus" aria-label="수량 증가">+</button>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-block" id="modal-add-cart">장바구니 담기</button>
        <button type="button" class="btn btn-primary btn-block" id="modal-buy-now">바로 구매</button>
      </div>
    </div>
  `;

  document.getElementById('modal-qty-minus').addEventListener('click', () => {
    modalQty = Math.max(1, modalQty - 1);
    document.getElementById('modal-qty-value').textContent = modalQty;
  });

  document.getElementById('modal-qty-plus').addEventListener('click', () => {
    modalQty += 1;
    document.getElementById('modal-qty-value').textContent = modalQty;
  });

  document.getElementById('modal-add-cart').addEventListener('click', () => {
    addToCart(product.id, modalQty);
  });

  document.getElementById('modal-buy-now').addEventListener('click', () => {
    addToCart(product.id, modalQty, { silent: true });
    closeProductModal();
    openCheckout();
  });

  productModal.classList.add('open');
  productModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeProductModal() {
  productModal.classList.remove('open');
  productModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

modalCloseBtn.addEventListener('click', closeProductModal);
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (productModal.classList.contains('open')) closeProductModal();
    if (cartSidebar.classList.contains('open')) closeCart();
  }
});

// ===== 장바구니 =====
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1, opts = {}) {
  const product = getProduct(productId);
  if (!product) return;

  const unitPrice = product.discountPrice || product.price;
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: unitPrice,
      image: product.image,
      quantity: qty,
    });
  }

  saveCart();
  renderCart();

  if (!opts.silent) {
    showToast('✓ 장바구니에 상품이 추가되었습니다.');
    openCart();
  }
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
  showToast('✓ 상품이 장바구니에서 삭제되었습니다.');
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEls.forEach(el => { el.textContent = count; });

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">장바구니가 비어 있습니다.</p>';
    cartSubtotalEl.textContent = formatPrice(0);
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-image" src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}</div>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn qty-minus" data-id="${item.id}" aria-label="${item.name} 수량 감소">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button type="button" class="qty-btn qty-plus" data-id="${item.id}" aria-label="${item.name} 수량 증가">+</button>
          <button type="button" class="cart-item-remove" data-id="${item.id}" aria-label="${item.name} 삭제">삭제</button>
        </div>
      </div>
    </div>
  `).join('');

  cartItemsEl.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), -1));
  });
  cartItemsEl.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), 1));
  });
  cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });

  cartSubtotalEl.textContent = formatPrice(cartSubtotal());
}

// ===== 장바구니 열기/닫기 =====
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  cartSidebar.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  cartSidebar.setAttribute('aria-hidden', 'true');
}

cartToggleBtn.addEventListener('click', () => {
  if (cartSidebar.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
});

cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ===== Checkout =====
function openCheckout() {
  if (cart.length === 0) {
    showToast('장바구니가 비어 있습니다.');
    return;
  }
  closeCart();
  renderCheckoutSummary();
  showPage('checkout');
}

cartCheckoutBtn.addEventListener('click', openCheckout);

function renderCheckoutSummary() {
  checkoutSummary.innerHTML = cart.map(item => `
    <div class="summary-row">
      <span class="summary-name">${item.name} <span class="summary-qty">× ${item.quantity}</span></span>
      <span class="summary-price">${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');

  const subtotal = cartSubtotal();
  checkoutSubtotal.textContent = formatPrice(subtotal);
  checkoutTotal.textContent = formatPrice(subtotal + SHIPPING_FEE);
}

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('장바구니가 비어 있습니다.');
    return;
  }

  const formData = new FormData(checkoutForm);
  const orderInfo = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    addressDetail: formData.get('addressDetail'),
    request: formData.get('request'),
  };

  placeOrder(orderInfo);
});

// ===== 주문 완료 =====
function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `CASE-${y}${m}${d}-${rand}`;
}

function placeOrder(orderInfo) {
  const subtotal = cartSubtotal();
  const total = subtotal + SHIPPING_FEE;
  const orderNumber = generateOrderNumber();

  document.getElementById('order-number').textContent = `#${orderNumber}`;
  document.getElementById('order-total').textContent = formatPrice(total);
  document.getElementById('order-shipping-info').textContent =
    `${orderInfo.name} / ${orderInfo.address} ${orderInfo.addressDetail || ''}`.trim();

  cart = [];
  saveCart();
  renderCart();
  checkoutForm.reset();

  showPage('complete');
}

// ===== Toast 알림 =====
let toastTimer = null;
function showToast(message) {
  toastContainer.textContent = message;
  toastContainer.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastContainer.classList.remove('show');
  }, 2500);
}

// ===== 슬라이더 =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.dataset.index));
      resetAutoSlide();
    });
  });
}

// ===== 초기화 =====
renderCategoryFilters();
renderProducts();
renderBestSellers();
renderCart();
startAutoSlide();
