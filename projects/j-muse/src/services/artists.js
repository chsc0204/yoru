import { supabase, isSupabaseConfigured } from './supabaseClient'
import { mockArtists } from './mockData'

export async function getPopularArtists(limit = 12) {
  if (!isSupabaseConfigured) {
    return [...mockArtists].sort((a, b) => b.popularity - a.popularity).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('popularity', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getArtistById(id) {
  if (!isSupabaseConfigured) {
    return mockArtists.find((a) => a.id === id) || null
  }
  const { data, error } = await supabase.from('artists').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function searchArtists(query, limit = 20) {
  if (!query?.trim()) return []
  if (!isSupabaseConfigured) {
    const q = query.toLowerCase()
    return mockArtists.filter((a) => a.name.toLowerCase().includes(q)).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('popularity', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
