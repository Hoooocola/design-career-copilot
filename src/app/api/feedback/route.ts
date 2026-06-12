import { NextRequest, NextResponse } from "next/server"

import {
  FOUNDER_AUTH_COOKIE,
  isFounderAuthenticated,
} from "@/lib/auth/founder-session"
import { buildFeedbackAnalytics } from "@/lib/feedback/aggregate"
import {
  appendFeedbackSubmission,
  readFeedbackSubmissions,
} from "@/lib/feedback/server-store"
import type { FeedbackSubmission } from "@/types/feedback"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackSubmission

    if (!body?.reportId || !body?.persona || !body?.timestamp) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    const submission: FeedbackSubmission = {
      ...body,
      id: body.id || crypto.randomUUID(),
    }

    await appendFeedbackSubmission(submission)

    return NextResponse.json({ ok: true, id: submission.id })
  } catch (error) {
    console.error("[feedback POST]", error)
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(FOUNDER_AUTH_COOKIE)?.value

  if (!isFounderAuthenticated(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const submissions = await readFeedbackSubmissions()
    const analytics = buildFeedbackAnalytics(submissions)

    return NextResponse.json({
      analytics,
      submissions,
    })
  } catch (error) {
    console.error("[feedback GET]", error)
    return NextResponse.json({ error: "Failed to load feedback" }, { status: 500 })
  }
}
