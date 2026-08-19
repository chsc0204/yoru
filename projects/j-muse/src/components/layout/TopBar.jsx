import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { Search, LogOut, User, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { signOut } from '../../services/auth'
import { toast } from '../../store/useToastStore'
import Button from '../common/Button'

export default function TopBar() {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore(useShallow((s) => ({ user: s.user, profile: s.profile })))
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('로그아웃되었습니다.')
      setMenuOpen(false)
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error('로그아웃에 실패했습니다.')
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur px-4 py-3 md:px-6">
      <Link to="/" className="flex md:hidden items-center gap-1.5 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient-bg">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-base font-bold brand-gradient-text">J-MUSE</span>
      </Link>

      <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 focus-within:border-[var(--color-brand-violet)] transition-colors">
        <Search size={16} className="text-[var(--color-text-dim)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="곡, 아티스트, 게시글 검색"
          className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none"
        />
      </form>

      <button
        onClick={() => navigate('/search')}
        className="flex md:hidden ml-auto h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)]"
      >
        <Search size={17} />
      </button>

      <div className="ml-auto hidden md:block relative" ref={menuRef}>
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] pl-1 pr-3 py-1 hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <img
                src={profile?.avatar_url || `https://i.pravatar.cc/80?u=${user.id}`}
                alt={profile?.nickname}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-[var(--color-text)]">{profile?.nickname ?? '사용자'}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-1.5 shadow-2xl shadow-black/40">
                <Link
                  to="/library"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                >
                  <User size={15} /> 내 라이브러리
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)]"
                >
                  <LogOut size={15} /> 로그아웃
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button as={Link} to="/login" variant="ghost" size="sm">로그인</Button>
            <Button as={Link} to="/signup" variant="primary" size="sm">회원가입</Button>
          </div>
        )}
      </div>
    </header>
  )
}
