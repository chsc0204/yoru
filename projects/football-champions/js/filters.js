/**
 * 필터 시스템 (FR-4.x). 대회/연대/기간/국가/최소 타이틀 수 조건을 조합해
 * 시즌 기록 배열을 필터링하는 순수 함수 모음.
 */

const DECADE_SPAN_YEARS = 10;

export const ERA_OPTIONS = [
  { value: "2000s", label: "2000년대" },
  { value: "2010s", label: "2010년대" },
  { value: "2020s", label: "2020년대" },
];

/**
 * 연대 문자열("2000s")을 [시작연도, 종료연도] 범위로 변환한다.
 * @param {string} era
 * @returns {[number, number]}
 */
export function getEraYearRange(era) {
  const decadeStart = Number.parseInt(era, 10);
  return [decadeStart, decadeStart + DECADE_SPAN_YEARS - 1];
}

/**
 * 전체 기록 기준 팀별 누적 타이틀 수를 계산한다 (FR-4.4 최소 타이틀 필터의 기준값).
 * 필터가 적용되기 전, 데이터셋 전체를 기준으로 계산해야 "3회 이상 우승팀"이라는
 * 팀의 고유 속성이 다른 필터 조합에 따라 흔들리지 않는다.
 * @param {import('./dataLoader.js').SeasonRecord[]} allRecords
 * @returns {Map<string, number>} teamId -> 누적 타이틀 수
 */
export function computeTeamTitleCounts(allRecords) {
  const counts = new Map();
  for (const record of allRecords) {
    counts.set(record.championTeamId, (counts.get(record.championTeamId) || 0) + 1);
  }
  return counts;
}

/**
 * 필터 조건에 맞는 레코드만 남긴다 (FR-4.1 ~ FR-4.5).
 * @param {import('./dataLoader.js').SeasonRecord[]} records
 * @param {import('./store.js').FilterState} filters
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {import('./dataLoader.js').SeasonRecord[]}
 */
export function applyFilters(records, filters, dataset) {
  const teamTitleCounts = computeTeamTitleCounts(dataset.allRecords);
  const [yearFrom, yearTo] = resolveYearRange(filters);

  return records.filter((record) => {
    if (filters.competitionIds.length && !filters.competitionIds.includes(record.competitionId)) {
      return false;
    }
    if (yearFrom != null && record.year < yearFrom) return false;
    if (yearTo != null && record.year > yearTo) return false;

    if (filters.countryId) {
      const team = dataset.teamsById.get(record.championTeamId);
      if (!team || team.countryId !== filters.countryId) return false;
    }

    if (filters.minTitles > 0) {
      const titleCount = teamTitleCounts.get(record.championTeamId) || 0;
      if (titleCount < filters.minTitles) return false;
    }

    return true;
  });
}

/**
 * 사용자 지정 연도 범위(직접 입력)가 있으면 그것을 우선하고, 없으면 연대 선택값을 사용한다.
 * @param {import('./store.js').FilterState} filters
 * @returns {[number|null, number|null]}
 */
function resolveYearRange(filters) {
  if (filters.yearFrom != null || filters.yearTo != null) {
    return [filters.yearFrom, filters.yearTo];
  }
  if (filters.era) {
    return getEraYearRange(filters.era);
  }
  return [null, null];
}

/**
 * 현재 활성화된 필터를 UI 칩으로 표시하기 위한 설명 목록으로 변환한다.
 * @param {import('./store.js').FilterState} filters
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {Array<{ key: string, label: string }>}
 */
export function describeActiveFilters(filters, dataset) {
  const chips = [];

  filters.competitionIds.forEach((competitionId) => {
    const competition = dataset.competitionsById.get(competitionId);
    chips.push({ key: `competition:${competitionId}`, label: competition ? competition.shortName : competitionId });
  });

  if (filters.yearFrom != null || filters.yearTo != null) {
    chips.push({ key: "yearRange", label: `${filters.yearFrom ?? "…"} – ${filters.yearTo ?? "현재"}` });
  } else if (filters.era) {
    const eraOption = ERA_OPTIONS.find((option) => option.value === filters.era);
    chips.push({ key: "era", label: eraOption ? eraOption.label : filters.era });
  }

  if (filters.countryId) {
    const country = dataset.countriesById.get(filters.countryId);
    chips.push({ key: "countryId", label: country ? country.name : filters.countryId });
  }

  if (filters.minTitles > 0) {
    chips.push({ key: "minTitles", label: `${filters.minTitles}회 이상 우승` });
  }

  return chips;
}

/** @returns {boolean} 활성화된 필터가 하나라도 있는지 여부 */
export function hasActiveFilters(filters) {
  return (
    filters.competitionIds.length > 0 ||
    !!filters.era ||
    filters.yearFrom != null ||
    filters.yearTo != null ||
    !!filters.countryId ||
    filters.minTitles > 0
  );
}
