import { mkdir, readFile, writeFile } from "fs/promises"

import { getDataDir, getDataFilePath } from "@/lib/data-path"
import type { FeedbackStore, FeedbackSubmission } from "@/types/feedback"

const FILE_NAME = "feedback-submissions.json"

function getStorePath(): string {
  return getDataFilePath(FILE_NAME)
}

async function ensureStoreFile(): Promise<FeedbackStore> {
  const filePath = getStorePath()
  await mkdir(getDataDir(), { recursive: true })

  try {
    const raw = await readFile(filePath, "utf8")
    const parsed = JSON.parse(raw) as FeedbackStore
    if (parsed.version === 1 && Array.isArray(parsed.submissions)) {
      return parsed
    }
  } catch {
    // initialize below
  }

  const empty: FeedbackStore = { version: 1, submissions: [] }
  await writeFile(filePath, JSON.stringify(empty, null, 2), "utf8")
  return empty
}

export async function readFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
  const store = await ensureStoreFile()
  return store.submissions
}

export async function appendFeedbackSubmission(
  submission: FeedbackSubmission
): Promise<FeedbackSubmission[]> {
  const store = await ensureStoreFile()
  const submissions = [
    submission,
    ...store.submissions.filter((item) => item.id !== submission.id),
  ].slice(0, 500)

  await writeFile(
    getStorePath(),
    JSON.stringify({ version: 1, submissions }, null, 2),
    "utf8"
  )

  return submissions
}
