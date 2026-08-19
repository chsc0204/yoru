import { supabase, isSupabaseConfigured } from './supabaseClient'
import { mockPosts } from './mockData'

const SELECT = '*, profiles(*), song:songs(*, artist:artists(*), album:albums(*))'

export async function getPosts({ category = 'all', sort = 'latest', limit = 20, offset = 0 } = {}) {
  if (!isSupabaseConfigured) {
    let result = [...mockPosts]
    if (category !== 'all') result = result.filter((p) => p.category === category)
    return result
  }

  let query = supabase.from('posts').select(SELECT)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (sort === 'popular') {
    query = query.order('like_count', { ascending: false })
  } else if (sort === 'answers') {
    query = query.order('answer_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getPostById(id) {
  if (!isSupabaseConfigured) {
    return mockPosts.find((p) => p.id === id) || null
  }
  const { data, error } = await supabase.from('posts').select(SELECT).eq('id', id).single()
  if (error) throw error
  return data
}

export async function getPostsByUser(userId) {
  if (!isSupabaseConfigured) return mockPosts.filter((p) => p.user_id === userId)
  const { data, error } = await supabase
    .from('posts')
    .select(SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getPostsByArtist(artistId, limit = 10) {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*), song:songs!inner(*, artist:artists(*), album:albums(*))')
    .eq('song.artist_id', artistId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getPostsBySong(songId, limit = 10) {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('posts')
    .select(SELECT)
    .eq('music_id', songId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function createPost({ userId, category, title, content, musicId }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: userId, category, title, content, music_id: musicId || null })
    .select(SELECT)
    .single()
  if (error) throw error
  return data
}

export async function updatePost(id, { category, title, content, musicId }) {
  const { data, error } = await supabase
    .from('posts')
    .update({ category, title, content, music_id: musicId || null })
    .eq('id', id)
    .select(SELECT)
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function incrementPostView(id) {
  if (!isSupabaseConfigured) return
  const { error } = await supabase.rpc('increment_post_view', { p_post_id: id })
  if (error) console.error('조회수 증가 실패', error)
}

export async function searchPosts(query, limit = 20) {
  if (!query?.trim()) return []
  if (!isSupabaseConfigured) {
    const q = query.toLowerCase()
    return mockPosts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    )
  }
  const { data, error } = await supabase
    .from('posts')
    .select(SELECT)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
