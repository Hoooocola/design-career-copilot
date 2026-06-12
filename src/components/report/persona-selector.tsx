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
                "rounded-xl border px-3 py-3 text-left transition-all",
                selected
                  ? "border-border bg-muted/50 shadow-[0_0_20px_-6px_oklch(0.55_0.15_265/0.2)]"
                  : "border-border/50 bg-transparent hover:border-border hover:bg-muted/30",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <p className="text-sm font-medium">
                {messages.report.reviewerPersonas[persona]}
              </p>
              {!compact && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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
