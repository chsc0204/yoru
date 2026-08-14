import { levenshteinDistance } from "./utils.js";

/**
 * 검색 엔진 (FR-3.x, 기획서 5.9절 검색 엔진 상세 동작 방식).
 * 팀명(별칭 포함)·대회명·연도를 대상으로 부분/대소문자 무시 매칭 후
 * 관련도 점수에 따라 정렬한다.
 */

const SCORE_EXACT_MATCH = 100;
const SCORE_PREFIX_MATCH = 70;
const SCORE_SUBSTRING_MATCH = 40;
const SCORE_ALIAS_MATCH = 30;
const MAX_SUGGESTIONS = 3;
const SUGGESTION_MAX_DISTANCE = 3;

/**
 * @typedef {Object} SearchResultItem
 * @property {import('./dataLoader.js').SeasonRecord} record
 * @property {number} score
 */

/**
 * 팀 하나에 대한 검색어 매칭 점수를 계산한다.
 * @param {string} normalizedQuery 이미 소문자/트리밍된 검색어
 * @param {Object} team teams.json 항목
 * @returns {number}
 */
function scoreTeamMatch(normalizedQuery, team) {
  const name = team.name.toLowerCase();
  if (name === normalizedQuery) return SCORE_EXACT_MATCH;
  if (name.startsWith(normalizedQuery)) return SCORE_PREFIX_MATCH;
  if (name.includes(normalizedQuery)) return SCORE_SUBSTRING_MATCH;

  const aliasHit = (team.aliases || []).some((alias) => alias.toLowerCase().includes(normalizedQuery));
  if (aliasHit) return SCORE_ALIAS_MATCH;

  return 0;
}

/**
 * 시즌 기록 1건이 검색어와 얼마나 관련 있는지 계산한다.
 * 팀명·대회명·연도 세 가지 축 중 가장 높은 점수를 채택한다.
 * @param {string} normalizedQuery
 * @param {import('./dataLoader.js').SeasonRecord} record
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {number}
 */
function scoreRecord(normalizedQuery, record, dataset) {
  const championTeam = dataset.teamsById.get(record.championTeamId);
  const runnerUpTeam = record.runnerUpTeamId ? dataset.teamsById.get(record.runnerUpTeamId) : null;
  const competition = dataset.competitionsById.get(record.competitionId);

  const teamScore = Math.max(
    championTeam ? scoreTeamMatch(normalizedQuery, championTeam) : 0,
    runnerUpTeam ? scoreTeamMatch(normalizedQuery, runnerUpTeam) * 0.9 : 0
  );

  const competitionNameMatch =
    competition &&
    (competition.name.toLowerCase().includes(normalizedQuery) ||
      competition.shortName.toLowerCase().includes(normalizedQuery));
  const competitionScore = competitionNameMatch ? SCORE_SUBSTRING_MATCH : 0;

  const yearScore = String(record.year).includes(normalizedQuery) ? SCORE_SUBSTRING_MATCH : 0;

  return Math.max(teamScore, competitionScore, yearScore);
}

/**
 * 검색어에 매칭되는 시즌 기록을 관련도 순으로 반환한다 (FR-3.1 ~ FR-3.3).
 * @param {string} query 사용자 입력 검색어 (원문)
 * @param {import('./dataLoader.js').SeasonRecord[]} records 검색 대상 레코드 (필터 적용 후일 수 있음)
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {SearchResultItem[]}
 */
export function searchRecords(query, records, dataset) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return records.map((record) => ({ record, score: 0 }));

  return records
    .map((record) => ({ record, score: scoreRecord(normalizedQuery, record, dataset) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * 검색 결과가 없을 때 편집 거리 기준으로 유사한 팀명을 추천한다 (FR-3.5).
 * @param {string} query
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {string[]} 추천 팀명 목록 (최대 3개)
 */
export function suggestSimilarTeamNames(query, dataset) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return dataset.teams
    .map((team) => ({ name: team.name, distance: levenshteinDistance(normalizedQuery, team.name.toLowerCase()) }))
    .filter((entry) => entry.distance <= SUGGESTION_MAX_DISTANCE)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, MAX_SUGGESTIONS)
    .map((entry) => entry.name);
}
