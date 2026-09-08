import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Button from './ui/Button'
import IconTile from './ui/IconTile'
import useLockBodyScroll from '../hooks/useLockBodyScroll'
import { TOOLS } from '../data/tools'
import { getToolComponent } from '../tools'

const ActionsContext = createContext(() => {})

/**
 * Lets a tool panel publish its primary/secondary buttons into the modal
 * footer, so the footer bar from the Figma design stays a single element
 * instead of being re-implemented by every tool.
 */
export function useToolActions(actions, deps = []) {
  const setActions = useContext(ActionsContext)
  useEffect(() => {
    setActions(actions)
    return () => setActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default function ToolModal({ toolId, onClose }) {
  const tool = toolId ? TOOLS[toolId] : null
  const [actions, setActions] = useState(null)
  const panelRef = useRef(null)

  useLockBodyScroll(Boolean(toolId))

  useEffect(() => {
    if (!toolId) return
    setActions(null)
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toolId, onClose])

  if (!tool) return null

  const Tool = getToolComponent(toolId)

  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[#0f1115]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
        tabIndex={-1}
        className="anim-pop flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-xl border border-line bg-surface shadow-xl outline-none sm:max-h-[88vh] sm:max-w-[680px] sm:rounded-xl"
      >
        <header className="flex shrink-0 items-center gap-3.5 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <IconTile icon={tool.icon} color={tool.color} />
          <div className="min-w-0 flex-1">
            <h2 id="tool-modal-title" className="t-h3 truncate text-ink">
              {tool.name}
            </h2>
            <p className="t-body-sm mt-0.5 text-ink-2">{tool.desc}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tool"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-subtle text-ink-2 transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <ActionsContext.Provider value={setActions}>
            <Tool key={toolId} tool={tool} onClose={onClose} />
          </ActionsContext.Provider>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-line bg-subtle px-5 py-4 sm:px-6">
          <p className="t-body-sm hidden flex-1 text-ink-3 sm:block">
            Runs entirely on your device — nothing is uploaded.
          </p>
          <div className="flex flex-1 items-center justify-end gap-3 sm:flex-none">
            {actions?.secondary ? (
              <Button variant="ghost" onClick={actions.secondary.onClick}>
                {actions.secondary.label}
              </Button>
            ) : null}
            {actions?.primary ? (
              <Button onClick={actions.primary.onClick} disabled={actions.primary.disabled}>
                {actions.primary.label}
              </Button>
            ) : (
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
