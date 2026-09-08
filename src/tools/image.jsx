import { useEffect, useState } from 'react'
import { CopyButton, Field, Note, TextArea, TextInput } from '../components/ui/Field'
import Chip from '../components/ui/Chip'
import FileDrop from '../components/ui/FileDrop'
import { useToolActions } from '../components/ToolModal'
import { canvasFrom, download, formatBytes, loadImageFile } from '../lib/utils'
import { rgbToHex } from '../lib/color'

/** Shared state for the canvas-based image tools. */
function useImageFile() {
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')

  const onFile = async (next) => {
    setFile(next)
    setError('')
    try {
      setImage(await loadImageFile(next))
    } catch (e) {
      setImage(null)
      setError(e.message)
    }
  }

  return { file, image, error, onFile }
}

function Preview({ src, caption }) {
  if (!src) return null
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-line bg-subtle p-4">
      <img src={src} alt="Result preview" className="max-h-[220px] w-auto rounded-sm" />
      {caption ? <p className="t-label-xs text-ink-3">{caption}</p> : null}
    </div>
  )
}

export function ImageCompressor() {
  const { file, image, error, onFile } = useImageFile()
  const [quality, setQuality] = useState(0.7)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!image) return setResult(null)
    canvasFrom(image, image.naturalWidth, image.naturalHeight).toBlob(
      (blob) => blob && setResult({ blob, url: URL.createObjectURL(blob) }),
      'image/jpeg',
      quality,
    )
  }, [image, quality])

  useToolActions(
    {
      primary: {
        label: 'Download',
        disabled: !result,
        onClick: () => result && download(result.blob, 'compressed.jpg'),
      },
    },
    [result],
  )

  const saved = result && file ? Math.max(0, 100 - (result.blob.size / file.size) * 100) : 0

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} />
      {error ? <Note tone="error">{error}</Note> : null}
      <Field label="Quality" hint={`${Math.round(quality * 100)}%`}>
        <input
          type="range"
          min={10}
          max={100}
          value={quality * 100}
          onChange={(e) => setQuality(Number(e.target.value) / 100)}
          className="w-full accent-[var(--tb-accent)]"
        />
      </Field>
      {result ? (
        <>
          <Preview
            src={result.url}
            caption={`${formatBytes(file.size)} → ${formatBytes(result.blob.size)}`}
          />
          <Note tone="success">{saved.toFixed(0)}% smaller than the original.</Note>
        </>
      ) : null}
    </div>
  )
}

export function ImageResizer() {
  const { file, image, error, onFile } = useImageFile()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [lock, setLock] = useState(true)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!image) return
    setWidth(String(image.naturalWidth))
    setHeight(String(image.naturalHeight))
  }, [image])

  const ratio = image ? image.naturalWidth / image.naturalHeight : 1

  const render = () => {
    if (!image) return
    canvasFrom(image, Number(width) || 1, Number(height) || 1).toBlob((blob) => {
      if (blob) setResult({ blob, url: URL.createObjectURL(blob) })
    }, 'image/png')
  }

  useToolActions(
    {
      primary: { label: 'Resize', disabled: !image, onClick: render },
      secondary: result
        ? { label: 'Download', onClick: () => download(result.blob, 'resized.png') }
        : undefined,
    },
    [image, width, height, result],
  )

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} />
      {error ? <Note tone="error">{error}</Note> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Width (px)">
          <TextInput
            type="number"
            value={width}
            onChange={(e) => {
              setWidth(e.target.value)
              if (lock) setHeight(String(Math.round(Number(e.target.value) / ratio)))
            }}
          />
        </Field>
        <Field label="Height (px)">
          <TextInput
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value)
              if (lock) setWidth(String(Math.round(Number(e.target.value) * ratio)))
            }}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip active={lock} onClick={() => setLock((v) => !v)}>
          Lock aspect ratio
        </Chip>
        {[50, 25].map((pct) => (
          <Chip
            key={pct}
            onClick={() => {
              if (!image) return
              setWidth(String(Math.round((image.naturalWidth * pct) / 100)))
              setHeight(String(Math.round((image.naturalHeight * pct) / 100)))
            }}
          >
            {pct}%
          </Chip>
        ))}
      </div>
      {result ? <Preview src={result.url} caption={`${width} × ${height} · ${formatBytes(result.blob.size)}`} /> : null}
    </div>
  )
}

const RATIOS = [
  ['1:1', 1],
  ['4:3', 4 / 3],
  ['16:9', 16 / 9],
  ['3:4', 3 / 4],
]

