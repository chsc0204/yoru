import { supabase } from './supabaseClient'

export async function getPlaylists(userId) {
  const { data, error } = await supabase
    .from('playlists')
    .select('*, playlist_songs(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((p) => ({ ...p, song_count: p.playlist_songs?.[0]?.count ?? 0 }))
}

export async function getPlaylistById(id) {
  const { data, error } = await supabase.from('playlists').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function getPlaylistSongs(playlistId) {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('added_at, song:songs(*, artist:artists(*), album:albums(*))')
    .eq('playlist_id', playlistId)
    .order('added_at', { ascending: false })
  if (error) throw error
  return data.map((row) => ({ ...row.song, added_at: row.added_at }))
}

export async function createPlaylist(userId, { name, description }) {
  const { data, error } = await supabase
    .from('playlists')
    .insert({ user_id: userId, name, description })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function renamePlaylist(id, updates) {
  const { data, error } = await supabase.from('playlists').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePlaylist(id) {
  const { error } = await supabase.from('playlists').delete().eq('id', id)
  if (error) throw error
}

export async function addSongToPlaylist(playlistId, songId) {
  const { error } = await supabase.from('playlist_songs').insert({ playlist_id: playlistId, song_id: songId })
  if (error && error.code !== '23505') throw error
}

export async function removeSongFromPlaylist(playlistId, songId) {
  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId)
  if (error) throw error
}
