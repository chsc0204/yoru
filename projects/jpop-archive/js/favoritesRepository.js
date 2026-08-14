// ===== 즐겨찾기 저장소 (localStorage) =====
const FAVORITES_KEY = 'jpop_archive_favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      artists: (parsed && parsed.artists) || [],
      songs: (parsed && parsed.songs) || [],
      albums: (parsed && parsed.albums) || [],
    };
  } catch (err) {
    return { artists: [], songs: [], albums: [] };
  }
}

let favorites = loadFavorites();

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(type, id) {
  return favorites[type].includes(id);
}

function toggleFavorite(type, id) {
  const list = favorites[type];
  const idx = list.indexOf(id);
  if (idx === -1) {
    list.push(id);
  } else {
    list.splice(idx, 1);
  }
  saveFavorites();
  return isFavorite(type, id);
}

function favoriteCount() {
  return favorites.artists.length + favorites.songs.length + favorites.albums.length;
}

function getFavoriteArtists() {
  return favorites.artists.map(getArtist).filter(Boolean);
}

function getFavoriteSongs() {
  return favorites.songs.map(getSong).filter(Boolean);
}

function getFavoriteAlbums() {
  return favorites.albums.map(getAlbum).filter(Boolean);
}
