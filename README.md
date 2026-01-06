# DocGenius - AI Document Assistant

**Production-ready AI web application for PDF analysis and text generation**

DocGenius combines OpenAI embeddings with vector search to enable intelligent Q&A over your documents, plus Gemini AI for creative text generation.

---

## 🚀 Quick Links

- **[Quick Deployment Guide](./QUICKSTART.md)** - Deploy to production in 10 minutes
- **[Detailed Deployment Guide](./DEPLOYMENT.md)** - Complete deployment documentation
- **Local Development** - See below

---

## 🏗️ Architecture

```
DocGenius/
├── backend/          # FastAPI REST API
│   ├── api/         # Route handlers (pdf, gemini)
│   ├── services/    # Core logic (embeddings, vector store, LLM)
│   └── app.py       # Application entrypoint
├── frontend/        # Next.js 14 (App Router)
│   ├── app/         # Pages and layouts
│   ├── components/  # React components
│   └── lib/         # API client
```

**Tech Stack:**
- **Backend:** FastAPI, LangChain, OpenAI API, FAISS vector store
- **Frontend:** Next.js 14, React 18, TypeScript
- **Deployment:** Render (backend), Vercel (frontend)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key
- Gemini API Key (optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd DocGenius/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   # Required
   OPENAI_API_KEY=sk-...
   
   # Optional (defaults to 'development' if not set)
   GEMINI_API_KEY=your-gemini-key
   DOCGENIUS_ENV=development  # Use 'production' when deploying
   ```

5. **Run the backend:**
   ```bash
   python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
   ```

   Backend will be available at `http://localhost:8000`
   - Health check: `http://localhost:8000/health`
   - API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd DocGenius/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. **Run the frontend:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

---

## 📦 Production Deployment

### ✨ Ready to Deploy!

This repository is **pre-configured** for immediate deployment to Vercel (frontend) and Render (backend).

**No manual environment variable configuration needed for connectivity!**

### Quick Deploy

1. **Backend (Render)**: 5 minutes
   - Root Directory: `/` (leave empty)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python start_server.py`
   - Required Env Vars: `DOCGENIUS_ENV=production`, `OPENAI_API_KEY=sk-...`

2. **Frontend (Vercel)**: 3 minutes
   - Root Directory: `DocGenius/frontend`
   - Build Command: `pnpm run build` (auto-detected)
   - Env Vars: **None required!** ✅

### 📚 Detailed Guides

- **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step deployment in 10 minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment documentation with troubleshooting

### What's Included

✅ All build errors fixed  
✅ Frontend and backend pre-connected  
✅ Dependencies pinned for security  
✅ CORS properly configured  
✅ Deployment configurations included  

---

## 📦 Legacy Deployment Notes (For Reference)

<details>
<summary>Click to expand legacy deployment instructions</summary>

### Backend (Render) - Old Method

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the repository branch

2. **Configure Build Settings:**
   - **Root Directory:** `DocGenius/backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
   - **Python Version:** 3.11 (via `runtime.txt`)

3. **Set Environment Variables:**
   ```
   DOCGENIUS_ENV=production
   OPENAI_API_KEY=sk-...
   GEMINI_API_KEY=your-gemini-key
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

4. **Deploy:** Render will automatically build and deploy

5. **Verify:** Visit `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok","service":"docgenius"}`

### Frontend (Vercel) - Old Method

1. **Import Project on Vercel**
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure Build Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `DocGenius/frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

3. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
   ```

4. **Deploy:** Vercel will automatically build and deploy

5. **Verify:** Visit your Vercel URL
   - Health status badge should show "● Online"

</details>

---

## 🔐 Environment Variables

### ✨ New Simplified Configuration

**Frontend**: No environment variables required! The backend URL is auto-configured based on the deployment environment.

**Backend Required**:
- `DOCGENIUS_ENV=production` - Enables production mode
- `OPENAI_API_KEY=sk-...` - Your OpenAI API key

**Backend Optional**:
- `GEMINI_API_KEY=...` - Your Gemini API key (for text generation)
- `CORS_ALLOWED_ORIGINS=...` - Override default frontend URL if needed

### Legacy Environment Variables (For Reference)

<details>
<summary>Click to expand legacy environment variable configuration</summary>

### Backend (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for embeddings and completions | `sk-...` |
| `DOCGENIUS_ENV` | Environment mode | `development` or `production` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins (production only) | `https://app.vercel.app` |

### Backend (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Gemini API key for text generation | None |

### Frontend (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000` or `https://api.onrender.com` |

</details>

---

## 📡 API Reference

### Endpoints

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "docgenius"
}
```

#### `POST /pdf/upload`
Upload and process a PDF document.

**Request:** `multipart/form-data`
- `file`: PDF file

**Response:**
```json
{
  "document_id": "uuid-here",
  "status": "success"
}
```

#### `POST /pdf/ask`
Ask a question about an uploaded document.

**Request:** `application/json`
```json
{
  "document_id": "uuid-here",
  "question": "What is this document about?"
}
```

**Response:**
```json
{
  "answer": "This document discusses...",
  "document_id": "uuid-here"
}
```

#### `POST /gemini/generate`
Generate text using Gemini AI.

**Request:** `application/json`
```json
{
  "prompt": "Write a story about..."
}
```

**Response:**
```json
{
  "response": "Generated text...",
  "status": "success"
}
```

### Error Format

All errors follow a consistent structure:

```json
{
  "error": "Human-readable error message",
  "status_code": 400,
  "details": {}  // Optional
}
```

---

## 🐛 Troubleshooting

### Render Backend Issues

**Problem:** Backend fails to start
- **Solution:** Check logs for Python errors. Verify `runtime.txt` specifies Python 3.11
- **Verify:** Start command must be: `python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT`

**Problem:** `/health` returns 404
- **Solution:** Ensure root directory is set to `DocGenius/backend` in Render settings
- **Verify:** Check that `backend.app:app` correctly points to the FastAPI app

**Problem:** CORS errors in browser console
- **Solution:** Set `CORS_ALLOWED_ORIGINS` environment variable with your frontend URL
- **Example:** `CORS_ALLOWED_ORIGINS=https://your-app.vercel.app`

