// ===== Dashboard 페이지 =====
function renderDashboard(container) {
  const topArtists = [...ARTISTS].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const topSongs = [...SONGS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const latestAlbums = [...ALBUMS].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 6);
  const todaysPicks = [...ARTISTS].sort((a, b) => b.popularity - a.popularity).slice(1, 5);

  const genreCounts = {};
  ARTISTS.forEach((a) => {
    genreCounts[a.genre] = (genreCounts[a.genre] || 0) + 1;
  });
  const mostPopularGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0];

  const recent = getRecentlyViewed();

  container.innerHTML = `
    <div class="page">
      <div class="container">
        <section class="hero">
          <p class="hero-kicker">Discover Japanese Music</p>
          <h1>J-POP을 더 깊게 탐색하고,<br>좋아하는 음악과 아티스트를 발견해보세요.</h1>
          <p class="hero-sub">아티스트, 곡, 앨범 정보부터 랭킹, 음악 통계, 일본어 학습까지 — 하나의 아카이브에서 만나보세요.</p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" data-nav-to="artists">Explore Music</button>
            <button type="button" class="btn btn-outline" data-nav-to="rankings">View Rankings</button>
          </div>
        </section>

        ${recent.length ? `
        <section>
          <div class="section-head"><h2>Recently Viewed</h2></div>
          <div class="recent-strip">${recent.map(recentChipHTML).join('')}</div>
        </section>` : ''}

        <section>
          <div class="section-head">
            <div>
              <div class="section-eyebrow">Curated</div>
              <h2>Today's Picks</h2>
            </div>
          </div>
          <div class="grid grid-artists">${todaysPicks.map(artistCardHTML).join('')}</div>
        </section>

        <section>
          <div class="section-head">
            <div>
              <div class="section-eyebrow">Popularity</div>
              <h2>Popular Artists</h2>
            </div>
            <button type="button" class="btn btn-sm btn-outline" data-nav-to="artists">전체보기</button>
          </div>
          <div class="grid grid-artists">${topArtists.map(artistCardHTML).join('')}</div>
        </section>

        <section>
          <div class="section-head">
            <div>
              <div class="section-eyebrow">Right Now</div>
              <h2>Trending Songs</h2>
            </div>
            <button type="button" class="btn btn-sm btn-outline" data-nav-to="songs">전체보기</button>
          </div>
          <div class="grid grid-songs">${topSongs.map((s, i) => songRowHTML(s, i + 1)).join('')}</div>
        </section>

        <section>
          <div class="section-head">
            <div>
              <div class="section-eyebrow">Fresh</div>
              <h2>Latest Releases</h2>
            </div>
            <button type="button" class="btn btn-sm btn-outline" data-nav-to="albums">전체보기</button>
          </div>
          <div class="grid grid-albums">${latestAlbums.map(albumCardHTML).join('')}</div>
        </section>

        <section>
          <div class="section-head"><h2>Music Statistics</h2></div>
          <div class="grid grid-stats">
            <div class="stat-card"><div class="stat-value">${ARTISTS.length}</div><div class="stat-label">Total Artists</div></div>
            <div class="stat-card"><div class="stat-value">${SONGS.length}</div><div class="stat-label">Total Songs</div></div>
            <div class="stat-card"><div class="stat-value">${ALBUMS.length}</div><div class="stat-label">Total Albums</div></div>
            <div class="stat-card"><div class="stat-value">${mostPopularGenre}</div><div class="stat-label">Most Popular Genre</div></div>
          </div>
        </section>

        <section>
          <div class="section-head"><h2>Yearly Trends</h2></div>
          <div class="chart-card">
            <h3>연도별 곡 발매 추이</h3>
            <div class="chart-canvas-wrap"><canvas id="yearlyTrendChart"></canvas></div>
          </div>
        </section>
      </div>
    </div>`;

  bindInteractions(container);
  renderYearlyTrendChart();
}

function renderYearlyTrendChart() {
  const counts = {};
  SONGS.forEach((s) => {
    const year = formatYear(s.releaseDate);
    counts[year] = (counts[year] || 0) + 1;
  });
  const years = Object.keys(counts).sort();

  const ctx = document.getElementById('yearlyTrendChart');
  if (!ctx || typeof Chart === 'undefined') return;

  registerChart(new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: '발매곡 수',
        data: years.map((y) => counts[y]),
        borderColor: '#FF4D8D',
        backgroundColor: 'rgba(255, 77, 141, 0.18)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      }],
    },
    options: chartBaseOptions(),
  }));
}

function recentChipHTML(item) {
  return `
    <div class="recent-chip" data-nav-to="${item.type === 'artist' ? 'artists' : 'songs'}/${item.id}">
      ${coverArtHTML(item.id, item.name, 'cover-sm')}
      <div>
        <div class="recent-chip-name">${item.name}</div>
        <div class="song-row-artist">${item.sub}</div>
      </div>
    </div>`;
}
