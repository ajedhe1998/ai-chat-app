from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# ✅ ADD THIS CORS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://172.17.0.1:11434/api/generate"

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    payload = {
        "model": "tinyllama",
        "prompt": request.message,
        "stream": False   # 🔥 VERY IMPORTANT
    }

    response = requests.post(OLLAMA_URL, json=payload)

    data = response.json()
    print("OLLAMA RESPONSE:", data)  # temporary debug

    return {"reply": data.get("response", "No response from model")}