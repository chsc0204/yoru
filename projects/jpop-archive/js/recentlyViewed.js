// ===== 최근 본 아티스트/곡 (localStorage, 최대 5개) =====
const RECENT_KEY = 'jpop_archive_recently_viewed';
const RECENT_MAX = 5;

function loadRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

let recentlyViewed = loadRecentlyViewed();

function saveRecentlyViewed() {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
}

// type: 'artist' | 'song'
function addRecentlyViewed(type, id) {
  recentlyViewed = recentlyViewed.filter((r) => !(r.type === type && r.id === id));
  recentlyViewed.unshift({ type, id });
  recentlyViewed = recentlyViewed.slice(0, RECENT_MAX);
  saveRecentlyViewed();
}

function getRecentlyViewed() {
  return recentlyViewed
    .map((r) => {
      if (r.type === 'artist') {
        const artist = getArtist(r.id);
        return artist ? { type: r.type, id: r.id, name: artist.name, sub: artist.genre } : null;
      }
      const song = getSong(r.id);
      if (!song) return null;
      const artist = getArtist(song.artistId);
      return { type: r.type, id: r.id, name: song.title, sub: artist ? artist.name : '' };
    })
    .filter(Boolean);
}
