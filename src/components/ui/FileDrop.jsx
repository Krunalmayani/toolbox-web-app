import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn, formatBytes } from '../../lib/utils'

/** Shared drop zone for every image tool. */
export default function FileDrop({ accept = 'image/*', file, onFile, hint = 'PNG, JPG, WebP or GIF' }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

  const pick = (list) => {
    const next = list?.[0]
    if (next) onFile(next)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        pick(e.dataTransfer.files)
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-8 text-center transition-colors',
        over ? 'border-accent bg-accent-soft' : 'border-line-strong bg-subtle',
      )}
    >
      <Upload size={20} className="text-ink-3" />
      <p className="t-body-sm text-ink">
        {file ? file.name : 'Drop an image here'}
        {file ? <span className="text-ink-3"> · {formatBytes(file.size)}</span> : null}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="t-label-sm text-accent hover:underline"
      >
        {file ? 'Choose a different file' : 'or browse your files'}
      </button>
      <p className="t-label-xs text-ink-3">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
    </div>
  )
}
