"use client"

import Link from "next/link"

import { useLocale } from "@/components/providers/locale-provider"

export function SiteFooter() {
  const { messages } = useLocale()

  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {messages.common.brand}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/framework"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {messages.footer.framework}
          </Link>
          <Link
            href="/architecture"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {messages.footer.architecture}
          </Link>
          <Link
            href="/founder"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {messages.footer.founder}
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
            {messages.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
