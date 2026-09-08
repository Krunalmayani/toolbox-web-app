import { useMemo, useState } from 'react'
import { CopyButton, Field, Note, Select, TextArea, TextInput } from '../components/ui/Field'
import Chip from '../components/ui/Chip'
import { useToolActions } from '../components/ToolModal'

const SAMPLE_JSON = '{ "name": "toolbox", "tools": 128, "free": true, "tags": ["json","format"] }'

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE_JSON)
  const [indent, setIndent] = useState('2')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [keys, setKeys] = useState(0)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      const space = indent === 'minify' ? 0 : indent === 'tab' ? '\t' : Number(indent)
      setOutput(JSON.stringify(parsed, null, space))
      setKeys(typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0)
      setError('')
    } catch (e) {
      setOutput('')
      setError(e.message)
    }
  }

  useToolActions(
    {
      primary: { label: 'Format JSON', onClick: format },
      secondary: {
        label: 'Clear',
        onClick: () => {
          setInput('')
          setOutput('')
          setError('')
        },
      },
    },
    [input, indent],
  )

  return (
    <div className="flex flex-col gap-5">
      <Field label="Input JSON" hint="Paste or type below">
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={6} />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <span className="t-label-sm text-ink-2">Indent</span>
        {[
          ['2', '2 spaces'],
          ['4', '4 spaces'],
          ['tab', 'Tab'],
          ['minify', 'Minify'],
        ].map(([value, label]) => (
          <Chip key={value} active={indent === value} onClick={() => setIndent(value)}>
            {label}
          </Chip>
        ))}
      </div>

      <Field
        label="Formatted output"
        hint={error ? 'Invalid JSON' : output ? `Valid JSON · ${keys} keys` : 'Not run yet'}
      >
        <TextArea readOnly value={output} rows={7} placeholder="Press “Format JSON” to see the result." />
      </Field>

      {error ? <Note tone="error">{error}</Note> : null}
      <div className="flex justify-end">
        <CopyButton value={output} label="Copy output" />
      </div>
    </div>
  )
}

export function RegexTester() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('Contact ada@toolbox.dev or grace@toolbox.dev for access.')

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: '' }
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      return { matches: [...text.matchAll(re)], error: '' }
    } catch (e) {
      return { matches: [], error: e.message }
    }
  }, [pattern, flags, text])

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Field label="Pattern">
          <TextInput value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </Field>
        <Field label="Flags">
          <TextInput
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
            className="sm:w-24"
          />
        </Field>
      </div>

      <Field label="Test string">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={5} mono={false} />
      </Field>

      <Field label="Matches" hint={error ? 'Invalid pattern' : `${matches.length} found`}>
        <div className="min-h-[92px] rounded-md border border-line bg-subtle p-3">
          {error ? (
            <Note tone="error">{error}</Note>
          ) : matches.length ? (
            <ul className="flex flex-wrap gap-2">
              {matches.map((m, i) => (
                <li
                  key={i}
                  className="mono rounded-sm bg-tint-emerald px-2 py-1 text-[12px] text-fg-emerald"
                >
                  {m[0]}
                </li>
              ))}
            </ul>
          ) : (
            <Note>No matches yet.</Note>
          )}
        </div>
      </Field>
    </div>
  )
}

const decodeSegment = (segment) => {
  const json = atob(segment.replace(/-/g, '+').replace(/_/g, '/'))
  return JSON.stringify(JSON.parse(json), null, 2)
}

export function JwtDecoder() {
  const [token, setToken] = useState('')

  const result = useMemo(() => {
    const value = token.trim()
    if (!value) return null
    const parts = value.split('.')
    if (parts.length < 2) return { error: 'A JWT needs at least a header and a payload.' }
    try {
      const payloadRaw = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      return {
        header: decodeSegment(parts[0]),
        payload: decodeSegment(parts[1]),
        exp: payloadRaw.exp ? new Date(payloadRaw.exp * 1000) : null,
      }
    } catch {
      return { error: 'That token could not be decoded — check it was copied in full.' }
    }
  }, [token])

  return (
    <div className="flex flex-col gap-5">
      <Field label="JWT" hint="Signature is not verified">
        <TextArea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />
      </Field>

      {result?.error ? <Note tone="error">{result.error}</Note> : null}

      {result && !result.error ? (
        <>
          <Field label="Header">
            <TextArea readOnly value={result.header} rows={4} />
          </Field>
          <Field
            label="Payload"
            hint={
              result.exp
                ? result.exp < new Date()
                  ? `Expired ${result.exp.toLocaleString()}`
                  : `Expires ${result.exp.toLocaleString()}`
                : 'No expiry claim'
            }
          >
            <TextArea readOnly value={result.payload} rows={7} />
          </Field>
        </>
      ) : null}
    </div>
  )
}

