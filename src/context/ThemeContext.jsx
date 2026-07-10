import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
export const useTheme = () => useContext(ThemeContext)

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const stored = localStorage.getItem('buildstack-settings')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.theme) return parsed.theme
    }
  } catch {
    // ignore
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')

    try {
      const stored = localStorage.getItem('buildstack-settings')
      const prefs = stored ? JSON.parse(stored) : {}
      localStorage.setItem('buildstack-settings', JSON.stringify({ ...prefs, theme }))
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
