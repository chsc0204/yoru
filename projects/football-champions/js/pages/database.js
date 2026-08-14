import { applyFilters } from "../filters.js";
import { renderFilterPanel, bindFilterPanelEvents } from "../filterPanel.js";
import { renderRecordList } from "../recordListView.js";

const PAGE_SIZE = 15;
const MAX_VISIBLE_PAGE_BUTTONS = 5;

/**
 * 챔피언스 데이터베이스 화면 (FR-2.x + FR-4.x 필터 연동).
 * @param {HTMLElement} container
 * @param {import('../router.js').RouteInfo} routeInfo
 * @param {Object} ctx
 */
export function render(container, routeInfo, ctx) {
  const { dataset, isLoading } = ctx.store.getState();
  if (isLoading || !dataset) {
    container.innerHTML = `<div class="loading-screen" role="status"><div class="loading-screen__spinner" aria-hidden="true"></div><p>데이터를 불러오는 중입니다…</p></div>`;
    return;
  }

  let currentPage = 1;

  function refresh() {
    const { filters } = ctx.store.getState();
    const filtered = applyFilters(dataset.allRecords, filters, dataset);
    const sorted = [...filtered].sort(
      (a, b) => b.year - a.year || a.competitionId.localeCompare(b.competitionId)
    );
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    container.innerHTML = `
      <h1 class="page-title">챔피언스 데이터베이스</h1>
      <p class="page-subtitle">대회별 전체 우승 기록을 연도순으로 확인하고, 필터로 좁혀보세요.</p>

      <div class="layout-with-sidebar">
        <aside class="sidebar-sticky" aria-label="필터">
          ${renderFilterPanel(filters, dataset)}
        </aside>

        <div>
          <div class="section-heading">
            <h2>전체 기록</h2>
            <span class="section-heading__meta">총 ${sorted.length.toLocaleString("ko-KR")}건 · ${currentPage} / ${totalPages} 페이지</span>
          </div>
          <div class="card">
            ${renderRecordList(pageItems, dataset, { emptyMessage: "조건에 맞는 우승 기록이 없습니다. 필터를 조정해보세요." })}
          </div>
          ${renderPagination(currentPage, totalPages)}
        </div>
      </div>
    `;

    bindFilterPanelEvents(container, ctx, () => {
      currentPage = 1;
      refresh();
    });

    container.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        currentPage = Number.parseInt(button.dataset.page, 10);
        refresh();
      });
    });
  }

  refresh();
}

/**
 * 페이지네이션 컨트롤을 렌더링한다 (FR-2.3).
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {string}
 */
function renderPagination(currentPage, totalPages) {
  if (totalPages <= 1) return "";

  const windowStart = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGE_BUTTONS / 2));
  const windowEnd = Math.min(totalPages, windowStart + MAX_VISIBLE_PAGE_BUTTONS - 1);

  const pageButtons = [];
  for (let page = windowStart; page <= windowEnd; page += 1) {
    pageButtons.push(
      `<button type="button" data-page="${page}" class="${page === currentPage ? "is-active" : ""}" aria-current="${page === currentPage}">${page}</button>`
    );
  }

  return `
    <nav class="pagination" aria-label="페이지 네비게이션">
      <button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="이전 페이지">‹</button>
      ${pageButtons.join("")}
      <button type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""} aria-label="다음 페이지">›</button>
    </nav>
  `;
}
