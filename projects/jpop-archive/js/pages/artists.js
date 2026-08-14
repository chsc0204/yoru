// ===== Artists 목록 페이지 =====
let artistsPageState = { search: '', genre: 'ALL', debutYear: 'ALL', sort: 'popularity' };

function renderArtists(container) {
  const genres = ['ALL', ...new Set(ARTISTS.map((a) => a.genre))];
  const debutYears = ['ALL', ...new Set(ARTISTS.map((a) => a.debutYear))].sort((a, b) => (a === 'ALL' ? -1 : b === 'ALL' ? 1 : a - b));

  container.innerHTML = `
    <div class="page container">
      <h1 class="page-title">Artists</h1>
      <p class="page-desc">${ARTISTS.length}명의 아티스트를 탐색해보세요.</p>

      <div class="toolbar">
        <input type="text" class="toolbar-search" id="artistSearchInput" placeholder="아티스트 이름 검색" value="${artistsPageState.search}">
        <select id="artistGenreSelect">
          ${genres.map((g) => `<option value="${g}">${g === 'ALL' ? '전체 장르' : g}</option>`).join('')}
        </select>
        <select id="artistYearSelect">
          ${debutYears.map((y) => `<option value="${y}">${y === 'ALL' ? '전체 데뷔년도' : y}</option>`).join('')}
        </select>
        <select id="artistSortSelect">
          <option value="popularity">Popularity 순</option>
          <option value="name">이름 순</option>
          <option value="debutYear">데뷔년도 순</option>
        </select>
      </div>

      <div class="grid grid-artists" id="artistsGrid"></div>
      <div id="artistsEmpty" hidden></div>
    </div>`;

  qs('#artistGenreSelect').value = artistsPageState.genre;
  qs('#artistYearSelect').value = artistsPageState.debutYear;
  qs('#artistSortSelect').value = artistsPageState.sort;

  qs('#artistSearchInput').addEventListener('input', debounce((e) => {
    artistsPageState.search = e.target.value;
    renderArtistsGrid();
  }, 200));
  qs('#artistGenreSelect').addEventListener('change', (e) => {
    artistsPageState.genre = e.target.value;
    renderArtistsGrid();
  });
  qs('#artistYearSelect').addEventListener('change', (e) => {
    artistsPageState.debutYear = e.target.value;
    renderArtistsGrid();
  });
  qs('#artistSortSelect').addEventListener('change', (e) => {
    artistsPageState.sort = e.target.value;
    renderArtistsGrid();
  });

  renderArtistsGrid();
}

function renderArtistsGrid() {
  const grid = qs('#artistsGrid');
  const emptyEl = qs('#artistsEmpty');
  if (!grid) return;

  let list = ARTISTS.filter((a) => {
    const matchesSearch = !artistsPageState.search || a.name.toLowerCase().includes(artistsPageState.search.toLowerCase());
    const matchesGenre = artistsPageState.genre === 'ALL' || a.genre === artistsPageState.genre;
    const matchesYear = artistsPageState.debutYear === 'ALL' || String(a.debutYear) === String(artistsPageState.debutYear);
    return matchesSearch && matchesGenre && matchesYear;
  });

  if (artistsPageState.sort === 'name') {
    list = list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (artistsPageState.sort === 'debutYear') {
    list = list.sort((a, b) => a.debutYear - b.debutYear);
  } else {
    list = list.sort((a, b) => b.popularity - a.popularity);
  }

  if (list.length === 0) {
    grid.innerHTML = '';
    emptyEl.hidden = false;
    emptyEl.innerHTML = emptyStateHTML('조건에 맞는 아티스트가 없습니다.');
    return;
  }

  emptyEl.hidden = true;
  grid.innerHTML = list.map(artistCardHTML).join('');
  bindInteractions(grid);
}
