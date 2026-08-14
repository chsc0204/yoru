import { applyFilters } from "../filters.js";
import { renderFilterPanel, bindFilterPanelEvents } from "../filterPanel.js";
import {
  aggregateDiversityByYear,
  aggregateTitlesByTeam,
  aggregateHeatmap,
  aggregateByCountry,
} from "../statisticsEngine.js";
import { renderLineChart, renderBarChart, renderDoughnutChart, markChartCardsRevealed } from "../chartController.js";
import { escapeHtml } from "../utils.js";

const HEATMAP_MIN_OPACITY = 0.12;
const HEATMAP_MAX_OPACITY = 0.9;

/**
 * 통계 대시보드 화면 (FR-6.x). FIFA 월드컵 세계지도는 별도 화면(#/worldmap)으로 분리되어 있다.
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

  function refresh() {
    const { filters } = ctx.store.getState();
    const filtered = applyFilters(dataset.allRecords, filters, dataset);

    const diversity = aggregateDiversityByYear(filtered, dataset);
    const teamRanking = aggregateTitlesByTeam(filtered, dataset);
    const heatmap = aggregateHeatmap(filtered, dataset);
    const byCountry = aggregateByCountry(filtered, dataset);

    container.innerHTML = `
      <h1 class="page-title">통계 대시보드</h1>
      <p class="page-subtitle">필터를 조정하면 아래 모든 차트가 함께 갱신됩니다 (FR-6.5).</p>

      <div class="layout-with-sidebar">
        <aside class="sidebar-sticky" aria-label="필터">
          ${renderFilterPanel(filters, dataset)}
        </aside>

        <div>
          <div class="chart-grid chart-grid--full">
            <div class="card chart-card">
              <div class="section-heading"><h2>연도별 우승팀 다양성 추이</h2></div>
              <div class="chart-card__canvas-wrap">
                ${diversity.labels.length ? `<canvas id="chart-diversity" role="img" aria-label="연도별 우승팀 다양성 추이 선그래프"></canvas>` : renderNoData()}
              </div>
            </div>
          </div>

          <div class="chart-grid" style="margin-top: var(--space-6);">
            <div class="card chart-card">
              <div class="section-heading"><h2>팀별 타이틀 순위</h2></div>
              <div class="chart-card__canvas-wrap">
                ${teamRanking.labels.length ? `<canvas id="chart-team-ranking" role="img" aria-label="팀별 타이틀 순위 막대그래프"></canvas>` : renderNoData()}
              </div>
            </div>

            <div class="card chart-card">
              <div class="section-heading">
                <h2>국가별 타이틀 비중</h2>
                <span class="section-heading__meta">국가대표 대회 한정</span>
              </div>
              <div class="chart-card__canvas-wrap">
                ${byCountry.labels.length ? `<canvas id="chart-country" role="img" aria-label="국가별 우승 비중 도넛차트"></canvas>` : renderNoData()}
              </div>
            </div>
          </div>

          <div class="card chart-card reveal-on-scroll" style="margin-top: var(--space-6);">
            <div class="section-heading"><h2>팀 × 연대 지배력 히트맵</h2></div>
            ${renderHeatmapTable(heatmap)}
          </div>

          <div class="card reveal-on-scroll" style="margin-top: var(--space-6);">
            <div class="section-heading">
              <h2>🌍 FIFA 월드컵 세계지도</h2>
            </div>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
              역대 월드컵 우승국 8개국을 지도에서 확인할 수 있는 전용 화면이 별도로 준비되어 있습니다.
            </p>
            <a class="btn btn--primary" href="#/worldmap">세계지도 보러가기 →</a>
          </div>
        </div>
      </div>
    `;

    if (diversity.labels.length) {
      renderLineChart(container.querySelector("#chart-diversity"), diversity);
    }
    if (teamRanking.labels.length) {
      renderBarChart(container.querySelector("#chart-team-ranking"), { labels: teamRanking.labels, data: teamRanking.data });
    }
    if (byCountry.labels.length) {
      renderDoughnutChart(container.querySelector("#chart-country"), byCountry);
    }
    markChartCardsRevealed(container);

    bindFilterPanelEvents(container, ctx, refresh);
  }

  refresh();
}

/**
 * 팀 × 연대 히트맵을 HTML 테이블로 렌더링한다 (Chart.js 외부 플러그인 없이 순수 구현).
 * @param {ReturnType<typeof import('../statisticsEngine.js').aggregateHeatmap>} heatmap
 * @returns {string}
 */
function renderHeatmapTable(heatmap) {
  if (!heatmap.teams.length) return renderNoData();

  return `
    <div class="heatmap-wrap">
      <table class="heatmap-table">
        <thead>
          <tr>
            <th scope="col">팀</th>
            ${heatmap.decades.map((decade) => `<th scope="col">${escapeHtml(decade)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${heatmap.teamIds
            .map(
              (teamId, index) => `
            <tr>
              <th scope="row">${escapeHtml(heatmap.teams[index])}</th>
              ${heatmap.decades
                .map((decade) => {
                  const value = heatmap.matrix[teamId][decade];
                  return value > 0
                    ? `<td><span class="heatmap-cell" style="display:inline-flex;align-items:center;justify-content:center;width:100%;padding:6px;background-color:${cellColor(value, heatmap.maxValue)};">${value}</span></td>`
                    : `<td><span class="heatmap-cell" data-empty="true">–</span></td>`;
                })
                .join("")}
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * 값의 크기에 비례한 accent 색상 투명도를 계산한다.
 * @param {number} value
 * @param {number} maxValue
 * @returns {string} rgba() 색상 문자열
 */
function cellColor(value, maxValue) {
  const ratio = maxValue > 0 ? value / maxValue : 0;
  const opacity = HEATMAP_MIN_OPACITY + ratio * (HEATMAP_MAX_OPACITY - HEATMAP_MIN_OPACITY);
  return `rgba(0, 200, 83, ${opacity.toFixed(2)})`;
}

function renderNoData() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">📉</div>
      <p class="empty-state__title">현재 필터 조건에 표시할 데이터가 없습니다.</p>
    </div>
  `;
}
