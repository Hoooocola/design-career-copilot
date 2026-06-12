"use client"

import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"

export function HeroSection() {
  const { messages } = useLocale()

  return (
    <section className="relative text-center">
      <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 max-w-lg bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.15_265/0.15),transparent_70%)]" />
      <Badge
        variant="outline"
        className="mb-6 font-mono text-[10px] uppercase tracking-widest"
      >
        {messages.hero.badge}
      </Badge>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
        {messages.hero.title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
        {messages.hero.subtitle}
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground/80 sm:text-base">
        {messages.hero.description}
      </p>
    </section>
  )
}
