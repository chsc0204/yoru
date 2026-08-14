// ===== Artist Detail 페이지 =====
function renderArtistDetail(container, artistId) {
  const artist = getArtist(artistId);

  if (!artist) {
    container.innerHTML = `<div class="page container">${emptyStateHTML('아티스트를 찾을 수 없습니다.')}</div>`;
    return;
  }

  addRecentlyViewed('artist', artist.id);

  const songs = songsByArtist(artist.id);
  const albums = albumsByArtist(artist.id);
  const fav = isFavorite('artists', artist.id);

  const related = ARTISTS.filter((a) => a.id !== artist.id && a.genre === artist.genre)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  container.innerHTML = `
    <div class="page container">
      <div class="detail-hero">
        ${coverArtHTML(artist.id, artist.name)}
        <div class="detail-info">
          <span class="badge badge-genre">${artist.genre}</span>
          <h1>${artist.name}</h1>
          <div class="detail-japanese">${artist.japaneseName}</div>
          <div class="detail-meta">
            <span>데뷔 <strong>${artist.debutYear}</strong></span>
            <span>국가 <strong>${artist.country}</strong></span>
            <span>인기도 ${starsHTML(artist.popularity)}</span>
          </div>
          <p class="detail-description">${artist.description}</p>
          <div class="detail-actions">
            <button type="button" class="fav-btn ${fav ? 'is-favorite' : ''}" id="artistFavBtn" style="font-size:1.6rem;" aria-label="즐겨찾기">${fav ? '♥' : '♡'}</button>
            <button type="button" class="btn btn-outline" data-nav-to="songs">모든 곡 보기</button>
          </div>
        </div>
      </div>

      <section>
        <div class="section-head"><h2>Popular Songs</h2></div>
        <div class="grid grid-songs">${songs.map((s, i) => songRowHTML(s, i + 1)).join('')}</div>
      </section>

      <section>
        <div class="section-head"><h2>Albums</h2></div>
        <div class="grid grid-albums">${albums.map(albumCardHTML).join('')}</div>
      </section>

      <section>
        <div class="section-head"><h2>Artist Statistics</h2></div>
        <div class="grid grid-2">
          <div class="chart-card">
            <h3>Popularity / Songs / Albums</h3>
            <div class="chart-canvas-wrap"><canvas id="artistOverviewChart"></canvas></div>
          </div>
          <div class="chart-card">
            <h3>Yearly Activity</h3>
            <div class="chart-canvas-wrap"><canvas id="artistYearlyChart"></canvas></div>
          </div>
        </div>
      </section>

      ${related.length ? `
      <section>
        <div class="section-head"><h2>Related Artists</h2></div>
        <div class="grid grid-artists">${related.map(artistCardHTML).join('')}</div>
      </section>` : ''}
    </div>`;

  bindInteractions(container);

  qs('#artistFavBtn').addEventListener('click', () => {
    const nowFav = toggleFavorite('artists', artist.id);
    qs('#artistFavBtn').classList.toggle('is-favorite', nowFav);
    qs('#artistFavBtn').textContent = nowFav ? '♥' : '♡';
    showToast(nowFav ? '♥ 즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 삭제되었습니다.');
    updateFavoriteNavCount();
  });

  renderArtistOverviewChart(artist, songs, albums);
  renderArtistYearlyChart(songs);
}

function renderArtistOverviewChart(artist, songs, albums) {
  const ctx = document.getElementById('artistOverviewChart');
  if (!ctx || typeof Chart === 'undefined') return;

  registerChart(new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Popularity', 'Songs', 'Albums'],
      datasets: [{
        label: artist.name,
        data: [artist.popularity, songs.length * 10, albums.length * 10],
        backgroundColor: ['#FF4D8D', '#9A6CF7', '#4ADE80'],
        borderRadius: 8,
      }],
    },
    options: chartBaseOptions({ plugins: { legend: { display: false } } }),
  }));
}

function renderArtistYearlyChart(songs) {
  const ctx = document.getElementById('artistYearlyChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const counts = {};
  songs.forEach((s) => {
    const y = formatYear(s.releaseDate);
    counts[y] = (counts[y] || 0) + 1;
  });
  const years = Object.keys(counts).sort();

  registerChart(new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: '발매곡 수',
        data: years.map((y) => counts[y]),
        backgroundColor: '#FF4D8D',
        borderRadius: 8,
      }],
    },
    options: chartBaseOptions({ plugins: { legend: { display: false } } }),
  }));
}
