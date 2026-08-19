import { NavLink } from 'react-router-dom'
import { Home, Users, Disc3, Library, PenSquare, Sparkles } from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: Home, end: true },
  { to: '/community', label: '커뮤니티', icon: Users },
  { to: '/music', label: '음악 탐색', icon: Disc3 },
  { to: '/library', label: '라이브러리', icon: Library },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] h-screen sticky top-0">
      <div className="px-6 py-6">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient-bg">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight brand-gradient-text">J-MUSE</span>
        </a>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
              )
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-4">
        <NavLink
          to="/write"
          className="flex items-center justify-center gap-2 rounded-xl brand-gradient-bg px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 hover:opacity-90 transition-opacity"
        >
          <PenSquare size={16} />
          글쓰기
        </NavLink>
      </div>

      <div className="mt-auto px-6 py-6 text-xs text-[var(--color-text-dim)]">
        <p>© 2026 J-MUSE</p>
        <p className="mt-0.5">Discover the sound of Japan.</p>
      </div>
    </aside>
  )
}
