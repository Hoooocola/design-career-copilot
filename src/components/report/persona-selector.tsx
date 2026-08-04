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
                "rounded-lg px-3 py-2.5 text-left transition-colors duration-200",
                selected
                  ? "bg-[var(--workspace-accent-muted)] text-[var(--workspace-accent)] ring-1 ring-[color-mix(in_oklch,var(--workspace-accent)_35%,transparent)]"
                  : "text-[var(--workspace-text-secondary)] hover:bg-[var(--workspace-surface-raised)] hover:text-[var(--workspace-text-primary)]",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  selected
                    ? "text-[var(--workspace-accent)]"
                    : "text-[var(--workspace-text-primary)]"
                )}
              >
                {messages.report.reviewerPersonas[persona]}
              </p>
              {!compact && (
                <p className="mt-1 text-xs leading-relaxed text-[var(--workspace-text-secondary)]">
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
