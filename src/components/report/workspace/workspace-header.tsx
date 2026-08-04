"use client"

import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { PersonaSelector } from "@/components/report/persona-selector"
import { useLocale } from "@/components/providers/locale-provider"
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

export function WorkspaceHeader({
  targetRoleLabel,
  persona,
  onPersonaChange,
  isRefreshing,
}: WorkspaceHeaderProps) {
  const { messages } = useLocale()
  const ws = messages.report.workspace

  return (
    <header className="border-b border-[color-mix(in_oklch,var(--workspace-border)_55%,transparent)] bg-[var(--workspace-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-metadata">{ws.productName}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-metadata transition-colors duration-200 hover:text-[var(--workspace-text-secondary)]"
              >
                <ArrowLeft className="size-3.5" />
                {ws.newAssessment}
              </Link>
            </div>

            <h1 className="text-[1.75rem] font-semibold tracking-tight text-[var(--workspace-text-primary)] sm:text-[2rem]">
              {targetRoleLabel ?? messages.report.title}
            </h1>
          </div>

          <div className="flex shrink-0 flex-col items-start sm:items-end">
            <PersonaSelector
              value={persona}
              onChange={onPersonaChange}
              disabled={isRefreshing}
              compact
            />
            {isRefreshing && (
              <div className="mt-2 flex items-center gap-2 text-metadata">
                <Loader2 className="size-3.5 animate-spin" />
                {messages.report.framework.regeneratingPersona}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
