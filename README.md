# AI-Assisted Knowledge Quiz

An interactive quiz application that generates multiple-choice questions using AI (Groq API). Built with React, TypeScript, and Zustand for state management.

## Features

- 🤖 **AI-Powered Question Generation** - Uses Groq's LLaMA 3.1 model to generate quiz questions
- ✅ **JSON Schema Validation** - Ensures AI responses match expected format using Zod
- 🔄 **Automatic Retries** - Handles API failures gracefully with retry logic
- 📊 **Progress Tracking** - Visual progress bar and question navigation
- 💬 **AI Feedback** - Get personalized feedback based on your score
- 🎨 **Smooth Transitions** - Fade animations between screens
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
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

1. Create a simple proxy server on port 3001:
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

2. Run the proxy:
```bash
node server.js
```

## Project Structure

```
src/
├── components/
│   ├── TopicPicker.tsx    # Topic selection screen
│   └── QuizRunner.tsx     # Quiz interface and logic
├── services/
│   └── aiService.ts       # AI API integration
├── state/
│   └── quizStore.ts       # Zustand store
├── types/
│   └── quiz.ts            # TypeScript types and Zod schemas
├── utils.ts               # Utility functions
├── App.tsx                # Main app component
├── App.css                # Transition styles
└── main.tsx               # Entry point
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

Built with ❤️ using React + TypeScript + Groq AI
