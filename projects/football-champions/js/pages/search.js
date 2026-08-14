import { applyFilters } from "../filters.js";
import { renderFilterPanel, bindFilterPanelEvents } from "../filterPanel.js";
import { renderRecordList } from "../recordListView.js";
import { searchRecords, suggestSimilarTeamNames } from "../searchEngine.js";
import { escapeHtml, debounce } from "../utils.js";

const SEARCH_INPUT_DEBOUNCE_MS = 250;

/**
 * 검색 결과 화면 (FR-3.x). 헤더 통합 검색 또는 URL 쿼리(`?q=`)로 진입할 수 있으며,
 * 필터 패널(FR-4.5)과 AND 조건으로 결합된다.
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

  const initialQuery = routeInfo.query.q ?? ctx.store.getState().searchQuery ?? "";
  ctx.store.setState({ searchQuery: initialQuery });

  function refresh() {
    const { filters, searchQuery } = ctx.store.getState();
    const filteredByPanel = applyFilters(dataset.allRecords, filters, dataset);
    const results = searchRecords(searchQuery, filteredByPanel, dataset);
    const hasQuery = searchQuery.trim().length > 0;
    const suggestions = hasQuery && results.length === 0 ? suggestSimilarTeamNames(searchQuery, dataset) : [];

    container.innerHTML = `
      <h1 class="page-title">검색 결과</h1>
      <p class="page-subtitle">${hasQuery ? `검색어 "<strong>${escapeHtml(searchQuery)}</strong>"에 대한 결과입니다.` : "팀, 대회, 연도를 입력해 검색해보세요."}</p>

      <div class="field-group" style="max-width: 420px;">
        <label class="field-group__label" for="search-page-input">검색어</label>
        <input
          id="search-page-input"
          class="text-input"
          type="search"
          value="${escapeHtml(searchQuery)}"
          placeholder="예: madrid, UCL, 2014"
        />
      </div>

      <div class="layout-with-sidebar">
        <aside class="sidebar-sticky" aria-label="필터">
          ${renderFilterPanel(filters, dataset)}
        </aside>

        <div>
          <div class="section-heading">
            <h2>결과</h2>
            <span class="section-heading__meta">${results.length.toLocaleString("ko-KR")}건</span>
          </div>
          <div class="card">
            ${results.length ? renderRecordList(results.map((item) => item.record), dataset) : renderNoResults(suggestions, hasQuery)}
          </div>
        </div>
      </div>
    `;

    bindFilterPanelEvents(container, ctx, refresh);

    const input = container.querySelector("#search-page-input");
    const debouncedUpdate = debounce((value) => {
      ctx.store.setState({ searchQuery: value });
      refresh();
    }, SEARCH_INPUT_DEBOUNCE_MS);
    input.addEventListener("input", (event) => debouncedUpdate(event.target.value));

    container.querySelectorAll("[data-suggest]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.store.setState({ searchQuery: button.dataset.suggest });
        refresh();
      });
    });
  }

  refresh();
}

/**
 * 검색 결과 없음 안내 및 유사 검색어 추천을 렌더링한다 (FR-3.5).
 * @param {string[]} suggestions
 * @param {boolean} hasQuery
 * @returns {string}
 */
function renderNoResults(suggestions, hasQuery) {
  if (!hasQuery) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">🔍</div>
        <p class="empty-state__title">검색어를 입력해주세요</p>
      </div>
    `;
  }

  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">😕</div>
      <p class="empty-state__title">검색 결과가 없습니다</p>
      ${
        suggestions.length
          ? `<p>혹시 이 팀을 찾으셨나요?</p>
             <div class="chip-row" style="justify-content:center; margin-top: var(--space-3);">
               ${suggestions.map((name) => `<button type="button" class="chip" data-suggest="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join("")}
             </div>`
          : `<p>다른 검색어나 필터 조건을 시도해보세요.</p>`
      }
    </div>
  `;
}
