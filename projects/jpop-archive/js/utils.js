// ===== 공용 유틸리티 =====

function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-');
  return `${y}.${m}.${d}`;
}

function formatYear(dateStr) {
  if (!dateStr) return '-';
  return dateStr.split('-')[0];
}

// popularity(0~100) -> 5점 만점 별점 HTML
function starsHTML(popularity) {
  const score = Math.round((popularity / 100) * 5);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= score ? '★' : '<span class="star-empty">★</span>';
  }
  return `<span class="stars" aria-label="인기도 5점 만점에 ${score}점">${html}</span>`;
}

// 문자열 -> 0 이상의 정수 해시 (그라디언트 색상 결정에 사용)
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 커버 아트용 큐레이션 그라디언트 팔레트 (다크 UI와 어울리는 보석톤 듀오톤 16종)
const COVER_GRADIENTS = [
  ['#FF4D8D', '#6C3BE0'], // pink → violet
  ['#22D3EE', '#4338CA'], // cyan → indigo
  ['#FBBF24', '#F43F5E'], // amber → rose
  ['#34D399', '#0F766E'], // emerald → teal
  ['#8B5CF6', '#D946EF'], // violet → fuchsia
  ['#FB923C', '#EC4899'], // sunset orange → pink
  ['#38BDF8', '#7C3AED'], // sky → purple
  ['#FACC15', '#B45309'], // gold → bronze
  ['#FB7185', '#9333EA'], // rose → purple
  ['#2DD4BF', '#2563EB'], // mint → blue
  ['#FF6B6B', '#C026D3'], // coral → magenta
  ['#A3E635', '#059669'], // lime → emerald
  ['#FDBA74', '#DC2626'], // peach → red
  ['#C4B5FD', '#4F46E5'], // lavender → indigo
  ['#2DD4BF', '#1E3A8A'], // turquoise → navy
  ['#F472B6', '#581C87'], // hot pink → deep purple
];

// id 문자열을 기반으로 결정적인(항상 같은) 그라디언트 배경을 생성
function gradientForId(id) {
  // 색상/각도를 서로 다른 시드로 해시해, 우연히 같은 팔레트 항목이 걸려도
  // 두 값이 동시에 겹칠 확률을 낮춘다.
  const colorHash = hashString(`${id}::color`);
  const [from, to] = COVER_GRADIENTS[colorHash % COVER_GRADIENTS.length];
  const angle = 120 + (hashString(`${id}::angle`) % 3) * 15; // 120 / 135 / 150도
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

// 이름에서 커버 아트에 표시할 이니셜 1~2글자 추출
function initialsFor(name) {
  if (!name) return '?';
  const trimmed = name.trim();
  const isAsciiWord = /^[A-Za-z0-9]/.test(trimmed);
  if (isAsciiWord) {
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }
  return trimmed.slice(0, 1);
}

// 외부 이미지 없이, id 기반 그라디언트 + 이니셜로 커버 아트를 렌더링
function coverArtHTML(id, label, extraClass = '') {
  const bg = gradientForId(id);
  const initials = initialsFor(label);
  return `<div class="cover-art ${extraClass}" style="background:${bg}" role="img" aria-label="${label} 커버 이미지">
    <span class="cover-initial">${initials}</span>
  </div>`;
}

function youtubeSearchUrl(artistName, songTitle) {
  const query = encodeURIComponent(`${artistName} ${songTitle} MV`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function trendHTML(trend) {
  if (trend > 0) return `<span class="ranking-trend up">▲ ${trend}</span>`;
  if (trend < 0) return `<span class="ranking-trend down">▼ ${Math.abs(trend)}</span>`;
  return `<span class="ranking-trend flat">- 0</span>`;
}

function getArtist(id) {
  return ARTISTS.find((a) => a.id === id);
}

function getSong(id) {
  return SONGS.find((s) => s.id === id);
}

function getAlbum(id) {
  return ALBUMS.find((a) => a.id === id);
}

function songsByArtist(artistId) {
  return SONGS.filter((s) => s.artistId === artistId);
}

function albumsByArtist(artistId) {
  return ALBUMS.filter((a) => a.artistId === artistId);
}

// Chart.js 다크 테마 공통 옵션
function chartBaseOptions(extra = {}) {
  const gridColor = 'rgba(255,255,255,0.06)';
  const textColor = '#9A9AA5';

  return Object.assign(
    {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: {
        legend: {
          labels: { color: textColor, font: { size: 11 } },
        },
        tooltip: {
          backgroundColor: '#1E1E2A',
          titleColor: '#F5F5F5',
          bodyColor: '#F5F5F5',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
        },
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } },
      },
    },
    extra
  );
}
