import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SectionHeader({ title, viewAllHref }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg md:text-xl font-bold text-[var(--color-text)]">{title}</h2>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="flex items-center gap-0.5 text-xs md:text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          더 보기 <ChevronRight size={14} />
        </Link>
      )}
    </div>
  )
}