**Problem:** OpenAI API errors
- **Solution:** Verify `OPENAI_API_KEY` is set correctly in environment variables
- **Check:** Review Render logs for "OpenAI API: configured" on startup

### Vercel Frontend Issues

**Problem:** Frontend can't connect to backend
- **Solution:** Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- **Important:** Must include full URL (e.g., `https://api.onrender.com`, not just `api.onrender.com`)

**Problem:** Health badge shows "Offline"
- **Solution:** Check backend is running and `/health` endpoint returns 200
- **Verify:** Open `https://your-backend.onrender.com/health` in browser

**Problem:** Build fails on Vercel
- **Solution:** Ensure root directory is set to `DocGenius/frontend`
- **Verify:** Check that `package.json` exists in root directory

### General Issues

**Problem:** "Module not found" errors
- **Backend:** Run `pip install -r requirements.txt` again
- **Frontend:** Run `npm install` again and clear `.next` folder

**Problem:** Vector store errors
- **Solution:** Ensure `data/vectorstores/` directory is created (happens automatically)
- **Note:** Vector stores are ephemeral on Render free tier (files reset on deploy)

---

## 🧪 Testing Locally

1. **Start backend** (terminal 1):
   ```bash
   cd DocGenius/backend
   python -m uvicorn backend.app:app --reload
   ```

2. **Start frontend** (terminal 2):
   ```bash
   cd DocGenius/frontend
   npm run dev
   ```

3. **Test workflow:**
   - Visit `http://localhost:3000`
   - Upload a PDF document
   - Ask questions about it
   - Try Gemini text generation

---

## 📝 Project Structure Details

### Backend Services

- **`pdf_loader.py`** - Extracts and chunks text from PDFs
- **`embeddings.py`** - Creates OpenAI embeddings with fallback support
- **`vector_store.py`** - Manages FAISS vector store with persistence
- **`llm.py`** - Handles Q&A using OpenAI Chat Completions

### Frontend Components

- **`PdfUpload.tsx`** - File upload with validation
- **`PdfChat.tsx`** - Q&A interface with document
- **`GeminiBox.tsx`** - Gemini text generation interface
- **`lib/apiClient.ts`** - Centralized API client with error handling

---

## 🛡️ Security Notes

- API keys are never exposed to the frontend
- CORS is enforced in production
- No raw stack traces leak in production mode
- Environment variables are validated on startup
- All errors are normalized to prevent information leakage

---

## 📄 License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

Built with:
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [LangChain](https://langchain.com/)
- [OpenAI](https://openai.com/)
- [Google Gemini](https://ai.google.dev/)

---

## 💡 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review backend logs on Render
3. Review frontend logs on Vercel
4. Open an issue on GitHub

**Deployment Time:** ~15 minutes for first-time setup

---

Made with ❤️ for production-ready AI applications
