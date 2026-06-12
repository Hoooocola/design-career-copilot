"use client"

import { cn } from "@/lib/utils"

export function StarRatingInput({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void
  label: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium leading-snug">{label}</p>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {([1, 2, 3, 4, 5] as const).map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            onClick={() => onChange(star)}
            className={cn(
              "rounded-md px-1.5 py-1 text-lg leading-none transition-colors",
              value >= star
                ? "text-amber-400"
                : "text-muted-foreground/30 hover:text-muted-foreground/50"
            )}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

export function CheckboxOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/20 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
      />
      <span className="text-sm leading-snug">{label}</span>
    </label>
  )
}

export function RadioOption({
  checked,
  onChange,
  name,
  label,
}: {
  checked: boolean
  onChange: () => void
  name: string
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/20 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 border-border accent-primary"
      />
      <span className="text-sm">{label}</span>
    </label>
  )
}

export function NpsInput({
  value,
  onChange,
  label,
}: {
  value: number | null
  onChange: (value: number) => void
  label: string
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium leading-snug">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 11 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              "min-w-9 rounded-md border px-2 py-1.5 font-mono text-xs tabular-nums transition-colors",
              value === index
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border/50 bg-muted/10 text-muted-foreground hover:bg-muted/25"
            )}
          >
            {index}
          </button>
        ))}
      </div>
    </div>
  )
}

export function FeedbackSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/30">
      <header className="border-b border-border/40 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </header>
      <div className="space-y-5 px-5 py-5">{children}</div>
    </section>
  )
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium leading-snug text-foreground">{children}</p>
  )
}
