"use client"

import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { PersonaSelector } from "@/components/report/persona-selector"
import { useLocale } from "@/components/providers/locale-provider"
import type { Locale } from "@/lib/i18n"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface WorkspaceHeaderProps {
  portfolioFileName?: string
  targetRoleLabel?: string
  assessmentDate: Date
  persona: ReviewerPersona
  onPersonaChange: (persona: ReviewerPersona) => void
  isRefreshing?: boolean
  isDemo?: boolean
  isAiGenerated?: boolean
}

function formatAssessmentDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function WorkspaceHeader({
  portfolioFileName,
  targetRoleLabel,
  assessmentDate,
  persona,
  onPersonaChange,
  isRefreshing,
  isDemo,
  isAiGenerated,
}: WorkspaceHeaderProps) {
  const { locale, messages } = useLocale()
  const ws = messages.report.workspace
  const fw = messages.report.framework

  return (
    <header className="workspace-header border-b border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--workspace-border)] bg-[var(--workspace-panel)] px-2.5 py-1.5 text-xs font-medium text-[var(--workspace-text-secondary)] transition-colors hover:border-[var(--workspace-border-strong)] hover:text-[var(--workspace-text-primary)]"
              >
                <ArrowLeft className="size-3" />
                {ws.newAssessment}
              </Link>
              {isDemo && <StatusPill label={messages.report.demoMode} variant="caution" />}
              {isAiGenerated && (
                <StatusPill label={messages.report.aiGenerated} variant="accent" />
              )}
            </div>

            <div>
              <p className="workspace-label">{ws.title}</p>
              <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-[var(--workspace-text-primary)] sm:text-xl">
                {portfolioFileName ?? messages.report.title}
              </h1>
            </div>

            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {targetRoleLabel && (
                <MetaItem label={ws.targetRole} value={targetRoleLabel} />
              )}
              <MetaItem
                label={ws.reviewerPersona}
                value={messages.report.reviewerPersonas[persona]}
              />
              <MetaItem
                label={ws.assessmentDate}
                value={formatAssessmentDate(assessmentDate, locale)}
              />
            </dl>
          </div>

          <div className="w-full shrink-0 lg:max-w-md">
            <p className="workspace-label">{fw.switchReviewer}</p>
            <div className="mt-2">
              <PersonaSelector
                value={persona}
                onChange={onPersonaChange}
                disabled={isRefreshing}
                compact
              />
            </div>
            {isRefreshing && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--workspace-text-secondary)]">
                <Loader2 className="size-3.5 animate-spin" />
                {fw.regeneratingPersona}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="workspace-label">{label}</dt>
      <dd className="mt-0.5 font-medium text-[var(--workspace-text-primary)]">{value}</dd>
    </div>
  )
}

function StatusPill({
  label,
  variant,
}: {
  label: string
  variant: "accent" | "caution" | "neutral"
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        variant === "accent" &&
          "border-[var(--workspace-accent)]/30 bg-[var(--workspace-accent)]/10 text-[var(--workspace-accent)]",
        variant === "caution" &&
          "border-[var(--workspace-caution)]/30 bg-[var(--workspace-caution)]/10 text-[var(--workspace-caution)]",
        variant === "neutral" &&
          "border-[var(--workspace-border)] bg-[var(--workspace-panel)] text-[var(--workspace-text-secondary)]"
      )}
    >
      {label}
    </span>
  )
}
