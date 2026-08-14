// ===== 앱 부트스트랩 =====
const navToggleBtn = document.getElementById('navToggle');
const navMenuEl = document.getElementById('navMenu');
const globalSearchInput = document.getElementById('globalSearchInput');
const searchResultsEl = document.getElementById('searchResults');
const toastEl = document.getElementById('toast');
const favNavCountEl = document.getElementById('favNavCount');

// ---------- 모바일 네비게이션 ----------
function closeMobileNav() {
  navMenuEl.classList.remove('open');
  navToggleBtn.setAttribute('aria-expanded', 'false');
}

navToggleBtn.addEventListener('click', () => {
  const isOpen = navMenuEl.classList.toggle('open');
  navToggleBtn.setAttribute('aria-expanded', String(isOpen));
});

// ---------- Toast ----------
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// ---------- Favorites 네비 카운트 ----------
function updateFavoriteNavCount() {
  const count = favoriteCount();
  favNavCountEl.textContent = count > 0 ? `(${count})` : '';
}

// ---------- 전체 검색 ----------
function renderSearchResults(results) {
  if (!hasSearchResults(results)) {
    searchResultsEl.innerHTML = emptyStateHTML('검색 결과가 없습니다.').replace('empty-state', 'empty-state search-empty');
    searchResultsEl.classList.add('open');
    return;
  }

  const groups = [
    { label: 'Artists', items: results.artists, type: 'artist' },
    { label: 'Songs', items: results.songs, type: 'song' },
    { label: 'Albums', items: results.albums, type: 'album' },
  ];

  searchResultsEl.innerHTML = groups
    .filter((g) => g.items.length > 0)
    .map((g) => `
      <div class="search-group-label">${g.label}</div>
      ${g.items.map((item) => searchResultItemHTML(item, g.type)).join('')}
    `)
    .join('');

  searchResultsEl.classList.add('open');

  qsa('[data-search-nav]', searchResultsEl).forEach((el) => {
    el.addEventListener('click', () => {
      navigateTo(el.dataset.searchNav);
      closeSearchResults();
      globalSearchInput.value = '';
    });
  });
}

function searchResultItemHTML(item, type) {
  if (type === 'artist') {
    return `
      <div class="search-result-item" data-search-nav="artists/${item.id}">
        ${coverArtHTML(item.id, item.name, 'search-result-thumb')}
        <div>
          <div class="search-result-name">${item.name}</div>
          <div class="search-result-sub">${item.genre}</div>
        </div>
      </div>`;
  }
  if (type === 'song') {
    const artist = getArtist(item.artistId);
    return `
      <div class="search-result-item" data-search-nav="songs/${item.id}">
        ${coverArtHTML(item.id, item.title, 'search-result-thumb')}
        <div>
          <div class="search-result-name">${item.title}</div>
          <div class="search-result-sub">${artist ? artist.name : ''}</div>
        </div>
      </div>`;
  }
  const artist = getArtist(item.artistId);
  return `
    <div class="search-result-item" data-search-nav="albums/${item.id}">
      ${coverArtHTML(item.id, item.title, 'search-result-thumb')}
      <div>
        <div class="search-result-name">${item.title}</div>
        <div class="search-result-sub">${artist ? artist.name : ''}</div>
      </div>
    </div>`;
}

function closeSearchResults() {
  searchResultsEl.classList.remove('open');
}

globalSearchInput.addEventListener('input', debounce((e) => {
  const q = e.target.value;
  if (!q.trim()) {
    closeSearchResults();
    return;
  }
  renderSearchResults(searchAll(q));
}, 200));

globalSearchInput.addEventListener('focus', () => {
  if (globalSearchInput.value.trim()) renderSearchResults(searchAll(globalSearchInput.value));
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-search')) closeSearchResults();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearchResults();
});

// ---------- Scroll reveal ----------
let revealObserver = null;
function revealOnScroll() {
  const targets = qsa('.section-head, .hero').filter((el) => !el.classList.contains('reveal') || !el.classList.contains('in-view'));
  targets.forEach((el) => el.classList.add('reveal'));

  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  qsa('.reveal:not(.in-view)').forEach((el) => revealObserver.observe(el));
}

// ---------- 초기화 ----------
updateFavoriteNavCount();
renderRoute();
