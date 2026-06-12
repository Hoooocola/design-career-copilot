import { NextRequest, NextResponse } from "next/server"

import {
  BETA_INVITE_COOKIE,
  getBetaInviteCode,
} from "@/lib/auth/founder-session"

export async function GET() {
  return NextResponse.json({
    required: Boolean(getBetaInviteCode()),
  })
}

export async function POST(request: NextRequest) {
  const expected = getBetaInviteCode()

  if (!expected) {
    return NextResponse.json({ ok: true, required: false })
  }

  const body = (await request.json()) as { code?: string }
  if (!body.code || body.code.trim() !== expected) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true, required: true })
  response.cookies.set(BETA_INVITE_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
