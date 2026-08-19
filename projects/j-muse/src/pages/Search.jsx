import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { searchAll } from '../services/search'
import { useDebounce } from '../hooks/useDebounce'
import SectionHeader from '../components/common/SectionHeader'
import SongCard from '../components/music/SongCard'
import ArtistCard from '../components/music/ArtistCard'
import AlbumCard from '../components/music/AlbumCard'
import PostCard from '../components/community/PostCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import { CardRowSkeleton } from '../components/common/Skeleton'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [input, setInput] = useState(searchParams.get('q') || '')
  const debounced = useDebounce(input, 350)

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setSearchParams(debounced ? { q: debounced } : {}, { replace: true })
    if (!debounced.trim()) {
      setResults(null)
      return
    }
    let active = true
    setLoading(true)
    setError(null)
    searchAll(debounced)
      .then((data) => active && setResults(data))
      .catch(() => active && setError('검색 결과를 불러오지 못했습니다.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const total = results ? results.songs.length + results.artists.length + results.albums.length + results.posts.length : 0

  return (
    <div className="animate-fade-in px-4 md:px-8 py-6 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">검색</h1>
        <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 focus-within:border-[var(--color-brand-violet)] transition-colors max-w-xl">
          <SearchIcon size={18} className="text-[var(--color-text-dim)]" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="곡, 아티스트, 앨범, 게시글 검색"
            className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none"
          />
        </div>
      </div>

      {error && <ErrorState message={error} />}

      {!error && loading && <CardRowSkeleton count={6} />}

      {!error && !loading && !debounced.trim() && (
        <EmptyState icon="🔍" title="검색어를 입력해보세요." description="좋아하는 곡, 아티스트, 게시글을 찾아보세요." />
      )}

      {!error && !loading && debounced.trim() && total === 0 && (
        <EmptyState icon="😢" title="검색 결과가 없습니다." description={`'${debounced}'에 대한 결과를 찾을 수 없어요.`} />
      )}

      {!error && !loading && results && total > 0 && (
        <div className="flex flex-col gap-10">
          {results.songs.length > 0 && (
            <section>
              <SectionHeader title="Songs" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.songs.map((song) => <SongCard key={song.id} song={song} queue={results.songs} />)}
              </div>
            </section>
          )}
          {results.artists.length > 0 && (
            <section>
              <SectionHeader title="Artists" />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {results.artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
              </div>
            </section>
          )}
          {results.albums.length > 0 && (
            <section>
              <SectionHeader title="Albums" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.albums.map((album) => <AlbumCard key={album.id} album={album} />)}
              </div>
            </section>
          )}
          {results.posts.length > 0 && (
            <section>
              <SectionHeader title="Community Posts" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.posts.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
