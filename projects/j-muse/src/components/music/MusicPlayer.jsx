import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { Play, Pause, SkipBack, SkipForward, X, Radio } from 'lucide-react'
import { usePlayerStore } from '../../store/usePlayerStore'
import LikeButton from '../common/LikeButton'
import { formatDuration } from '../../utils/formatters'

export default function MusicPlayer() {
  const { currentSong, isPlaying, progress, duration } = usePlayerStore(
    useShallow((s) => ({
      currentSong: s.currentSong,
      isPlaying: s.isPlaying,
      progress: s.progress,
      duration: s.duration,
    }))
  )
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const next = usePlayerStore((s) => s.next)
  const prev = usePlayerStore((s) => s.prev)
  const seekTo = usePlayerStore((s) => s.seekTo)
  const setProgress = usePlayerStore((s) => s.setProgress)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const closePlayer = usePlayerStore((s) => s.closePlayer)

  const audioRef = useRef(null)
  const barRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const hasPreview = Boolean(currentSong?.preview_url)

  // real audio playback when a preview_url is available
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasPreview) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying, hasPreview, currentSong?.id])

  // demo playback: simulate progress with a timer when there's no preview audio
  useEffect(() => {
    if (!currentSong || hasPreview || !isPlaying || dragging) return
    const interval = setInterval(() => {
      const state = usePlayerStore.getState()
      const nextProgress = state.progress + 0.25
      if (nextProgress >= state.duration) {
        next()
      } else {
        setProgress(nextProgress)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [currentSong, isPlaying, hasPreview, dragging, next, setProgress])

  if (!currentSong) return null

  const ratio = duration > 0 ? Math.min(progress / duration, 1) : 0

  function handleSeek(e) {
    const bar = barRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const newRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    seekTo(newRatio)
    if (hasPreview && audioRef.current) {
      audioRef.current.currentTime = newRatio * (audioRef.current.duration || 0)
    }
  }

  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 backdrop-blur">
      {hasPreview && (
        <audio
          ref={audioRef}
          src={currentSong.preview_url}
          onTimeUpdate={(e) => !dragging && setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
          onEnded={next}
        />
      )}

      {/* progress bar */}
      <div
        ref={barRef}
        onMouseDown={(e) => {
          setDragging(true)
          handleSeek(e)
        }}
        onMouseMove={(e) => dragging && handleSeek(e)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => dragging && setDragging(false)}
        className="group/bar relative h-1 w-full cursor-pointer bg-[var(--color-border)]"
      >
        <div
          className="h-full brand-gradient-bg transition-[width] duration-150"
          style={{ width: `${ratio * 100}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 shadow"
          style={{ left: `${ratio * 100}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-3 py-2 md:gap-4 md:px-6 md:py-3">
        <Link to={`/song/${currentSong.id}`} className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:w-64">
          <img
            src={currentSong.artwork_url}
            alt={currentSong.title}
            className="h-11 w-11 md:h-14 md:w-14 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">{currentSong.title}</p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">{currentSong.artist?.name ?? '아티스트 미상'}</p>
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <button onClick={prev} className="hidden md:flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full brand-gradient-bg text-white shadow-lg shadow-purple-900/30"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={next} className="hidden md:flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          <span className="text-xs tabular-nums text-[var(--color-text-dim)]">
            {formatDuration(progress)} / {formatDuration(duration)}
          </span>
          {!hasPreview && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[var(--color-text-dim)]">
              <Radio size={12} /> Demo
            </span>
          )}
          <LikeButton targetType="song" targetId={currentSong.id} initialCount={currentSong.like_count} size="sm" showCount={false} />
          <button onClick={closePlayer} className="h-8 w-8 flex items-center justify-center rounded-full text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
