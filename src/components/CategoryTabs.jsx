import { CATEGORIES } from '../data/tools'
import { cn } from '../lib/utils'

export default function CategoryTabs({ value, onChange }) {
  return (
    <div className="sticky top-[72px] z-30 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="gutter">
        {/* Horizontal scroll keeps all seven tabs reachable on narrow screens. */}
        <div className="shell -mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 py-4 sm:py-5 lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => {
            const active = value === category
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(category)}
                className={cn(
                  'h-[38px] shrink-0 snap-start rounded-full px-[18px] t-label-sm transition-colors duration-150',
                  active
                    ? 'bg-ink text-canvas'
                    : 'border border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
                )}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
