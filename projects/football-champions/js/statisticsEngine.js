import { toDecadeLabel } from "./utils.js";

/**
 * 통계 엔진 (FR-6.x, 기획서 5.10절 통계 엔진 상세 동작 방식).
 * 필터링된 레코드 서브셋을 입력받아 4종 차트에 필요한 데이터셋으로 집계한다.
 * 원본 데이터셋은 변경하지 않는다 (7.4절 불변 원본 데이터 원칙).
 */

const HEATMAP_MAX_TEAMS = 12;
const TEAM_RANKING_TOP_N = 10;

/**
 * 연도별 "우승팀 다양성" 추이를 계산한다 (FR-6.1).
 * 각 대회마다, 해당 연도까지 누적된 고유 우승팀 수를 라인으로 표현해
 * 특정 팀의 장기 지배(평평한 선) vs 다양한 우승팀 배출(계속 상승하는 선)을 비교할 수 있게 한다.
 * @param {import('./dataLoader.js').SeasonRecord[]} records
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {{ labels: number[], datasets: Array<{ label: string, data: number[] }> }}
 */
export function aggregateDiversityByYear(records, dataset) {
  const years = [...new Set(records.map((record) => record.year))].sort((a, b) => a - b);
  const competitionIds = [...new Set(records.map((record) => record.competitionId))];

  const datasets = competitionIds.map((competitionId) => {
    const competition = dataset.competitionsById.get(competitionId);
    const recordsForCompetition = records
      .filter((record) => record.competitionId === competitionId)
      .sort((a, b) => a.year - b.year);

    const seenTeams = new Set();
    const dataByYear = new Map();
    for (const record of recordsForCompetition) {
      seenTeams.add(record.championTeamId);
      dataByYear.set(record.year, seenTeams.size);
    }

    let lastKnownValue = 0;
    const data = years.map((year) => {
      if (dataByYear.has(year)) lastKnownValue = dataByYear.get(year);
      return dataByYear.has(year) ? dataByYear.get(year) : lastKnownValue;
    });

    return { label: competition ? competition.shortName : competitionId, data };
  });

  return { labels: years, datasets };
}

/**
 * 팀별 누적 타이틀 수 상위 N개를 계산한다 (FR-6.2).
 * @param {import('./dataLoader.js').SeasonRecord[]} records
 * @param {import('./dataLoader.js').Dataset} dataset
 * @param {number} [topN]
 * @returns {{ labels: string[], data: number[] }}
 */
export function aggregateTitlesByTeam(records, dataset, topN = TEAM_RANKING_TOP_N) {
  const counts = new Map();
  for (const record of records) {
    counts.set(record.championTeamId, (counts.get(record.championTeamId) || 0) + 1);
  }

  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([teamId, count]) => {
      const team = dataset.teamsById.get(teamId);
      return { label: team ? team.name : teamId, count };
    });

  return { labels: ranked.map((entry) => entry.label), data: ranked.map((entry) => entry.count) };
}

/**
 * 팀 × 연대 교차 지배력 매트릭스를 계산한다 (FR-6.3).
 * @param {import('./dataLoader.js').SeasonRecord[]} records
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {{ teams: string[], decades: string[], matrix: Record<string, Record<string, number>>, maxValue: number }}
 */
export function aggregateHeatmap(records, dataset) {
  const totalCounts = new Map();
  for (const record of records) {
    totalCounts.set(record.championTeamId, (totalCounts.get(record.championTeamId) || 0) + 1);
  }

  const topTeamIds = [...totalCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, HEATMAP_MAX_TEAMS)
    .map(([teamId]) => teamId);

  const decades = [...new Set(records.map((record) => toDecadeLabel(record.year)))].sort();
  const matrix = {};
  let maxValue = 0;

  for (const teamId of topTeamIds) {
    matrix[teamId] = {};
    for (const decade of decades) {
      matrix[teamId][decade] = 0;
    }
  }

  for (const record of records) {
    if (!topTeamIds.includes(record.championTeamId)) continue;
    const decade = toDecadeLabel(record.year);
    matrix[record.championTeamId][decade] += 1;
    maxValue = Math.max(maxValue, matrix[record.championTeamId][decade]);
  }

  const teamNames = topTeamIds.map((teamId) => dataset.teamsById.get(teamId)?.name || teamId);

  return { teams: teamNames, teamIds: topTeamIds, decades, matrix, maxValue };
}

/**
 * 국가대표 대회 레코드를 국가별로 집계한다 (FR-6.4). 클럽 대회 레코드는 제외한다.
 * @param {import('./dataLoader.js').SeasonRecord[]} records
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {{ labels: string[], data: number[] }}
 */
export function aggregateByCountry(records, dataset) {
  const nationalTeamRecords = records.filter((record) => {
    const competition = dataset.competitionsById.get(record.competitionId);
    return competition?.type === "national-team";
  });

  const counts = new Map();
  for (const record of nationalTeamRecords) {
    const team = dataset.teamsById.get(record.championTeamId);
    const countryId = team?.countryId || "unknown";
    counts.set(countryId, (counts.get(countryId) || 0) + 1);
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return {
    labels: ranked.map(([countryId]) => dataset.countriesById.get(countryId)?.name || countryId),
    data: ranked.map(([, count]) => count),
  };
}
