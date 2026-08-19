import { useState } from 'react'
import clsx from 'clsx'
import { CATEGORIES } from '../../utils/constants'
import MusicSearchPicker from '../music/MusicSearchPicker'
import Button from '../common/Button'

export default function PostForm({ initial, submitLabel = '작성하기', submittingLabel = '등록 중...', onSubmit }) {
  const [category, setCategory] = useState(initial?.category || 'recommendation')
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [song, setSong] = useState(initial?.song || null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ category, title: title.trim(), content: content.trim(), musicId: song?.id })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">카테고리</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={clsx(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                category === c.value
                  ? 'brand-gradient-bg text-white'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              )}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">제목</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="제목을 입력하세요"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none focus:border-[var(--color-brand-violet)] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={8000}
          rows={8}
          placeholder="내용을 입력하세요"
          className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none focus:border-[var(--color-brand-violet)] transition-colors"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">음악 선택 (선택)</label>
        <MusicSearchPicker selected={song} onSelect={setSong} />
      </div>

      <Button type="submit" disabled={submitting} size="lg" className="self-end">
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  )
}
