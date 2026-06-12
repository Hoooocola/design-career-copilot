import path from "path"

export function getDataDir(): string {
  const configured = process.env.FEEDBACK_DATA_DIR?.trim()
  if (configured) return configured
  return path.join(process.cwd(), ".data")
}

export function getDataFilePath(fileName: string): string {
  return path.join(getDataDir(), fileName)
}
