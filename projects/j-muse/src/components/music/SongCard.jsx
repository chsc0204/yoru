import { Link } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import { usePlayerStore } from '../../store/usePlayerStore'
import LikeButton from '../common/LikeButton'

export default function SongCard({ song, queue }) {
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playSong = usePlayerStore((s) => s.playSong)
  const togglePlay = usePlayerStore((s) => s.togglePlay)

  const isCurrent = currentSong?.id === song.id
  const artist = song.artist

  function handlePlayClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrent) {
      togglePlay()
    } else {
      playSong(song, queue)
    }
  }

  return (
    <Link to={`/song/${song.id}`} className="group flex flex-col gap-3 card-hover">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-surface-2)]">
        <img
          src={song.artwork_url}
          alt={song.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          onClick={handlePlayClick}
          aria-label={isCurrent && isPlaying ? '일시정지' : '재생'}
          className={`absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full brand-gradient-bg text-white shadow-lg shadow-black/40 transition-all duration-200 ${
            isCurrent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--color-text)]">{song.title}</p>
        {artist && (
          <p className="truncate text-xs text-[var(--color-text-muted)]">{artist.name}</p>
        )}
        <div className="mt-1">
          <LikeButton targetType="song" targetId={song.id} initialCount={song.like_count} size="sm" />
        </div>
      </div>
    </Link>
  )
}
