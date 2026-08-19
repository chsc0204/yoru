import { useEffect, useState } from 'react'
import { Search, X, Music2 } from 'lucide-react'
import { searchSongs } from '../../services/songs'
import { useDebounce } from '../../hooks/useDebounce'

export default function MusicSearchPicker({ selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounced = useDebounce(query, 300)

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([])
      return
    }
    let active = true
    setLoading(true)
    searchSongs(debounced, 8)
      .then((data) => active && setResults(data))
      .catch(() => active && setResults([]))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [debounced])

  if (selected) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
        <img src={selected.artwork_url} alt={selected.title} className="h-12 w-12 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--color-text)]">{selected.title}</p>
          <p className="truncate text-xs text-[var(--color-text-muted)]">{selected.artist?.name}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-dim)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 focus-within:border-[var(--color-brand-violet)] transition-colors">
        <Search size={16} className="text-[var(--color-text-dim)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: YOASOBI, Lemon..."
          className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none"
        />
      </div>

      {query.trim() && (
        <div className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-2xl shadow-black/40">
          {loading && <p className="p-4 text-sm text-[var(--color-text-muted)]">검색 중...</p>}
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-[var(--color-text-muted)]">검색 결과가 없습니다.</p>
          )}
          {!loading &&
            results.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => {
                  onSelect(song)
                  setQuery('')
                }}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                {song.artwork_url ? (
                  <img src={song.artwork_url} alt={song.title} className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                    <Music2 size={16} className="text-[var(--color-text-dim)]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm text-[var(--color-text)]">{song.title}</p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{song.artist?.name}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
