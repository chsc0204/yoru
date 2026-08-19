import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '../store/useAuthStore'
import { createPost } from '../services/posts'
import { toast } from '../store/useToastStore'
import PostForm from '../components/community/PostForm'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'

export default function WritePost() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading: authLoading } = useAuthStore(useShallow((s) => ({ user: s.user, loading: s.loading })))

  if (!authLoading && !user) {
    return (
      <div className="px-4 md:px-8 py-10">
        <EmptyState
          icon="🔒"
          title="로그인이 필요합니다."
          description="게시글을 작성하려면 먼저 로그인해주세요."
          action={<Button as={Link} to="/login?redirect=/write" size="sm">로그인하러 가기</Button>}
        />
      </div>
    )
  }

  async function handleCreate(payload) {
    try {
      const post = await createPost({ userId: user.id, ...payload })
      toast.success('게시글이 등록되었습니다.')
      navigate(`/post/${post.id}`)
    } catch (err) {
      console.error(err)
      toast.error('게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 md:px-0 py-8">
      <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
      <PostForm
        initial={{ category: searchParams.get('category') || 'recommendation' }}
        onSubmit={handleCreate}
        submitLabel="작성하기"
        submittingLabel="등록 중..."
      />
    </div>
  )
}
