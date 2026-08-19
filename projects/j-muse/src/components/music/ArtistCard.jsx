import { Link } from 'react-router-dom'

export default function ArtistCard({ artist }) {
  return (
    <Link to={`/artist/${artist.id}`} className="group flex flex-col items-center gap-3 text-center card-hover">
      <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-[var(--color-surface-2)] ring-1 ring-[var(--color-border)]">
        <img
          src={artist.image_url}
          alt={artist.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">{artist.name}</p>
        <p className="text-xs text-[var(--color-text-dim)]">아티스트</p>
      </div>
    </Link>
  )
}
