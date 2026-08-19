import { supabase, isSupabaseConfigured } from './supabaseClient'

// Returns a Set of target_ids the user has already liked, scoped to targetType.
export async function getLikedIds(userId, targetType, targetIds = []) {
  if (!isSupabaseConfigured || !userId || targetIds.length === 0) return new Set()
  const { data, error } = await supabase
    .from('likes')
    .select('target_id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .in('target_id', targetIds)
  if (error) throw error
  return new Set(data.map((row) => row.target_id))
}

export async function isLiked(userId, targetType, targetId) {
  if (!isSupabaseConfigured || !userId) return false
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}

// Toggles a like and returns { liked: boolean }.
export async function toggleLike(userId, targetType, targetId) {
  const existing = await isLiked(userId, targetType, targetId)

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
    if (error) throw error
    return { liked: false }
  }

  const { error } = await supabase
    .from('likes')
    .insert({ user_id: userId, target_type: targetType, target_id: targetId })
  if (error) {
    // unique violation => another tab/click already liked it, treat as liked
    if (error.code === '23505') return { liked: true }
    throw error
  }
  return { liked: true }
}

// likes.target_id is polymorphic (no FK), so PostgREST can't embed songs
// directly — fetch liked ids, then fetch the songs in a second query.
export async function getLikedSongs(userId) {
  if (!isSupabaseConfigured || !userId) return []
  const { data: likeRows, error: likeErr } = await supabase
    .from('likes')
    .select('target_id, created_at')
    .eq('user_id', userId)
    .eq('target_type', 'song')
    .order('created_at', { ascending: false })
  if (likeErr) throw likeErr
  if (!likeRows.length) return []

  const ids = likeRows.map((r) => r.target_id)
  const { data: songs, error: songsErr } = await supabase
    .from('songs')
    .select('*, artist:artists(*), album:albums(*)')
    .in('id', ids)
  if (songsErr) throw songsErr

  const order = new Map(ids.map((id, i) => [id, i]))
  return [...songs].sort((a, b) => order.get(a.id) - order.get(b.id))
}
