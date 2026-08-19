export const CATEGORIES = [
  { value: 'recommendation', label: '음악 추천', emoji: '🎵' },
  { value: 'question', label: '질문', emoji: '❓' },
  { value: 'artist', label: '아티스트 추천', emoji: '🎤' },
  { value: 'album', label: '앨범 추천', emoji: '💿' },
  { value: 'playlist', label: '플레이리스트 추천', emoji: '📻' },
  { value: 'free', label: '자유 이야기', emoji: '💬' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]))

export function categoryLabel(value) {
  return CATEGORY_MAP[value]?.label ?? value
}

export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'answers', label: '답변 많은 순' },
]

export const LIKE_TARGET = {
  POST: 'post',
  ANSWER: 'answer',
  SONG: 'song',
}
