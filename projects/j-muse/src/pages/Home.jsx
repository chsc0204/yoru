import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, MessageCircleHeart } from 'lucide-react'
import { getPopularSongs, getLatestSongs } from '../services/songs'
import { getPopularArtists } from '../services/artists'
import { getPosts } from '../services/posts'
import SectionHeader from '../components/common/SectionHeader'
import ScrollRow from '../components/common/ScrollRow'
import SongCard from '../components/music/SongCard'
import ArtistCard from '../components/music/ArtistCard'
import PostCard from '../components/community/PostCard'
import { CardRowSkeleton, ArtistCardSkeleton, PostCardSkeleton } from '../components/common/Skeleton'
import ErrorState from '../components/common/ErrorState'
import Button from '../components/common/Button'

export default function Home() {
  const [state, setState] = useState({ loading: true, error: null })
  const [trending, setTrending] = useState([])
  const [latest, setLatest] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [popularPosts, setPopularPosts] = useState([])
  const [artists, setArtists] = useState([])

  async function load() {
    setState({ loading: true, error: null })
    try {
      const [trendingSongs, latestSongs, recentPosts, likedPosts, popularArtists] = await Promise.all([
        getPopularSongs(12),
        getLatestSongs(12),
        getPosts({ sort: 'latest', limit: 6 }),
        getPosts({ sort: 'popular', limit: 6 }),
        getPopularArtists(10),
      ])
      setTrending(trendingSongs)
      setLatest(latestSongs)
      setDiscussions(recentPosts)
      setPopularPosts(likedPosts)
      setArtists(popularArtists)
      setState({ loading: false, error: null })
    } catch (err) {
      console.error(err)
      setState({ loading: false, error: '홈 데이터를 불러오지 못했습니다.' })
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (state.error) return <ErrorState message={state.error} onRetry={load} />

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-14 md:px-8 md:py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--color-brand-violet)]/25 blur-[110px]" />
          <div className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-blue)]/20 blur-[100px]" />
        </div>

        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] text-[var(--color-accent)] uppercase mb-4">J-MUSE</p>
        <h1 className="mx-auto max-w-3xl text-3xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="brand-gradient-text">Discover the sound</span>
          <br className="hidden md:block" /> of Japan.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm md:text-lg text-[var(--color-text-muted)]">
          좋은 음악을 발견하고, 사람들과 이야기하세요.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as={Link} to="/music" size="lg">
            <Compass size={18} /> 음악 탐색
          </Button>
          <Button as={Link} to="/write?category=question" variant="secondary" size="lg">
            <MessageCircleHeart size={18} /> 추천 받기
          </Button>
        </div>
      </section>

      <div className="flex flex-col gap-12 px-4 md:px-8 pb-16">
        {/* Trending */}
        <section>
          <SectionHeader title="🔥 Trending J-POP" viewAllHref="/music" />
          {state.loading ? (
            <CardRowSkeleton count={6} />
          ) : (
            <ScrollRow>{trending.map((song) => <SongCard key={song.id} song={song} queue={trending} />)}</ScrollRow>
          )}
        </section>

        {/* Latest */}
        <section>
          <SectionHeader title="🆕 Latest Releases" viewAllHref="/music" />
          {state.loading ? (
            <CardRowSkeleton count={6} />
          ) : (
            <ScrollRow>{latest.map((song) => <SongCard key={song.id} song={song} queue={latest} />)}</ScrollRow>
          )}
        </section>

        {/* Recent discussions */}
        <section>
          <SectionHeader title="💬 Recent Discussions" viewAllHref="/community" />
          {state.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : discussions.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">아직 게시글이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discussions.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </section>

        {/* Popular recommendations */}
        <section>
          <SectionHeader title="❤️ Popular Recommendations" viewAllHref="/community?sort=popular" />
          {state.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : popularPosts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">아직 인기 게시글이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularPosts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </section>

        {/* Popular artists */}
        <section>
          <SectionHeader title="🎤 Popular Artists" viewAllHref="/music" />
          {state.loading ? (
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
              {Array.from({ length: 6 }).map((_, i) => <ArtistCardSkeleton key={i} />)}
            </div>
          ) : (
            <ScrollRow itemClassName="w-[30%] sm:w-[22%] md:w-[16%] lg:w-[12%]">
              {artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
            </ScrollRow>
          )}
        </section>
      </div>
    </div>
  )
}
