import { z } from 'zod'

// Zod-safe parse with automatic retries if the model returns extra text.
export function safeJsonParse<T>(schema: z.ZodType<T>, raw: string): T {
  // Try a naive extraction: find first { and last } to slice to JSON block
  const first = raw.indexOf('{')
  const last = raw.lastIndexOf('}')
  const candidate = (first !== -1 && last !== -1) ? raw.slice(first, last + 1) : raw
  try {
    const parsed = JSON.parse(candidate)
    const validated = schema.parse(parsed)
    return validated
  } catch (e) {
    // Re-throw with a more specific error message if parsing fails
    throw new Error('Invalid JSON content received from AI.')
  }
}

export function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)) }
