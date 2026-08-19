import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../services/supabaseClient'
import { getProfile } from '../services/auth'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  init: async () => {
    if (get().initialized) return
    set({ initialized: true })

    if (!isSupabaseConfigured) {
      set({ loading: false })
      return
    }

    const { data } = await supabase.auth.getSession()
    if (data.session?.user) {
      await get().hydrateProfile(data.session.user)
    } else {
      set({ loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await get().hydrateProfile(session.user)
      } else {
        set({ user: null, profile: null, loading: false })
      }
    })
  },

  hydrateProfile: async (user) => {
    set({ user, loading: true })
    try {
      const profile = await getProfile(user.id)
      set({ profile, loading: false })
    } catch (err) {
      console.error('프로필을 불러오지 못했습니다.', err)
      set({ profile: null, loading: false })
    }
  },

  setProfile: (profile) => set({ profile }),
}))
