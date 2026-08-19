import { create } from 'zustand'

const DEMO_DURATION = 30 // seconds — simulated playback length when there is no preview_url

export const usePlayerStore = create((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  progress: 0, // seconds elapsed
  duration: DEMO_DURATION,

  playSong: (song, queue = null) => {
    const nextQueue = queue || [song]
    const index = nextQueue.findIndex((s) => s.id === song.id)
    set({
      queue: nextQueue,
      currentIndex: index === -1 ? 0 : index,
      currentSong: song,
      isPlaying: true,
      progress: 0,
      duration: song.preview_url ? get().duration : DEMO_DURATION,
    })
  },

  togglePlay: () => {
    if (!get().currentSong) return
    set({ isPlaying: !get().isPlaying })
  },

  next: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0) return
    const nextIndex = (currentIndex + 1) % queue.length
    set({ currentIndex: nextIndex, currentSong: queue[nextIndex], progress: 0, isPlaying: true })
  },

  prev: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0) return
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length
    set({ currentIndex: prevIndex, currentSong: queue[prevIndex], progress: 0, isPlaying: true })
  },

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  seekTo: (ratio) => {
    const { duration } = get()
    set({ progress: Math.max(0, Math.min(1, ratio)) * duration })
  },

  closePlayer: () => set({ currentSong: null, isPlaying: false, queue: [], currentIndex: -1, progress: 0 }),
}))
