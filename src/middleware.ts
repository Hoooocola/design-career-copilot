import { NextRequest, NextResponse } from "next/server"

import {
  BETA_INVITE_COOKIE,
  FOUNDER_AUTH_COOKIE,
  getBetaInviteCode,
  isBetaInviteValid,
  isFounderAuthenticated,
} from "@/lib/auth/founder-session"

const PUBLIC_PATHS = [
  "/api/beta/verify",
  "/api/founder/login",
  "/api/ai-status",
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) return true
  if (pathname.startsWith("/_next")) return true
  if (pathname.startsWith("/favicon")) return true
  if (pathname === "/beta") return true
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const betaCode = getBetaInviteCode()
  const founderBypassBeta =
    pathname.startsWith("/founder") || pathname.startsWith("/api/founder")

  if (betaCode && !founderBypassBeta) {
    const betaCookie = request.cookies.get(BETA_INVITE_COOKIE)?.value
    if (!isBetaInviteValid(betaCookie)) {
      const url = request.nextUrl.clone()
      url.pathname = "/beta"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith("/founder")) {
    if (pathname === "/founder/login") {
      return NextResponse.next()
    }

    const founderCookie = request.cookies.get(FOUNDER_AUTH_COOKIE)?.value
    if (!isFounderAuthenticated(founderCookie)) {
      const url = request.nextUrl.clone()
      url.pathname = "/founder/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  if (
    (pathname.startsWith("/api/feedback") ||
      pathname.startsWith("/api/analytics/events")) &&
    request.method === "GET"
  ) {
    const founderCookie = request.cookies.get(FOUNDER_AUTH_COOKIE)?.value
    if (!isFounderAuthenticated(founderCookie)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
