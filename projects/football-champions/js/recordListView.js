import { escapeHtml } from "./utils.js";

/**
 * 시즌 기록 리스트를 데스크톱 표(FR-2.x) / 모바일 카드(FR-8.3)로 동시에 렌더링하는
 * 공용 뷰. CSS 브레이크포인트에 따라 둘 중 하나만 화면에 노출된다.
 */

/**
 * @param {import('./dataLoader.js').SeasonRecord[]} records
 * @param {import('./dataLoader.js').Dataset} dataset
 * @param {{ emptyMessage?: string }} [options]
 * @returns {string}
 */
export function renderRecordList(records, dataset, options = {}) {
  if (!records.length) {
    return renderEmptyState(options.emptyMessage || "조건에 맞는 기록이 없습니다.");
  }

  return `
    <table class="record-table" aria-label="시즌별 우승 기록">
      <thead>
        <tr>
          <th scope="col">시즌</th>
          <th scope="col">대회</th>
          <th scope="col">우승팀</th>
          <th scope="col">준우승팀</th>
          <th scope="col">스코어 / 개최국</th>
        </tr>
      </thead>
      <tbody>
        ${records.map((record) => renderTableRow(record, dataset)).join("")}
      </tbody>
    </table>

    <div class="record-card-list">
      ${records.map((record) => renderCard(record, dataset)).join("")}
    </div>
  `;
}

function renderTableRow(record, dataset) {
  const competition = dataset.competitionsById.get(record.competitionId);
  const championTeam = dataset.teamsById.get(record.championTeamId);
  const runnerUpTeam = record.runnerUpTeamId ? dataset.teamsById.get(record.runnerUpTeamId) : null;

  return `
    <tr>
      <td>${escapeHtml(record.season)}</td>
      <td><span class="badge">${escapeHtml(competition ? competition.shortName : record.competitionId)}</span></td>
      <td>
        <a class="record-table__team-link" href="#/team/${encodeURIComponent(record.championTeamId)}">
          ${escapeHtml(championTeam ? championTeam.name : record.championTeamId)}
        </a>
      </td>
      <td>${runnerUpTeam ? escapeHtml(runnerUpTeam.name) : "—"}</td>
      <td>${escapeHtml(record.score || record.hostNation || "—")}</td>
    </tr>
  `;
}

function renderCard(record, dataset) {
  const competition = dataset.competitionsById.get(record.competitionId);
  const championTeam = dataset.teamsById.get(record.championTeamId);
  const runnerUpTeam = record.runnerUpTeamId ? dataset.teamsById.get(record.runnerUpTeamId) : null;

  return `
    <a class="card record-card" href="#/team/${encodeURIComponent(record.championTeamId)}">
      <div class="record-card__row">
        <dt>대회</dt>
        <dd><span class="badge">${escapeHtml(competition ? competition.shortName : record.competitionId)}</span></dd>
      </div>
      <div class="record-card__row">
        <dt>시즌</dt>
        <dd>${escapeHtml(record.season)}</dd>
      </div>
      <div class="record-card__row">
        <dt>우승팀</dt>
        <dd>${escapeHtml(championTeam ? championTeam.name : record.championTeamId)}</dd>
      </div>
      <div class="record-card__row">
        <dt>준우승팀</dt>
        <dd>${runnerUpTeam ? escapeHtml(runnerUpTeam.name) : "—"}</dd>
      </div>
      <div class="record-card__row">
        <dt>스코어 / 개최국</dt>
        <dd>${escapeHtml(record.score || record.hostNation || "—")}</dd>
      </div>
    </a>
  `;
}

function renderEmptyState(message) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">🔍</div>
      <p class="empty-state__title">${escapeHtml(message)}</p>
    </div>
  `;
}
