import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { getAlbumById } from '../services/albums'
import { getSongsByAlbum } from '../services/songs'
import { usePlayerStore } from '../store/usePlayerStore'
import { formatDate, formatCount } from '../utils/formatters'
import ErrorState from '../components/common/ErrorState'
import { Skeleton } from '../components/common/Skeleton'
import LikeButton from '../components/common/LikeButton'

export default function AlbumDetail() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [songs, setSongs] = useState([])
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
      const [albumData, songsData] = await Promise.all([getAlbumById(id), getSongsByAlbum(id)])
      if (!albumData) setError('앨범 정보를 찾을 수 없습니다.')
      else {
        setAlbum(albumData)
        setSongs(songsData)
      }
    } catch (err) {
      console.error(err)
      setError('앨범 정보를 불러오지 못했습니다.')
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
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !album) return <ErrorState message={error} />

  return (
    <div className="animate-fade-in px-4 md:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row gap-6">
        <img src={album.artwork_url} alt={album.title} className="h-56 w-56 rounded-2xl object-cover self-center sm:self-start shadow-2xl shadow-black/30" />
        <div className="flex flex-col justify-end gap-2 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">Album</p>
          <h1 className="text-2xl md:text-4xl font-extrabold">{album.title}</h1>
          {album.artist && (
            <Link to={`/artist/${album.artist.id}`} className="text-[var(--color-accent)] font-medium hover:underline w-fit mx-auto sm:mx-0">
              {album.artist.name}
            </Link>
          )}
          <p className="text-sm text-[var(--color-text-muted)]">{formatDate(album.release_date)} · 트랙 {songs.length}곡</p>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border-soft)]">
        {songs.length === 0 ? (
          <p className="p-6 text-sm text-[var(--color-text-muted)]">등록된 트랙이 없습니다.</p>
        ) : (
          songs.map((song, i) => {
            const isCurrent = currentSong?.id === song.id
            return (
              <div key={song.id} className="group flex items-center gap-4 px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors">
                <button
                  onClick={() => (isCurrent ? togglePlay() : playSong(song, songs))}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  {isCurrent && isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <>
                      <span className="w-4 text-center text-sm tabular-nums group-hover:hidden">{i + 1}</span>
                      <Play size={16} fill="currentColor" className="ml-0.5 hidden group-hover:block" />
                    </>
                  )}
                </button>
                <Link to={`/song/${song.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">{song.title}</p>
                </Link>
                <LikeButton targetType="song" targetId={song.id} initialCount={song.like_count} size="sm" showCount={false} />
                <span className="text-xs text-[var(--color-text-dim)] w-10 text-right">{formatCount(song.popularity)}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
