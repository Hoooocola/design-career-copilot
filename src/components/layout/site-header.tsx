"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import { LanguageToggle } from "@/components/layout/language-toggle"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"

export function SiteHeader() {
  const { messages } = useLocale()
  const [aiEnabled, setAiEnabled] = useState(false)

  useEffect(() => {
    fetch("/api/ai-status")
      .then((res) => res.json())
      .then((data: { aiEnabled?: boolean }) => setAiEnabled(Boolean(data.aiEnabled)))
      .catch(() => setAiEnabled(false))
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md border border-border/60 bg-muted/50 transition-colors group-hover:border-border">
            <Sparkles className="size-3.5 text-foreground/80" />
          </div>
          <span className="text-sm font-medium tracking-tight">
            {messages.common.brand}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-4 sm:flex">
            <Link
              href="/framework"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {messages.nav.framework}
            </Link>
            <Link
              href="/architecture"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {messages.nav.howItWorks}
            </Link>
          </nav>
          <ThemeToggle />
          <LanguageToggle />
          <Badge
            variant="outline"
            className={
              aiEnabled
                ? "border-emerald-500/25 bg-emerald-500/10 font-mono text-[10px] uppercase tracking-wider text-emerald-400"
                : "font-mono text-[10px] uppercase tracking-wider"
            }
          >
            {aiEnabled ? messages.common.aiLive : messages.common.beta}
          </Badge>
        </div>
      </div>
    </header>
  )
}
