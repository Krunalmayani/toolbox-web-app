/** Tiny classname joiner — avoids pulling in clsx for one helper. */
export const cn = (...parts) => parts.filter(Boolean).join(' ')

export async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

/** Trigger a client-side download for a blob or data URL. */
export function download(source, filename) {
  const url = typeof source === 'string' ? source : URL.createObjectURL(source)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  if (typeof source !== 'string') setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/** Read a File into an HTMLImageElement, resolving once decoded. */
export function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That file could not be read as an image.'))
    }
    img.src = url
  })
}

export function canvasFrom(img, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas
}
