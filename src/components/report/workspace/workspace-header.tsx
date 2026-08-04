"use client"

import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { PersonaSelector } from "@/components/report/persona-selector"
import { useLocale } from "@/components/providers/locale-provider"
import type { Locale } from "@/lib/i18n"
import type { ReviewerPersona } from "@/types/reviewer"

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
  const snap = messages.report.snapshot
  const fw = messages.report.framework

  const statusNote = isDemo
    ? messages.report.demoMode
    : isAiGenerated
      ? messages.report.aiGenerated
      : null

  return (
    <header className="border-b border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium tracking-tight text-[var(--workspace-text-primary)]">
                {ws.productName}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--workspace-text-muted)] transition-colors duration-200 hover:text-[var(--workspace-accent)]"
              >
                <ArrowLeft className="size-3.5" />
                {ws.newAssessment}
              </Link>
            </div>

            <div>
              <p className="workspace-label">{ws.targetRole}</p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--workspace-text-primary)] sm:text-[1.75rem]">
                {targetRoleLabel ?? messages.report.title}
              </h1>
              {statusNote && (
                <p className="mt-2 text-xs text-[var(--workspace-text-muted)]">{statusNote}</p>
              )}
            </div>

            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {portfolioFileName && (
                <MetaItem label={snap.candidateProfile} value={portfolioFileName} />
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

          <div className="w-full shrink-0 lg:max-w-sm">
            <p className="workspace-label">{fw.switchReviewer}</p>
            <div className="mt-2.5">
              <PersonaSelector
                value={persona}
                onChange={onPersonaChange}
                disabled={isRefreshing}
                compact
              />
            </div>
            {isRefreshing && (
              <div className="mt-2.5 flex items-center gap-2 text-xs text-[var(--workspace-text-muted)]">
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
      <dd className="mt-1 text-sm text-[var(--workspace-text-secondary)]">{value}</dd>
    </div>
  )
}
