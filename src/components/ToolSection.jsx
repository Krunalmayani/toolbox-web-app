import { ArrowRight } from 'lucide-react'
import ToolGrid from './ToolGrid'
import { cn } from '../lib/utils'

export default function ToolSection({ section, tools, onOpen, onViewAll }) {
  return (
    <section
      id={section.id}
      className={cn('scroll-mt-[124px]', section.tint ? 'border-y border-line bg-subtle' : 'bg-canvas')}
    >
      <div className="gutter">
        <div className="shell py-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="t-h1 text-ink">{section.title}</h2>
              <p className="t-body mt-1 text-ink-2">{section.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1.5 t-label-sm text-accent transition-colors hover:brightness-110"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-7">
            <ToolGrid tools={tools} onOpen={onOpen} />
          </div>
        </div>
      </div>
    </section>
  )
}
