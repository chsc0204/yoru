import { supabase, isSupabaseConfigured } from './supabaseClient'
import { mockSongs } from './mockData'

const SELECT = '*, artist:artists(*), album:albums(*)'

export async function getLatestSongs(limit = 12) {
  if (!isSupabaseConfigured) {
    return [...mockSongs].sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('songs')
    .select(SELECT)
    .order('release_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getPopularSongs(limit = 12) {
  if (!isSupabaseConfigured) {
    return [...mockSongs].sort((a, b) => b.popularity - a.popularity).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('songs')
    .select(SELECT)
    .order('popularity', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getSongById(id) {
  if (!isSupabaseConfigured) {
    return mockSongs.find((s) => s.id === id) || null
  }
  const { data, error } = await supabase.from('songs').select(SELECT).eq('id', id).single()
  if (error) throw error
  return data
}

export async function getSongsByArtist(artistId, limit = 20) {
  if (!isSupabaseConfigured) {
    return mockSongs.filter((s) => s.artist_id === artistId).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('songs')
    .select(SELECT)
    .eq('artist_id', artistId)
    .order('popularity', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getSongsByAlbum(albumId) {
  if (!isSupabaseConfigured) {
    return mockSongs.filter((s) => s.album_id === albumId)
  }
  const { data, error } = await supabase
    .from('songs')
    .select(SELECT)
    .eq('album_id', albumId)
    .order('release_date', { ascending: true })
  if (error) throw error
  return data
}

export async function searchSongs(query, limit = 20) {
  if (!query?.trim()) return []
  if (!isSupabaseConfigured) {
    const q = query.toLowerCase()
    return mockSongs.filter((s) => s.title.toLowerCase().includes(q)).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('songs')
    .select(SELECT)
    .ilike('title', `%${query}%`)
    .order('popularity', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
