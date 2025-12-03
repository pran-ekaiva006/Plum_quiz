import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * @typedef {Object} QuizState
 * @property {string | null} topic - Current quiz topic
 * @property {Object | null} quiz - Quiz data with questions
 * @property {number} currentIndex - Current question index
 * @property {Record<string, number>} answers - Map of question IDs to selected answer indices
 * @property {boolean} loading - Loading state
 * @property {string | null} error - Error message
 * @property {(t: string | null) => void} setTopic - Set current topic
 * @property {(q: Object | null) => void} setQuiz - Set quiz data
 * @property {(v: boolean) => void} setLoading - Set loading state
 * @property {(e: string | null) => void} setError - Set error message
 * @property {(questionId: string, idx: number) => void} answer - Record an answer
 * @property {() => void} next - Go to next question
 * @property {() => void} prev - Go to previous question
 * @property {() => void} reset - Reset entire state
 */

export const useQuizStore = create(
  persist(
    (set, get) => ({
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
      
      answer: (id, idx) => {
        const currentAnswers = get().answers
        set({ answers: { ...currentAnswers, [id]: idx } })
      },
      
      next: () => {
        const { quiz, currentIndex } = get()
        if (!quiz) return
        set({ currentIndex: Math.min(currentIndex + 1, quiz.questions.length - 1) })
      },
      
      prev: () => {
        const { currentIndex } = get()
        set({ currentIndex: Math.max(currentIndex - 1, 0) })
      },
      
      reset: () => set({ 
        topic: null, 
        quiz: null, 
        currentIndex: 0, 
        answers: {}, 
        loading: false, 
        error: null 
      })
    }),
    {
      name: 'ai-quiz-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        topic: state.topic,
        quiz: state.quiz,
        currentIndex: state.currentIndex,
        answers: state.answers,
      }),
    }
  )
)
