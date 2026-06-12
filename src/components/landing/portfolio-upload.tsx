"use client"

import { FileText, Upload, X } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

interface PortfolioUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
}

export function PortfolioUpload({
  file,
  onFileChange,
  error,
}: PortfolioUploadProps) {
  const { messages } = useLocale()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") {
      onFileChange(dropped)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) onFileChange(selected)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{messages.form.portfolio}</label>
      <p className="text-xs text-muted-foreground">{messages.form.portfolioHint}</p>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={messages.common.removeFile}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-10 transition-colors hover:border-border hover:bg-muted/40",
            error && "border-destructive/50"
          )}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={messages.common.uploadPdf}
          />
          <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-border/60 bg-background transition-colors group-hover:border-border">
            <Upload className="size-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">{messages.form.dropPdf}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {messages.form.browseHint}
          </p>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
