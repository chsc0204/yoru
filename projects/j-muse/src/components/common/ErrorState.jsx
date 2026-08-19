import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorState({ message = '데이터를 불러오지 못했습니다.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6">
      <AlertTriangle size={32} className="text-[var(--color-danger)]" />
      <p className="text-[var(--color-text)] font-medium">{message}</p>
      <p className="text-sm text-[var(--color-text-muted)]">잠시 후 다시 시도해주세요.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <RotateCcw size={14} /> 다시 시도
        </button>
      )}
    </div>
  )
}
