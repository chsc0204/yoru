import { searchSongs } from './songs'
import { searchArtists } from './artists'
import { searchAlbums } from './albums'
import { searchPosts } from './posts'

export async function searchAll(query) {
  if (!query?.trim()) {
    return { songs: [], artists: [], albums: [], posts: [] }
  }

  const [songs, artists, albums, posts] = await Promise.all([
    searchSongs(query).catch(() => []),
    searchArtists(query).catch(() => []),
    searchAlbums(query).catch(() => []),
    searchPosts(query).catch(() => []),
  ])

  return { songs, artists, albums, posts }
}
