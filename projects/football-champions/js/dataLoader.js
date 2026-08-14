import { indexBy } from "./utils.js";

/**
 * @typedef {Object} SeasonRecord
 * @property {string} recordId
 * @property {string} competitionId
 * @property {string} season
 * @property {number} year
 * @property {string} championTeamId
 * @property {string|null} runnerUpTeamId
 * @property {string|null} score
 * @property {string|null} venue
 * @property {string|null} hostNation
 */

/**
 * @typedef {Object} Dataset
 * @property {Array<Object>} competitions
 * @property {Array<Object>} teams
 * @property {Array<Object>} countries
 * @property {Array<Object>} worldCupChampions
 * @property {Array<Object>} ballonDorWinners
 * @property {Array<SeasonRecord>} allRecords
 * @property {Map<string, Object>} teamsById
 * @property {Map<string, Object>} competitionsById
 * @property {Map<string, Object>} countriesById
 * @property {Map<string, Array<SeasonRecord>>} recordsByCompetition
 */

const DATA_BASE_PATH = "data/";

/**
 * 지정된 경로의 JSON 파일을 가져온다. 실패 시 콘솔에 경고를 남기고 빈 배열을 반환한다
 * (7.4절 방어적 렌더링 원칙 — 하나의 파일 로드 실패가 앱 전체 크래시로 이어지지 않도록 한다).
 * @param {string} relativePath data/ 기준 상대 경로
 * @returns {Promise<Array<Object>>}
 */
async function fetchJson(relativePath) {
  const url = `${DATA_BASE_PATH}${relativePath}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`[dataLoader] ${url} 로드 실패:`, error);
    return [];
  }
}

/**
 * 시즌 기록 배열에서 championTeamId/runnerUpTeamId가 teams.json에 존재하지 않는
 * 결함 레코드를 제거한다 (9.7절 참조 무결성 검증).
 * @param {Array<SeasonRecord>} records
 * @param {Set<string>} validTeamIds
 * @returns {Array<SeasonRecord>}
 */
function filterRecordsWithValidTeamRefs(records, validTeamIds) {
  return records.filter((record) => {
    const championValid = validTeamIds.has(record.championTeamId);
    const runnerUpValid = record.runnerUpTeamId == null || validTeamIds.has(record.runnerUpTeamId);
    if (!championValid || !runnerUpValid) {
      console.warn(`[dataLoader] 참조 무결성 오류로 레코드 제외: ${record.recordId}`);
      return false;
    }
    return true;
  });
}

/**
 * 앱 시작 시 전체 정적 데이터를 로드하고, 검증한 뒤 메모리 데이터셋으로 병합한다.
 * @returns {Promise<Dataset>}
 */
export async function loadDataset() {
  const [competitions, teams, countries, worldCupChampions, ballonDorWinners] = await Promise.all([
    fetchJson("competitions.json"),
    fetchJson("teams.json"),
    fetchJson("countries.json"),
    fetchJson("worldcup-champions.json"),
    fetchJson("ballondor.json"),
  ]);

  const validTeamIds = new Set(teams.map((team) => team.teamId));
  const recordsByCompetition = new Map();

  await Promise.all(
    competitions.map(async (competition) => {
      const rawRecords = await fetchJson(competition.recordsFile);
      const validRecords = filterRecordsWithValidTeamRefs(rawRecords, validTeamIds);
      recordsByCompetition.set(competition.competitionId, validRecords);
    })
  );

  const allRecords = competitions.flatMap(
    (competition) => recordsByCompetition.get(competition.competitionId) || []
  );

  return {
    competitions,
    teams,
    countries,
    worldCupChampions,
    ballonDorWinners,
    allRecords,
    recordsByCompetition,
    teamsById: indexBy(teams, "teamId"),
    competitionsById: indexBy(competitions, "competitionId"),
    countriesById: indexBy(countries, "countryId"),
  };
}
