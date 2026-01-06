#!/usr/bin/env python3
import os
import sys

# Add DocGenius directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'DocGenius'))

# Change to DocGenius directory for proper imports
os.chdir(os.path.join(os.path.dirname(__file__), 'DocGenius'))

# Now import and run uvicorn
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port)
