// ===== Rankings 페이지 =====
function renderRankings(container) {
  const topArtists = [...ARTISTS].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
  const topSongs = [...SONGS].sort((a, b) => b.popularity - a.popularity).slice(0, 10);

  const albumsWithScore = ALBUMS.map((al) => {
    const tracks = al.trackIds.map(getSong).filter(Boolean);
    const score = tracks.length ? Math.round(tracks.reduce((sum, s) => sum + s.popularity, 0) / tracks.length) : 0;
    return { ...al, score };
  }).sort((a, b) => b.score - a.score).slice(0, 10);

  const risingArtists = [...ARTISTS].filter((a) => a.trend > 0).sort((a, b) => b.trend - a.trend).slice(0, 6);

  container.innerHTML = `
    <div class="page container">
      <h1 class="page-title">Rankings</h1>
      <p class="page-desc">인기도를 기준으로 한 아티스트 · 곡 · 앨범 순위입니다.</p>
      <p class="disclaimer-note">ℹ️ 이 랭킹은 실제 공식 차트 데이터가 아니라, 실제 인기도를 참고해 구성한 <strong>학습용 예시 데이터</strong>입니다.</p>

      <section>
        <div class="section-head"><h2>Top Artists</h2></div>
        <div>${topArtists.map((a, i) => rankingRowHTML(i + 1, {
          id: a.id, name: a.name, sub: `${a.genre} · ${a.debutYear}`, score: a.popularity, trend: a.trend, navTo: `artists/${a.id}`,
        })).join('')}</div>
      </section>

      <section>
        <div class="section-head"><h2>Top Songs</h2></div>
        <div>${topSongs.map((s, i) => {
          const artist = getArtist(s.artistId);
          return rankingRowHTML(i + 1, {
            id: s.id, name: s.title, sub: artist ? artist.name : '', score: s.popularity, navTo: `songs/${s.id}`,
          });
        }).join('')}</div>
      </section>

      <section>
        <div class="section-head"><h2>Top Albums</h2></div>
        <div>${albumsWithScore.map((al, i) => {
          const artist = getArtist(al.artistId);
          return rankingRowHTML(i + 1, {
            id: al.id, name: al.title, sub: artist ? artist.name : '', score: al.score, navTo: `albums/${al.id}`,
          });
        }).join('')}</div>
      </section>

      ${risingArtists.length ? `
      <section>
        <div class="section-head">
          <div>
            <div class="section-eyebrow">Momentum</div>
            <h2>Rising Artists</h2>
          </div>
        </div>
        <div class="grid grid-artists">${risingArtists.map(artistCardHTML).join('')}</div>
      </section>` : ''}

      <section>
        <div class="section-head"><h2>Music Charts</h2></div>
        <div class="grid grid-2">
          <div class="chart-card">
            <h3>Artist Popularity</h3>
            <div class="chart-canvas-wrap"><canvas id="rankingPopularityChart"></canvas></div>
          </div>
          <div class="chart-card">
            <h3>Genre Distribution</h3>
            <div class="chart-canvas-wrap"><canvas id="rankingGenreChart"></canvas></div>
          </div>
        </div>
        <div class="chart-card" style="margin-top:20px;">
          <h3>Yearly Release Trend</h3>
          <div class="chart-canvas-wrap"><canvas id="rankingYearlyChart"></canvas></div>
        </div>
      </section>
    </div>`;

  bindInteractions(container);

  renderRankingPopularityChart(topArtists);
  renderRankingGenreChart();
  renderRankingYearlyChart();
}

function renderRankingPopularityChart(topArtists) {
  const ctx = document.getElementById('rankingPopularityChart');
  if (!ctx || typeof Chart === 'undefined') return;
  const top6 = topArtists.slice(0, 6);

  registerChart(new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top6.map((a) => a.name),
      datasets: [{
        label: 'Popularity',
        data: top6.map((a) => a.popularity),
        backgroundColor: '#FF4D8D',
        borderRadius: 8,
      }],
    },
    options: chartBaseOptions({
      indexAxis: 'y',
      plugins: { legend: { display: false } },
    }),
  }));
}

function renderRankingGenreChart() {
  const ctx = document.getElementById('rankingGenreChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const counts = {};
  ARTISTS.forEach((a) => { counts[a.genre] = (counts[a.genre] || 0) + 1; });
  const labels = Object.keys(counts);
  const palette = ['#FF4D8D', '#9A6CF7', '#4ADE80', '#38BDF8', '#FBBF24', '#FF6B6B', '#22D3EE', '#F472B6'];

  registerChart(new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: labels.map((g) => counts[g]),
        backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        borderColor: '#17171F',
        borderWidth: 2,
      }],
    },
    options: chartBaseOptions({ scales: {} }),
  }));
}

function renderRankingYearlyChart() {
  const ctx = document.getElementById('rankingYearlyChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const counts = {};
  SONGS.forEach((s) => {
    const y = formatYear(s.releaseDate);
    counts[y] = (counts[y] || 0) + 1;
  });
  const years = Object.keys(counts).sort();

  registerChart(new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: '발매곡 수',
        data: years.map((y) => counts[y]),
        borderColor: '#9A6CF7',
        backgroundColor: 'rgba(154, 108, 247, 0.18)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      }],
    },
    options: chartBaseOptions(),
  }));
}
