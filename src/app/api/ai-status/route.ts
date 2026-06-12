import { NextResponse } from "next/server"

export async function GET() {
  const aiEnabled = Boolean(process.env.OPENAI_API_KEY?.trim())
  const provider = process.env.OPENAI_BASE_URL?.includes("deepseek")
    ? "deepseek"
    : process.env.OPENAI_BASE_URL
      ? "compatible"
      : "openai"

  return NextResponse.json({ aiEnabled, provider })
}
