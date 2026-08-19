import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatters'

export default function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} className="group flex flex-col gap-3 card-hover">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-surface-2)] shadow-lg shadow-black/20">
        <img
          src={album.artwork_url}
          alt={album.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--color-text)]">{album.title}</p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">{album.artist?.name}</p>
        <p className="text-xs text-[var(--color-text-dim)]">{formatDate(album.release_date)}</p>
      </div>
    </Link>
  )
}
