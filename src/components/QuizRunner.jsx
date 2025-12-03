import React, { useEffect, useMemo, useState } from 'react'
import { useQuizStore } from '../state/quizStore.js'
import { generateQuiz, generateFeedback } from '../services/aiService.js'

/**
 * QuizRunner component for quiz interface
 * @param {Object} props
 * @param {() => void} props.onReset - Callback to reset quiz
 */
export default function QuizRunner({ onReset }) {
  const { 
    topic, 
    quiz, 
    setQuiz, 
    currentIndex, 
    next, 
    prev, 
    answers, 
    answer, 
    loading, 
    setLoading, 
    setError, 
    error 
  } = useQuizStore()
  
  const [feedback, setFeedback] = useState(null)
  const [fbLoading, setFbLoading] = useState(false)

  useEffect(() => {
    if (!topic || quiz) return
    
    const loadQuiz = async () => {
      try {
        setLoading(true)
        setError(null)
        const q = await generateQuiz(topic)
        setQuiz(q)
      } catch (e) {
        setError(e?.message ?? 'Failed to generate quiz')
      } finally {
        setLoading(false)
      }
    }
    
    loadQuiz()
  }, [topic, quiz, setQuiz, setLoading, setError])

  const completed = useMemo(() => {
    return quiz ? Object.keys(answers).length === quiz.questions.length : false
  }, [quiz, answers])

  const score = useMemo(() => {
    if (!completed || !quiz) return 0
    return quiz.questions.reduce((acc, qq) => {
      return acc + ((answers[qq.id] === qq.correctIndex) ? 1 : 0)
    }, 0)
  }, [completed, quiz, answers])

  if (!topic) return null

  const regenerate = async () => {
    if (!topic) return
    try {
      setLoading(true)
      setError(null)
      setFeedback(null)
      const q = await generateQuiz(topic)
      setQuiz(q)
    } catch (e) {
      setError(e?.message ?? 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app-card loader-container">
        <div className="spinner"></div>
        <div className="badge primary">Generating MCQs…</div>
        <div className="loader-progress">
          <div className="progress">
            <div className="progress-bar" style={{ width: '65%' }}></div>
          </div>
        </div>
        <p className="loader-text">Calling AI and validating JSON…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-card">
        <h2 className="quiz-title">Something went wrong</h2>
        <p className="text-secondary mb-lg">{error}</p>
        <div className="btn-group">
          <button className="btn primary" onClick={regenerate}>Retry</button>
          <button className="btn ghost" onClick={onReset}>Change Topic</button>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  const q = quiz.questions[currentIndex]
  const chosen = answers[q.id]
  const isAnswered = chosen !== undefined

  const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100)
  const answeredCount = Object.keys(answers).length

  const getFeedback = async () => {
    setFbLoading(true)
    try {
      const fb = await generateFeedback(quiz.topic, score)
      setFeedback(fb.message)
    } catch (e) {
      setFeedback("Couldn't fetch feedback right now. Try again later.")
    } finally {
      setFbLoading(false)
    }
  }

  return (
    <div className="app-card">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-info">
          <div className="badge primary">{quiz.topic}</div>
          <h2 className="quiz-title">
            Question {currentIndex + 1} / {quiz.questions.length}
          </h2>
          <div className="quiz-progress-text">
            {answeredCount} of {quiz.questions.length} answered
          </div>
        </div>
        <button className="btn ghost" onClick={onReset}>Change Topic</button>
      </div>

      {/* Progress Bar */}
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="card question-card">
        <div className="question-text">{q.question}</div>
        <div className="options-container">
          {q.options.map((opt, idx) => {
            const isChosen = chosen === idx
            const isCorrect = completed && q.correctIndex === idx
            const isWrong = completed && isChosen && !isCorrect
            
            let className = 'btn option-btn'
            if (completed) {
              if (isCorrect) className += ' correct'
              else if (isWrong) className += ' wrong'
            } else if (isChosen) {
              className += ' selected'
            }
            
            return (
              <button
                key={idx}
                className={className}
                onClick={() => !completed && answer(q.id, idx)}
                disabled={completed}
              >
                <span className="option-label">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {!completed && !isAnswered && (
          <div className="alert warning">
            <span>⚠️</span>
            <span>Please select an answer before moving to the next question</span>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="nav-controls">
        <div className="nav-buttons">
          <button 
            className="btn" 
            onClick={prev} 
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <button 
            className="btn" 
            onClick={next} 
            disabled={currentIndex === quiz.questions.length - 1}
          >
            Next →
          </button>
        </div>
        <button className="btn primary" onClick={regenerate}>
          🔄 Regenerate
        </button>
      </div>

      {/* Question Navigation Dots */}
      {!completed && (
        <div className="question-dots">
          {quiz.questions.map((question, idx) => {
            const isCurrentQuestion = idx === currentIndex
            const isQuestionAnswered = answers[question.id] !== undefined
            
            let className = 'btn dot-btn'
            if (isCurrentQuestion) className += ' active'
            if (isQuestionAnswered) className += ' answered'
            
            return (
              <button
                key={question.id}
                className={className}
                onClick={() => useQuizStore.setState({ currentIndex: idx })}
                title={`Question ${idx + 1}${isQuestionAnswered ? ' (answered)' : ''}`}
              >
                {isQuestionAnswered ? '✓' : idx + 1}
              </button>
            )
          })}
        </div>
      )}

      {/* Results Section */}
      {completed && (
        <div className="card results-card">
          <div className="results-header">
            <div className="results-info">
              <div className={`score-display ${score >= 3 ? 'pass' : 'fail'}`}>
                Score: {score} / {quiz.questions.length}
              </div>
              <div className="score-message">
                {score === 5 ? '🎉 Perfect score!' : score >= 3 ? '👍 Good job!' : '💪 Keep practicing!'}
              </div>
              <div className="score-hint">
                Correct answers are highlighted in green above.
              </div>
            </div>
            <div className="results-actions">
              <button className="btn" onClick={getFeedback} disabled={fbLoading}>
                {fbLoading ? '⏳ Loading...' : '💬 Get AI Feedback'}
              </button>
              <button className="btn danger" onClick={onReset}>
                🏠 Start Over
              </button>
            </div>
          </div>
          
          {feedback && (
            <div className="feedback-box">
              <div className="feedback-title">
                <span>🤖</span>
                <span>AI Feedback</span>
              </div>
              <p className="feedback-message">{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
