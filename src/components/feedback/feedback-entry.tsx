"use client"

import Link from "next/link"
import { ArrowRight, MessageSquarePlus } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"

export function FeedbackEntry() {
  const { messages } = useLocale()
  const fb = messages.feedback.entry

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 via-muted/10 to-transparent px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/60">
          <MessageSquarePlus className="size-4 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">{fb.title}</h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {fb.estimatedTime}
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
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
