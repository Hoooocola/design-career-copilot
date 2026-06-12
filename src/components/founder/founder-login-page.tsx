"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"

export function FounderLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { messages } = useLocale()
  const fl = messages.founder.login

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const next = searchParams.get("next") || "/founder"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/founder/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? fl.error)

      router.replace(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : fl.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer size="narrow" className="py-20 sm:py-28">
      <div className="mx-auto max-w-sm">
        <div className="mb-6 flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/20">
          <Lock className="size-4 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{fl.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{fl.description}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="founder-password"
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {fl.passwordLabel}
            </label>
            <input
              id="founder-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? fl.submitting : fl.submit}
          </Button>
        </form>
      </div>
    </PageContainer>
  )
}
