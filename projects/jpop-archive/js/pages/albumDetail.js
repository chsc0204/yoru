// ===== Album Detail 페이지 =====
function renderAlbumDetail(container, albumId) {
  const album = getAlbum(albumId);

  if (!album) {
    container.innerHTML = `<div class="page container">${emptyStateHTML('앨범을 찾을 수 없습니다.')}</div>`;
    return;
  }

  const artist = getArtist(album.artistId);
  const tracks = album.trackIds.map(getSong).filter(Boolean);
  const fav = isFavorite('albums', album.id);

  container.innerHTML = `
    <div class="page container">
      <div class="detail-hero">
        ${coverArtHTML(album.id, album.title)}
        <div class="detail-info">
          <span class="badge badge-genre">${album.genre}</span>
          <h1>${album.title}</h1>
          <div class="detail-japanese" data-nav-to="artists/${artist ? artist.id : ''}" style="cursor:pointer;">${artist ? artist.name : '-'}</div>
          <div class="detail-meta">
            <span>발매년도 <strong>${album.releaseYear}</strong></span>
            <span>수록곡 <strong>${tracks.length}곡</strong></span>
          </div>
          <p class="detail-description">${album.description}</p>
          <div class="detail-actions">
            <button type="button" class="fav-btn ${fav ? 'is-favorite' : ''}" id="albumFavBtn" style="font-size:1.6rem;" aria-label="즐겨찾기">${fav ? '♥' : '♡'}</button>
          </div>
        </div>
      </div>

      <section>
        <div class="section-head"><h2>Track List</h2></div>
        <div class="grid grid-songs">${tracks.map((s, i) => songRowHTML(s, i + 1)).join('')}</div>
      </section>
    </div>`;

  bindInteractions(container);

  qs('#albumFavBtn').addEventListener('click', () => {
    const nowFav = toggleFavorite('albums', album.id);
    qs('#albumFavBtn').classList.toggle('is-favorite', nowFav);
    qs('#albumFavBtn').textContent = nowFav ? '♥' : '♡';
    showToast(nowFav ? '♥ 즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 삭제되었습니다.');
    updateFavoriteNavCount();
  });
}
