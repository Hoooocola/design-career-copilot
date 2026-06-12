"use client"

import { Textarea } from "@/components/ui/textarea"
import { useLocale } from "@/components/providers/locale-provider"

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function JobDescriptionInput({
  value,
  onChange,
  error,
}: JobDescriptionInputProps) {
  const { messages } = useLocale()

  return (
    <div className="space-y-2">
      <label htmlFor="job-description" className="text-sm font-medium">
        {messages.form.jobDescription}
      </label>
      <p className="text-xs text-muted-foreground">
        {messages.form.jobDescriptionHint}
      </p>
      <Textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={messages.form.jobDescriptionPlaceholder}
        rows={8}
        className="min-h-40 resize-y font-mono text-xs leading-relaxed"
        aria-invalid={!!error}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
