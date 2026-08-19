import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { getSongById } from '../services/songs'
import { getPostsBySong } from '../services/posts'
import { addRecentlyViewed } from '../utils/recentlyViewed'
import { usePlayerStore } from '../store/usePlayerStore'
import LikeButton from '../components/common/LikeButton'
import PostCard from '../components/community/PostCard'
import SectionHeader from '../components/common/SectionHeader'
import ErrorState from '../components/common/ErrorState'
import { Skeleton } from '../components/common/Skeleton'
import Button from '../components/common/Button'
import { formatDate } from '../utils/formatters'

export default function SongDetail() {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playSong = usePlayerStore((s) => s.playSong)
  const togglePlay = usePlayerStore((s) => s.togglePlay)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [songData, postsData] = await Promise.all([getSongById(id), getPostsBySong(id, 10).catch(() => [])])
      if (!songData) setError('곡 정보를 찾을 수 없습니다.')
      else {
        setSong(songData)
        setPosts(postsData)
        addRecentlyViewed({ type: 'song', id: songData.id, title: songData.title, subtitle: songData.artist?.name, image: songData.artwork_url })
      }
    } catch (err) {
      console.error(err)
      setError('곡 정보를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return (
      <div className="px-4 md:px-8 py-8 flex flex-col sm:flex-row gap-6">
        <Skeleton className="h-56 w-56 rounded-2xl shrink-0" />
        <div className="flex flex-col gap-3 pt-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    )
  }

  if (error || !song) return <ErrorState message={error} />

  const isCurrent = currentSong?.id === song.id

  return (
    <div className="animate-fade-in px-4 md:px-8 py-8 flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row gap-6">
        <img src={song.artwork_url} alt={song.title} className="h-56 w-56 rounded-2xl object-cover self-center sm:self-start shadow-2xl shadow-black/30" />
        <div className="flex flex-col justify-end gap-3 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">Song</p>
          <h1 className="text-2xl md:text-4xl font-extrabold">{song.title}</h1>
          {song.artist && (
            <Link to={`/artist/${song.artist.id}`} className="text-[var(--color-accent)] font-medium hover:underline w-fit mx-auto sm:mx-0">
              {song.artist.name}
            </Link>
          )}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
            {song.album && <Link to={`/album/${song.album.id}`} className="hover:text-[var(--color-text)]">{song.album.title}</Link>}
            <span>{formatDate(song.release_date)}</span>
            {song.genre && <span>{song.genre}</span>}
            <span>인기도 {song.popularity}</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
            <Button
              onClick={() => (isCurrent ? togglePlay() : playSong(song))}
              size="lg"
            >
              {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              {isCurrent && isPlaying ? '일시정지' : '재생'}
            </Button>
            <LikeButton targetType="song" targetId={song.id} initialCount={song.like_count} size="lg" />
          </div>
        </div>
      </div>

      <section>
        <SectionHeader title="💬 이 곡에 대한 이야기" viewAllHref={`/write?category=recommendation`} />
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">아직 이 곡에 대한 게시글이 없습니다. 첫 이야기를 남겨보세요!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </div>
  )
}
