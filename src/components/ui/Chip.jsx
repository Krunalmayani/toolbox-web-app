import { cn } from '../../lib/utils'

/** Pill used for hero popular-searches and in-modal option toggles. */
export default function Chip({ active = false, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-[13px] leading-[18px] font-medium transition-colors duration-150',
        active
          ? 'bg-ink text-canvas'
          : 'border border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
        className,
      )}
      {...props}
    />
  )
}
