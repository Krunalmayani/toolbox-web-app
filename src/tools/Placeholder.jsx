import { Construction } from 'lucide-react'
import { Note } from '../components/ui/Field'

/**
 * Honest placeholder for the two catalogue entries whose engines would need a
 * heavyweight dependency (PDF writing, barcode symbologies). The panel keeps
 * the modal layout from the design rather than pretending to work.
 */
export default function Placeholder({ tool }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-line-strong bg-subtle px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-tint-amber text-fg-amber">
        <Construction size={20} />
      </span>
      <p className="t-h4 text-ink">{tool.name} is not wired up yet</p>
      <p className="t-body-sm max-w-[380px] text-ink-2">{tool.desc}</p>
      <Note>
        The interface is built; the engine needs a dedicated library and is intentionally left out
        to keep the bundle small.
      </Note>
    </div>
  )
}
