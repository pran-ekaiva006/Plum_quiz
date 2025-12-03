import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { QuizPayload } from '../types/quiz'

interface QuizState {
  topic: string | null
  quiz: QuizPayload | null
  currentIndex: number
  answers: Record<string, number> // question.id -> chosen index
  loading: boolean
  error: string | null
  setTopic: (t: string | null) => void
  setQuiz: (q: QuizPayload | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  answer: (questionId: string, idx: number) => void
  next: () => void
  prev: () => void
  reset: () => void
}

export const useQuizStore = create<QuizState>()(persist((set, get) => ({
  topic: null,
  quiz: null,
  currentIndex: 0,
  answers: {},
  loading: false,
  error: null,
  setTopic: (t) => set({ topic: t }),
  setQuiz: (q) => set({ quiz: q, currentIndex: 0, answers: {} }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
  answer: (id, idx) => set({ answers: { ...get().answers, [id]: idx } }),
  next: () => {
    const { quiz, currentIndex } = get()
    if (!quiz) return
    set({ currentIndex: Math.min(currentIndex + 1, quiz.questions.length - 1) })
  },
  prev: () => {
    const { currentIndex } = get()
    set({ currentIndex: Math.max(currentIndex - 1, 0) })
  },
  reset: () => set({ topic: null, quiz: null, currentIndex: 0, answers: {}, loading: false, error: null })
}), { 
  name: 'ai-quiz-store',
  storage: createJSONStorage(() => localStorage),
  // Only persist the data, not the functions
  partialize: (state) => ({
    topic: state.topic,
    quiz: state.quiz,
    currentIndex: state.currentIndex,
    answers: state.answers,
  }),
}))
