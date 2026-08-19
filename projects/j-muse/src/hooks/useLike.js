import { useCallback, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { toggleLike } from '../services/likes'
import { toast } from '../store/useToastStore'

const MESSAGES = {
  post: { on: '좋아요에 추가했습니다.', off: '좋아요를 취소했습니다.' },
  answer: { on: '좋아요에 추가했습니다.', off: '좋아요를 취소했습니다.' },
  song: { on: '좋아요에 추가했습니다.', off: '좋아요를 취소했습니다.' },
}

export function useLike(targetType, targetId, initialLiked = false, initialCount = 0) {
  const user = useAuthStore((s) => s.user)
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [busy, setBusy] = useState(false)

  const toggle = useCallback(async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }
    if (busy) return
    setBusy(true)

    const prevLiked = liked
    const prevCount = count
    setLiked(!prevLiked)
    setCount(prevLiked ? prevCount - 1 : prevCount + 1)

    try {
      const { liked: nowLiked } = await toggleLike(user.id, targetType, targetId)
      setLiked(nowLiked)
      toast.success(MESSAGES[targetType]?.[nowLiked ? 'on' : 'off'] ?? '완료되었습니다.')
    } catch (err) {
      console.error(err)
      setLiked(prevLiked)
      setCount(prevCount)
      toast.error('요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setBusy(false)
    }
  }, [user, busy, liked, count, targetType, targetId])

  return { liked, count, toggle, busy, setLiked, setCount }
}
