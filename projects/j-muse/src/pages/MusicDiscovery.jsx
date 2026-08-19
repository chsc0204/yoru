import { useEffect, useState } from 'react'
import { getLatestSongs, getPopularSongs } from '../services/songs'
import { getPopularArtists } from '../services/artists'
import { getLatestAlbums } from '../services/albums'
import SectionHeader from '../components/common/SectionHeader'
import SongCard from '../components/music/SongCard'
import ArtistCard from '../components/music/ArtistCard'
import AlbumCard from '../components/music/AlbumCard'
import { CardRowSkeleton, ArtistCardSkeleton } from '../components/common/Skeleton'
import ErrorState from '../components/common/ErrorState'

export default function MusicDiscovery() {
  const [data, setData] = useState({ latest: [], popular: [], artists: [], albums: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [latest, popular, artists, albums] = await Promise.all([
        getLatestSongs(18),
        getPopularSongs(18),
        getPopularArtists(12),
        getLatestAlbums(12),
      ])
      setData({ latest, popular, artists, albums })
    } catch (err) {
      console.error(err)
      setError('음악 정보를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="animate-fade-in px-4 md:px-8 py-6 flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-bold">음악 탐색</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">최신 발매곡부터 인기 아티스트까지, J-POP을 탐색해보세요.</p>
      </div>

      <section>
        <SectionHeader title="최신 발매" />
        {loading ? (
          <CardRowSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.latest.map((song) => <SongCard key={song.id} song={song} queue={data.latest} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="인기곡" />
        {loading ? (
          <CardRowSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.popular.map((song) => <SongCard key={song.id} song={song} queue={data.popular} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="인기 아티스트" />
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ArtistCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {data.artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="인기 앨범" />
        {loading ? (
          <CardRowSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.albums.map((album) => <AlbumCard key={album.id} album={album} />)}
          </div>
        )}
      </section>
    </div>
  )
}
