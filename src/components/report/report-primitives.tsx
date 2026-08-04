"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function ReportPaper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("report-paper rounded-2xl shadow-sm", className)}>
      {children}
    </div>
  )
}

export function ReportCard({
  children,
  className,
  accent,
}: {
  children: React.ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "report-card p-5 sm:p-6",
        accent && "report-accent-line pl-6",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ReportChapter({
  id,
  number,
  title,
  subtitle,
  appendix,
  sectionLabel,
  children,
  className,
}: {
  id: string
  number?: number
  title: string
  subtitle?: string
  appendix?: boolean
  sectionLabel?: string
  children: React.ReactNode
  className?: string
}) {
  const label = appendix
    ? sectionLabel ?? "Appendix"
    : number !== undefined
      ? String(number).padStart(2, "0")
      : undefined

  return (
    <section id={id} className={cn("scroll-mt-28 space-y-8", className)}>
      <header className="pb-6">
        {label && <p className="report-caption mb-2">{label}</p>}
        <h2 className="report-h2">{title}</h2>
        {subtitle && <p className="report-body mt-2 max-w-2xl">{subtitle}</p>}
      </header>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

export function ReportSectionHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <h3 className="report-h3">{title}</h3>
      {description && (
        <p className="report-body text-[0.9375rem]">{description}</p>
      )}
    </div>
  )
}

export function ReportMetaLabel({ children }: { children: React.ReactNode }) {
  return <p className="report-caption">{children}</p>
}

export function ReportDivider() {
  return <hr className="border-[var(--workspace-border)]" />
}

interface InsightBlockProps {
  category: string
  priority?: string
  priorityVariant?: "high" | "medium" | "low" | "neutral"
  finding: string
  evidence: string
  implication: string
  findingLabel: string
  evidenceLabel: string
  implicationLabel: string
  className?: string
}

const priorityStyles = {
  high: "bg-[var(--workspace-danger-muted)] text-[var(--workspace-danger)] border-[var(--workspace-danger)]/20",
  medium: "bg-[var(--workspace-warning-muted)] text-[var(--workspace-warning)] border-[var(--workspace-warning)]/20",
  low: "bg-[var(--workspace-accent-muted)] text-[var(--workspace-accent)] border-[var(--workspace-accent)]/20",
  neutral: "bg-[var(--workspace-surface)] text-[var(--workspace-text-secondary)] border-[var(--workspace-border)]",
}

export function UnifiedInsightBlock({
  category,
  priority,
  priorityVariant = "neutral",
  finding,
  evidence,
  implication,
  findingLabel,
  evidenceLabel,
  implicationLabel,
  className,
}: InsightBlockProps) {
  return (
    <article
      className={cn(
        "report-card report-accent-line space-y-5 py-5 pl-6 pr-5 sm:py-6 sm:pl-7 sm:pr-6",
        className
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--workspace-text-primary)]">{category}</p>
        {priority && (
          <span
            className={cn(
              "rounded-md border px-2.5 py-0.5 text-xs font-medium",
              priorityStyles[priorityVariant]
            )}
          >
            {priority}
          </span>
        )}
      </header>
      <div className="space-y-4">
        <InsightStep label={findingLabel} content={finding} />
        <InsightStep label={evidenceLabel} content={evidence} muted />
        <InsightStep label={implicationLabel} content={implication} accent />
      </div>
    </article>
  )
}

function InsightStep({
  label,
  content,
  muted,
  accent,
}: {
  label: string
  content: string
  muted?: boolean
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "space-y-1.5",
        accent && "rounded-lg bg-[var(--workspace-accent-muted)] px-4 py-3"
      )}
    >
      <p className="report-caption">{label}</p>
      <p
        className={cn(
          "text-[0.9375rem] leading-relaxed",
          muted ? "text-[var(--workspace-text-secondary)]" : "text-[var(--workspace-text-primary)]",
          accent && "text-[var(--workspace-text-primary)]"
        )}
      >
        {content}
      </p>
    </div>
  )
}

export function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
  className,
}: {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-start justify-between gap-4 py-2 text-left transition-colors duration-200"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-[var(--workspace-text-primary)]">{title}</h3>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-[var(--workspace-text-muted)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  )
}
