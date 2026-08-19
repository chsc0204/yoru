import { NavLink } from 'react-router-dom'
import { Home, Users, Disc3, Search, Library } from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: Home, end: true },
  { to: '/community', label: '커뮤니티', icon: Users },
  { to: '/music', label: '음악', icon: Disc3 },
  { to: '/search', label: '검색', icon: Search },
  { to: '/library', label: '라이브러리', icon: Library },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 backdrop-blur">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium',
              isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
