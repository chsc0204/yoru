// ------------------------------------------------------------------
// Fallback mock data used ONLY when Supabase env vars are not set.
// Shaped identically to what the Supabase queries return (nested
// `artist` / `album` objects) so UI components never need to branch
// on the data source. Swap this module out once a real API/DB is wired.
// See services/songs.js, artists.js, albums.js for the selection logic.
// ------------------------------------------------------------------

export const mockArtists = [
  { id: 'mock-a1', name: 'YOASOBI', image_url: 'https://picsum.photos/seed/yoasobi/600', description: '소설을 음악으로 만드는 프로젝트.', popularity: 98 },
  { id: 'mock-a2', name: 'Fujii Kaze', image_url: 'https://picsum.photos/seed/fujiikaze/600', description: '소울/펑크 기반의 싱어송라이터.', popularity: 95 },
  { id: 'mock-a3', name: 'Kenshi Yonezu', image_url: 'https://picsum.photos/seed/yonezu/600', description: '작곡가 겸 싱어송라이터.', popularity: 97 },
  { id: 'mock-a4', name: 'Aimyon', image_url: 'https://picsum.photos/seed/aimyon/600', description: '솔직한 가사의 싱어송라이터.', popularity: 90 },
  { id: 'mock-a5', name: 'Ado', image_url: 'https://picsum.photos/seed/ado/600', description: '강렬한 보컬 표현력의 아티스트.', popularity: 94 },
  { id: 'mock-a6', name: 'King Gnu', image_url: 'https://picsum.photos/seed/kinggnu/600', description: '장르를 넘나드는 4인조 밴드.', popularity: 92 },
]

export const mockAlbums = [
  { id: 'mock-al1', title: 'THE BOOK', artist_id: 'mock-a1', artwork_url: 'https://picsum.photos/seed/thebook/500', release_date: '2021-01-06' },
  { id: 'mock-al2', title: 'LOVE ALL SERVE ALL', artist_id: 'mock-a2', artwork_url: 'https://picsum.photos/seed/lasa/500', release_date: '2022-05-25' },
  { id: 'mock-al3', title: 'STRAY SHEEP', artist_id: 'mock-a3', artwork_url: 'https://picsum.photos/seed/straysheep/500', release_date: '2020-08-05' },
]

function withRelations(song) {
  const artist = mockArtists.find((a) => a.id === song.artist_id) || null
  const album = mockAlbums.find((a) => a.id === song.album_id) || null
  return { ...song, artist, album }
}

export const mockSongs = [
  { id: 'mock-s1', title: '夜に駆ける', artist_id: 'mock-a1', album_id: 'mock-al1', artwork_url: 'https://picsum.photos/seed/song1/500', release_date: '2019-11-15', genre: 'J-Pop', popularity: 99, like_count: 12, preview_url: null },
  { id: 'mock-s2', title: 'Shinunoga E-Wa', artist_id: 'mock-a2', album_id: 'mock-al2', artwork_url: 'https://picsum.photos/seed/song5/500', release_date: '2020-05-19', genre: 'Soul/J-Pop', popularity: 97, like_count: 10, preview_url: null },
  { id: 'mock-s3', title: 'Lemon', artist_id: 'mock-a3', album_id: 'mock-al3', artwork_url: 'https://picsum.photos/seed/song9/500', release_date: '2018-03-05', genre: 'J-Pop', popularity: 98, like_count: 20, preview_url: null },
  { id: 'mock-s4', title: 'マリーゴールド', artist_id: 'mock-a4', album_id: null, artwork_url: 'https://picsum.photos/seed/song12/500', release_date: '2018-10-03', genre: 'J-Pop', popularity: 95, like_count: 8, preview_url: null },
  { id: 'mock-s5', title: 'うっせぇわ', artist_id: 'mock-a5', album_id: null, artwork_url: 'https://picsum.photos/seed/song21/500', release_date: '2020-10-23', genre: 'J-Pop', popularity: 97, like_count: 15, preview_url: null },
  { id: 'mock-s6', title: '白日', artist_id: 'mock-a6', album_id: null, artwork_url: 'https://picsum.photos/seed/song18/500', release_date: '2019-08-21', genre: 'Rock/J-Pop', popularity: 94, like_count: 9, preview_url: null },
].map(withRelations)

export const mockPosts = [
  {
    id: 'mock-p1',
    user_id: 'mock-u1',
    category: 'recommendation',
    title: '요즘 밤에 듣기 좋은 J-POP 추천해주세요.',
    content: '조용한 밤에 산책하면서 들을만한 잔잔한 J-POP 찾고 있어요.',
    music_id: null,
    view_count: 132,
    like_count: 4,
    answer_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    profiles: { id: 'mock-u1', nickname: 'yuki_night', avatar_url: 'https://i.pravatar.cc/150?u=mock-u1' },
    song: null,
  },
]

export const mockAnswers = [
  {
    id: 'mock-ans1',
    post_id: 'mock-p1',
    user_id: 'mock-u2',
    content: 'Fujii Kaze의 Shinunoga E-Wa 추천합니다. 밤에 들으면 분위기가 정말 좋아요.',
    like_count: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    profiles: { id: 'mock-u2', nickname: 'haru_beats', avatar_url: 'https://i.pravatar.cc/150?u=mock-u2' },
  },
]
