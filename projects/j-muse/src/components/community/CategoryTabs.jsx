import clsx from 'clsx'
import { CATEGORIES } from '../../utils/constants'

export default function CategoryTabs({ value, onChange }) {
  const tabs = [{ value: 'all', label: '전체', emoji: '✨' }, ...CATEGORIES]

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
            value === tab.value
              ? 'brand-gradient-bg text-white shadow-md shadow-purple-900/30'
              : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
          )}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  )
}
