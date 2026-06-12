"use client"

import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  Brain,
  FileSearch,
  FileText,
  GitBranch,
  Layers,
  ListChecks,
  Map,
  ScanLine,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STEP_ICONS: LucideIcon[] = [
  FileText,
  ScanLine,
  Brain,
  FileSearch,
  Layers,
  GitBranch,
  Users,
  Shield,
  ListChecks,
  Sparkles,
  Map,
]

const PILLAR_ICONS = [Shield, Sparkles, Users] as const

export function WorkflowArchitecturePage() {
  const { messages } = useLocale()
  const arch = messages.architecture

  return (
    <PageContainer size="wide" className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="outline"
          className="mb-5 font-mono text-[10px] uppercase tracking-widest"
        >
          {arch.badge}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {arch.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {arch.subtitle}
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-3">
        {arch.pillars.map((pillar, index) => {
          const Icon = PILLAR_ICONS[index]
          return (
            <div
              key={pillar.title}
              className="rounded-xl border border-border/60 bg-muted/10 px-4 py-4 text-left"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {pillar.label}
                </span>
              </div>
              <p className="text-sm font-medium">{pillar.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <p className="mb-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {arch.pipelineLabel}
        </p>

        <div className="space-y-0">
          {arch.steps.map((step, index) => {
            const Icon = STEP_ICONS[index]
            const isLast = index === arch.steps.length - 1
            const showPhase =
              step.phase &&
              (index === 0 || arch.steps[index - 1]?.phase !== step.phase)

            return (
              <div key={step.id}>
                {showPhase && (
                  <div className="mb-4 mt-8 first:mt-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      {step.phase}
                    </span>
                  </div>
                )}
                <article
                  className={cn(
                    "rounded-xl border border-border/60 bg-card/40 px-5 py-4",
                    step.highlight && "border-primary/25 bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold tracking-tight">
                        {step.title}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      {step.output && (
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                          → {step.output}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
                {!isLast && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="size-4 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-border/60 bg-muted/10 px-6 py-6 text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {arch.closing}
        </p>
        <Button
          className="mt-5 gap-2"
          size="lg"
          nativeButton={false}
          render={<Link href="/" />}
        >
          {arch.cta}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </PageContainer>
  )
}
