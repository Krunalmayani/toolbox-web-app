import { useEffect, useMemo, useState } from 'react'
import { CopyButton, Field, Note, TextArea, TextInput } from '../components/ui/Field'
import Chip from '../components/ui/Chip'
import Button from '../components/ui/Button'
import { useToolActions } from '../components/ToolModal'
import { download } from '../lib/utils'

const SETS = {
  Lowercase: 'abcdefghijklmnopqrstuvwxyz',
  Uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  Numbers: '0123456789',
  Symbols: '!@#$%^&*()-_=+[]{};:,.?/',
}

/** Rejection sampling over crypto.getRandomValues — avoids modulo bias. */
function randomFrom(alphabet, length) {
  const out = []
  const max = 256 - (256 % alphabet.length)
  const buffer = new Uint8Array(length * 2)
  while (out.length < length) {
    crypto.getRandomValues(buffer)
    for (const byte of buffer) {
      if (byte < max && out.length < length) out.push(alphabet[byte % alphabet.length])
    }
  }
  return out.join('')
}

export function PasswordGenerator() {
  const [length, setLength] = useState(20)
  const [enabled, setEnabled] = useState({
    Lowercase: true,
    Uppercase: true,
    Numbers: true,
    Symbols: true,
  })
  const [password, setPassword] = useState('')

  const alphabet = Object.entries(enabled)
    .filter(([, on]) => on)
    .map(([key]) => SETS[key])
    .join('')

  const generate = () => setPassword(alphabet ? randomFrom(alphabet, length) : '')

  useEffect(generate, [length, alphabet])

  useToolActions({ primary: { label: 'Regenerate', onClick: generate } }, [length, alphabet])

  const bits = alphabet ? Math.round(length * Math.log2(alphabet.length)) : 0
  const strength = bits >= 100 ? 'Very strong' : bits >= 70 ? 'Strong' : bits >= 45 ? 'Fair' : 'Weak'
  const strengthTone =
    bits >= 70 ? 'text-fg-emerald' : bits >= 45 ? 'text-fg-amber' : 'text-fg-rose'

  return (
    <div className="flex flex-col gap-5">
      <Field label="Generated password" hint={`${bits} bits of entropy`}>
        <div className="flex items-center gap-2 rounded-md border border-line bg-subtle px-3.5 py-3">
          <span className="mono flex-1 break-all text-[15px] leading-6 text-ink">
            {password || '—'}
          </span>
          <CopyButton value={password} />
        </div>
      </Field>

      <Field label="Length" hint={`${length} characters`}>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[var(--tb-accent)]"
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        {Object.keys(SETS).map((key) => (
          <Chip
            key={key}
            active={enabled[key]}
            onClick={() => setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))}
          >
            {key}
          </Chip>
        ))}
      </div>

      {alphabet ? (
        <p className={`t-label-sm ${strengthTone}`}>{strength}</p>
      ) : (
        <Note tone="error">Pick at least one character set.</Note>
      )}
    </div>
  )
}

export function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [list, setList] = useState([])

  const generate = () => {
    const n = Math.max(1, Math.min(200, Number(count) || 1))
    setList(Array.from({ length: n }, () => crypto.randomUUID()))
  }

  useEffect(generate, [])
  useToolActions({ primary: { label: 'Generate', onClick: generate } }, [count])

  const text = list.map((id) => (uppercase ? id.toUpperCase() : id)).join('\n')

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
        <Field label="How many">
          <TextInput
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </Field>
        <Field label="Formatting">
          <div className="pt-1">
            <Chip active={uppercase} onClick={() => setUppercase((v) => !v)}>
              Uppercase
            </Chip>
          </div>
        </Field>
      </div>
      <Field label="UUID v4" hint={`${list.length} generated`}>
        <TextArea readOnly value={text} rows={8} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={text} />
      </div>
    </div>
  )
}

export function QrCodeGenerator() {
  const [text, setText] = useState('https://toolbox.dev')
  const [size, setSize] = useState(320)
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (!text.trim()) {
      setDataUrl('')
      return
    }
    import('qrcode')
      .then((QRCode) =>
        QRCode.default.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: 'M' }),
      )
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url)
          setError('')
        }
      })
      .catch((e) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [text, size])

  useToolActions(
    {
      primary: {
        label: 'Download PNG',
        disabled: !dataUrl,
        onClick: () => download(dataUrl, 'qr-code.png'),
      },
    },
    [dataUrl],
  )

  return (
    <div className="flex flex-col gap-5">
      <Field label="Content" hint="Link, text or Wi-Fi string">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={3} mono={false} />
      </Field>
      <div className="flex flex-wrap items-center gap-2">
        <span className="t-label-sm text-ink-2">Size</span>
        {[160, 320, 512].map((s) => (
          <Chip key={s} active={size === s} onClick={() => setSize(s)}>
            {s}px
          </Chip>
        ))}
      </div>
      <div className="flex items-center justify-center rounded-md border border-line bg-subtle p-6">
        {error ? (
          <Note tone="error">{error}</Note>
        ) : dataUrl ? (
          <img src={dataUrl} alt="Generated QR code" className="h-auto w-[220px] rounded-sm" />
        ) : (
          <Note>Enter some content to generate a code.</Note>
        )}
      </div>
    </div>
  )
}

