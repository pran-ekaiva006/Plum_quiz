import { QuizPayloadSchema, FeedbackSchema } from '../types/quiz.js'
import { safeJsonParse, sleep } from '../utils.js'

// --- Prompt Templates ---
export const QUIZ_JSON_PROMPT = (topic) => `
You are a quiz generator. Return STRICT JSON ONLY. No prose.
Schema:
{
  "topic": string,
  "questions": [
    {
      "id": string,
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": 0 | 1 | 2 | 3
    },
    ... exactly 5 total
  ]
}
Rules:
- Use everyday language, no jargon.
- Avoid ambiguous wording.
- Ensure one and only one correct answer (correctIndex).
- Never include explanations.
- Output MUST be valid JSON matching the schema.
Generate for topic: "${topic}".
`

export const FEEDBACK_PROMPT = (topic, score) => `
You are a friendly coach. Based on score ${score}/5 on topic "${topic}", write 2 short sentences of encouragement + 1 concrete tip. Keep it under 45 words, no emojis.
Return plain text.
`

// --- Runtime options ---
const USE_MOCK = import.meta.env?.VITE_USE_MOCK === 'true'

/**
 * Generate quiz questions using AI
 * @param {string} topic - Quiz topic
 * @returns {Promise<Object>} Quiz payload with questions
 */
export async function generateQuiz(topic) {
  if (USE_MOCK) {
    const mock = {
      topic,
      questions: Array.from({ length: 5 }).map((_, i) => ({
        id: `${topic.toLowerCase().replace(/\s+/g, '-')}-${i+1}`,
        question: `Sample ${topic} question #${i+1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: i % 4
      }))
    }
    await sleep(800)
    return mock
  }

  const endpoint = import.meta.env?.VITE_AI_ENDPOINT ?? 'http://localhost:3001/api/generate'
  const apiKey = import.meta.env?.VITE_AI_API_KEY
  
  if (!endpoint || !apiKey) {
    throw new Error("AI endpoint or API key missing. Use .env or set VITE_USE_MOCK=true")
  }

  let lastErr = null
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: QUIZ_JSON_PROMPT(topic) }],
          model: 'llama-3.1-8b-instant',
          temperature: 0.2
        })
      })
      
      if (!resp.ok) {
        const errorText = await resp.text()
        console.error('API Error:', errorText)
        throw new Error(`Upstream ${resp.status}: ${errorText}`)
      }
      
      const json = await resp.json()
      const text = json.choices?.[0]?.message?.content
      
      if (!text) {
        throw new Error("No content in AI response")
      }
      
      const data = safeJsonParse(QuizPayloadSchema, text)
      return data
      
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err)
      lastErr = err
      if (attempt < 2) await sleep(400)
    }
  }
  
  throw lastErr ?? new Error("Failed to generate quiz")
}

/**
 * Generate AI feedback based on quiz score
 * @param {string} topic - Quiz topic
 * @param {number} score - User's score (0-5)
 * @returns {Promise<Object>} Feedback object with score and message
 */
export async function generateFeedback(topic, score) {
  if (USE_MOCK) {
    await sleep(400)
    return { 
      score, 
      message: score >= 3 
        ? "Nice work! You've got a solid grasp—review the misses and try again. Tip: note tricky terms in a mini cheatsheet." 
        : "Good start! Revisit the basics and retry. Tip: read each option aloud and eliminate two wrong choices first." 
    }
  }

  const endpoint = import.meta.env?.VITE_AI_ENDPOINT ?? 'http://localhost:3001/api/generate'
  const apiKey = import.meta.env?.VITE_AI_API_KEY
  
  if (!endpoint || !apiKey) {
    throw new Error("AI endpoint or API key missing. Use .env or set VITE_USE_MOCK=true")
  }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: FEEDBACK_PROMPT(topic, score) }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7
    })
  })
  
  if (!resp.ok) {
    throw new Error(`Upstream ${resp.status}`)
  }
  
  const json = await resp.json()
  const message = json.choices?.[0]?.message?.content ?? "Could not get feedback."
  const out = { score, message }
  
  return FeedbackSchema.parse(out)
}
