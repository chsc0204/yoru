import { create } from 'zustand'

let idCounter = 0

export const useToastStore = create((set, get) => ({
  toasts: [],

  show: (message, type = 'success') => {
    const id = ++idCounter
    set({ toasts: [...get().toasts, { id, message, type }] })
    setTimeout(() => get().dismiss(id), 3200)
  },

  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export function toast(message) {
  useToastStore.getState().show(message, 'success')
}
toast.success = (message) => useToastStore.getState().show(message, 'success')
toast.error = (message) => useToastStore.getState().show(message, 'error')
toast.info = (message) => useToastStore.getState().show(message, 'info')
