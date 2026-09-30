"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

export type Theme = "light" | "dark" | "system"

export type ThemePalette = {
  primary?: string
  background?: string
  foreground?: string
  radius?: string
}

/**
 * Builds a CSSProperties object of CSS variables from a palette.
 * Can be passed to <ThemeProvider theme={...}> to override defaults.
 */
export function createTheme(palette: ThemePalette = {}): CSSProperties {
  const vars: Record<string, string> = {}
  if (palette.primary) vars["--primary"] = palette.primary
  if (palette.background) vars["--background"] = palette.background
  if (palette.foreground) vars["--foreground"] = palette.foreground
  if (palette.radius) vars["--radius"] = palette.radius
  return vars as CSSProperties
}

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "hng15-theme"

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
}

export function ThemeProvider({
  children,
  theme: themeVars,
}: {
  children: ReactNode
  theme?: CSSProperties
}) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [systemDark, setSystemDark] = useState(false)

  const vars = useMemo(() => themeVars ?? createTheme(), [themeVars])

  // Load persisted theme and track system preference (client only)
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored)
    }
    setSystemDark(prefersDark())

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      resolvedTheme === "dark"
    )
    Object.entries(vars).forEach(([key, value]) =>
      document.documentElement.style.setProperty(key, value)
    )
  }, [resolvedTheme, vars])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
