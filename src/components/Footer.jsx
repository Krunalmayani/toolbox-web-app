import { LayoutGrid } from 'lucide-react'
import { FOOTER_GROUPS } from '../data/tools'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-subtle">
      <div className="gutter">
        <div className="shell pb-10 pt-14 lg:pt-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <div className="max-w-[320px]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-ink text-canvas">
                  <LayoutGrid size={16} strokeWidth={2} />
                </span>
                <span className="t-h3 text-ink">ToolBox</span>
              </div>
              <p className="t-body-sm mt-3 text-ink-2">
                120+ browser-based utilities for developers, writers and designers. No accounts,
                no uploads.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16">
              {FOOTER_GROUPS.map((group) => (
                <div key={group.heading} className="flex flex-col gap-3">
                  <p className="t-label-sm text-ink">{group.heading}</p>
                  {group.links.map((link) => (
                    <a
                      key={link}
                      href="#top"
                      className="t-body-sm text-ink-2 transition-colors hover:text-ink"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <hr className="mt-10 border-line" />

          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="t-body-sm text-ink-3">
              © {new Date().getFullYear()} ToolBox. All tools run locally in your browser.
            </p>
            <div className="flex items-center gap-5">
              {['GitHub', 'X', 'Discord'].map((item) => (
                <a
                  key={item}
                  href="#top"
                  className="t-body-sm text-ink-3 transition-colors hover:text-ink"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
