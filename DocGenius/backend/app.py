from fastapi import FastAPI
import os
from dotenv import load_dotenv

# Only load a local .env during development. Production must provide env vars.
if os.getenv("DOCGENIUS_ENV", "") != "production":
    load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

from .api import pdf as pdf_router
from .api import gemini as gemini_router

app = FastAPI(title="DocGenius Backend")

cors_env = os.getenv("CORS_ALLOWED_ORIGINS")
if cors_env:
    cors_origins = [o.strip() for o in cors_env.split(",") if o.strip()]
else:
    # In development allow all; in production require explicit origins
    if os.getenv("DOCGENIUS_ENV") == "production":
        raise RuntimeError("CORS_ALLOWED_ORIGINS must be set in production")
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(pdf_router.router, prefix="/pdf", tags=["pdf"])
app.include_router(gemini_router.router, prefix="/gemini", tags=["gemini"])
