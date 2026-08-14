// ===== Song Detail 페이지 =====
function renderSongDetail(container, songId) {
  const song = getSong(songId);

  if (!song) {
    container.innerHTML = `<div class="page container">${emptyStateHTML('곡을 찾을 수 없습니다.')}</div>`;
    return;
  }

  addRecentlyViewed('song', song.id);

  const artist = getArtist(song.artistId);
  const album = getAlbum(song.albumId);
  const fav = isFavorite('songs', song.id);
  const mvUrl = youtubeSearchUrl(artist ? artist.name : '', song.title);

  let vocabList = VOCABULARY.filter((v) => v.relatedSongId === song.id);
  if (vocabList.length < 2) {
    const fillerCount = 2 - vocabList.length;
    const filler = VOCABULARY.filter((v) => !vocabList.includes(v) && !v.relatedSongId).slice(0, fillerCount);
    vocabList = vocabList.concat(filler);
  }

  container.innerHTML = `
    <div class="page container">
      <div class="detail-hero">
        ${coverArtHTML(song.id, song.title)}
        <div class="detail-info">
          <span class="badge badge-genre">${song.genre}</span>
          <h1>${song.title}</h1>
          <div class="detail-japanese">${song.reading} · "${song.translatedTitle}"</div>
          <div class="detail-meta">
            <span>아티스트 <strong data-nav-to="artists/${artist ? artist.id : ''}" style="cursor:pointer; color:var(--color-primary);">${artist ? artist.name : '-'}</strong></span>
            <span>앨범 <strong data-nav-to="albums/${album ? album.id : ''}" style="cursor:pointer; color:var(--color-primary);">${album ? album.title : '-'}</strong></span>
            <span>발매 <strong>${formatDate(song.releaseDate)}</strong></span>
            <span>인기도 ${starsHTML(song.popularity)} (${song.popularity})</span>
          </div>
          <div class="detail-actions">
            <a class="btn btn-primary" href="${mvUrl}" target="_blank" rel="noopener">▶ MV 보기</a>
            <button type="button" class="fav-btn ${fav ? 'is-favorite' : ''}" id="songFavBtn" style="font-size:1.6rem;" aria-label="즐겨찾기">${fav ? '♥' : '♡'}</button>
          </div>
        </div>
      </div>

      <section>
        <div class="section-head">
          <div>
            <div class="section-eyebrow">이 곡에서 배우는 일본어</div>
            <h2>Japanese Study</h2>
          </div>
          <button type="button" class="btn btn-sm btn-outline" data-nav-to="study">Japanese Study 전체보기</button>
        </div>
        <div class="grid grid-2">${vocabList.map(vocabCardHTML).join('')}</div>
      </section>
    </div>`;

  bindInteractions(container);

  qs('#songFavBtn').addEventListener('click', () => {
    const nowFav = toggleFavorite('songs', song.id);
    qs('#songFavBtn').classList.toggle('is-favorite', nowFav);
    qs('#songFavBtn').textContent = nowFav ? '♥' : '♡';
    showToast(nowFav ? '♥ 즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 삭제되었습니다.');
    updateFavoriteNavCount();
  });
}
