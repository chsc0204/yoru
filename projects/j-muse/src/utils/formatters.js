export function timeAgo(dateString) {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return '방금 전'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}주 전`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}개월 전`
  const years = Math.floor(days / 365)
  return `${years}년 전`
}

export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatCount(count) {
  const n = Number(count) || 0
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatDuration(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function truncate(text, length = 120) {
  if (!text) return ''
  return text.length > length ? `${text.slice(0, length)}...` : text
}
