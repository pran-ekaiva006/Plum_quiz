import React, { useState } from 'react'

const TOPICS = [
  { value: 'Wellness', icon: '🧘', description: 'Health & well-being practices' },
  { value: 'Tech Trends', icon: '💻', description: 'Latest in technology' },
  { value: 'Nutrition', icon: '🥗', description: 'Food & dietary science' },
  { value: 'Fitness', icon: '💪', description: 'Exercise & body health' },
  { value: 'Mental Health', icon: '🧠', description: 'Psychological wellness' }
]

/**
 * TopicPicker component for selecting quiz topic
 * @param {Object} props
 * @param {(topic: string) => void} props.onStart - Callback when quiz starts
 */
export default function TopicPicker({ onStart }) {
  const [selected, setSelected] = useState('')
  const [hoveredTopic, setHoveredTopic] = useState(null)

  return (
    <div className="app-card landing-page">
      <div className="hero-section">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          AI-Powered Learning
        </div>
        <h1 className="hero-title">
          Test Your Knowledge
          <span className="gradient-text"> with AI</span>
        </h1>
        <p className="hero-description">
          Choose a topic and challenge yourself with 5 AI-generated multiple-choice questions.
          Get instant feedback and track your progress.
        </p>
      </div>

      <div className="topic-grid">
        {TOPICS.map(topic => (
          <button
            key={topic.value}
            className={`topic-card ${selected === topic.value ? 'selected' : ''} ${hoveredTopic === topic.value ? 'hovered' : ''}`}
            onClick={() => setSelected(topic.value)}
            onMouseEnter={() => setHoveredTopic(topic.value)}
            onMouseLeave={() => setHoveredTopic(null)}
          >
            <div className="topic-icon">{topic.icon}</div>
            <div className="topic-content">
              <div className="topic-name">{topic.value}</div>
              <div className="topic-description">{topic.description}</div>
            </div>
            {selected === topic.value && (
              <div className="check-icon">✓</div>
            )}
          </button>
        ))}
      </div>

      <button 
        className="btn primary start-btn" 
        disabled={!selected} 
        onClick={() => onStart(selected)}
      >
        <span>Generate Quiz</span>
        <span className="arrow">→</span>
      </button>

      <div className="features-grid">
        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <span className="feature-text">5 Questions</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">✨</span>
          <span className="feature-text">AI Generated</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📊</span>
          <span className="feature-text">Instant Feedback</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔄</span>
          <span className="feature-text">Retry & Learn</span>
        </div>
      </div>
    </div>
  )
}
