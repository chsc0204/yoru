// ===== Favorites 페이지 =====
function renderFavorites(container) {
  const favArtists = getFavoriteArtists();
  const favSongs = getFavoriteSongs();
  const favAlbums = getFavoriteAlbums();
  const recent = getRecentlyViewed();
  const isEmpty = favArtists.length === 0 && favSongs.length === 0 && favAlbums.length === 0;

  container.innerHTML = `
    <div class="page container">
      <h1 class="page-title">Favorites</h1>
      <p class="page-desc">즐겨찾기한 아티스트 · 곡 · 앨범을 한눈에 모아봅니다.</p>

      ${isEmpty ? emptyStateHTML('아직 저장한 음악이 없습니다.') : `
        ${favArtists.length ? `
        <section>
          <div class="section-head"><h2>Favorite Artists</h2></div>
          <div class="grid grid-artists">${favArtists.map(artistCardHTML).join('')}</div>
        </section>` : ''}

        ${favSongs.length ? `
        <section>
          <div class="section-head"><h2>Favorite Songs</h2></div>
          <div class="grid grid-songs">${favSongs.map((s, i) => songRowHTML(s, i + 1)).join('')}</div>
        </section>` : ''}

        ${favAlbums.length ? `
        <section>
          <div class="section-head"><h2>Favorite Albums</h2></div>
          <div class="grid grid-albums">${favAlbums.map(albumCardHTML).join('')}</div>
        </section>` : ''}
      `}

      ${recent.length ? `
      <section>
        <div class="section-head"><h2>Recently Viewed</h2></div>
        <div class="recent-strip">${recent.map(recentChipHTML).join('')}</div>
      </section>` : ''}
    </div>`;

  bindInteractions(container);
}
