import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { signUp } from '../services/auth'
import { toast } from '../store/useToastStore'
import Button from '../components/common/Button'

export default function Signup() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await signUp({ email, password, nickname })
      toast.success('회원가입이 완료되었습니다.')
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message?.includes('already') ? '이미 가입된 이메일입니다.' : '회원가입에 실패했습니다.')
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
        <h1 className="text-xl font-bold">J-MUSE 회원가입</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="nickname" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">닉네임</label>
          <input
            id="nickname"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="j_pop_lover"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--color-brand-violet)] transition-colors"
          />
        </div>
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
            placeholder="6자 이상"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--color-brand-violet)] transition-colors"
          />
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <Button type="submit" disabled={loading} size="lg" className="mt-2 w-full">
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-[var(--color-accent)] hover:underline">로그인</Link>
      </p>
    </div>
  )
}
