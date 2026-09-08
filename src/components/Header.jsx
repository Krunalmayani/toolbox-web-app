import { useEffect, useState } from 'react'
import { LayoutGrid, Menu, Moon, Search, Sun, X } from 'lucide-react'
import Button from './ui/Button'
import { NAV_LINKS } from '../data/tools'
import { cn } from '../lib/utils'

function Logo({ size = 'md' }) {
  const box = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
  return (
    <a href="#top" className="flex shrink-0 items-center gap-2.5">
      <span className={cn('flex items-center justify-center rounded-sm bg-ink text-canvas', box)}>
        <LayoutGrid size={size === 'sm' ? 16 : 18} strokeWidth={2} />
      </span>
      <span className="text-[20px] leading-6 font-bold tracking-[-0.02em] text-ink">ToolBox</span>
    </a>
  )
}

export default function Header({ query, onQuery, onCategory, dark, onToggleDark }) {
  const [open, setOpen] = useState(false)

  // Close the mobile sheet when the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="gutter">
        <div className="shell flex h-[72px] items-center gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => onCategory(link.category)}
                className="rounded-md px-2.5 py-2 t-label-sm text-ink-2 transition-colors hover:bg-subtle hover:text-ink"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <label className="relative hidden md:block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
              />
              <input
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="Search tools"
                aria-label="Search tools"
                className="h-[38px] w-[180px] rounded-md border border-line bg-subtle pl-9 pr-3 t-body-sm text-ink placeholder:text-ink-3 transition-[width,border-color] focus:w-[240px] focus:border-accent focus:outline-none lg:w-[220px]"
              />
            </label>

            <button
              type="button"
              onClick={onToggleDark}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-line bg-surface text-ink transition-colors hover:bg-subtle"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <span className="hidden sm:block">
              <Button>Get Started</Button>
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-line bg-surface text-ink lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-surface lg:hidden">
          <div className="gutter">
            <div className="shell flex flex-col gap-3 py-4">
              <label className="relative md:hidden">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
                />
                <input
                  value={query}
                  onChange={(e) => onQuery(e.target.value)}
                  placeholder="Search tools"
                  aria-label="Search tools"
                  className="h-11 w-full rounded-md border border-line bg-subtle pl-9 pr-3 t-body-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      onCategory(link.category)
                      setOpen(false)
                    }}
                    className="rounded-md px-3 py-2.5 text-left t-label-sm text-ink-2 transition-colors hover:bg-subtle hover:text-ink"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <span className="block sm:hidden">
                <Button className="w-full">Get Started</Button>
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
