// ===== 해시 기반 라우터 =====
const appEl = () => document.getElementById('app');

// Chart.js 인스턴스는 페이지 전환 시 반드시 destroy 해야 캔버스 재사용 오류가 나지 않는다.
let activeCharts = [];
function registerChart(chart) {
  activeCharts.push(chart);
  return chart;
}
function destroyActiveCharts() {
  activeCharts.forEach((c) => c.destroy());
  activeCharts = [];
}

// render 함수는 화살표 함수로 감싸 "호출 시점"에 조회되도록 한다.
// (routes 배열 자체는 js/pages/*.js보다 먼저 로드되므로, 여기서 함수 식별자를
// 즉시 참조하면 아직 정의되지 않아 ReferenceError가 발생한다.)
const routes = [
  { pattern: /^$/, render: (el) => renderDashboard(el), nav: 'home' },
  { pattern: /^artists$/, render: (el) => renderArtists(el), nav: 'artists' },
  { pattern: /^artists\/([^/]+)$/, render: (el, m) => renderArtistDetail(el, m[1]), nav: 'artists' },
  { pattern: /^songs$/, render: (el) => renderSongs(el), nav: 'songs' },
  { pattern: /^songs\/([^/]+)$/, render: (el, m) => renderSongDetail(el, m[1]), nav: 'songs' },
  { pattern: /^albums$/, render: (el) => renderAlbums(el), nav: 'albums' },
  { pattern: /^albums\/([^/]+)$/, render: (el, m) => renderAlbumDetail(el, m[1]), nav: 'albums' },
  { pattern: /^rankings$/, render: (el) => renderRankings(el), nav: 'rankings' },
  { pattern: /^study$/, render: (el) => renderStudy(el), nav: 'study' },
  { pattern: /^favorites$/, render: (el) => renderFavorites(el), nav: 'favorites' },
];

function currentPath() {
  return (location.hash || '#').slice(1).replace(/^\//, '');
}

function navigateTo(path) {
  location.hash = path;
}

function setActiveNav(navKey) {
  qsa('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === navKey);
  });
}

function renderRoute() {
  const path = currentPath();
  const match = routes.find((r) => r.pattern.test(path));
  const container = appEl();

  destroyActiveCharts();

  if (!match) {
    container.innerHTML = `
      <div class="page container">
        <div class="empty-state">
          <div class="empty-icon">🎧</div>
          <p>페이지를 찾을 수 없습니다.</p>
          <button type="button" class="btn btn-primary" style="margin-top:16px;" onclick="navigateTo('')">Dashboard로 이동</button>
        </div>
      </div>`;
    return;
  }

  const params = path.match(match.pattern);
  setActiveNav(match.nav);
  match.render(container, params);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileNav();
  requestAnimationFrame(revealOnScroll);
}

window.addEventListener('hashchange', renderRoute);
