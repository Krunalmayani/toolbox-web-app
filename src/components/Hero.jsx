import { Search, Sparkles } from 'lucide-react'
import Button from './ui/Button'
import { POPULAR_SEARCHES } from '../data/tools'

export default function Hero({ query, onQuery, onSubmit }) {
  return (
    <section className="border-b border-line bg-subtle">
      <div className="gutter">
        <div className="shell flex flex-col items-center py-14 text-center sm:py-20 lg:py-[88px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 t-label-sm text-accent">
            <Sparkles size={14} strokeWidth={2} />
            120+ free tools · No sign-up required
          </span>

          <h1 className="t-display mt-5 max-w-[880px] text-balance text-ink">
            All Your Tools in One Place
          </h1>

          <p className="t-body-lg mt-5 max-w-[640px] text-pretty text-ink-2">
            Formatters, converters, generators and image utilities — fast, private, and free.
            Everything runs right in your browser.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit?.()
            }}
            className="mt-6 flex w-full max-w-[760px] items-center gap-2 rounded-xl border border-line bg-surface p-2 shadow-md sm:gap-3 sm:pl-5"
          >
            <Search size={20} className="ml-3 shrink-0 text-ink-3 sm:ml-0" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search for a tool"
              aria-label="Search for a tool"
              className="min-w-0 flex-1 bg-transparent py-3 t-body-lg text-ink placeholder:text-ink-3 focus:outline-none"
            />
            {/* A wrapper handles the responsive swap: a `hidden` utility passed
                straight to Button loses to its own `inline-flex` base class. */}
            <span className="hidden sm:block">
              <Button type="submit" size="lg">
                Search
              </Button>
            </span>
            <span className="block sm:hidden">
              <Button type="submit" size="md" aria-label="Search">
                <Search size={16} />
              </Button>
            </span>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="t-label-sm text-ink-3">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onQuery(term)}
                className="rounded-full border border-line bg-surface px-3 py-1.5 t-label-sm text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
