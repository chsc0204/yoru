// ===== Songs 목록 페이지 =====
let songsPageState = { search: '', genre: 'ALL', artist: 'ALL', sort: 'popularity' };

function renderSongs(container) {
  const genres = ['ALL', ...new Set(SONGS.map((s) => s.genre))];
  const artistOptions = ['ALL', ...ARTISTS.map((a) => a.id)];

  container.innerHTML = `
    <div class="page container">
      <h1 class="page-title">Songs</h1>
      <p class="page-desc">${SONGS.length}곡을 검색하고 필터링해보세요.</p>

      <div class="toolbar">
        <input type="text" class="toolbar-search" id="songSearchInput" placeholder="곡명 / 아티스트명 검색" value="${songsPageState.search}">
        <select id="songGenreSelect">
          ${genres.map((g) => `<option value="${g}">${g === 'ALL' ? '전체 장르' : g}</option>`).join('')}
        </select>
        <select id="songArtistSelect">
          ${artistOptions.map((id) => `<option value="${id}">${id === 'ALL' ? '전체 아티스트' : getArtist(id).name}</option>`).join('')}
        </select>
        <select id="songSortSelect">
          <option value="popularity">Popularity 순</option>
          <option value="latest">최신순</option>
          <option value="oldest">오래된 순</option>
          <option value="alphabetical">가나다/ABC 순</option>
        </select>
      </div>

      <div class="grid grid-songs" id="songsList"></div>
      <div id="songsEmpty" hidden></div>
    </div>`;

  qs('#songGenreSelect').value = songsPageState.genre;
  qs('#songArtistSelect').value = songsPageState.artist;
  qs('#songSortSelect').value = songsPageState.sort;

  qs('#songSearchInput').addEventListener('input', debounce((e) => {
    songsPageState.search = e.target.value;
    renderSongsList();
  }, 200));
  qs('#songGenreSelect').addEventListener('change', (e) => {
    songsPageState.genre = e.target.value;
    renderSongsList();
  });
  qs('#songArtistSelect').addEventListener('change', (e) => {
    songsPageState.artist = e.target.value;
    renderSongsList();
  });
  qs('#songSortSelect').addEventListener('change', (e) => {
    songsPageState.sort = e.target.value;
    renderSongsList();
  });

  renderSongsList();
}

function renderSongsList() {
  const listEl = qs('#songsList');
  const emptyEl = qs('#songsEmpty');
  if (!listEl) return;

  const q = songsPageState.search.toLowerCase();

  let list = SONGS.filter((s) => {
    const artist = getArtist(s.artistId);
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.translatedTitle.toLowerCase().includes(q) || (artist && artist.name.toLowerCase().includes(q));
    const matchesGenre = songsPageState.genre === 'ALL' || s.genre === songsPageState.genre;
    const matchesArtist = songsPageState.artist === 'ALL' || s.artistId === songsPageState.artist;
    return matchesSearch && matchesGenre && matchesArtist;
  });

  if (songsPageState.sort === 'latest') {
    list = list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  } else if (songsPageState.sort === 'oldest') {
    list = list.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  } else if (songsPageState.sort === 'alphabetical') {
    list = list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list = list.sort((a, b) => b.popularity - a.popularity);
  }

  if (list.length === 0) {
    listEl.innerHTML = '';
    emptyEl.hidden = false;
    emptyEl.innerHTML = emptyStateHTML('검색 결과가 없습니다.');
    return;
  }

  emptyEl.hidden = true;
  listEl.innerHTML = list.map((s, i) => songRowHTML(s, i + 1)).join('');
  bindInteractions(listEl);
}
