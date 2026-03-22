🚀 AI-Powered Business News Platform
📌 Overview

This project reimagines how business news is consumed in 2026. Instead of static articles, it delivers interactive, personalized, and AI-driven news experiences tailored to each user.

The platform combines multiple innovative modules:

My ET (Personalized Newsroom)
News Navigator (Interactive Briefings)
AI News Video Studio
Story Arc Tracker
Vernacular Business News Engine
✨ Features
1. Personalized Newsroom (My ET)
User-specific news feed
Context-aware recommendations
Role-based content (investor, student, founder, etc.)
2. News Navigator
AI-generated deep briefings
Summarizes multiple articles into one interactive document
Supports follow-up questions
3. AI News Video Studio
Converts articles into short videos (60–120 sec)
AI narration + visuals
Automated script generation
4. Story Arc Tracker
Tracks ongoing business stories
Timeline visualization
Sentiment analysis
Predictive insights
5. Vernacular News Engine
Real-time translation into regional languages
Context-aware explanations (not literal translation)
🛠️ Tech Stack

Frontend

React.js
Tailwind CSS

Backend

Node.js
Express.js

AI/ML

OpenAI API / LLMs
NLP pipelines
Speech synthesis (TTS)

Database

MongoDB / PostgreSQL

Other Tools

FFmpeg (video generation)
Redis (caching)

⚙️ Setup Instructions

1. Clone Repository
   git clone https://github.com/bhaveshkatari-beep/ET-NEWS-WORLD-AI.git
cd ET-NEWS-WORLD-AI

2. Install Dependencies

Backend
   cd backend
npm install

Frontend
cd ../frontend
npm install

3. Environment Variables

Create a .env file in the backend folder:
PORT=5000
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_db_url
REDIS_URL=your_redis_url

4. Run the Application

   Start Backend
   cd backend
npm run dev

Start Frontend
cd frontend
npm start

5. Access App
http://localhost:3000

📂 Project Structure
ai-news-platform/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── ai-modules/
│   ├── summarizer/
│   ├── video-generator/
│   ├── translator/
│   └── sentiment-analysis/
│
└── README.md

🔄 Sample Commit History (Build Process)

commit 1: Initial project setup
- Created repository
- Added README and project structure

commit 2: Backend setup
- Initialized Node.js server
- Configured Express routes

commit 3: Frontend setup
- Created React app
- Added basic UI layout

commit 4: Integrated database
- Connected MongoDB
- Created user and news schemas

commit 5: Implemented personalization engine
- Added user preference model
- Built recommendation logic

commit 6: News Navigator module
- Integrated LLM summarization
- Built interactive briefing UI

commit 7: Video generation feature
- Added script generator
- Integrated FFmpeg for video rendering

commit 8: Story Arc Tracker
- Implemented timeline visualization
- Added sentiment analysis

commit 9: Vernacular translation engine
- Integrated multilingual support
- Added context-aware translation logic

commit 10: UI/UX improvements
- Responsive design
- Improved user flows

commit 11: Performance optimization
- Added caching with Redis
- Optimized API calls

commit 12: Final deployment
- Configured production build
- Deployed backend and frontend

  

