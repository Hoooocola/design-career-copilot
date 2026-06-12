import { en, type Messages } from "@/lib/i18n/en"
import { zh } from "@/lib/i18n/zh"

export type Locale = "en" | "zh"

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_STORAGE_KEY = "dcc-locale"

const messages: Record<Locale, Messages> = { en, zh }

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.en
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "zh"
}

export { en, zh }
export type { Messages }
