from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import os
import sys
from dotenv import load_dotenv

# Only load a local .env during development. Production must provide env vars.
if os.getenv("DOCGENIUS_ENV", "") != "production":
    load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

from .api import pdf as pdf_router
from .api import gemini as gemini_router

app = FastAPI(title="DocGenius Backend")

# Startup logging
@app.on_event("startup")
async def startup_event():
    env = os.getenv("DOCGENIUS_ENV", "development")
    print(f"[DocGenius] Starting up", file=sys.stderr)
    print(f"[DocGenius] Environment: {env}", file=sys.stderr)
    
    # Log provider status
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    print(f"[DocGenius] OpenAI API: {'configured' if openai_key else 'NOT configured'}", file=sys.stderr)
    print(f"[DocGenius] Gemini API: {'configured' if gemini_key else 'NOT configured'}", file=sys.stderr)
    
    # Log vector store location
    data_dir = os.path.join(os.getcwd(), "data", "vectorstores")
    print(f"[DocGenius] Vector store directory: {data_dir}", file=sys.stderr)
    print(f"[DocGenius] Startup complete", file=sys.stderr)

# CORS configuration
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

# Centralized exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Normalize HTTP exceptions to JSON"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Normalize validation errors to JSON"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation error", "details": exc.errors(), "status_code": 422}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler - never leak stack traces in production"""
    env = os.getenv("DOCGENIUS_ENV", "development")
    
    # In development, show the actual error for debugging
    if env != "production":
        error_detail = str(exc)
    else:
        # In production, return a generic error message
        error_detail = "Internal server error"
    
    # Always log the actual error to stderr for debugging
    print(f"[DocGenius] ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": error_detail, "status_code": 500}
    )

@app.get("/health")
def health():
    return {"status": "ok", "service": "docgenius"}


app.include_router(pdf_router.router, prefix="/pdf", tags=["pdf"])
app.include_router(gemini_router.router, prefix="/gemini", tags=["gemini"])
