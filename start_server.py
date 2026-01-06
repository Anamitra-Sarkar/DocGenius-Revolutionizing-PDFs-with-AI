#!/usr/bin/env python3
"""
Start script for DocGenius backend on Render.

This script runs from the repository root and properly sets up the Python path
to import the backend module from DocGenius/backend/. It expects the following
directory structure:
    /
    ├── DocGenius/
    │   └── backend/
    │       ├── __init__.py
    │       └── app.py
    └── start_server.py (this file)
"""
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
