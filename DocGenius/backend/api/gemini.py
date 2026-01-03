import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()


class GeminiRequest(BaseModel):
    prompt: str


@router.post("/generate")
def generate(req: GeminiRequest):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    url = "https://generativeai.googleapis.com/v1/models/gemini-1.5-flash:generate"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    body = {
        "prompt": {"text": req.prompt},
        "temperature": 0.0,
        "maxOutputTokens": 512
    }

    resp = requests.post(url, json=body, headers=headers, timeout=30)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Gemini API error")
    data = resp.json()
    # Attempt to pull the text response in a few common locations
    response_text = data.get("candidates", [{}])[0].get("content") or data.get("output", {}).get("text") or str(data)
    return {"response": response_text}
