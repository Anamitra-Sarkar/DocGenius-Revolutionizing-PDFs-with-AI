# Deployment Guide for DocGenius

This guide provides step-by-step instructions for deploying DocGenius to Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub repository: `Anamitra-Sarkar/DocGenius-Revolutionizing-PDFs-with-AI`
- OpenAI API Key (required for PDF processing and Q&A)
- Gemini API Key (optional, for text generation features)

## Backend Deployment (Render)

### Option 1: Using Render Dashboard (Recommended)

1. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select the repository

2. **Configure the Web Service**
   - **Name**: `docgenius-backend` (or any name you prefer)
   - **Region**: Choose your preferred region
   - **Branch**: `main`
   - **Root Directory**: Leave empty (use root `/`)
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     python start_server.py
     ```

3. **Set Environment Variables**
   
   Click "Environment" and add these variables:
   
   | Key | Value | Required |
   |-----|-------|----------|
   | `DOCGENIUS_ENV` | `production` | Yes |
   | `OPENAI_API_KEY` | Your OpenAI API key (sk-...) | Yes |
   | `GEMINI_API_KEY` | Your Gemini API key | No |
   
   **Note**: You can also optionally set `CORS_ALLOWED_ORIGINS` if you want to override the default frontend URL.

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Wait for the build to complete (usually 2-5 minutes)

5. **Verify Deployment**
   - Once deployed, you'll get a URL like: `https://docgenius-revolutionizing-pdfs-with-ai.onrender.com`
   - Test the health endpoint: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"ok","service":"docgenius"}`

### Option 2: Using render.yaml (Blueprint)

1. Fork or push the repository to GitHub
2. Go to Render Dashboard → "Blueprints" → "New Blueprint Instance"
3. Connect your repository
4. Render will detect the `render.yaml` file and configure everything automatically
5. Add your API keys in the environment variables section

### Troubleshooting Backend Deployment

**Issue**: Build fails with "module not found"
- **Solution**: Ensure all dependencies are in `requirements.txt`

**Issue**: Server starts but health check fails
- **Solution**: Verify the start command is `python start_server.py`

**Issue**: CORS errors in browser
- **Solution**: The default CORS configuration already includes the Vercel frontend URL. If you changed the frontend URL, update the CORS settings in `DocGenius/backend/app.py`

## Frontend Deployment (Vercel)

### Using Vercel Dashboard

1. **Import Project on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository and click "Import"

2. **Configure Build Settings**
   
   Vercel will auto-detect Next.js, but verify these settings:
   
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `DocGenius/frontend`
   - **Build Command**: `pnpm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `pnpm install` (auto-detected)
   - **Node Version**: `18.x` or higher

3. **Set Environment Variables (Optional)**
   
   The frontend is already configured with the backend URL hardcoded, so no environment variables are strictly required. However, you can optionally override:
   
   | Key | Value | Required |
   |-----|-------|----------|
   | `NEXT_PUBLIC_API_URL` | Your backend URL (e.g., `https://docgenius-revolutionizing-pdfs-with-ai.onrender.com`) | No |
   
   **Note**: If you don't set this variable, the frontend will automatically use the hardcoded production backend URL.

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Wait for the build to complete (usually 1-3 minutes)

5. **Verify Deployment**
   - Once deployed, you'll get a URL like: `https://doc-genius-revolutionizing-pd-fs-wi.vercel.app`
   - Visit the URL and test the application
   - Check that the health status badge shows "● Online"

### Troubleshooting Frontend Deployment

**Issue**: Build fails with "lockfile out of sync"
- **Solution**: This is already fixed in the latest commit. The `pnpm-lock.yaml` is now up to date.

**Issue**: Build fails with "export not found"
- **Solution**: This is already fixed. The missing exports (`mockDocuments`, `mockMessages`) have been added to `lib/api.ts`.

**Issue**: Frontend can't connect to backend
- **Solution**: Verify the backend is deployed and accessible at the health endpoint.

**Issue**: CORS errors in browser console
- **Solution**: The backend is already configured to allow the Vercel frontend URL. Make sure your backend is deployed successfully.

## Post-Deployment Verification

### 1. Test Backend Health
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{"status":"ok","service":"docgenius"}
```

### 2. Test Frontend
1. Visit your Vercel URL
2. Navigate to the Dashboard
3. Try uploading a PDF (requires OpenAI API key to be configured in backend)
4. Try the Gemini text generation feature (requires Gemini API key)

### 3. Test Integration
1. Upload a PDF document
2. Ask a question about it
3. Verify you get a response from the backend

## Configuration Summary

### Backend URL (Hardcoded in Frontend)
```
Production: https://docgenius-revolutionizing-pdfs-with-ai.onrender.com
Development: http://localhost:8000
```

### Frontend URL (Hardcoded in Backend CORS)
```
Production: https://doc-genius-revolutionizing-pd-fs-wi.vercel.app
Development: *
```

### No Manual Environment Variable Setup Required
The application is configured to work without setting environment variables manually:
- Frontend automatically uses the production backend URL when deployed
- Backend automatically allows the production frontend URL in CORS

However, you MUST set these environment variables in Render:
- `OPENAI_API_KEY`: Required for PDF processing
- `DOCGENIUS_ENV=production`: To enable production mode

## Architecture

```
┌─────────────────────────────────────────┐
│  Vercel (Frontend)                      │
│  https://doc-genius-***.vercel.app      │
│                                          │
│  - Next.js 16                            │
│  - React 19                              │
│  - TypeScript                            │
│  - Tailwind CSS                          │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS (API Calls)
               │
               ▼
┌─────────────────────────────────────────┐
│  Render (Backend)                        │
│  https://docgenius-***.onrender.com     │
│                                          │
│  - FastAPI                               │
│  - Python 3.11                           │
│  - LangChain                             │
│  - OpenAI API                            │
│  - Gemini API                            │
│  - FAISS Vector Store                    │
└─────────────────────────────────────────┘
```

## Cost Estimate

### Render (Backend)
- **Free Tier**: 750 hours/month, sleeps after 15 min of inactivity
- **Starter Plan**: $7/month, no sleep, 512 MB RAM
- **Standard Plan**: $25/month, 2 GB RAM

### Vercel (Frontend)
- **Hobby Plan**: Free, 100 GB bandwidth/month
- **Pro Plan**: $20/month, 1 TB bandwidth/month

### API Costs
- **OpenAI**: Pay-as-you-go (embeddings + completions)
- **Gemini**: Free tier available, then pay-as-you-go

## Monitoring

### Backend Logs (Render)
1. Go to Render Dashboard
2. Select your web service
3. Click "Logs" tab
4. Monitor startup messages, errors, and API calls

### Frontend Logs (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. Click "Runtime Logs" to see server-side logs
5. Use browser DevTools for client-side logs

## Updating the Deployment

### Backend Updates
1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy
3. Or manually trigger a deploy from Render Dashboard

### Frontend Updates
1. Push changes to your GitHub repository
2. Vercel will automatically detect changes and redeploy
3. Or manually trigger a deploy from Vercel Dashboard

## Security Considerations

1. **API Keys**: Never commit API keys to the repository. Always use environment variables.
2. **CORS**: The backend is configured to only allow requests from the specific Vercel frontend URL in production.
3. **HTTPS**: Both Vercel and Render provide free SSL certificates.
4. **Rate Limiting**: Consider implementing rate limiting for production use.

## Support

If you encounter issues:
1. Check the troubleshooting sections above
2. Review backend logs on Render
3. Review frontend logs on Vercel
4. Check browser console for errors
5. Verify API keys are set correctly

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
