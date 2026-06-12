"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  DEFAULT_LOCALE,
  getMessages,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Messages,
} from "@/lib/i18n"

interface LocaleContextValue {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && isLocale(stored)) {
      setLocaleState(stored)
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en"
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
  }, [locale, mounted])

  const value = useMemo(
    () => ({
      locale,
      messages: getMessages(locale),
      setLocale,
    }),
    [locale, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return context
}
