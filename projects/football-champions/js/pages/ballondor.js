import { escapeHtml } from "../utils.js";

/**
 * 발롱도르(Ballon d'Or) 역대 최다 수상자 Top 5 화면.
 * teams.json/records와 무관한 별도 정적 데이터(data/ballondor.json)를 사용한다.
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

  const winners = [...(dataset.ballonDorWinners || [])].sort((a, b) => b.wins - a.wins);

  container.innerHTML = `
    <h1 class="page-title">발롱도르 Top 5</h1>
    <p class="page-subtitle">역대 발롱도르(Ballon d'Or) 최다 수상자 상위 5인입니다.</p>

    <div class="card reveal-on-scroll">
      ${
        winners.length
          ? `<ol class="rank-list">${winners.map((player, index) => renderPlayerRow(player, index, dataset)).join("")}</ol>`
          : renderEmptyState()
      }
    </div>

    <p style="margin-top: var(--space-4); color: var(--color-text-muted); font-size: var(--font-size-xs);">
      ※ 시상식 결과에 따라 매 시즌 갱신이 필요한 정적 참고 데이터입니다 (자동 갱신 기능은 포함되어 있지 않습니다).
    </p>
  `;
}

/**
 * @param {{ playerId: string, name: string, countryId: string, wins: number, years: number[] }} player
 * @param {number} index
 * @param {import('../dataLoader.js').Dataset} dataset
 * @returns {string}
 */
function renderPlayerRow(player, index, dataset) {
  const country = dataset.countriesById.get(player.countryId);

  return `
    <li class="rank-row" style="align-items: flex-start; flex-wrap: wrap;">
      <span class="rank-row__index">${index + 1}</span>
      <div style="flex: 1; min-width: 200px;">
        <div class="rank-row__name">
          <span aria-hidden="true">${escapeHtml(country ? country.flag : "")}</span>
          ${escapeHtml(player.name)}
        </div>
        <div class="chip-row" style="margin-top: var(--space-2);">
          ${player.years.map((year) => `<span class="badge">${year}</span>`).join("")}
        </div>
      </div>
      <span class="rank-row__value">${player.wins}회</span>
    </li>
  `;
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">🏆</div>
      <p class="empty-state__title">발롱도르 데이터를 불러오지 못했습니다</p>
    </div>
  `;
}
