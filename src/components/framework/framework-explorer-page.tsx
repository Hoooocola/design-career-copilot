"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"
import {
  getExplorerDimensions,
  getExplorerDimensionsByCategory,
} from "@/lib/framework/explorer"
import type { DimensionId } from "@/types/framework"
import { cn } from "@/lib/utils"

export function FrameworkExplorerPage() {
  const { messages, locale } = useLocale()
  const fx = messages.frameworkExplorer

  const categories = getExplorerDimensionsByCategory(locale)
  const allDimensions = getExplorerDimensions(locale)
  const [selectedId, setSelectedId] = useState<DimensionId>(
    allDimensions[0]?.id ?? "problem_framing_strategy"
  )

  const selected =
    allDimensions.find((d) => d.id === selectedId) ?? allDimensions[0]

  if (!selected) return null

  return (
    <PageContainer size="wide" className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {fx.badge}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {fx.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {fx.subtitle}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border/60 bg-muted/10 px-5 py-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {fx.philosophy}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fx.browseLabel}
          </p>
          {categories.map((group) => (
            <div key={group.categoryId}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {fx.categories[group.categoryId]}
              </p>
              <ul className="space-y-0.5">
                {group.dimensions.map((dim) => {
                  const active = dim.id === selectedId
                  return (
                    <li key={dim.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(dim.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          active
                            ? "bg-muted/60 font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{dim.title}</span>
                        {active && (
                          <ChevronRight className="size-3.5 shrink-0 opacity-50" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <article className="rounded-xl border border-border/60 bg-card/40">
          <header className="border-b border-border/40 px-6 py-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {fx.categories[selected.categoryId]}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              {selected.title}
            </h2>
          </header>

          <div className="space-y-6 px-6 py-6">
            <Section label={fx.sections.definition} content={selected.definition} />
            <Section
              label={fx.sections.whyItMatters}
              content={selected.whyItMatters}
              accent
            />
            <ListSection
              label={fx.sections.evaluationCriteria}
              items={selected.evaluationCriteria}
            />
            <ListSection
              label={fx.sections.exampleEvidence}
              items={selected.exampleEvidence}
              variant="evidence"
            />
            <ListSection
              label={fx.sections.commonWeaknesses}
              items={selected.commonWeaknesses}
              variant="weakness"
            />
          </div>
        </article>
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-xl border border-border/60 bg-muted/10 px-6 py-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {fx.scoringTitle}
        </p>
        <div className="grid gap-2 sm:grid-cols-5">
          {fx.scoringLevels.map((level) => (
            <div
              key={level.score}
              className="rounded-lg border border-border/40 bg-background/50 px-3 py-2.5 text-center"
            >
              <p className="font-mono text-lg font-semibold tabular-nums">
                {level.score}
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider">
                {level.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={<Link href="/architecture" />}
        >
          {fx.howItWorksLink}
        </Button>
        <Button
          size="lg"
          className="gap-2"
          nativeButton={false}
          render={<Link href="/" />}
        >
          {fx.cta}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </PageContainer>
  )
}

function Section({
  label,
  content,
  accent,
}: {
  label: string
  content: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        accent && "rounded-lg border border-primary/15 bg-primary/5 px-4 py-3"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {content}
      </p>
    </div>
  )
}

function ListSection({
  label,
  items,
  variant = "default",
}: {
  label: string
  items: string[]
  variant?: "default" | "evidence" | "weakness"
}) {
  const bulletClass =
    variant === "evidence"
      ? "text-emerald-400/80"
      : variant === "weakness"
        ? "text-rose-400/80"
        : "text-muted-foreground/50"

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
          >
            <span className={cn("mt-2 size-1 shrink-0 rounded-full", bulletClass)} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
