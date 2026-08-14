// ===== 통합 검색 (Artists / Songs / Albums) =====
function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { artists: [], songs: [], albums: [] };

  const artists = ARTISTS.filter(
    (a) => a.name.toLowerCase().includes(q) || a.japaneseName.toLowerCase().includes(q)
  ).slice(0, 6);

  const songs = SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.reading.toLowerCase().includes(q) ||
      s.translatedTitle.toLowerCase().includes(q)
  ).slice(0, 6);

  const albums = ALBUMS.filter((al) => al.title.toLowerCase().includes(q)).slice(0, 6);

  return { artists, songs, albums };
}

function hasSearchResults(results) {
  return results.artists.length + results.songs.length + results.albums.length > 0;
}
