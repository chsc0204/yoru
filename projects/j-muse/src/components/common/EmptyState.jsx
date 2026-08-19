export default function EmptyState({ icon = '🎧', title = '표시할 내용이 없습니다.', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6">
      <div className="text-4xl">{icon}</div>
      <p className="text-[var(--color-text)] font-medium">{title}</p>
      {description && <p className="text-sm text-[var(--color-text-muted)] max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
