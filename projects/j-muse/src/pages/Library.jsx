import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { Plus, Trash2, ListMusic, Clock } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../store/useAuthStore'
import { getLikedSongs } from '../services/likes'
import { getPostsByUser } from '../services/posts'
import { getAnswersByUser } from '../services/answers'
import { getPlaylists, createPlaylist, deletePlaylist } from '../services/playlists'
import { getRecentlyViewed } from '../utils/recentlyViewed'
import { toast } from '../store/useToastStore'
import { timeAgo, formatCount } from '../utils/formatters'
import { categoryLabel } from '../utils/constants'
import SongCard from '../components/music/SongCard'
import PostCard from '../components/community/PostCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Button from '../components/common/Button'
import { CardRowSkeleton } from '../components/common/Skeleton'

const TABS = [
  { value: 'liked', label: 'Liked Songs' },
  { value: 'posts', label: 'My Posts' },
  { value: 'answers', label: 'My Answers' },
  { value: 'playlists', label: 'Playlists' },
  { value: 'recent', label: 'Recently Viewed' },
]

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'liked'
  const { user, loading: authLoading } = useAuthStore(useShallow((s) => ({ user: s.user, loading: s.loading })))

  if (!authLoading && !user) {
    return (
      <div className="px-4 md:px-8 py-10">
        <EmptyState
          icon="🔒"
          title="로그인이 필요합니다."
          description="라이브러리를 이용하려면 먼저 로그인해주세요."
          action={<Button as={Link} to="/login?redirect=/library" size="sm">로그인하러 가기</Button>}
        />
      </div>
    )
  }

  return (
    <div className="animate-fade-in px-4 md:px-8 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">라이브러리</h1>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setSearchParams({ tab: t.value })}
            className={clsx(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              tab === t.value
                ? 'brand-gradient-bg text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {user && tab === 'liked' && <LikedSongsTab userId={user.id} />}
      {user && tab === 'posts' && <MyPostsTab userId={user.id} />}
      {user && tab === 'answers' && <MyAnswersTab userId={user.id} />}
      {user && tab === 'playlists' && <PlaylistsTab userId={user.id} />}
      {tab === 'recent' && <RecentlyViewedTab />}
    </div>
  )
}

function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  useEffect(() => {
    let active = true
    setState({ data: null, loading: true, error: null })
    fn()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        console.error(err)
        if (active) setState({ data: null, loading: false, error: '데이터를 불러오지 못했습니다.' })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

function LikedSongsTab({ userId }) {
  const { data, loading, error } = useAsync(() => getLikedSongs(userId), [userId])
  if (loading) return <CardRowSkeleton count={6} />
  if (error) return <ErrorState message={error} />
  if (!data.length) return <EmptyState icon="🤍" title="좋아요한 음악이 없습니다." description="마음에 드는 곡에 좋아요를 눌러보세요." />
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {data.map((song) => <SongCard key={song.id} song={song} queue={data} />)}
    </div>
  )
}

function MyPostsTab({ userId }) {
  const { data, loading, error } = useAsync(() => getPostsByUser(userId), [userId])
  if (loading) return <CardRowSkeleton count={3} />
  if (error) return <ErrorState message={error} />
  if (!data.length) return <EmptyState icon="📝" title="작성한 게시글이 없습니다." action={<Button as={Link} to="/write" size="sm">글쓰기</Button>} />
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  )
}

function MyAnswersTab({ userId }) {
  const { data, loading, error } = useAsync(() => getAnswersByUser(userId), [userId])
  if (loading) return <CardRowSkeleton count={3} />
  if (error) return <ErrorState message={error} />
  if (!data.length) return <EmptyState icon="💬" title="작성한 답변이 없습니다." />
  return (
    <div className="flex flex-col gap-3">
      {data.map((answer) => (
        <Link
          key={answer.id}
          to={`/post/${answer.posts?.id}`}
          className="card-hover flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
            <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[var(--color-accent)]">{categoryLabel(answer.posts?.category)}</span>
            <span>{timeAgo(answer.created_at)}</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)] line-clamp-1">{answer.posts?.title}</p>
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{answer.content}</p>
        </Link>
      ))}
    </div>
  )
}

function PlaylistsTab({ userId }) {
  const [playlists, setPlaylists] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setPlaylists(await getPlaylists(userId))
    } catch (err) {
      console.error(err)
      setError('플레이리스트를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await createPlaylist(userId, { name: name.trim(), description: '' })
      toast.success('플레이리스트가 생성되었습니다.')
      setName('')
      setCreating(false)
      load()
    } catch (err) {
      console.error(err)
      toast.error('플레이리스트 생성에 실패했습니다.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('플레이리스트를 삭제하시겠습니까?')) return
    try {
      await deletePlaylist(id)
      toast.success('삭제되었습니다.')
      setPlaylists((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('삭제에 실패했습니다.')
    }
  }

  if (loading) return <CardRowSkeleton count={3} />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="flex flex-col gap-4">
      {creating ? (
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="플레이리스트 이름 (예: 밤에 듣는 J-POP)"
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand-violet)]"
          />
          <Button type="submit" size="md">만들기</Button>
          <Button type="button" variant="ghost" size="md" onClick={() => setCreating(false)}>취소</Button>
        </form>
      ) : (
        <Button onClick={() => setCreating(true)} size="sm" className="self-start">
          <Plus size={15} /> 새 플레이리스트
        </Button>
      )}

      {!playlists.length ? (
        <EmptyState icon="📻" title="플레이리스트가 없습니다." description="새 플레이리스트를 만들어 곡을 모아보세요." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((p) => (
            <div key={p.id} className="card-hover flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <Link to={`/playlist/${p.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl brand-gradient-bg">
                  <ListMusic size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">{p.name}</p>
                  <p className="text-xs text-[var(--color-text-dim)]">{formatCount(p.song_count)}곡</p>
                </div>
              </Link>
              <button onClick={() => handleDelete(p.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-dim)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RecentlyViewedTab() {
  const items = getRecentlyViewed()
  if (!items.length) return <EmptyState icon="🕓" title="최근 본 항목이 없습니다." />
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={`${item.type}-${item.id}`}
          to={item.type === 'song' ? `/song/${item.id}` : `/post/${item.id}`}
          className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          {item.image ? (
            <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]">
              <Clock size={16} className="text-[var(--color-text-dim)]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--color-text)]">{item.title}</p>
            {item.subtitle && <p className="truncate text-xs text-[var(--color-text-muted)]">{item.subtitle}</p>}
          </div>
          <span className="text-xs text-[var(--color-text-dim)] shrink-0">{timeAgo(item.viewedAt)}</span>
        </Link>
      ))}
    </div>
  )
}
