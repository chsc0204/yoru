import clsx from 'clsx'

const VARIANTS = {
  primary: 'brand-gradient-bg text-white hover:opacity-90 shadow-lg shadow-purple-900/30',
  secondary: 'bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]',
  ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
  outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
  danger: 'bg-transparent text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10',
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
