import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { getArtistById } from '../services/artists'
import { getSongsByArtist } from '../services/songs'
import { getAlbumsByArtist } from '../services/albums'
import { getPostsByArtist } from '../services/posts'
import SectionHeader from '../components/common/SectionHeader'
import SongCard from '../components/music/SongCard'
import AlbumCard from '../components/music/AlbumCard'
import PostCard from '../components/community/PostCard'
import ErrorState from '../components/common/ErrorState'
import { Skeleton, CardRowSkeleton } from '../components/common/Skeleton'

export default function ArtistDetail() {
  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [artistData, songsData, albumsData, postsData] = await Promise.all([
        getArtistById(id),
        getSongsByArtist(id, 20),
        getAlbumsByArtist(id),
        getPostsByArtist(id, 6).catch(() => []),
      ])
      if (!artistData) {
        setError('아티스트를 찾을 수 없습니다.')
      } else {
        setArtist(artistData)
        setSongs(songsData)
        setAlbums(albumsData)
        setPosts(postsData)
      }
    } catch (err) {
      console.error(err)
      setError('아티스트 정보를 불러오지 못했습니다.')
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
      <div className="px-4 md:px-8 py-8 flex flex-col gap-6">
        <div className="flex items-center gap-5">
          <Skeleton className="h-28 w-28 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <CardRowSkeleton count={6} />
      </div>
    )
  }

  if (error || !artist) return <ErrorState message={error} />

  const topSongs = [...songs].sort((a, b) => b.popularity - a.popularity).slice(0, 5)
  const latestSongs = [...songs].sort((a, b) => new Date(b.release_date) - new Date(a.release_date))

  return (
    <div className="animate-fade-in px-4 md:px-8 py-8 flex flex-col gap-12">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
        <img src={artist.image_url} alt={artist.name} className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover ring-1 ring-[var(--color-border)]" />
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] mb-1">Artist</p>
          <h1 className="text-2xl md:text-4xl font-extrabold">{artist.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">{artist.description}</p>
          <p className="mt-2 flex items-center justify-center sm:justify-start gap-1.5 text-sm text-[var(--color-accent)]">
            <Flame size={14} /> 인기도 {artist.popularity}
          </p>
        </div>
      </div>

      <section>
        <SectionHeader title="인기곡 TOP 5" />
        {topSongs.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">등록된 곡이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topSongs.map((song) => <SongCard key={song.id} song={song} queue={topSongs} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="최신곡" />
        {latestSongs.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">등록된 곡이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {latestSongs.map((song) => <SongCard key={song.id} song={song} queue={latestSongs} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="앨범" />
        {albums.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">등록된 앨범이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.map((album) => <AlbumCard key={album.id} album={album} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="관련 커뮤니티 게시글" />
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">아직 이 아티스트에 대한 게시글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </div>
  )
}
