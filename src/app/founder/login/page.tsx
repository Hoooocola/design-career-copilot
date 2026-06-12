import { Suspense } from "react"

import { FounderLoginPage } from "@/components/founder/founder-login-page"

export const metadata = {
  title: "Founder Login — Design Career Copilot",
}

export default function FounderLoginRoute() {
  return (
    <Suspense>
      <FounderLoginPage />
    </Suspense>
  )
}
