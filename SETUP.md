# Setup

## Requirements
- Python 3.12+ (not 3.14 - pydantic-core incompatibility)
- Node.js
- OpenAI API key

## Quick Start

1. **Set up environment:**
```bash
cp .env.example .env
# Add your OPENAI_API_KEY to .env
```

2. **Start backend:**
```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

3. **Start frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

4. **Open:** http://localhost:3000

## Example Usage
- "How do I make burgers?"
- "I have a BBQ" (adds to equipment)
- Click recipes in right panel to expand
