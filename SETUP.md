# PantryPal - Setup Guide

## Quick Start (Local Development)

1. Copy `.env.example` to `.env` and add your OpenAI API key:
```bash
cp .env.example .env
```

2. Add your key to `.env`:
```
OPENAI_API_KEY=your_key_here
```

### Backend Setup
**Note:** Requires Python 3.12 (Python 3.14 not compatible with pydantic-core)

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

3. Open http://localhost:3000

## Docker (Alternative)
```bash
docker-compose up --build
```

## Project Structure

```
/backend
  /app
    main.py       # FastAPI server with CORS
    agent.py      # LangGraph agent with tools
  venv/           # Python virtual environment
  requirements.txt
  Dockerfile

/frontend
  /app
    page.tsx      # Main chat UI with recipe cards
  /components/ui  # shadcn components
  Dockerfile

.env              # API keys (not committed)
docker-compose.yml
SCOPING.md        # Project scope and decisions
```

## Features Implemented
- ✅ LangGraph agent with cooking personality
- ✅ Conversation memory via LangGraph checkpointer
- ✅ Equipment management (editable, localStorage)
- ✅ Recipe generation with history facts
- ✅ Recipe cards (2-column brownie-box style)
- ✅ Recipes saved to localStorage
- ✅ Equipment context injected into prompts
- ✅ Off-topic query redirection

## Future Improvements
- [ ] Web search tool integration
- [ ] Structured recipe output (currently parsed from text)
- [ ] User preference tracking
- [ ] Recipe image generation
