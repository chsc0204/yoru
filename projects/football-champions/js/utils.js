/**
 * 프로젝트 전반에서 재사용하는 순수 유틸리티 함수 모음.
 * 상태나 DOM을 직접 참조하지 않는 함수만 포함한다 (단일 책임 원칙).
 */

const DEBOUNCE_DEFAULT_DELAY_MS = 250;
const HEATMAP_DECADE_SIZE = 10;

/**
 * 함수 호출을 지연시켜 과도한 재실행을 방지한다.
 * @param {Function} fn 실행할 함수
 * @param {number} [delay] 지연 시간(ms)
 * @returns {Function} 디바운스된 함수
 */
export function debounce(fn, delay = DEBOUNCE_DEFAULT_DELAY_MS) {
  let timerId;
  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => fn(...args), delay);
  };
}

/**
 * 배열을 특정 키 기준으로 Map(id -> item)으로 색인화한다.
 * @param {Array<Object>} items
 * @param {string} key
 * @returns {Map<string, Object>}
 */
export function indexBy(items, key) {
  const map = new Map();
  for (const item of items) {
    map.set(item[key], item);
  }
  return map;
}

/**
 * 연도를 소속 연대(decade) 라벨로 변환한다. 예: 2014 -> "2010s"
 * @param {number} year
 * @returns {string}
 */
export function toDecadeLabel(year) {
  const decadeStart = Math.floor(year / HEATMAP_DECADE_SIZE) * HEATMAP_DECADE_SIZE;
  return `${decadeStart}s`;
}

/**
 * XSS 방지를 위한 최소한의 HTML 이스케이프.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 두 문자열 간 편집 거리(Levenshtein distance)를 계산한다.
 * 검색 결과가 없을 때 유사 팀명을 추천하는 데 사용한다 (FR-3.5).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let col = 1; col < cols; col += 1) matrix[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }
  return matrix[rows - 1][cols - 1];
}

/**
 * 화면에 잠시 나타났다 사라지는 토스트 메시지를 표시한다.
 * @param {string} message
 * @param {number} [durationMs]
 */
export function showToast(message, durationMs = 2400) {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), durationMs);
}

/**
 * IntersectionObserver 기반 스크롤 리빌 애니메이션을 지정 컨테이너 내부에 적용한다.
 * @param {HTMLElement} container
 */
export function initScrollReveal(container) {
  const targets = container.querySelectorAll(".reveal-on-scroll");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}
