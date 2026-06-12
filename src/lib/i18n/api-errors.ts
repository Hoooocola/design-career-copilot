import { getMessages, type Locale } from "@/lib/i18n"

const ERROR_KEYS: Record<string, keyof ReturnType<typeof getMessages>["analyzing"]["errors"]> = {
  "Portfolio PDF is required": "portfolioRequired",
  "Job description is required (minimum 50 characters)": "jdRequired",
  "Only PDF files are supported": "pdfOnly",
  "File size exceeds 20 MB limit": "fileTooLarge",
  "Analysis failed": "failed",
}

export function translateApiError(error: string, locale: Locale): string {
  const key = ERROR_KEYS[error]
  if (key) return getMessages(locale).analyzing.errors[key]
  return error
}
