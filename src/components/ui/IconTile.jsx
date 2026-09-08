import { ICONS } from './icons'
import { cn } from '../../lib/utils'

/** Mirrors the Figma `IconTile` component set: 6 colour variants + icon swap. */
const TINTS = {
  blue: 'bg-tint-blue text-fg-blue',
  violet: 'bg-tint-violet text-fg-violet',
  emerald: 'bg-tint-emerald text-fg-emerald',
  amber: 'bg-tint-amber text-fg-amber',
  rose: 'bg-tint-rose text-fg-rose',
  cyan: 'bg-tint-cyan text-fg-cyan',
}

const SIZES = {
  md: { box: 'h-11 w-11 rounded-md', icon: 20 },
  lg: { box: 'h-12 w-12 rounded-lg', icon: 22 },
}

export default function IconTile({ icon, color = 'blue', size = 'md', className }) {
  const Icon = ICONS[icon] ?? ICONS.Wrench
  const s = SIZES[size]
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', TINTS[color], s.box, className)}
      aria-hidden="true"
    >
      <Icon size={s.icon} strokeWidth={2} />
    </span>
  )
}
