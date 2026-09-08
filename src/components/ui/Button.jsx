import { cn } from '../../lib/utils'

/** Mirrors the Figma `Button` component set: Variant × Size. */
const VARIANTS = {
  primary: 'bg-accent text-on-accent hover:brightness-110 active:brightness-95 shadow-xs',
  secondary:
    'bg-surface text-ink border border-line hover:border-line-strong hover:bg-subtle active:bg-subtle',
  ghost: 'bg-transparent text-ink-2 hover:bg-subtle hover:text-ink',
  danger: 'bg-fg-rose text-white hover:brightness-110',
}

const SIZES = {
  sm: 'h-9 px-3 text-[13px] leading-[18px] font-medium rounded-md gap-1.5',
  md: 'h-10 px-4 text-[13px] leading-[18px] font-medium rounded-md gap-2',
  lg: 'h-12 px-[22px] text-[15px] leading-5 font-medium rounded-md gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  as: Tag = 'button',
  ...props
}) {
  return (
    <Tag
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-[background-color,border-color,color,filter,box-shadow] duration-150',
        'disabled:cursor-not-allowed disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
