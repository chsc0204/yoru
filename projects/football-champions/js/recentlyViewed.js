/**
 * "최근 본 팀" 데이터 접근 계층 (추가 기능 요구사항).
 * 팀 상세 페이지 방문 시 자동 저장되며, 최대 10개까지 최신순으로 유지한다.
 * 중복 방문 시 기존 항목을 제거한 뒤 맨 앞으로 다시 삽입해 순서를 갱신한다.
 */

const STORAGE_KEY = "fca.recentlyViewed.v1";
const MAX_ENTRIES = 10;

/** @typedef {{ teamId: string, viewedAt: string }} RecentlyViewedEntry */

/** @returns {RecentlyViewedEntry[]} */
function readEntries() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("[recentlyViewed] 저장된 데이터 파싱 실패, 초기화합니다.", error);
    return [];
  }
}

/** @param {RecentlyViewedEntry[]} entries */
function writeEntries(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn("[recentlyViewed] localStorage 저장 실패 (이번 세션에서는 기록되지 않습니다).", error);
  }
}

/** @returns {RecentlyViewedEntry[]} 최신 방문순 목록 (최대 10개) */
export function getRecentlyViewed() {
  return readEntries();
}

/**
 * 팀 방문 기록을 추가하고 최신 순서로 갱신한다.
 * @param {string} teamId
 */
export function recordTeamView(teamId) {
  const existing = readEntries().filter((entry) => entry.teamId !== teamId);
  const updated = [{ teamId, viewedAt: new Date().toISOString() }, ...existing].slice(0, MAX_ENTRIES);
  writeEntries(updated);
  return updated;
}

/** @param {string} teamId */
export function removeFromRecentlyViewed(teamId) {
  const updated = readEntries().filter((entry) => entry.teamId !== teamId);
  writeEntries(updated);
  return updated;
}
