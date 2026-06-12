"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { REVIEWER_PERSONAS } from "@/types/reviewer"

export function ReviewerPersonasHint() {
  const { messages } = useLocale()

  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-4">
      <p className="text-sm font-medium">{messages.form.reviewerPersona}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {messages.form.reviewerPersonaHint}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {REVIEWER_PERSONAS.map((persona) => (
          <li
            key={persona}
            className="rounded-lg border border-border/40 bg-background/50 px-3 py-2.5"
          >
            <p className="text-xs font-medium">
              {messages.report.reviewerPersonas[persona]}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              {messages.report.reviewerPersonaDescriptions[persona]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
