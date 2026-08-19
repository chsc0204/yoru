import clsx from 'clsx'
import { SORT_OPTIONS } from '../../utils/constants'

export default function SortTabs({ value, onChange }) {
  return (
    <div className="flex gap-1 rounded-full bg-[var(--color-surface-2)] p-1 w-fit">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
            value === opt.value
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
