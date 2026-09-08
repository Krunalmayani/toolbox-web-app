import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn, copyText } from '../../lib/utils'

export function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="t-label-sm text-ink">{children}</span>
      {hint ? <span className="t-label-xs text-ink-3">{hint}</span> : null}
    </div>
  )
}

/** Bordered textarea styled like the Figma modal input block. */
export function TextArea({ className, rows = 6, mono = true, ...props }) {
  return (
    <textarea
      rows={rows}
      spellCheck={false}
      className={cn(
        'w-full resize-y rounded-md border border-line bg-subtle px-3.5 py-3 text-[13px] leading-5 text-ink',
        'placeholder:text-ink-3 focus:border-accent focus:outline-none',
        mono && 'mono',
        className,
      )}
      {...props}
    />
  )
}

export function TextInput({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-line bg-subtle px-3.5 py-2.5 text-[13px] leading-5 text-ink',
        'placeholder:text-ink-3 focus:border-accent focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        'rounded-md border border-line bg-surface px-3 py-2 text-[13px] leading-5 font-medium text-ink',
        'focus:border-accent focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}

export function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label ? <FieldLabel hint={hint}>{label}</FieldLabel> : null}
      {children}
    </div>
  )
}

/** Copy-to-clipboard control with a transient confirmation state. */
export function CopyButton({ value, label = 'Copy', className, disabled }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled || !value}
      onClick={async () => {
        if (await copyText(value)) {
          setDone(true)
          setTimeout(() => setDone(false), 1400)
        }
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5',
        't-label-xs text-ink-2 transition-colors hover:border-line-strong hover:text-ink',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
    >
      {done ? <Check size={13} className="text-fg-emerald" /> : <Copy size={13} />}
      {done ? 'Copied' : label}
    </button>
  )
}

/** Neutral status line used across tool panels for errors and confirmations. */
export function Note({ tone = 'muted', children }) {
  const tones = {
    muted: 'text-ink-3',
    error: 'text-fg-rose',
    success: 'text-fg-emerald',
  }
  return <p className={cn('t-body-sm', tones[tone])}>{children}</p>
}
