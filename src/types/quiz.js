import { z } from 'zod'

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3)
})

export const QuizPayloadSchema = z.object({
  topic: z.string(),
  questions: z.array(QuizQuestionSchema).length(5)
})



export const FeedbackSchema = z.object({
  score: z.number().int().min(0).max(5),
  message: z.string()
})

