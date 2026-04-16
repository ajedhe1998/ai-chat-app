import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

class ChatRequest(BaseModel):
    message: str


def generate_gemini_reply(message: str) -> str:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not set on the backend.",
        )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": message}],
            }
        ],
    }

    response = requests.post(
        GEMINI_URL,
        headers={"x-goog-api-key": GEMINI_API_KEY},
        json=payload,
        timeout=30,
    )

    if not response.ok:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Gemini API error: {response.text}",
        )

    data = response.json()

    candidates = data.get("candidates", [])
    if not candidates:
        return "No response from Gemini."

    content = candidates[0].get("content", {})
    parts = content.get("parts", [])
    if not parts:
        return "No response from Gemini."

    return parts[0].get("text", "No response from Gemini.")


@app.post("/chat")
def chat(request: ChatRequest):
    reply = generate_gemini_reply(request.message)
    return {"reply": reply}
