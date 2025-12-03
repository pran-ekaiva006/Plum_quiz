import React, { useState } from 'react'
import './App.css'
import TopicPicker from './components/TopicPicker.jsx'
import QuizRunner from './components/QuizRunner.jsx'
import { useQuizStore } from './state/quizStore.js'

export default function App() {
  const { topic, reset, setTopic } = useQuizStore()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStart = (selectedTopic) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setTopic(selectedTopic)
      setIsTransitioning(false)
    }, 300)
  }

  const handleReset = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      reset()
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="container">
      <div className={`fade-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        {topic ? (
          <QuizRunner onReset={handleReset} />
        ) : (
          <TopicPicker onStart={handleStart} />
        )}
      </div>
      <footer className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 12 }}>
        Built for SDE Intern Assignment – Problem 2 · Async loaders, retries, JSON schema validation, progress & feedback
      </footer>
    </div>
  )
}
