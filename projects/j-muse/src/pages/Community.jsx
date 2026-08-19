import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getPosts } from '../services/posts'
import CategoryTabs from '../components/community/CategoryTabs'
import SortTabs from '../components/community/SortTabs'
import PostCard from '../components/community/PostCard'
import { PostCardSkeleton } from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Button from '../components/common/Button'

const PAGE_SIZE = 9

export default function Community() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'latest'

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getPosts({ category, sort, limit: PAGE_SIZE, offset: 0 })
      setPosts(data)
      setHasMore(data.length === PAGE_SIZE)
      setPage(0)
    } catch (err) {
      console.error(err)
      setError('게시글을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort])

  async function loadMore() {
    const nextPage = page + 1
    try {
      const data = await getPosts({ category, sort, limit: PAGE_SIZE, offset: nextPage * PAGE_SIZE })
      setPosts((prev) => [...prev, ...data])
      setHasMore(data.length === PAGE_SIZE)
      setPage(nextPage)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="animate-fade-in px-4 md:px-8 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">커뮤니티</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">J-POP에 대한 추천과 질문을 나눠보세요.</p>
      </div>

      <CategoryTabs value={category} onChange={(v) => setSearchParams({ category: v, sort })} />
      <div className="flex items-center justify-between">
        <SortTabs value={sort} onChange={(v) => setSearchParams({ category, sort: v })} />
        <Button as={Link} to="/write" size="sm" className="hidden sm:inline-flex">글쓰기</Button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      )}

      {!error && !loading && posts.length === 0 && (
        <EmptyState
          icon="📝"
          title="아직 게시글이 없습니다."
          description="첫 번째 추천글이나 질문을 작성해보세요."
          action={<Button as={Link} to="/write" size="sm">글쓰기</Button>}
        />
      )}

      {!error && !loading && posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-2">
              <Button variant="secondary" onClick={loadMore}>더 불러오기</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
