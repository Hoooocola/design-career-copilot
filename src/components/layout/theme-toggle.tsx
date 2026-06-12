"use client"

import { Moon, Sun } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { messages } = useLocale()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={messages.theme.switchTo}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground transition-colors",
        "hover:border-border hover:bg-muted/50 hover:text-foreground"
      )}
    >
      {theme === "dark" ? (
        <Sun className="size-3.5" />
      ) : (
        <Moon className="size-3.5" />
      )}
    </button>
  )
}
