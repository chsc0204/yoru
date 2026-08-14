import { escapeHtml } from "../utils.js";
import { renderBarChart, markChartCardsRevealed } from "../chartController.js";

/**
 * 팀 상세 화면 (FR-5.x). 라우트: #/team/:teamId
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

  const teamId = decodeURIComponent(routeInfo.params[0] || "");
  const team = dataset.teamsById.get(teamId);

  if (!team) {
    container.innerHTML = renderTeamNotFound();
    return;
  }

  ctx.recentlyViewed.recordTeamView(teamId);
  ctx.store.setState({ recentlyViewed: ctx.recentlyViewed.getRecentlyViewed() });

  const teamRecords = dataset.allRecords
    .filter((record) => record.championTeamId === teamId)
    .sort((a, b) => a.year - b.year);
  const country = dataset.countriesById.get(team.countryId);
  const titlesByCompetition = countTitlesByCompetition(teamRecords, dataset);

  container.innerHTML = `
    <a href="#/database" class="btn btn--ghost btn--sm" style="margin-bottom: var(--space-5);">← 목록으로</a>

    <section class="card team-profile reveal-on-scroll">
      <div class="team-profile__crest" aria-hidden="true">${escapeHtml(country ? country.flag : "⚽")}</div>
      <div class="team-profile__info">
        <h1>${escapeHtml(team.name)}</h1>
        <p>${escapeHtml(country ? country.name : "")} · 통합 타이틀 ${teamRecords.length}회</p>
        <div class="tag-list" style="margin-top: var(--space-3);">
          ${titlesByCompetition.map(({ competition, count }) => `<span class="badge badge--accent">${escapeHtml(competition.shortName)} ${count}회</span>`).join("")}
        </div>
      </div>
      <button
        type="button"
        id="team-favorite-toggle"
        class="btn btn--icon ${ctx.favoritesRepository.isFavorite(teamId) ? "is-active" : ""}"
        style="margin-left: auto;"
        aria-pressed="${ctx.favoritesRepository.isFavorite(teamId)}"
        aria-label="${team.name} 즐겨찾기 토글"
      >
        ${ctx.favoritesRepository.isFavorite(teamId) ? "★" : "☆"}
      </button>
    </section>

    <section class="card reveal-on-scroll" style="margin-top: var(--space-6);">
      <div class="section-heading"><h2>대회별 타이틀 분포</h2></div>
      <div class="chart-card__canvas-wrap" style="height: 260px;">
        <canvas id="team-titles-chart" role="img" aria-label="${team.name}의 대회별 우승 횟수 막대 차트"></canvas>
      </div>
    </section>

    <section class="card reveal-on-scroll" style="margin-top: var(--space-6);">
      <div class="section-heading"><h2>우승 연도 타임라인</h2></div>
      <div class="timeline" role="list">
        ${teamRecords
          .map(
            (record) => `
          <button type="button" class="timeline__dot" role="listitem" data-jump-to="record-${record.recordId}">
            <span class="timeline__marker" aria-hidden="true"></span>
            <span class="timeline__year">${record.year}</span>
          </button>`
          )
          .join("")}
      </div>
    </section>

    <section class="card reveal-on-scroll" style="margin-top: var(--space-6);">
      <div class="section-heading"><h2>시즌별 상세</h2></div>
      <div id="team-season-accordion">
        ${teamRecords
          .slice()
          .reverse()
          .map((record) => renderAccordionItem(record, dataset))
          .join("")}
      </div>
    </section>
  `;

  renderBarChart(container.querySelector("#team-titles-chart"), {
    labels: titlesByCompetition.map(({ competition }) => competition.shortName),
    data: titlesByCompetition.map(({ count }) => count),
    label: "우승 횟수",
  });
  markChartCardsRevealed(container);

  bindFavoriteToggle(container, ctx, team);
  bindTimelineJumps(container);
  bindAccordion(container);
}

/**
 * @param {import('../dataLoader.js').SeasonRecord[]} teamRecords
 * @param {import('../dataLoader.js').Dataset} dataset
 * @returns {Array<{ competition: Object, count: number }>}
 */
function countTitlesByCompetition(teamRecords, dataset) {
  const counts = new Map();
  for (const record of teamRecords) {
    counts.set(record.competitionId, (counts.get(record.competitionId) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([competitionId, count]) => ({ competition: dataset.competitionsById.get(competitionId), count }))
    .filter((entry) => entry.competition)
    .sort((a, b) => b.count - a.count);
}

function renderAccordionItem(record, dataset) {
  const competition = dataset.competitionsById.get(record.competitionId);
  const runnerUpTeam = record.runnerUpTeamId ? dataset.teamsById.get(record.runnerUpTeamId) : null;

  return `
    <div class="accordion-item" id="record-${record.recordId}">
      <button type="button" class="accordion-item__trigger" aria-expanded="false">
        <span>${escapeHtml(competition ? competition.name : record.competitionId)} — ${escapeHtml(record.season)}</span>
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="accordion-item__panel">
        <div class="accordion-item__panel-inner">
          ${runnerUpTeam ? `<p>상대: ${escapeHtml(runnerUpTeam.name)}</p>` : ""}
          ${record.score ? `<p>결과: ${escapeHtml(record.score)}</p>` : ""}
          ${record.venue ? `<p>장소: ${escapeHtml(record.venue)}</p>` : ""}
          ${record.hostNation ? `<p>개최국: ${escapeHtml(record.hostNation)}</p>` : ""}
        </div>
      </div>
    </div>
  `;
}

function bindFavoriteToggle(container, ctx, team) {
  const button = container.querySelector("#team-favorite-toggle");
  button.addEventListener("click", () => {
    const nowFavorited = ctx.favoritesRepository.toggleFavorite(team.teamId);
    button.classList.toggle("is-active", nowFavorited);
    button.setAttribute("aria-pressed", String(nowFavorited));
    button.textContent = nowFavorited ? "★" : "☆";
    ctx.store.setState({ favorites: ctx.favoritesRepository.getFavoriteTeamIds() });
    ctx.showToast(nowFavorited ? `${team.name}을(를) 즐겨찾기에 추가했습니다.` : `${team.name}을(를) 즐겨찾기에서 제거했습니다.`);
  });
}

function bindTimelineJumps(container) {
  container.querySelectorAll("[data-jump-to]").forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = container.querySelector(`#${dot.dataset.jumpTo}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("is-open");
      target.querySelector(".accordion-item__trigger")?.setAttribute("aria-expanded", "true");
    });
  });
}

function bindAccordion(container) {
  container.querySelectorAll(".accordion-item__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const isOpen = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function renderTeamNotFound() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">❓</div>
      <p class="empty-state__title">존재하지 않는 팀입니다</p>
      <a class="btn btn--primary" href="#/database" style="margin-top: var(--space-4);">데이터베이스로 이동</a>
    </div>
  `;
}
