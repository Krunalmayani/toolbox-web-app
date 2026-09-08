import { useEffect, useState } from 'react'

const KEY = 'toolbox-theme'

export default function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) return saved === 'dark'
    } catch {
      /* private mode — fall through to the system preference */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    try {
      localStorage.setItem(KEY, dark ? 'dark' : 'light')
    } catch {
      /* ignore — the toggle still works for this session */
    }
  }, [dark])

  return [dark, () => setDark((v) => !v)]
}
