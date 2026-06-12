export type Theme = "dark" | "light"

export const DEFAULT_THEME: Theme = "dark"
export const THEME_STORAGE_KEY = "dcc-theme"

export function isTheme(value: string): value is Theme {
  return value === "dark" || value === "light"
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}
