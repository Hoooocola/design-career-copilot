import { NextRequest, NextResponse } from "next/server"

import {
  FOUNDER_AUTH_COOKIE,
  getFounderPassword,
  getFounderSessionToken,
} from "@/lib/auth/founder-session"

export async function POST(request: NextRequest) {
  const password = getFounderPassword()
  const token = getFounderSessionToken()

  if (!password || !token) {
    return NextResponse.json(
      { error: "Founder access is not configured" },
      { status: 503 }
    )
  }

  const body = (await request.json()) as { password?: string }
  if (!body.password || body.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(FOUNDER_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
