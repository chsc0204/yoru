import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2, Plus, X, Search as SearchIcon, Check, Play, Pause } from 'lucide-react'
import { getPlaylistById, getPlaylistSongs, renamePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } from '../services/playlists'
import { searchSongs } from '../services/songs'
import { useAuthStore } from '../store/useAuthStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { useDebounce } from '../hooks/useDebounce'
import { toast } from '../store/useToastStore'
import { formatCount } from '../utils/formatters'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import { Skeleton } from '../components/common/Skeleton'
import Button from '../components/common/Button'

export default function PlaylistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [playlist, setPlaylist] = useState(null)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)

  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playSong = usePlayerStore((s) => s.playSong)
  const togglePlay = usePlayerStore((s) => s.togglePlay)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [playlistData, songsData] = await Promise.all([getPlaylistById(id), getPlaylistSongs(id)])
      setPlaylist(playlistData)
      setName(playlistData.name)
      setSongs(songsData)
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
  }, [id])

  async function handleRename(e) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const updated = await renamePlaylist(id, { name: name.trim() })
      setPlaylist(updated)
      setRenaming(false)
      toast.success('플레이리스트 이름이 변경되었습니다.')
    } catch (err) {
      console.error(err)
      toast.error('이름 변경에 실패했습니다.')
    }
  }

  async function handleDeletePlaylist() {
    if (!window.confirm('플레이리스트를 삭제하시겠습니까?')) return
    try {
      await deletePlaylist(id)
      toast.success('삭제되었습니다.')
      navigate('/library?tab=playlists')
    } catch (err) {
      console.error(err)
      toast.error('삭제에 실패했습니다.')
    }
  }

  async function handleAddSong(song) {
    try {
      await addSongToPlaylist(id, song.id)
      setSongs((prev) => (prev.some((s) => s.id === song.id) ? prev : [{ ...song, added_at: new Date().toISOString() }, ...prev]))
      toast.success('플레이리스트에 추가되었습니다.')
    } catch (err) {
      console.error(err)
      toast.error('추가에 실패했습니다.')
    }
  }

  async function handleRemoveSong(songId) {
    try {
      await removeSongFromPlaylist(id, songId)
      setSongs((prev) => prev.filter((s) => s.id !== songId))
      toast.success('플레이리스트에서 제거했습니다.')
    } catch (err) {
      console.error(err)
      toast.error('제거에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="px-4 md:px-8 py-8 flex flex-col gap-4">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !playlist) return <ErrorState message={error} onRetry={load} />

  const isOwner = user?.id === playlist.user_id

  return (
    <div className="animate-fade-in px-4 md:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        {renaming ? (
          <form onSubmit={handleRename} className="flex flex-1 gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-lg font-bold outline-none focus:border-[var(--color-brand-violet)]"
            />
            <Button type="submit" size="sm"><Check size={15} /></Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setRenaming(false)}><X size={15} /></Button>
          </form>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">Playlist</p>
            <h1 className="text-2xl md:text-3xl font-extrabold">{playlist.name}</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{formatCount(songs.length)}곡</p>
          </div>
        )}
        {isOwner && !renaming && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setRenaming(true)} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]">
              <Pencil size={16} />
            </button>
            <button onClick={handleDeletePlaylist} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isOwner && (
        <div>
          {adding ? (
            <AddSongPicker onAdd={handleAddSong} onClose={() => setAdding(false)} />
          ) : (
            <Button onClick={() => setAdding(true)} size="sm" variant="secondary" className="self-start">
              <Plus size={15} /> 곡 추가
            </Button>
          )}
        </div>
      )}

      {songs.length === 0 ? (
        <EmptyState icon="📻" title="아직 추가된 곡이 없습니다." />
      ) : (
        <div className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border-soft)]">
          {songs.map((song) => {
            const isCurrent = currentSong?.id === song.id
            return (
              <div key={song.id} className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => (isCurrent ? togglePlay() : playSong(song, songs))}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg overflow-hidden relative group"
                >
                  <img src={song.artwork_url} alt={song.title} className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isCurrent && isPlaying ? <Pause size={14} className="text-white" fill="currentColor" /> : <Play size={14} className="text-white ml-0.5" fill="currentColor" />}
                  </span>
                </button>
                <Link to={`/song/${song.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">{song.title}</p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{song.artist?.name}</p>
                </Link>
                {isOwner && (
                  <button onClick={() => handleRemoveSong(song.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-dim)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]">
                    <X size={15} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AddSongPicker({ onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const debounced = useDebounce(query, 300)

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([])
      return
    }
    let active = true
    searchSongs(debounced, 8).then((data) => active && setResults(data))
    return () => {
      active = false
    }
  }, [debounced])

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <div className="flex items-center gap-2">
        <SearchIcon size={15} className="text-[var(--color-text-dim)]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="추가할 곡 검색..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-dim)]"
        />
        <button onClick={onClose} className="text-[var(--color-text-dim)] hover:text-[var(--color-text)]"><X size={15} /></button>
      </div>
      {results.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 max-h-56 overflow-y-auto">
          {results.map((song) => (
            <button
              key={song.id}
              onClick={() => onAdd(song)}
              className="flex items-center gap-2.5 rounded-lg p-2 text-left hover:bg-[var(--color-surface-hover)]"
            >
              <img src={song.artwork_url} alt={song.title} className="h-8 w-8 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[var(--color-text)]">{song.title}</p>
                <p className="truncate text-[11px] text-[var(--color-text-muted)]">{song.artist?.name}</p>
              </div>
              <Plus size={14} className="text-[var(--color-accent)]" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
