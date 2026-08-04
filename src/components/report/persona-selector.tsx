"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { REVIEWER_PERSONAS } from "@/types/reviewer"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface PersonaSelectorProps {
  value: ReviewerPersona
  onChange: (persona: ReviewerPersona) => void
  disabled?: boolean
  compact?: boolean
}

export function PersonaSelector({
  value,
  onChange,
  disabled,
  compact,
}: PersonaSelectorProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework

  return (
    <div className="space-y-2">
      {!compact && (
        <>
          <p className="text-sm font-medium">{messages.form.reviewerPersona}</p>
          <p className="text-xs text-muted-foreground">
            {messages.form.reviewerPersonaHint}
          </p>
        </>
      )}
      <div
        role="radiogroup"
        aria-label={fw.switchReviewer}
        className={cn(
          "grid gap-2",
          compact ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"
        )}
      >
        {REVIEWER_PERSONAS.map((persona) => {
          const selected = value === persona
          return (
            <button
              key={persona}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(persona)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left transition-colors",
                selected
                  ? "border-[var(--report-accent)] bg-[var(--report-accent-muted)]"
                  : "border-[var(--report-border)] bg-[var(--report-card)] hover:border-[var(--report-border-strong)]",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <p className="text-sm font-medium text-[var(--report-text)]">
                {messages.report.reviewerPersonas[persona]}
              </p>
              {!compact && (
                <p className="mt-1 text-xs leading-relaxed text-[var(--report-text-muted)]">
                  {messages.report.reviewerPersonaDescriptions[persona]}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
