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
      <header className="border-b border-[var(--report-border)] pb-6">
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
  return <hr className="border-[var(--report-border)]" />
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
  high: "bg-[var(--report-negative-bg)] text-[var(--report-negative)] border-[var(--report-negative)]/20",
  medium: "bg-[var(--report-caution-bg)] text-[var(--report-caution)] border-[var(--report-caution)]/20",
  low: "bg-[var(--report-accent-muted)] text-[var(--report-accent)] border-[var(--report-accent)]/20",
  neutral: "bg-[var(--report-paper)] text-[var(--report-text-muted)] border-[var(--report-border)]",
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
        <p className="text-sm font-semibold text-[var(--report-text)]">{category}</p>
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
        accent && "rounded-lg bg-[var(--report-accent-muted)] px-4 py-3"
      )}
    >
      <p className="report-caption">{label}</p>
      <p
        className={cn(
          "text-[0.9375rem] leading-relaxed",
          muted ? "text-[var(--report-text-muted)]" : "text-[var(--report-text)]",
          accent && "text-[var(--report-text)]"
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
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--report-border)] bg-[var(--report-paper)]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--report-card)] sm:px-6"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--report-text)]">{title}</h3>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-[var(--report-text-muted)]">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-[var(--report-text-subtle)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="border-t border-[var(--report-border)] px-5 py-5 sm:px-6">
          {children}
        </div>
      )}
    </div>
  )
}
