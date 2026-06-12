import { Suspense } from "react"

import { BetaInvitePage } from "@/components/beta/beta-invite-page"

export const metadata = {
  title: "Beta Access — Design Career Copilot",
}

export default function BetaPage() {
  return (
    <Suspense>
      <BetaInvitePage />
    </Suspense>
  )
}
