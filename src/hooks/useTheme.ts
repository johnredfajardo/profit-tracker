import { useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import type { Theme } from '@/types'

function applyTheme(theme: Theme) {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && systemDark)
  document.documentElement.classList.toggle('dark', dark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#0b1120' : '#4f46e5')
}

/**
 * Keeps the <html> class in sync with the persisted theme, and reacts to OS
 * theme changes while "system" is selected. Mount once, near the app root.
 */
export function useTheme() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])
}
