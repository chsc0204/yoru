import { escapeHtml } from "../utils.js";

const LEADERBOARD_SIZE = 5;

/**
 * 대시보드 화면 렌더러 (FR-1.1 ~ FR-1.4).
 * @param {HTMLElement} container
 * @param {import('../router.js').RouteInfo} routeInfo
 * @param {Object} ctx
 */
export function render(container, routeInfo, ctx) {
  const { dataset, isLoading, loadError } = ctx.store.getState();

  if (isLoading) {
    container.innerHTML = renderLoading();
    return;
  }
  if (loadError || !dataset) {
    container.innerHTML = renderError();
    return;
  }

  const totalCompetitions = dataset.competitions.length;
  const totalRecords = dataset.allRecords.length;
  const uniqueChampionCount = new Set(dataset.allRecords.map((r) => r.championTeamId)).size;

  const latestByCompetition = getLatestRecordPerCompetition(dataset);
  const leaderboard = getTopChampionTeams(dataset, LEADERBOARD_SIZE);

  container.innerHTML = `
    <h1 class="page-title">대시보드</h1>
    <p class="page-subtitle">2000년 이후 주요 축구대회 챔피언 현황을 한눈에 확인하세요.</p>

    <section class="grid grid--stats-3 reveal-on-scroll" aria-label="전체 통계 요약">
      ${renderStatTile(totalCompetitions, "추적 중인 대회")}
      ${renderStatTile(totalRecords, "시즌 기록")}
      ${renderStatTile(uniqueChampionCount, "고유 우승팀")}
    </section>

    <section class="grid grid--2col" style="margin-top: var(--space-6);">
      <div class="card reveal-on-scroll">
        <div class="section-heading">
          <h2>최신 우승 현황</h2>
          <span class="section-heading__meta">대회별 최신 시즌</span>
        </div>
        <ul class="rank-list">
          ${latestByCompetition.map((entry) => renderLatestChampionRow(entry, dataset)).join("")}
        </ul>
      </div>

      <div class="card reveal-on-scroll">
        <div class="section-heading">
          <h2>최다 우승팀 Top ${LEADERBOARD_SIZE}</h2>
          <span class="section-heading__meta">전 대회 통합</span>
        </div>
        <ol class="rank-list">
          ${leaderboard.map((entry, index) => renderLeaderboardRow(entry, index)).join("")}
        </ol>
      </div>
    </section>

    <section class="card reveal-on-scroll" style="margin-top: var(--space-6);">
      <div class="section-heading">
        <h2>빠른 이동</h2>
      </div>
      <div class="chip-row">
        <a class="btn btn--ghost" href="#/database">📚 챔피언스 데이터베이스</a>
        <a class="btn btn--ghost" href="#/search">🔍 검색</a>
        <a class="btn btn--ghost" href="#/statistics">📊 통계 대시보드</a>
        <a class="btn btn--ghost" href="#/favorites">☆ 즐겨찾기</a>
      </div>
    </section>
  `;
}

function renderStatTile(value, label) {
  return `
    <div class="card stat-tile">
      <div class="stat-tile__value">${value.toLocaleString("ko-KR")}</div>
      <div class="stat-tile__label">${escapeHtml(label)}</div>
    </div>
  `;
}

/**
 * 대회별로 가장 최근 연도의 시즌 기록을 1건씩 추출한다.
 * @param {import('../dataLoader.js').Dataset} dataset
 */
function getLatestRecordPerCompetition(dataset) {
  return dataset.competitions
    .map((competition) => {
      const records = dataset.recordsByCompetition.get(competition.competitionId) || [];
      if (!records.length) return null;
      const latest = records.reduce((a, b) => (a.year > b.year ? a : b));
      return { competition, record: latest };
    })
    .filter(Boolean)
    .sort((a, b) => b.record.year - a.record.year);
}

function renderLatestChampionRow({ competition, record }, dataset) {
  const team = dataset.teamsById.get(record.championTeamId);
  const displayName = team ? team.name : record.championTeamId;
  return `
    <li class="rank-row">
      <span class="badge badge--accent">${escapeHtml(competition.shortName)}</span>
      <span class="rank-row__name">
        <a class="record-table__team-link" href="#/team/${encodeURIComponent(record.championTeamId)}">
          ${escapeHtml(displayName)}
        </a>
      </span>
      <span class="rank-row__value">${escapeHtml(record.season)}</span>
    </li>
  `;
}

/**
 * 전 대회 통합 기준 우승 횟수 상위 N개 팀을 계산한다.
 * @param {import('../dataLoader.js').Dataset} dataset
 * @param {number} limit
 */
function getTopChampionTeams(dataset, limit) {
  const counts = new Map();
  for (const record of dataset.allRecords) {
    counts.set(record.championTeamId, (counts.get(record.championTeamId) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([teamId, count]) => ({ team: dataset.teamsById.get(teamId), teamId, count }));
}

function renderLeaderboardRow({ team, teamId, count }, index) {
  const displayName = team ? team.name : teamId;
  return `
    <li class="rank-row">
      <span class="rank-row__index">${index + 1}</span>
      <a class="rank-row__name record-table__team-link" href="#/team/${encodeURIComponent(teamId)}">
        ${escapeHtml(displayName)}
      </a>
      <span class="rank-row__value">${count}회</span>
    </li>
  `;
}

function renderLoading() {
  return `
    <div class="loading-screen" role="status">
      <div class="loading-screen__spinner" aria-hidden="true"></div>
      <p>데이터를 불러오는 중입니다…</p>
    </div>
  `;
}

function renderError() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">⚠️</div>
      <p class="empty-state__title">데이터를 불러오지 못했습니다</p>
      <p>네트워크 상태를 확인한 뒤 새로고침해주세요.</p>
    </div>
  `;
}
