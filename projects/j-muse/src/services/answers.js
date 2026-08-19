import { supabase, isSupabaseConfigured } from './supabaseClient'
import { mockAnswers } from './mockData'

const SELECT = '*, profiles(*)'

export async function getAnswersByPost(postId) {
  if (!isSupabaseConfigured) {
    return mockAnswers.filter((a) => a.post_id === postId)
  }
  const { data, error } = await supabase
    .from('answers')
    .select(SELECT)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getAnswersByUser(userId) {
  if (!isSupabaseConfigured) return mockAnswers.filter((a) => a.user_id === userId)
  const { data, error } = await supabase
    .from('answers')
    .select('*, posts(id, title, category)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createAnswer({ postId, userId, content }) {
  const { data, error } = await supabase
    .from('answers')
    .insert({ post_id: postId, user_id: userId, content })
    .select(SELECT)
    .single()
  if (error) throw error
  return data
}

export async function deleteAnswer(id) {
  const { error } = await supabase.from('answers').delete().eq('id', id)
  if (error) throw error
}
