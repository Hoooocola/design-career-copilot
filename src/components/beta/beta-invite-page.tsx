"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { KeyRound } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"

export function BetaInvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { messages } = useLocale()
  const beta = messages.beta

  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const next = searchParams.get("next") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/beta/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? beta.error)

      router.replace(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : beta.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer size="narrow" className="py-20 sm:py-28">
      <div className="mx-auto max-w-sm text-center">
        <div className="mx-auto mb-6 flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/20">
          <KeyRound className="size-4 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{beta.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {beta.description}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div className="space-y-2">
            <label
              htmlFor="beta-code"
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {beta.codeLabel}
            </label>
            <input
              id="beta-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              autoComplete="off"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? beta.submitting : beta.submit}
          </Button>
        </form>
      </div>
    </PageContainer>
  )
}
