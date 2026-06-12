import { PDFParse } from "pdf-parse"

export interface ParsedPortfolio {
  text: string
  pageCount: number
  fileName: string
}

const MAX_TEXT_LENGTH = 48_000

export async function parsePortfolioPdf(
  buffer: Buffer,
  fileName: string
): Promise<ParsedPortfolio> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) })

  try {
    const textResult = await parser.getText()
    const rawText = textResult.text.trim()
    const pageCount = textResult.pages.length

    return {
      text:
        rawText.length > MAX_TEXT_LENGTH
          ? `${rawText.slice(0, MAX_TEXT_LENGTH)}\n\n[... truncated for analysis — ${rawText.length - MAX_TEXT_LENGTH} characters omitted]`
          : rawText,
      pageCount,
      fileName,
    }
  } finally {
    await parser.destroy()
  }
}
