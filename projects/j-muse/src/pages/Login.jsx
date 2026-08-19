import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { signIn } from '../services/auth'
import { toast } from '../store/useToastStore'
import Button from '../components/common/Button'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn({ email, password })
      toast.success('로그인되었습니다.')
      navigate(searchParams.get('redirect') || '/')
    } catch (err) {
      console.error(err)
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient-bg">
          <Sparkles size={22} className="text-white" />
        </div>
        <h1 className="text-xl font-bold">J-MUSE에 로그인</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">이메일</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--color-brand-violet)] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">비밀번호</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--color-brand-violet)] transition-colors"
          />
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <Button type="submit" disabled={loading} size="lg" className="mt-2 w-full">
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        아직 계정이 없으신가요?{' '}
        <Link to="/signup" className="font-medium text-[var(--color-accent)] hover:underline">회원가입</Link>
      </p>
    </div>
  )
}
