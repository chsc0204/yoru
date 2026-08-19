import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-6xl">🎧</p>
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다.</h1>
      <p className="text-sm text-[var(--color-text-muted)]">주소를 다시 확인하거나 홈으로 돌아가세요.</p>
      <Button as={Link} to="/" size="md">홈으로 가기</Button>
    </div>
  )
}