export function UrlEncoder() {
  const [input, setInput] = useState('https://toolbox.dev/search?q=hello world&lang=en')
  const [mode, setMode] = useState('encode')

  const output = useMemo(() => {
    try {
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
    } catch {
      return ''
    }
  }, [input, mode])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Chip active={mode === 'encode'} onClick={() => setMode('encode')}>
          Encode
        </Chip>
        <Chip active={mode === 'decode'} onClick={() => setMode('decode')}>
          Decode
        </Chip>
      </div>
      <Field label="Input">
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
      </Field>
      <Field label="Output">
        <TextArea readOnly value={output} rows={4} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

export function HashGenerator() {
  const [text, setText] = useState('hello toolbox')
  const [algo, setAlgo] = useState('SHA-256')
  const [hash, setHash] = useState('')
  const [error, setError] = useState('')

  const run = async () => {
    try {
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest(algo, bytes)
      setHash(
        [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''),
      )
      setError('')
    } catch {
      setError('Hashing needs a secure context (https or localhost).')
    }
  }

  useToolActions({ primary: { label: 'Generate hash', onClick: run } }, [text, algo])

  return (
    <div className="flex flex-col gap-5">
      <Field label="Text">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={4} mono={false} />
      </Field>
      <Field label="Algorithm">
        <div className="flex flex-wrap gap-2">
          {ALGOS.map((a) => (
            <Chip key={a} active={algo === a} onClick={() => setAlgo(a)}>
              {a}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="Digest" hint={hash ? `${hash.length * 4} bit` : 'Not run yet'}>
        <TextArea readOnly value={hash} rows={3} placeholder="Press “Generate hash”." />
      </Field>
      {error ? <Note tone="error">{error}</Note> : null}
      <div className="flex justify-end">
        <CopyButton value={hash} />
      </div>
    </div>
  )
}

const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function describePart(value, index) {
  if (value === '*') return `every ${FIELD_NAMES[index]}`
  if (value.startsWith('*/')) return `every ${value.slice(2)} ${FIELD_NAMES[index]}s`
  if (value.includes('-')) return `${FIELD_NAMES[index]} ${value.replace('-', ' through ')}`
  const list = value.split(',')
  const pretty = list.map((v) => {
    if (index === 3) return MONTHS[Number(v) - 1] ?? v
    if (index === 4) return DAYS[Number(v) % 7] ?? v
    return v
  })
  return `${FIELD_NAMES[index]} ${pretty.join(', ')}`
}

export function CronParser() {
  const [expr, setExpr] = useState('*/15 9-17 * * 1-5')

  const description = useMemo(() => {
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) return { error: 'A cron expression has exactly five fields.' }
    return { text: 'Runs at ' + parts.map(describePart).join(', ') + '.' }
  }, [expr])

  return (
    <div className="flex flex-col gap-5">
      <Field label="Cron expression" hint="minute hour day month weekday">
        <TextInput value={expr} onChange={(e) => setExpr(e.target.value)} />
      </Field>
      <div className="flex flex-wrap gap-2">
        {[
          ['*/15 9-17 * * 1-5', 'Weekday business hours'],
          ['0 0 * * *', 'Daily at midnight'],
          ['0 9 1 * *', 'Monthly on the 1st'],
        ].map(([value, label]) => (
          <Chip key={value} active={expr === value} onClick={() => setExpr(value)}>
            {label}
          </Chip>
        ))}
      </div>
      <Field label="In plain English">
        <div className="rounded-md border border-line bg-subtle px-3.5 py-3">
          {description.error ? (
            <Note tone="error">{description.error}</Note>
          ) : (
            <p className="t-body text-ink">{description.text}</p>
          )}
        </div>
      </Field>
    </div>
  )
}

/** Line-level diff via a longest-common-subsequence table. */
function diffLines(a, b) {
  const left = a.split('\n')
  const right = b.split('\n')
  const table = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0))
  for (let i = left.length - 1; i >= 0; i--) {
    for (let j = right.length - 1; j >= 0; j--) {
      table[i][j] =
        left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const rows = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      rows.push({ type: 'same', text: left[i] })
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) rows.push({ type: 'removed', text: left[i++] })
    else rows.push({ type: 'added', text: right[j++] })
  }
  while (i < left.length) rows.push({ type: 'removed', text: left[i++] })
  while (j < right.length) rows.push({ type: 'added', text: right[j++] })
  return rows
}

const ROW_STYLES = {
  same: 'text-ink-2',
  added: 'bg-tint-emerald text-fg-emerald',
  removed: 'bg-tint-rose text-fg-rose',
}
const ROW_PREFIX = { same: ' ', added: '+', removed: '-' }

export function DiffChecker() {
  const [left, setLeft] = useState('the quick brown fox\njumps over\nthe lazy dog')
  const [right, setRight] = useState('the quick brown fox\nleaps over\nthe lazy dog\nevery morning')

  const rows = useMemo(() => diffLines(left, right), [left, right])
  const added = rows.filter((r) => r.type === 'added').length
  const removed = rows.filter((r) => r.type === 'removed').length

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Original">
          <TextArea value={left} onChange={(e) => setLeft(e.target.value)} rows={6} />
        </Field>
        <Field label="Changed">
          <TextArea value={right} onChange={(e) => setRight(e.target.value)} rows={6} />
        </Field>
      </div>
      <Field label="Differences" hint={`+${added} / -${removed}`}>
        <div className="overflow-x-auto rounded-md border border-line bg-subtle p-3">
          <pre className="mono text-[12px] leading-5">
            {rows.map((row, i) => (
              <div key={i} className={ROW_STYLES[row.type]}>
                {ROW_PREFIX[row.type]} {row.text || ' '}
              </div>
            ))}
          </pre>
        </div>
      </Field>
    </div>
  )
}
