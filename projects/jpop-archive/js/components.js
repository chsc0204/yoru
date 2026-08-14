// ===== 공용 카드/행 컴포넌트 (HTML 문자열 + 이벤트 바인딩) =====

function artistCardHTML(artist) {
  const fav = isFavorite('artists', artist.id) ? 'is-favorite' : '';
  return `
    <div class="artist-card" data-nav-to="artists/${artist.id}">
      <div style="position:relative;">
        ${coverArtHTML(artist.id, artist.name)}
        <div class="artist-card-overlay">
          <button type="button" class="btn btn-sm btn-primary" data-nav-to="artists/${artist.id}">상세보기</button>
        </div>
      </div>
      <div class="artist-card-body">
        <div class="artist-card-name">${artist.name}</div>
        <div class="artist-card-genre">${artist.genre} · ${artist.debutYear}</div>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          ${starsHTML(artist.popularity)}
          <button type="button" class="fav-btn ${fav}" data-fav-toggle="artists:${artist.id}" aria-label="${artist.name} 즐겨찾기">${fav ? '♥' : '♡'}</button>
        </div>
      </div>
    </div>`;
}

function albumCardHTML(album) {
  const artist = getArtist(album.artistId);
  const fav = isFavorite('albums', album.id) ? 'is-favorite' : '';
  return `
    <div class="artist-card" data-nav-to="albums/${album.id}">
      <div style="position:relative;">
        ${coverArtHTML(album.id, album.title)}
        <div class="artist-card-overlay">
          <button type="button" class="btn btn-sm btn-primary" data-nav-to="albums/${album.id}">상세보기</button>
        </div>
      </div>
      <div class="artist-card-body">
        <div class="artist-card-name">${album.title}</div>
        <div class="artist-card-genre">${artist ? artist.name : ''} · ${album.releaseYear}</div>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span class="badge badge-genre">${album.trackIds.length} tracks</span>
          <button type="button" class="fav-btn ${fav}" data-fav-toggle="albums:${album.id}" aria-label="${album.title} 즐겨찾기">${fav ? '♥' : '♡'}</button>
        </div>
      </div>
    </div>`;
}

function songRowHTML(song, index) {
  const artist = getArtist(song.artistId);
  const fav = isFavorite('songs', song.id) ? 'is-favorite' : '';
  return `
    <div class="song-row" data-nav-to="songs/${song.id}">
      <div class="song-row-index">${index != null ? index : '♪'}</div>
      <div style="min-width:0;">
        <div class="song-row-title">${song.title} <span style="color:var(--color-text-secondary); font-weight:500;">· ${song.translatedTitle}</span></div>
        <div class="song-row-artist">${artist ? artist.name : ''}</div>
      </div>
      <div class="song-row-genre">${song.genre}</div>
      <div class="song-row-date">${formatDate(song.releaseDate)}</div>
      <button type="button" class="fav-btn ${fav}" data-fav-toggle="songs:${song.id}" aria-label="${song.title} 즐겨찾기">${fav ? '♥' : '♡'}</button>
    </div>`;
}

function rankingRowHTML(rank, opts) {
  const isTop1 = rank === 1 ? 'top1' : '';
  return `
    <div class="ranking-row" data-nav-to="${opts.navTo}">
      <div class="ranking-rank ${isTop1}">${String(rank).padStart(2, '0')}</div>
      ${coverArtHTML(opts.id, opts.name, 'cover-sm')}
      <div>
        <div class="ranking-name">${opts.name}</div>
        <div class="ranking-sub">${opts.sub}</div>
      </div>
      <div class="ranking-score">${opts.score}</div>
      ${opts.trend !== undefined ? trendHTML(opts.trend) : '<div></div>'}
    </div>`;
}

function vocabCardHTML(v) {
  const relatedSong = v.relatedSongId ? getSong(v.relatedSongId) : null;
  return `
    <div class="vocab-card">
      <div class="vocab-word">${v.word}</div>
      <div class="vocab-reading">${v.reading}</div>
      <div class="vocab-meaning">${v.meaning}</div>
      <div class="vocab-meta">
        <span class="badge badge-genre">${v.category}</span>
        <span class="badge badge-jlpt">${v.jlpt}</span>
        ${relatedSong ? `<span class="badge badge-genre" data-nav-to="songs/${relatedSong.id}" style="cursor:pointer;">🎵 ${relatedSong.title}</span>` : ''}
      </div>
    </div>`;
}

// data-nav-to / data-fav-toggle 요소에 이벤트를 위임 바인딩한다.
function bindInteractions(container) {
  qsa('[data-nav-to]', container).forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo(el.dataset.navTo);
    });
  });

  qsa('[data-fav-toggle]', container).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const [type, id] = btn.dataset.favToggle.split(':');
      const nowFav = toggleFavorite(type, id);
      btn.classList.toggle('is-favorite', nowFav);
      btn.textContent = nowFav ? '♥' : '♡';
      showToast(nowFav ? '♥ 즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 삭제되었습니다.');
      updateFavoriteNavCount();
    });
  });
}

function emptyStateHTML(message) {
  return `
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>${message}</p>
    </div>`;
}
