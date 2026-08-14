/**
 * 즐겨찾기 데이터 접근 계층 (FR-7.x, 기획서 9.5절 LocalStorage 스키마).
 * localStorage 사용이 불가능한 환경(시크릿 모드 등)에서는 메모리 Map으로 폴백한다 (FR-7.4).
 */

const STORAGE_KEY = "fca.favorites.v1";
const STORAGE_META_KEY = "fca.favorites.meta.v1";

/** @type {Map<string, string>} localStorage 미가용 시 세션 한정 폴백 저장소 (teamId -> addedAt) */
const memoryFallback = new Map();
let isStorageAvailable = true;

/** localStorage 접근 가능 여부를 1회 점검한다. */
function detectStorageAvailability() {
  try {
    const probeKey = "__fca_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch (error) {
    console.warn("[favoritesRepository] localStorage 사용 불가, 메모리 폴백으로 전환합니다.", error);
    return false;
  }
}

isStorageAvailable = detectStorageAvailability();

/** @returns {Record<string,string>} teamId -> addedAt(ISO) 맵 */
function readMeta() {
  if (!isStorageAvailable) return Object.fromEntries(memoryFallback);
  try {
    const raw = window.localStorage.getItem(STORAGE_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("[favoritesRepository] 저장된 즐겨찾기 메타데이터 파싱 실패, 초기화합니다.", error);
    return {};
  }
}

/** @param {Record<string,string>} meta */
function writeMeta(meta) {
  if (!isStorageAvailable) {
    memoryFallback.clear();
    Object.entries(meta).forEach(([teamId, addedAt]) => memoryFallback.set(teamId, addedAt));
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.keys(meta)));
  window.localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
}

/** @returns {string[]} 즐겨찾기한 팀 ID 배열 (등록 최신순) */
export function getFavoriteTeamIds() {
  const meta = readMeta();
  return Object.entries(meta)
    .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime())
    .map(([teamId]) => teamId);
}

/** @param {string} teamId */
export function isFavorite(teamId) {
  return Object.prototype.hasOwnProperty.call(readMeta(), teamId);
}

/**
 * 즐겨찾기 상태를 토글한다.
 * @param {string} teamId
 * @returns {boolean} 토글 후 즐겨찾기 여부
 */
export function toggleFavorite(teamId) {
  const meta = readMeta();
  const nowFavorited = !Object.prototype.hasOwnProperty.call(meta, teamId);
  if (nowFavorited) {
    meta[teamId] = new Date().toISOString();
  } else {
    delete meta[teamId];
  }
  writeMeta(meta);
  return nowFavorited;
}

/** @param {string} teamId */
export function removeFavorite(teamId) {
  const meta = readMeta();
  delete meta[teamId];
  writeMeta(meta);
}

/** @returns {boolean} 저장소가 메모리 폴백 모드인지 여부 (FR-7.4 경고 배너 표시용) */
export function isUsingMemoryFallback() {
  return !isStorageAvailable;
}
