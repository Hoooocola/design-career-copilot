"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"

export function LanguageToggle() {
  const { locale, setLocale, messages } = useLocale()

  return (
    <div
      role="group"
      aria-label={messages.language.switchTo}
      className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5"
    >
      {(["en", "zh"] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
            locale === code
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {messages.language[code]}
        </button>
      ))}
    </div>
  )
}
