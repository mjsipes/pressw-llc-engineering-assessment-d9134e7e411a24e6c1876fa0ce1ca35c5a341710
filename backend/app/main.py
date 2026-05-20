from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PantryPal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: str
    messages: Optional[List[Message]] = []
    equipment: Optional[str] = "stove, oven"

class ChatResponse(BaseModel):
    response: str
    type: str = "text"
    data: Optional[dict] = None

@app.get("/")
async def root():
    return {"message": "PantryPal API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    from .agent import run_agent
    
    result = run_agent(
        message=request.message,
        session_id=request.session_id,
        history=request.messages,
        equipment=request.equipment
    )
    
    return ChatResponse(
        response=result["response"],
        type=result["type"],
        data=result.get("data")
    )

@app.get("/health")
async def health():
    return {"status": "healthy"}
