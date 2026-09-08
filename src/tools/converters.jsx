import { useMemo, useState } from 'react'
import { CopyButton, Field, Note, TextArea, TextInput } from '../components/ui/Field'
import Chip from '../components/ui/Chip'
import { hexToRgb, isLight, rgbToHex, rgbToHsl } from '../lib/color'

export function Base64Encoder() {
  const [input, setInput] = useState('hello toolbox')
  const [mode, setMode] = useState('encode')

  const { output, error } = useMemo(() => {
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input)
        return { output: btoa(String.fromCharCode(...bytes)), error: '' }
      }
      const binary = atob(input.trim())
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      return { output: new TextDecoder().decode(bytes), error: '' }
    } catch {
      return { output: '', error: 'That input is not valid Base64.' }
    }
  }, [input, mode])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Chip active={mode === 'encode'} onClick={() => setMode('encode')}>
          Encode
        </Chip>
        <Chip active={mode === 'decode'} onClick={() => setMode('decode')}>
          Decode
        </Chip>
      </div>
      <Field label={mode === 'encode' ? 'Plain text' : 'Base64'}>
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={5} />
      </Field>
      <Field label={mode === 'encode' ? 'Base64' : 'Plain text'} hint={`${output.length} characters`}>
        <TextArea readOnly value={output} rows={5} />
      </Field>
      {error ? <Note tone="error">{error}</Note> : null}
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

export function ColorPicker() {
  const [hex, setHex] = useState('#2563eb')
  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const formats = rgb
    ? [
        ['HEX', rgbToHex(rgb.r, rgb.g, rgb.b)],
        ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
        ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
        ['CSS variable', `--brand: ${rgbToHex(rgb.r, rgb.g, rgb.b)};`],
      ]
    : []

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex h-32 items-end justify-between rounded-md border border-line p-4"
        style={{ backgroundColor: rgb ? hex : 'transparent' }}
      >
        <span
          className="t-label-sm"
          style={{ color: rgb && isLight(rgb) ? '#0f1115' : '#ffffff' }}
        >
          {rgb ? hex.toUpperCase() : 'Invalid colour'}
        </span>
      </div>

      <Field label="Colour">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : '#000000'}
            onChange={(e) => setHex(e.target.value)}
            className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-line bg-surface"
          />
          <TextInput value={hex} onChange={(e) => setHex(e.target.value)} className="mono" />
        </div>
      </Field>

      {rgb ? (
        <div className="flex flex-col gap-2">
          {formats.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-md border border-line bg-subtle px-3.5 py-2.5"
            >
              <span className="t-label-xs w-24 shrink-0 text-ink-3">{label}</span>
              <span className="mono flex-1 truncate text-[13px] text-ink">{value}</span>
              <CopyButton value={value} label="Copy" />
            </div>
          ))}
        </div>
      ) : (
        <Note tone="error">Enter a valid 3 or 6 digit hex value.</Note>
      )}
    </div>
  )
}
