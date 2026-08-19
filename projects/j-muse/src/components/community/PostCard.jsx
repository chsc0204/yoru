import { Link } from 'react-router-dom'
import { MessageCircle, Heart, Eye, Music2 } from 'lucide-react'
import { categoryLabel } from '../../utils/constants'
import { timeAgo, truncate, formatCount } from '../../utils/formatters'

export default function PostCard({ post }) {
  const nickname = post.profiles?.nickname ?? '알 수 없음'
  const song = post.song

  return (
    <Link
      to={`/post/${post.id}`}
      className="card-hover flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--color-accent)]">
          {categoryLabel(post.category)}
        </span>
        <span className="text-xs text-[var(--color-text-dim)]">{timeAgo(post.created_at)}</span>
      </div>

      <div>
        <h3 className="font-semibold text-[var(--color-text)] leading-snug line-clamp-1">{post.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)] line-clamp-2">{truncate(post.content, 140)}</p>
      </div>

      {song && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-2.5 py-2">
          {song.artwork_url ? (
            <img src={song.artwork_url} alt={song.title} className="h-8 w-8 rounded object-cover" />
          ) : (
            <Music2 size={14} className="text-[var(--color-text-dim)]" />
          )}
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            <span className="text-[var(--color-text)]">{song.title}</span> · {song.artist?.name}
          </p>
        </div>
      )}

      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <img
            src={post.profiles?.avatar_url || `https://i.pravatar.cc/80?u=${post.user_id}`}
            alt={nickname}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="truncate text-xs text-[var(--color-text-muted)]">{nickname}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-dim)]">
          <span className="flex items-center gap-1"><MessageCircle size={13} /> {formatCount(post.answer_count)}</span>
          <span className="flex items-center gap-1"><Heart size={13} /> {formatCount(post.like_count)}</span>
          <span className="flex items-center gap-1"><Eye size={13} /> {formatCount(post.view_count)}</span>
        </div>
      </div>
    </Link>
  )
}
