# PantryPal - Setup Guide

## Quick Start with Docker

1. Copy `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
```

2. Add your keys to `.env`:
```
OPENAI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

4. Open http://localhost:3000

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
/backend
  /app
    main.py       # FastAPI server
    agent.py      # LangGraph agent (TODO)
  requirements.txt
  Dockerfile

/frontend
  /app
    page.tsx      # Main chat UI
  Dockerfile

docker-compose.yml
```

## TODO
- [ ] Implement LangGraph agent in `backend/app/agent.py`
- [ ] Add web search tool
- [ ] Add recipe generation with structured output
- [ ] Implement memory/preferences
- [ ] Add guardrails for off-topic queries
- [ ] Create recipe card component in frontend
- [ ] Add equipment checking logic
