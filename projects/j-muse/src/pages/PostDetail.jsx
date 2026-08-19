import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Eye, Pencil, Trash2, Play, Pause } from 'lucide-react'
import { getPostById, incrementPostView, deletePost } from '../services/posts'
import { getAnswersByPost, createAnswer, deleteAnswer } from '../services/answers'
import { addRecentlyViewed } from '../utils/recentlyViewed'
import { useAuthStore } from '../store/useAuthStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { toast } from '../store/useToastStore'
import { categoryLabel } from '../utils/constants'
import { formatDate, timeAgo } from '../utils/formatters'
import LikeButton from '../components/common/LikeButton'
import AnswerItem from '../components/community/AnswerItem'
import ErrorState from '../components/common/ErrorState'
import { Skeleton } from '../components/common/Skeleton'
import Button from '../components/common/Button'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [post, setPost] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answerText, setAnswerText] = useState('')
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const viewedRef = useRef(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [postData, answersData] = await Promise.all([getPostById(id), getAnswersByPost(id)])
      if (!postData) {
        setError('게시글을 찾을 수 없습니다.')
      } else {
        setPost(postData)
        setAnswers(answersData)
        addRecentlyViewed({ type: 'post', id: postData.id, title: postData.title, subtitle: postData.profiles?.nickname })
        if (!viewedRef.current) {
          viewedRef.current = true
          incrementPostView(id)
          setPost((p) => (p ? { ...p, view_count: p.view_count + 1 } : p))
        }
      }
    } catch (err) {
      console.error(err)
      setError('게시글을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleDeletePost() {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return
    try {
      await deletePost(id)
      toast.success('삭제되었습니다.')
      navigate('/community')
    } catch (err) {
      console.error(err)
      toast.error('삭제에 실패했습니다.')
    }
  }

  async function handleSubmitAnswer(e) {
    e.preventDefault()
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }
    if (!answerText.trim()) return
    setSubmittingAnswer(true)
    try {
      const answer = await createAnswer({ postId: id, userId: user.id, content: answerText.trim() })
      setAnswers((prev) => [...prev, answer])
      setPost((p) => (p ? { ...p, answer_count: p.answer_count + 1 } : p))
      setAnswerText('')
      toast.success('답변이 등록되었습니다.')
    } catch (err) {
      console.error(err)
      toast.error('답변 등록에 실패했습니다.')
    } finally {
      setSubmittingAnswer(false)
    }
  }

  async function handleDeleteAnswer(answerId) {
    if (!window.confirm('답변을 삭제하시겠습니까?')) return
    try {
      await deleteAnswer(answerId)
      setAnswers((prev) => prev.filter((a) => a.id !== answerId))
      setPost((p) => (p ? { ...p, answer_count: Math.max(p.answer_count - 1, 0) } : p))
      toast.success('삭제되었습니다.')
    } catch (err) {
      console.error(err)
      toast.error('삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-0 py-8 flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error || !post) return <ErrorState message={error || '게시글을 찾을 수 없습니다.'} />

  const isOwner = user?.id === post.user_id
  const nickname = post.profiles?.nickname ?? '알 수 없음'

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 md:px-0 py-8">
      <span className="inline-block rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
        {categoryLabel(post.category)}
      </span>

      <h1 className="mt-4 text-2xl md:text-3xl font-bold leading-snug text-[var(--color-text)]">{post.title}</h1>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={post.profiles?.avatar_url || `https://i.pravatar.cc/80?u=${post.user_id}`}
            alt={nickname}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">{nickname}</p>
            <p className="text-xs text-[var(--color-text-dim)]" title={formatDate(post.created_at)}>{timeAgo(post.created_at)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-1">
            <Link to={`/post/${id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]">
              <Pencil size={16} />
            </Link>
            <button onClick={handleDeletePost} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[var(--color-text)]">
        {post.content}
      </p>

      {post.song && <AttachedSong song={post.song} />}

      <div className="mt-6 flex items-center gap-4 border-y border-[var(--color-border-soft)] py-3">
        <LikeButton targetType="post" targetId={post.id} initialCount={post.like_count} />
        <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-dim)]">
          <Eye size={16} /> {post.view_count}
        </span>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-bold">💬 답변 {answers.length}개</h2>
        <div>
          {answers.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">아직 답변이 없습니다. 첫 답변을 남겨보세요!</p>
          ) : (
            answers.map((answer) => <AnswerItem key={answer.id} answer={answer} onDelete={handleDeleteAnswer} />)
          )}
        </div>

        <form onSubmit={handleSubmitAnswer} className="mt-4 flex flex-col gap-3">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={3}
            maxLength={4000}
            placeholder={user ? '답변을 작성해보세요.' : '로그인 후 답변을 작성할 수 있습니다.'}
            disabled={!user}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none focus:border-[var(--color-brand-violet)] disabled:opacity-60 transition-colors"
          />
          <Button type="submit" disabled={!user || submittingAnswer} className="self-end">
            {submittingAnswer ? '등록 중...' : '답변 작성'}
          </Button>
        </form>
      </div>
    </div>
  )
}

function AttachedSong({ song }) {
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playSong = usePlayerStore((s) => s.playSong)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const isCurrent = currentSong?.id === song.id

  return (
    <Link
      to={`/song/${song.id}`}
      className="mt-6 flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      <img src={song.artwork_url} alt={song.title} className="h-16 w-16 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[var(--color-text)]">{song.title}</p>
        <p className="truncate text-sm text-[var(--color-text-muted)]">{song.artist?.name}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          if (isCurrent) togglePlay()
          else playSong(song)
        }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full brand-gradient-bg text-white"
      >
        {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>
    </Link>
  )
}
