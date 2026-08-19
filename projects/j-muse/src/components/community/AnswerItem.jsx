import { Trash2 } from 'lucide-react'
import { timeAgo } from '../../utils/formatters'
import { useAuthStore } from '../../store/useAuthStore'
import LikeButton from '../common/LikeButton'

export default function AnswerItem({ answer, onDelete }) {
  const user = useAuthStore((s) => s.user)
  const nickname = answer.profiles?.nickname ?? '알 수 없음'
  const isOwner = user?.id === answer.user_id

  return (
    <div className="flex gap-3 py-4 border-b border-[var(--color-border-soft)] last:border-none">
      <img
        src={answer.profiles?.avatar_url || `https://i.pravatar.cc/80?u=${answer.user_id}`}
        alt={nickname}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-sm font-semibold text-[var(--color-text)]">{nickname}</span>
            <span className="text-xs text-[var(--color-text-dim)]">{timeAgo(answer.created_at)}</span>
          </div>
          {isOwner && (
            <button
              onClick={() => onDelete?.(answer.id)}
              className="flex items-center gap-1 text-xs text-[var(--color-text-dim)] hover:text-[var(--color-danger)]"
            >
              <Trash2 size={13} /> 삭제
            </button>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-wrap break-words">{answer.content}</p>
        <div className="mt-2">
          <LikeButton targetType="answer" targetId={answer.id} initialCount={answer.like_count} size="sm" />
        </div>
      </div>
    </div>
  )
}
