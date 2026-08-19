import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { useToastStore } from '../../store/useToastStore'

const ICONS = {
  success: <CheckCircle2 size={18} className="text-[var(--color-success)] shrink-0" />,
  error: <XCircle size={18} className="text-[var(--color-danger)] shrink-0" />,
  info: <Info size={18} className="text-[var(--color-brand-blue)] shrink-0" />,
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm px-4 md:px-0">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="animate-toast-in flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/95 backdrop-blur px-4 py-3 text-sm text-left text-[var(--color-text)] shadow-2xl shadow-black/40"
        >
          {ICONS[t.type] ?? ICONS.success}
          <span className="leading-snug">{t.message}</span>
        </button>
      ))}
    </div>
  )
}
