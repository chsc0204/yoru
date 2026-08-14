import { initScrollReveal } from "./utils.js";

/**
 * 해시 기반 클라이언트 라우터. GitHub Pages 등 정적 호스팅에서
 * 서버 측 URL 재작성 설정 없이 동작하도록 `#/route/param?query` 형식을 사용한다.
 */

/** @typedef {{ params: string[], query: Record<string,string> }} RouteInfo */
/** @typedef {(container: HTMLElement, routeInfo: RouteInfo, ctx: Object) => Promise<void>|void} PageRenderer */

const routeLoaders = {
  dashboard: () => import("./pages/dashboard.js"),
  database: () => import("./pages/database.js"),
  search: () => import("./pages/search.js"),
  team: () => import("./pages/teamDetail.js"),
  statistics: () => import("./pages/statistics.js"),
  worldmap: () => import("./pages/worldmap.js"),
  ballondor: () => import("./pages/ballondor.js"),
  favorites: () => import("./pages/favorites.js"),
};

const DEFAULT_ROUTE = "dashboard";

/**
 * 현재 location.hash를 라우트명/파라미터/쿼리로 분해한다.
 * 예: "#/team/real-madrid?from=search" -> { name:'team', params:['real-madrid'], query:{from:'search'} }
 * @param {string} hash
 * @returns {{ name: string } & RouteInfo}
 */
export function parseHash(hash) {
  const withoutPrefix = hash.replace(/^#\/?/, "");
  const [pathPart, queryPart] = withoutPrefix.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const name = segments[0] || DEFAULT_ROUTE;
  const params = segments.slice(1);
  const query = Object.fromEntries(new URLSearchParams(queryPart || ""));
  return { name, params, query };
}

/**
 * 상단/모바일 내비게이션에서 현재 라우트에 해당하는 링크에 활성 스타일을 부여한다.
 * @param {string} routeName
 */
function updateActiveNavLinks(routeName) {
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === routeName);
  });
}

/**
 * 라우터를 초기화하고 최초 렌더링을 수행한다.
 * @param {HTMLElement} container 페이지 콘텐츠가 렌더링될 루트 엘리먼트
 * @param {Object} ctx 각 페이지에 전달할 공용 컨텍스트 (store, dataset 접근자 등)
 */
export function initRouter(container, ctx) {
  const handleRouteChange = () => renderCurrentRoute(container, ctx);
  window.addEventListener("hashchange", handleRouteChange);
  renderCurrentRoute(container, ctx);
}

/**
 * @param {HTMLElement} container
 * @param {Object} ctx
 */
async function renderCurrentRoute(container, ctx) {
  const { name, params, query } = parseHash(window.location.hash);
  const loadPage = routeLoaders[name] || routeLoaders[DEFAULT_ROUTE];

  updateActiveNavLinks(routeLoaders[name] ? name : DEFAULT_ROUTE);
  container.setAttribute("aria-busy", "true");

  try {
    /** @type {{ render: PageRenderer }} */
    const pageModule = await loadPage();
    container.innerHTML = "";
    await pageModule.render(container, { params, query }, ctx);
  } catch (error) {
    console.error(`[router] "${name}" 페이지 렌더링 중 오류가 발생했습니다.`, error);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">⚠️</div>
        <p class="empty-state__title">페이지를 불러오는 중 문제가 발생했습니다</p>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>`;
  } finally {
    container.removeAttribute("aria-busy");
    window.scrollTo({ top: 0, behavior: "auto" });
    initScrollReveal(container);
    closeMobileDrawerIfOpen();
    announceRouteChange(container);
  }
}

/**
 * 스크린 리더 사용자에게 페이지 전환을 알린다. 컨테이너 전체를 aria-live로
 * 만들지 않고, 별도의 시각적으로 숨겨진 안내 영역에 새 페이지의 제목만 알려준다.
 * @param {HTMLElement} container
 */
function announceRouteChange(container) {
  const announcer = document.getElementById("route-announcer");
  const heading = container.querySelector("h1");
  if (announcer && heading) {
    announcer.textContent = `${heading.textContent} 페이지로 이동했습니다.`;
  }
}

function closeMobileDrawerIfOpen() {
  const drawer = document.getElementById("mobile-nav-drawer");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  const hamburger = document.getElementById("hamburger-btn");
  if (drawer?.classList.contains("is-open")) {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop?.setAttribute("hidden", "");
    hamburger?.setAttribute("aria-expanded", "false");
  }
}

/**
 * 프로그래밍 방식으로 라우트를 이동한다 (검색 제출 등에서 사용).
 * @param {string} path 예: "team/real-madrid" 또는 "search?q=madrid"
 */
export function navigateTo(path) {
  window.location.hash = `#/${path}`;
}
