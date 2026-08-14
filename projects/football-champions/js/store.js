/**
 * 전역 애플리케이션 상태 스토어 (7.4절 단일 진실 공급원 원칙).
 * 데이터/즐겨찾기/최근 본 팀/필터/검색어 등 화면 간 공유 상태만 보관하며,
 * 필터링·집계 등 비즈니스 로직은 filters.js / statisticsEngine.js에 위임한다.
 */

/**
 * @typedef {Object} FilterState
 * @property {string[]} competitionIds 선택된 대회 ID 목록 (비어있으면 전체)
 * @property {string|null} era "2000s" | "2010s" | "2020s" | null
 * @property {number|null} yearFrom 사용자 지정 시작 연도
 * @property {number|null} yearTo 사용자 지정 종료 연도
 * @property {string|null} countryId 국가 필터
 * @property {number} minTitles 최소 타이틀 수 (0이면 미적용)
 */

/** @type {FilterState} */
const INITIAL_FILTERS = {
  competitionIds: [],
  era: null,
  yearFrom: null,
  yearTo: null,
  countryId: null,
  minTitles: 0,
};

class Store {
  constructor() {
    this.state = {
      /** @type {import('./dataLoader.js').Dataset|null} */
      dataset: null,
      isLoading: true,
      loadError: null,
      searchQuery: "",
      filters: { ...INITIAL_FILTERS },
      favorites: [],
      recentlyViewed: [],
    };
    /** @type {Set<Function>} */
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  /**
   * 상태 일부를 갱신하고 모든 구독자에게 통지한다.
   * @param {Partial<typeof this.state>} patch
   */
  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * @param {(state: typeof this.state) => void} listener
   * @returns {() => void} 구독 해제 함수
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  resetFilters() {
    this.setState({ filters: { ...INITIAL_FILTERS } });
  }
}

export const store = new Store();
export const DEFAULT_FILTERS = INITIAL_FILTERS;
