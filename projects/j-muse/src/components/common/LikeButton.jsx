import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { useLike } from '../../hooks/useLike'
import { formatCount } from '../../utils/formatters'

export default function LikeButton({ targetType, targetId, initialLiked, initialCount, size = 'md', showCount = true, onToggle }) {
  const { liked, count, toggle, busy } = useLike(targetType, targetId, initialLiked, initialCount)

  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 22 : 17

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await toggle()
        onToggle?.()
      }}
      className={clsx(
        'inline-flex items-center rounded-full transition-colors disabled:opacity-60',
        size === 'sm' ? 'gap-1 px-2 py-1 text-xs' : 'gap-1.5 px-3 py-1.5 text-sm',
        liked
          ? 'text-[var(--color-brand-pink)] bg-[var(--color-brand-pink)]/10'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-brand-pink)] hover:bg-[var(--color-brand-pink)]/10'
      )}
    >
      <Heart size={iconSize} fill={liked ? 'currentColor' : 'none'} strokeWidth={2} />
      {showCount && <span>{formatCount(count)}</span>}
    </button>
  )
}
