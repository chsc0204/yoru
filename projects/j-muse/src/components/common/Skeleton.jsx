export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

export function SongCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-3 mt-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="w-32 h-32 md:w-36 md:h-36 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

export function CardRowSkeleton({ count = 6, Card = SongCardSkeleton }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  )
}
