import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPostById, updatePost } from '../services/posts'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from '../store/useToastStore'
import PostForm from '../components/community/PostForm'
import ErrorState from '../components/common/ErrorState'
import { Skeleton } from '../components/common/Skeleton'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    getPostById(id)
      .then((data) => {
        if (!active) return
        if (!data) {
          setError('게시글을 찾을 수 없습니다.')
        } else if (user && data.user_id !== user.id) {
          setError('수정 권한이 없습니다.')
        } else {
          setPost(data)
        }
      })
      .catch(() => active && setError('게시글을 불러오지 못했습니다.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, user])

  async function handleUpdate(payload) {
    try {
      await updatePost(id, payload)
      toast.success('게시글이 수정되었습니다.')
      navigate(`/post/${id}`)
    } catch (err) {
      console.error(err)
      toast.error('게시글 수정에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 md:px-0 py-8 flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error) return <ErrorState message={error} />

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 md:px-0 py-8">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <PostForm
        initial={{ category: post.category, title: post.title, content: post.content, song: post.song }}
        onSubmit={handleUpdate}
        submitLabel="수정하기"
        submittingLabel="수정 중..."
      />
    </div>
  )
}
