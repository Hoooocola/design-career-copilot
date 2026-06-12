import { mkdir, readFile, writeFile } from "fs/promises"

import { getDataDir, getDataFilePath } from "@/lib/data-path"
import type { AnalyticsEvent, AnalyticsEventStore } from "@/types/analytics"

const FILE_NAME = "analytics-events.json"
const MAX_EVENTS = 10_000

async function ensureStore(): Promise<AnalyticsEventStore> {
  const filePath = getDataFilePath(FILE_NAME)
  await mkdir(getDataDir(), { recursive: true })

  try {
    const raw = await readFile(filePath, "utf8")
    const parsed = JSON.parse(raw) as AnalyticsEventStore
    if (parsed.version === 1 && Array.isArray(parsed.events)) {
      return parsed
    }
  } catch {
    // initialize
  }

  const empty: AnalyticsEventStore = { version: 1, events: [] }
  await writeFile(filePath, JSON.stringify(empty, null, 2), "utf8")
  return empty
}

export async function readAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const store = await ensureStore()
  return store.events
}

export async function appendAnalyticsEvent(
  event: AnalyticsEvent
): Promise<AnalyticsEvent[]> {
  const store = await ensureStore()
  const events = [event, ...store.events.filter((item) => item.id !== event.id)]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_EVENTS)

  await writeFile(
    getDataFilePath(FILE_NAME),
    JSON.stringify({ version: 1, events }, null, 2),
    "utf8"
  )

  return events
}