export function ImageCropper() {
  const { file, image, error, onFile } = useImageFile()
  const [ratio, setRatio] = useState(1)
  const [result, setResult] = useState(null)

  const crop = () => {
    if (!image) return
    const sw = image.naturalWidth
    const sh = image.naturalHeight
    let cw = sw
    let ch = sw / ratio
    if (ch > sh) {
      ch = sh
      cw = sh * ratio
    }
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(cw)
    canvas.height = Math.round(ch)
    canvas
      .getContext('2d')
      .drawImage(image, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => blob && setResult({ blob, url: URL.createObjectURL(blob) }), 'image/png')
  }

  useToolActions(
    {
      primary: { label: 'Crop', disabled: !image, onClick: crop },
      secondary: result
        ? { label: 'Download', onClick: () => download(result.blob, 'cropped.png') }
        : undefined,
    },
    [image, ratio, result],
  )

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} />
      {error ? <Note tone="error">{error}</Note> : null}
      <Field label="Aspect ratio">
        <div className="flex flex-wrap gap-2">
          {RATIOS.map(([label, value]) => (
            <Chip key={label} active={ratio === value} onClick={() => setRatio(value)}>
              {label}
            </Chip>
          ))}
        </div>
      </Field>
      <Note>The crop is taken from the centre of the image.</Note>
      {result ? <Preview src={result.url} caption={formatBytes(result.blob.size)} /> : null}
    </div>
  )
}

const FORMATS = [
  ['PNG', 'image/png', 'png'],
  ['JPG', 'image/jpeg', 'jpg'],
  ['WebP', 'image/webp', 'webp'],
]

export function FormatConverter() {
  const { file, image, error, onFile } = useImageFile()
  const [format, setFormat] = useState('image/webp')
  const [result, setResult] = useState(null)

  const convert = () => {
    if (!image) return
    canvasFrom(image, image.naturalWidth, image.naturalHeight).toBlob(
      (blob) => blob && setResult({ blob, url: URL.createObjectURL(blob) }),
      format,
      0.92,
    )
  }

  const ext = FORMATS.find(([, mime]) => mime === format)?.[2] ?? 'png'

  useToolActions(
    {
      primary: { label: 'Convert', disabled: !image, onClick: convert },
      secondary: result
        ? { label: 'Download', onClick: () => download(result.blob, `converted.${ext}`) }
        : undefined,
    },
    [image, format, result],
  )

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} />
      {error ? <Note tone="error">{error}</Note> : null}
      <Field label="Convert to">
        <div className="flex flex-wrap gap-2">
          {FORMATS.map(([label, mime]) => (
            <Chip key={mime} active={format === mime} onClick={() => setFormat(mime)}>
              {label}
            </Chip>
          ))}
        </div>
      </Field>
      {result ? (
        <Preview
          src={result.url}
          caption={`${file ? formatBytes(file.size) : ''} → ${formatBytes(result.blob.size)}`}
        />
      ) : null}
    </div>
  )
}

export function ColorExtractor() {
  const { file, image, error, onFile } = useImageFile()
  const [palette, setPalette] = useState([])

  useEffect(() => {
    if (!image) return setPalette([])
    // Sample a small canvas and bucket colours into a coarse 4-bit-per-channel grid.
    const canvas = canvasFrom(image, 120, (120 * image.naturalHeight) / image.naturalWidth)
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
    const buckets = new Map()
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue
      const key = `${data[i] >> 4}-${data[i + 1] >> 4}-${data[i + 2] >> 4}`
      const entry = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 }
      entry.r += data[i]
      entry.g += data[i + 1]
      entry.b += data[i + 2]
      entry.n += 1
      buckets.set(key, entry)
    }
    setPalette(
      [...buckets.values()]
        .sort((a, b) => b.n - a.n)
        .slice(0, 6)
        .map((e) => rgbToHex(e.r / e.n, e.g / e.n, e.b / e.n)),
    )
  }, [image])

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} />
      {error ? <Note tone="error">{error}</Note> : null}
      {palette.length ? (
        <Field label="Dominant colours" hint={`${palette.length} swatches`}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {palette.map((hex) => (
              <div key={hex} className="overflow-hidden rounded-md border border-line">
                <div className="h-16" style={{ backgroundColor: hex }} />
                <div className="flex items-center justify-between gap-2 bg-surface px-2.5 py-2">
                  <span className="mono text-[12px] text-ink">{hex.toUpperCase()}</span>
                  <CopyButton value={hex} label="" />
                </div>
              </div>
            ))}
          </div>
        </Field>
      ) : (
        <Note>Add an image to pull out its palette.</Note>
      )}
    </div>
  )
}

