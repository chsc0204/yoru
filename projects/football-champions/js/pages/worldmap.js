import { renderWorldMap } from "../worldMap.js";
import { escapeHtml } from "../utils.js";

const PODIUM_MEDALS = ["🥇", "🥈", "🥉"];

/**
 * FIFA 월드컵 세계지도 전용 화면. 통계 대시보드의 필터와는 무관하게
 * 항상 전체 역사 기준(8개국) 우승 현황을 보여준다.
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

  const winners = [...(dataset.worldCupChampions || [])].sort((a, b) => b.titles - a.titles);
  const totalTitlesAwarded = winners.reduce((sum, entry) => sum + entry.titles, 0);
  const mostTitledCountry = winners[0];

  container.innerHTML = `
    <h1 class="page-title">FIFA 월드컵 세계지도</h1>
    <p class="page-subtitle">1930년 첫 대회부터 지금까지, 월드컵 우승은 단 ${winners.length}개국만이 경험했습니다.</p>

    <section class="grid grid--stats-3 reveal-on-scroll">
      ${renderStatTile(`${totalTitlesAwarded}회`, "역대 개최된 월드컵")}
      ${renderStatTile(`${winners.length}개국`, "우승 경험이 있는 국가")}
      ${renderStatTile(`${mostTitledCountry.flag} ${mostTitledCountry.titles}회`, `최다 우승국 · ${mostTitledCountry.name}`)}
    </section>

    <section class="card world-map-card reveal-on-scroll" style="margin-top: var(--space-6);">
      <div class="section-heading">
        <h2>우승국 지도</h2>
        <span class="section-heading__meta">국기를 클릭하거나 마우스를 올려보세요</span>
      </div>
      <div class="world-map-viewport" id="world-map-viewport" role="group" aria-label="국가별 월드컵 우승 현황 지도"></div>
    </section>

    <section class="reveal-on-scroll" style="margin-top: var(--space-6);">
      <div class="section-heading">
        <h2>국가별 우승 순위</h2>
        <span class="section-heading__meta">총 ${winners.length}개국</span>
      </div>
      <div class="grid grid--cards">
        ${winners.map((entry, index) => renderCountryCard(entry, index)).join("")}
      </div>
    </section>
  `;

  renderWorldMap(container.querySelector("#world-map-viewport"), dataset.worldCupChampions).catch((error) =>
    console.error("[worldmap] 세계지도 렌더링 실패", error)
  );
}

function renderStatTile(value, label) {
  return `
    <div class="card stat-tile">
      <div class="stat-tile__value">${value}</div>
      <div class="stat-tile__label">${escapeHtml(label)}</div>
    </div>
  `;
}

/**
 * @param {{ name: string, flag: string, titles: number, years: number[] }} entry
 * @param {number} index
 * @returns {string}
 */
function renderCountryCard(entry, index) {
  const medal = PODIUM_MEDALS[index];

  return `
    <div class="card reveal-on-scroll" style="text-align: center; position: relative;">
      ${medal ? `<span style="position: absolute; top: var(--space-3); left: var(--space-3); font-size: 1.1rem;" aria-hidden="true">${medal}</span>` : ""}
      <div style="font-size: 2.4rem;" aria-hidden="true">${escapeHtml(entry.flag)}</div>
      <div style="font-weight: 700; margin-top: var(--space-2);">${escapeHtml(entry.name)}</div>
      <div class="stat-tile__value" style="margin-top: var(--space-1); font-size: var(--font-size-xl);">${entry.titles}회 우승</div>
      <div class="chip-row" style="justify-content: center; margin-top: var(--space-3);">
        ${entry.years.map((year) => `<span class="badge">${year}</span>`).join("")}
      </div>
    </div>
  `;
}
