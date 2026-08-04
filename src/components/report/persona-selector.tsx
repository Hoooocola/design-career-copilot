"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

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
  const ws = messages.report.workspace

  if (compact) {
    return (
      <PersonaDropdown
        value={value}
        onChange={onChange}
        disabled={disabled}
        label={ws.perspective}
      />
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{messages.form.reviewerPersona}</p>
      <p className="text-xs text-muted-foreground">
        {messages.form.reviewerPersonaHint}
      </p>
      <div
        role="radiogroup"
        aria-label={fw.switchReviewer}
        className="grid gap-2 sm:grid-cols-2"
      >
        {REVIEWER_PERSONAS.map((persona) => (
          <PersonaOption
            key={persona}
            persona={persona}
            selected={value === persona}
            disabled={disabled}
            onSelect={onChange}
            showDescription
          />
        ))}
      </div>
    </div>
  )
}

function PersonaDropdown({
  value,
  onChange,
  disabled,
  label,
}: {
  value: ReviewerPersona
  onChange: (persona: ReviewerPersona) => void
  disabled?: boolean
  label: string
}) {
  const { messages } = useLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-flex items-center gap-2">
      <span className="text-metadata">{label}</span>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium text-[var(--workspace-text-primary)] transition-colors duration-200 hover:text-[var(--workspace-text-secondary)]",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {messages.report.reviewerPersonas[value]}
        <ChevronDown
          className={cn(
            "size-3.5 text-[var(--workspace-text-muted)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={messages.report.framework.switchReviewer}
          className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-lg border border-[color-mix(in_oklch,var(--workspace-border)_70%,transparent)] bg-[var(--workspace-surface)] py-1 shadow-[0_12px_40px_color-mix(in_oklch,var(--workspace-text-primary)_8%,transparent)]"
        >
          {REVIEWER_PERSONAS.map((persona) => {
            const selected = persona === value
            return (
              <button
                key={persona}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(persona)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm transition-colors duration-200",
                  selected
                    ? "text-[var(--workspace-text-primary)]"
                    : "text-[var(--workspace-text-secondary)] hover:bg-[var(--workspace-surface-raised)] hover:text-[var(--workspace-text-primary)]"
                )}
              >
                {messages.report.reviewerPersonas[persona]}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PersonaOption({
  persona,
  selected,
  disabled,
  onSelect,
  showDescription,
}: {
  persona: ReviewerPersona
  selected: boolean
  disabled?: boolean
  onSelect: (persona: ReviewerPersona) => void
  showDescription?: boolean
}) {
  const { messages } = useLocale()

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(persona)}
      className={cn(
        "rounded-lg px-3 py-2.5 text-left transition-colors duration-200",
        selected
          ? "bg-[var(--workspace-surface-raised)] text-[var(--workspace-text-primary)] ring-1 ring-[color-mix(in_oklch,var(--workspace-border)_80%,transparent)]"
          : "text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-surface-raised)] hover:text-[var(--workspace-text-secondary)]",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <p className="text-sm font-medium text-[var(--workspace-text-primary)]">
        {messages.report.reviewerPersonas[persona]}
      </p>
      {showDescription && (
        <p className="mt-1 text-xs leading-relaxed text-[var(--workspace-text-secondary)]">
          {messages.report.reviewerPersonaDescriptions[persona]}
        </p>
      )}
    </button>
  )
}
