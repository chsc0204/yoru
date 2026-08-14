// ===== Albums 목록 페이지 =====
let albumsPageState = { search: '', genre: 'ALL', sort: 'latest' };

function renderAlbums(container) {
  const genres = ['ALL', ...new Set(ALBUMS.map((a) => a.genre))];

  container.innerHTML = `
    <div class="page container">
      <h1 class="page-title">Albums</h1>
      <p class="page-desc">${ALBUMS.length}개의 앨범을 둘러보세요.</p>

      <div class="toolbar">
        <input type="text" class="toolbar-search" id="albumSearchInput" placeholder="앨범명 검색" value="${albumsPageState.search}">
        <select id="albumGenreSelect">
          ${genres.map((g) => `<option value="${g}">${g === 'ALL' ? '전체 장르' : g}</option>`).join('')}
        </select>
        <select id="albumSortSelect">
          <option value="latest">최신순</option>
          <option value="oldest">오래된 순</option>
          <option value="alphabetical">가나다/ABC 순</option>
        </select>
      </div>

      <div class="grid grid-albums" id="albumsGrid"></div>
      <div id="albumsEmpty" hidden></div>
    </div>`;

  qs('#albumGenreSelect').value = albumsPageState.genre;
  qs('#albumSortSelect').value = albumsPageState.sort;

  qs('#albumSearchInput').addEventListener('input', debounce((e) => {
    albumsPageState.search = e.target.value;
    renderAlbumsGrid();
  }, 200));
  qs('#albumGenreSelect').addEventListener('change', (e) => {
    albumsPageState.genre = e.target.value;
    renderAlbumsGrid();
  });
  qs('#albumSortSelect').addEventListener('change', (e) => {
    albumsPageState.sort = e.target.value;
    renderAlbumsGrid();
  });

  renderAlbumsGrid();
}

function renderAlbumsGrid() {
  const grid = qs('#albumsGrid');
  const emptyEl = qs('#albumsEmpty');
  if (!grid) return;

  const q = albumsPageState.search.toLowerCase();

  let list = ALBUMS.filter((al) => {
    const matchesSearch = !q || al.title.toLowerCase().includes(q);
    const matchesGenre = albumsPageState.genre === 'ALL' || al.genre === albumsPageState.genre;
    return matchesSearch && matchesGenre;
  });

  if (albumsPageState.sort === 'oldest') {
    list = list.sort((a, b) => a.releaseYear - b.releaseYear);
  } else if (albumsPageState.sort === 'alphabetical') {
    list = list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list = list.sort((a, b) => b.releaseYear - a.releaseYear);
  }

  if (list.length === 0) {
    grid.innerHTML = '';
    emptyEl.hidden = false;
    emptyEl.innerHTML = emptyStateHTML('조건에 맞는 앨범이 없습니다.');
    return;
  }

  emptyEl.hidden = true;
  grid.innerHTML = list.map(albumCardHTML).join('');
  bindInteractions(grid);
}