export function GradientGenerator() {
  const [from, setFrom] = useState('#2563eb')
  const [to, setTo] = useState('#7c3aed')
  const [angle, setAngle] = useState(135)
  const css = `background: linear-gradient(${angle}deg, ${from} 0%, ${to} 100%);`

  return (
    <div className="flex flex-col gap-5">
      <div
        className="h-40 rounded-md border border-line"
        style={{ backgroundImage: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)` }}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-line bg-surface"
            />
            <TextInput value={from} onChange={(e) => setFrom(e.target.value)} className="mono" />
          </div>
        </Field>
        <Field label="To">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-line bg-surface"
            />
            <TextInput value={to} onChange={(e) => setTo(e.target.value)} className="mono" />
          </div>
        </Field>
      </div>
      <Field label="Angle" hint={`${angle}°`}>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full accent-[var(--tb-accent)]"
        />
      </Field>
      <Field label="CSS">
        <TextArea readOnly value={css} rows={2} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={css} />
      </div>
    </div>
  )
}

export function MetaTagGenerator() {
  const [meta, setMeta] = useState({
    title: 'ToolBox — All Your Tools in One Place',
    description: 'Formatters, converters, generators and image utilities that run in your browser.',
    url: 'https://toolbox.dev',
    image: 'https://toolbox.dev/og.png',
  })

  const output = useMemo(
    () =>
      [
        `<title>${meta.title}</title>`,
        `<meta name="description" content="${meta.description}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${meta.title}" />`,
        `<meta property="og:description" content="${meta.description}" />`,
        `<meta property="og:url" content="${meta.url}" />`,
        `<meta property="og:image" content="${meta.image}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${meta.title}" />`,
        `<meta name="twitter:description" content="${meta.description}" />`,
        `<meta name="twitter:image" content="${meta.image}" />`,
      ].join('\n'),
    [meta],
  )

  const set = (key) => (e) => setMeta((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="flex flex-col gap-5">
      <Field label="Page title">
        <TextInput value={meta.title} onChange={set('title')} />
      </Field>
      <Field label="Description" hint={`${meta.description.length}/160`}>
        <TextArea value={meta.description} onChange={set('description')} rows={2} mono={false} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Canonical URL">
          <TextInput value={meta.url} onChange={set('url')} />
        </Field>
        <Field label="Share image">
          <TextInput value={meta.image} onChange={set('image')} />
        </Field>
      </div>
      <Field label="Tags">
        <TextArea readOnly value={output} rows={9} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

const FIRST = ['Ada', 'Grace', 'Alan', 'Katherine', 'Linus', 'Radia', 'Barbara', 'Tim', 'Anita', 'Vint']
const LAST = ['Lovelace', 'Hopper', 'Turing', 'Johnson', 'Torvalds', 'Perlman', 'Liskov', 'Berners', 'Borg', 'Cerf']
const CITY = ['Lisbon', 'Toronto', 'Osaka', 'Nairobi', 'Bristol', 'Austin', 'Bogotá', 'Helsinki']
const DOMAIN = ['example.com', 'mail.test', 'toolbox.dev', 'sample.org']

const rand = (list) => list[Math.floor(Math.random() * list.length)]

export function FakeDataGenerator() {
  const [rows, setRows] = useState(5)
  const [format, setFormat] = useState('json')
  const [output, setOutput] = useState('')

  const generate = () => {
    const n = Math.max(1, Math.min(100, Number(rows) || 1))
    const people = Array.from({ length: n }, () => {
      const first = rand(FIRST)
      const last = rand(LAST)
      return {
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@${rand(DOMAIN)}`,
        city: rand(CITY),
        age: 21 + Math.floor(Math.random() * 45),
      }
    })
    if (format === 'json') setOutput(JSON.stringify(people, null, 2))
    else
      setOutput(
        ['name,email,city,age', ...people.map((p) => `${p.name},${p.email},${p.city},${p.age}`)].join(
          '\n',
        ),
      )
  }

  useEffect(generate, [])
  useToolActions({ primary: { label: 'Generate', onClick: generate } }, [rows, format])

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
        <Field label="Rows">
          <TextInput
            type="number"
            min={1}
            max={100}
            value={rows}
            onChange={(e) => setRows(e.target.value)}
          />
        </Field>
        <Field label="Format">
          <div className="flex gap-2 pt-1">
            <Chip active={format === 'json'} onClick={() => setFormat('json')}>
              JSON
            </Chip>
            <Chip active={format === 'csv'} onClick={() => setFormat('csv')}>
              CSV
            </Chip>
          </div>
        </Field>
      </div>
      <Field label="Mock data">
        <TextArea readOnly value={output} rows={9} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            download(
              new Blob([output], { type: format === 'json' ? 'application/json' : 'text/csv' }),
              `mock-data.${format}`,
            )
          }
        >
          Download
        </Button>
        <CopyButton value={output} />
      </div>
    </div>
  )
}
