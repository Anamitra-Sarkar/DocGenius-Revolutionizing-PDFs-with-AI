import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Read Gemini API key from the environment (may be unset in development)
key = os.getenv("GEMINI_API_KEY")

router = APIRouter()


@router.get("/_probe")
def probe():
    """Lightweight probe to check handler availability without invoking LLMs."""
    return {"status": "ok", "gemini_key_configured": bool(key)}


class GeminiRequest(BaseModel):
    prompt: str


@router.post("/generate")
def generate(req: GeminiRequest):
    """Generate text using Gemini AI. This handler is defensive: any error
    will be caught and returned as a JSON response so the server doesn't
    terminate unexpectedly during testing or when external keys/deps are
    missing.
    """
    try:
        if not req.prompt:
            return {"response": "", "status": "error", "detail": "Prompt is required"}

        if not key:
            # Fallback for testing without keys
            return {
                "response": f"Simulated generation for prompt: {req.prompt[:50]}... (Please configure GEMINI_API_KEY)",
                "status": "success",
            }

        # Attempt to use the real LLM provider
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain.schema import HumanMessage

            llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=key, temperature=0.7)
            messages = [HumanMessage(content=req.prompt)]
            response = llm.invoke(messages)
            return {"response": response.content, "status": "success"}
        except Exception as inner_e:
            # Return an error payload rather than raising to avoid crashing the
            # server during development or when dependencies are unavailable.
            return {"response": "", "status": "error", "detail": str(inner_e)}

    except Exception as e:
        return {"response": "", "status": "error", "detail": str(e)}

