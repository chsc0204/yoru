import { supabase, isSupabaseConfigured } from './supabaseClient'
import { mockAlbums, mockArtists } from './mockData'

const SELECT = '*, artist:artists(*)'

function withArtist(album) {
  return { ...album, artist: mockArtists.find((a) => a.id === album.artist_id) || null }
}

export async function getLatestAlbums(limit = 12) {
  if (!isSupabaseConfigured) {
    return mockAlbums.map(withArtist).sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('albums')
    .select(SELECT)
    .order('release_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getAlbumById(id) {
  if (!isSupabaseConfigured) {
    const album = mockAlbums.find((a) => a.id === id)
    return album ? withArtist(album) : null
  }
  const { data, error } = await supabase.from('albums').select(SELECT).eq('id', id).single()
  if (error) throw error
  return data
}

export async function getAlbumsByArtist(artistId) {
  if (!isSupabaseConfigured) {
    return mockAlbums.filter((a) => a.artist_id === artistId).map(withArtist)
  }
  const { data, error } = await supabase
    .from('albums')
    .select(SELECT)
    .eq('artist_id', artistId)
    .order('release_date', { ascending: false })
  if (error) throw error
  return data
}

export async function searchAlbums(query, limit = 20) {
  if (!query?.trim()) return []
  if (!isSupabaseConfigured) {
    const q = query.toLowerCase()
    return mockAlbums.filter((a) => a.title.toLowerCase().includes(q)).map(withArtist).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('albums')
    .select(SELECT)
    .ilike('title', `%${query}%`)
    .limit(limit)
  if (error) throw error
  return data
}
