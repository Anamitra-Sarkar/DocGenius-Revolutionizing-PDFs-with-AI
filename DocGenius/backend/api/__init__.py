from fastapi import APIRouter

router = APIRouter()

from . import pdf, gemini  # noqa: E402,F401