export function ImageToBase64() {
  const [file, setFile] = useState(null)
  const [dataUrl, setDataUrl] = useState('')

  const onFile = (next) => {
    setFile(next)
    const reader = new FileReader()
    reader.onload = () => setDataUrl(String(reader.result))
    reader.readAsDataURL(next)
  }

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} />
      {dataUrl ? (
        <>
          <Preview src={dataUrl} caption={formatBytes(dataUrl.length)} />
          <Field label="Data URI" hint={`${dataUrl.length} characters`}>
            <TextArea readOnly value={dataUrl} rows={5} />
          </Field>
          <div className="flex justify-end">
            <CopyButton value={dataUrl} />
          </div>
        </>
      ) : (
        <Note>Pick an image to produce an inline data URI.</Note>
      )}
    </div>
  )
}

const FAVICON_SIZES = [16, 32, 48, 128, 180, 192, 512]

export function FaviconGenerator() {
  const { file, image, error, onFile } = useImageFile()
  const [sizes, setSizes] = useState([16, 32, 180, 192])

  const toggle = (size) =>
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))

  const exportAll = () => {
    if (!image) return
    for (const size of sizes) {
      canvasFrom(image, size, size).toBlob(
        (blob) => blob && download(blob, `favicon-${size}x${size}.png`),
        'image/png',
      )
    }
  }

  useToolActions(
    { primary: { label: `Download ${sizes.length} PNGs`, disabled: !image || !sizes.length, onClick: exportAll } },
    [image, sizes],
  )

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} hint="A square image works best" />
      {error ? <Note tone="error">{error}</Note> : null}
      <Field label="Sizes">
        <div className="flex flex-wrap gap-2">
          {FAVICON_SIZES.map((size) => (
            <Chip key={size} active={sizes.includes(size)} onClick={() => toggle(size)}>
              {size}px
            </Chip>
          ))}
        </div>
      </Field>
      <Note>Each selected size is exported as a separate PNG.</Note>
    </div>
  )
}

/**
 * Removes a flat background by keying out colours close to the corner pixels.
 * Works well for product shots and logos on a solid backdrop; it is a colour
 * key, not a subject-detection model, so busy photos are out of scope.
 */
export function BackgroundRemover() {
  const { file, image, error, onFile } = useImageFile()
  const [tolerance, setTolerance] = useState(40)
  const [result, setResult] = useState(null)

  const run = () => {
    if (!image) return
    const canvas = canvasFrom(image, image.naturalWidth, image.naturalHeight)
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const { data, width, height } = imageData

    const at = (x, y) => (y * width + x) * 4
    const corners = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)]
    const key = corners.reduce(
      (acc, i) => ({ r: acc.r + data[i] / 4, g: acc.g + data[i + 1] / 4, b: acc.b + data[i + 2] / 4 }),
      { r: 0, g: 0, b: 0 },
    )

    const limit = (tolerance / 100) * 441.67
    for (let i = 0; i < data.length; i += 4) {
      const distance = Math.hypot(data[i] - key.r, data[i + 1] - key.g, data[i + 2] - key.b)
      if (distance < limit) data[i + 3] = 0
    }
    ctx.putImageData(imageData, 0, 0)
    canvas.toBlob((blob) => blob && setResult({ blob, url: URL.createObjectURL(blob) }), 'image/png')
  }

  useToolActions(
    {
      primary: { label: 'Remove background', disabled: !image, onClick: run },
      secondary: result
        ? { label: 'Download PNG', onClick: () => download(result.blob, 'cutout.png') }
        : undefined,
    },
    [image, tolerance, result],
  )

  return (
    <div className="flex flex-col gap-5">
      <FileDrop file={file} onFile={onFile} hint="Best with a solid background" />
      {error ? <Note tone="error">{error}</Note> : null}
      <Field label="Tolerance" hint={`${tolerance}%`}>
        <input
          type="range"
          min={5}
          max={90}
          value={tolerance}
          onChange={(e) => setTolerance(Number(e.target.value))}
          className="w-full accent-[var(--tb-accent)]"
        />
      </Field>
      <Note>
        Colour-keys the backdrop sampled from the image corners — ideal for logos and product shots
        on a flat background.
      </Note>
      {result ? <Preview src={result.url} caption={formatBytes(result.blob.size)} /> : null}
    </div>
  )
}
