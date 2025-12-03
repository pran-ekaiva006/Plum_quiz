import { z } from 'zod'

/**
 * Safely parse JSON from AI response using Zod schema validation
 * @param {import('zod').ZodType} schema - Zod schema to validate against
 * @param {string} raw - Raw text response from AI
 * @returns {*} Validated parsed data
 */
export function safeJsonParse(schema, raw) {
  // Try to extract JSON block from response
  const first = raw.indexOf('{')
  const last = raw.lastIndexOf('}')
  const candidate = (first !== -1 && last !== -1) ? raw.slice(first, last + 1) : raw
  
  try {
    const parsed = JSON.parse(candidate)
    const validated = schema.parse(parsed)
    return validated
  } catch (e) {
    throw new Error('Invalid JSON content received from AI.')
  }
}

/**
 * Utility function to pause execution
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
