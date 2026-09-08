import { useMemo, useState } from 'react'
import { CopyButton, Field, Note, TextArea, TextInput } from '../components/ui/Field'
import Chip from '../components/ui/Chip'
import { useToolActions } from '../components/ToolModal'

const SAMPLE =
  'ToolBox keeps every utility in one place. No sign-up, no uploads — everything runs locally in your browser.'

export function WordCounter() {
  const [text, setText] = useState(SAMPLE)

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    return {
      words,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      sentences: trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0,
      paragraphs: trimmed ? trimmed.split(/\n{2,}/).filter(Boolean).length : 0,
      readingTime: Math.max(1, Math.round(words / 200)),
    }
  }, [text])

  const cards = [
    ['Words', stats.words],
    ['Characters', stats.characters],
    ['No spaces', stats.charactersNoSpaces],
    ['Sentences', stats.sentences],
    ['Paragraphs', stats.paragraphs],
    ['Read time', `${stats.readingTime} min`],
  ]

  return (
    <div className="flex flex-col gap-5">
      <Field label="Your text">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={7} mono={false} />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-md border border-line bg-subtle px-3.5 py-3">
            <p className="t-label-xs text-ink-3">{label}</p>
            <p className="t-h3 mt-1 text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const CASES = {
  'lower case': (s) => s.toLowerCase(),
  'UPPER CASE': (s) => s.toUpperCase(),
  'Title Case': (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  'Sentence case': (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  camelCase: (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, ''),
  PascalCase: (s) => {
    const camel = CASES.camelCase(s)
    return camel ? camel[0].toUpperCase() + camel.slice(1) : ''
  },
  snake_case: (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
  'kebab-case': (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
}

export function CaseConverter() {
  const [text, setText] = useState('Convert this headline to any case')
  const [mode, setMode] = useState('Title Case')
  const output = CASES[mode](text)

  return (
    <div className="flex flex-col gap-5">
      <Field label="Input">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={4} mono={false} />
      </Field>
      <div className="flex flex-wrap gap-2">
        {Object.keys(CASES).map((key) => (
          <Chip key={key} active={mode === key} onClick={() => setMode(key)}>
            {key}
          </Chip>
        ))}
      </div>
      <Field label="Output">
        <TextArea readOnly value={output} rows={4} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

export function RemoveDuplicates() {
  const [text, setText] = useState('apple\nbanana\napple\ncherry\nbanana\n\ncherry')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [trim, setTrim] = useState(true)
  const [dropEmpty, setDropEmpty] = useState(true)

  const { output, removed } = useMemo(() => {
    let lines = text.split('\n')
    if (trim) lines = lines.map((l) => l.trim())
    if (dropEmpty) lines = lines.filter((l) => l.length)
    const seen = new Set()
    const kept = lines.filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    return { output: kept.join('\n'), removed: lines.length - kept.length }
  }, [text, caseSensitive, trim, dropEmpty])

  return (
    <div className="flex flex-col gap-5">
      <Field label="Lines">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Chip active={caseSensitive} onClick={() => setCaseSensitive((v) => !v)}>
          Case sensitive
        </Chip>
        <Chip active={trim} onClick={() => setTrim((v) => !v)}>
          Trim whitespace
        </Chip>
        <Chip active={dropEmpty} onClick={() => setDropEmpty((v) => !v)}>
          Drop empty lines
        </Chip>
      </div>
      <Field label="Result" hint={`${removed} duplicate${removed === 1 ? '' : 's'} removed`}>
        <TextArea readOnly value={output} rows={6} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

const SORTS = {
  'A → Z': (lines) => [...lines].sort((a, b) => a.localeCompare(b)),
  'Z → A': (lines) => [...lines].sort((a, b) => b.localeCompare(a)),
  '0 → 9': (lines) => [...lines].sort((a, b) => parseFloat(a) - parseFloat(b)),
  '9 → 0': (lines) => [...lines].sort((a, b) => parseFloat(b) - parseFloat(a)),
  'By length': (lines) => [...lines].sort((a, b) => a.length - b.length),
  Reverse: (lines) => [...lines].reverse(),
  Shuffle: (lines) => [...lines].sort(() => Math.random() - 0.5),
}

export function TextSorter() {
  const [text, setText] = useState('cherry\napple\nbanana\ndamson')
  const [mode, setMode] = useState('A → Z')
  const [nonce, setNonce] = useState(0)

  const output = useMemo(
    () => SORTS[mode](text.split('\n').filter((l) => l.trim())).join('\n'),
    // `nonce` lets Shuffle re-run on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, mode, nonce],
  )

  useToolActions({ primary: { label: 'Sort lines', onClick: () => setNonce((n) => n + 1) } }, [])

  return (
    <div className="flex flex-col gap-5">
      <Field label="Lines">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      </Field>
      <div className="flex flex-wrap gap-2">
        {Object.keys(SORTS).map((key) => (
          <Chip key={key} active={mode === key} onClick={() => setMode(key)}>
            {key}
          </Chip>
        ))}
      </div>
      <Field label="Sorted">
        <TextArea readOnly value={output} rows={6} />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

export function SlugGenerator() {
  const [text, setText] = useState('10 Tools Every Front-End Developer Should Bookmark!')
  const [separator, setSeparator] = useState('-')

  const slug = useMemo(
    () =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, separator)
        .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), ''),
    [text, separator],
  )

  return (
    <div className="flex flex-col gap-5">
      <Field label="Headline">
        <TextInput value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="flex items-center gap-2">
        <span className="t-label-sm text-ink-2">Separator</span>
        <Chip active={separator === '-'} onClick={() => setSeparator('-')}>
          Hyphen
        </Chip>
        <Chip active={separator === '_'} onClick={() => setSeparator('_')}>
          Underscore
        </Chip>
      </div>
      <Field label="Slug" hint={`${slug.length} characters`}>
        <TextInput readOnly value={slug} className="mono" />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={slug} />
      </div>
    </div>
  )
}

const LOREM_WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  )

const pick = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]

function makeSentence() {
  const length = 8 + Math.floor(Math.random() * 10)
  const words = Array.from({ length }, pick)
  words[0] = words[0][0].toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

export function LoremIpsum() {
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState('paragraphs')
  const [output, setOutput] = useState('')

  const generate = () => {
    const n = Math.max(1, Math.min(50, Number(count) || 1))
    if (unit === 'words') setOutput(Array.from({ length: n }, pick).join(' '))
    else if (unit === 'sentences') setOutput(Array.from({ length: n }, makeSentence).join(' '))
    else
      setOutput(
        Array.from({ length: n }, () =>
          Array.from({ length: 3 + Math.floor(Math.random() * 3) }, makeSentence).join(' '),
        ).join('\n\n'),
      )
  }

  useToolActions({ primary: { label: 'Generate', onClick: generate } }, [count, unit])

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <Field label="How many">
          <TextInput
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </Field>
        <Field label="Unit">
          <div className="flex flex-wrap gap-2 pt-1">
            {['paragraphs', 'sentences', 'words'].map((u) => (
              <Chip key={u} active={unit === u} onClick={() => setUnit(u)}>
                {u}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Placeholder text">
        <TextArea
          readOnly
          value={output}
          rows={8}
          mono={false}
          placeholder="Press “Generate” to create placeholder copy."
        />
      </Field>
      <div className="flex justify-end">
        <CopyButton value={output} />
      </div>
    </div>
  )
}

/**
 * Deliberately small Markdown subset (headings, bold, italic, code, links,
 * lists, quotes) — enough for a live preview without a parser dependency.
 */
function renderMarkdown(src) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const inline = (s) =>
    escape(s)
      .replace(/`([^`]+)`/g, '<code class="mono rounded bg-subtle px-1 py-0.5 text-[12px]">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
        /^(https?:|mailto:|\/|#)/i.test(href.trim())
          ? `<a class="text-accent underline" href="${href.trim()}">${label}</a>`
          : label,
      )

  return src
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n')
      const heading = block.match(/^(#{1,4})\s+(.*)$/)
      if (heading) {
        const level = heading[1].length
        const size = ['t-h1', 't-h2', 't-h3', 't-h4'][level - 1]
        return `<h${level} class="${size} text-ink">${inline(heading[2])}</h${level}>`
      }
      if (lines.every((l) => /^[-*]\s+/.test(l)))
        return `<ul class="list-disc pl-5 space-y-1">${lines
          .map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`)
          .join('')}</ul>`
      if (lines.every((l) => /^>\s?/.test(l)))
        return `<blockquote class="border-l-2 border-line-strong pl-3 text-ink-2">${inline(
          block.replace(/^>\s?/gm, ''),
        )}</blockquote>`
      return `<p>${inline(block).replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}

const MD_SAMPLE = `# ToolBox

A **fast** collection of *browser-only* utilities.

- No sign-up
- No uploads
- Works offline

> Everything runs on your device.

Try \`npm run dev\` or read the [docs](https://example.com).`

export function MarkdownPreview() {
  const [text, setText] = useState(MD_SAMPLE)
  const html = useMemo(() => renderMarkdown(text), [text])

  return (
    <div className="flex flex-col gap-5">
      <Field label="Markdown">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={8} />
      </Field>
      <Field label="Preview">
        <div
          className="t-body space-y-3 rounded-md border border-line bg-subtle px-3.5 py-3 text-ink-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Field>
      <Note>Supports headings, bold, italic, inline code, links, lists and quotes.</Note>
    </div>
  )
}
