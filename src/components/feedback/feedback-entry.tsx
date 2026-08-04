"use client"

import Link from "next/link"
import { ArrowRight, MessageSquarePlus } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"

export function FeedbackEntry() {
  const { messages } = useLocale()
  const fb = messages.feedback.entry

  return (
    <div className="rounded-xl bg-[var(--workspace-surface-raised)] px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <MessageSquarePlus className="mb-4 size-5 text-[var(--workspace-text-muted)]" />
        <h2 className="text-lg font-semibold tracking-tight text-[var(--workspace-text-primary)]">
          {fb.title}
        </h2>
        <p className="mt-2 text-xs uppercase tracking-wider text-[var(--workspace-text-muted)]">
          {fb.estimatedTime}
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {fb.description}
        </p>
        <Button
          size="lg"
          className="mt-6 gap-2"
          nativeButton={false}
          render={<Link href="/feedback" />}
        >
          {fb.cta}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
