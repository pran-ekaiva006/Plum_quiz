# AI-Assisted Knowledge Quiz

An interactive quiz application that generates multiple-choice questions using AI (Groq API). Built with React and Zustand for state management.

## Features

- 🤖 **AI-Powered Question Generation** - Uses Groq's LLaMA 3.1 model to generate quiz questions
- ✅ **JSON Schema Validation** - Ensures AI responses match expected format using Zod
- 🔄 **Automatic Retries** - Handles API failures gracefully with retry logic
- 📊 **Progress Tracking** - Visual progress bar and question navigation
- 💬 **AI Feedback** - Get personalized feedback based on your score
- 🎨 **Smooth Transitions** - Fade animations between screens
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + JavaScript (Vite)
- **State Management**: Zustand
- **Validation**: Zod
- **AI API**: Groq (LLaMA 3.1-8b-instant)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key (free tier available at [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pran-ekaiva006/Plum_quiz.git
cd Plum_quiz
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_AI_API_KEY=your_groq_api_key_here
VITE_AI_ENDPOINT=http://localhost:3001/api/generate
# Optional: Use mock data instead of real API
VITE_USE_MOCK=false
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Setting Up the Proxy Server

If you're using the local proxy (recommended for CORS handling):

1. Navigate to the server directory:
```bash
cd server
npm install
```

2. Create a `.env` file in the `server` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
PORT=3001
```

3. Run the proxy:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── TopicPicker.jsx    # Topic selection screen
│   └── QuizRunner.jsx     # Quiz interface and logic
├── services/
│   └── aiService.js       # AI API integration
├── state/
│   └── quizStore.js       # Zustand store
├── types/
│   └── quiz.js            # Zod schemas
├── utils.js               # Utility functions
├── App.jsx                # Main app component
├── App.css                # Transition styles
└── main.jsx               # Entry point
```

## Usage

1. **Select a Topic**: Choose from predefined topics or enter a custom one
2. **Answer Questions**: Select answers for all 5 multiple-choice questions
3. **Navigate**: Use Previous/Next buttons to review answers
4. **Get Feedback**: After completing, click "Get AI Feedback" for personalized tips
5. **Retry or Change**: Regenerate questions or start over with a new topic

## Key Features Explained

### Async Loaders
- Shows loading state while AI generates questions
- Displays progress bar during generation

### Retry Logic
- Automatically retries failed API calls (up to 2 attempts)
- Extracts JSON from malformed responses
- User-friendly error messages

### JSON Schema Validation
- Validates AI responses against Zod schemas
- Ensures type safety throughout the app
- Catches and handles invalid data

### Progress & Feedback
- Real-time progress tracking
- Visual indicators for correct/incorrect answers
- AI-generated feedback based on performance

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_AI_API_KEY` | Your Groq API key | Required |
| `VITE_AI_ENDPOINT` | API endpoint URL | `http://localhost:3001/api/generate` |
| `VITE_USE_MOCK` | Use mock data instead of API | `false` |

## Mock Mode

For testing without an API key:

```env
VITE_USE_MOCK=true
```

This will generate sample questions locally without calling the AI API.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built as part of SDE Intern Assignment – Problem 2
- Uses Groq's free LLaMA 3.1 API
- Inspired by modern quiz applications

## Contact

Pranjal Kumar Verma - [GitHub](https://github.com/pran-ekaiva006)

---

Built with ❤️ using React + JavaScript + Groq AI
