const KEY = 'jmuse:recently-viewed'
const MAX_ITEMS = 20

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRecentlyViewed(item) {
  try {
    const list = getRecentlyViewed().filter((i) => !(i.type === item.type && i.id === item.id))
    list.unshift({ ...item, viewedAt: new Date().toISOString() })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
  } catch {
    // localStorage unavailable — ignore silently, this is a non-critical feature
  }
}
