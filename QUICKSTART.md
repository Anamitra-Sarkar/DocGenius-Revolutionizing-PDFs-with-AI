# 🚀 Quick Deployment Guide

This is a **quick reference** for deploying DocGenius. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## ✅ What's Fixed

This repository is ready for immediate deployment to:
- **Frontend**: Vercel
- **Backend**: Render

**No environment variables needed for connectivity!** The services are pre-configured to connect to each other.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- OpenAI API Key (required for PDF Q&A)
- Gemini API Key (optional for text generation)

## 🎯 Deploy Backend (Render) - 5 minutes

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: Leave empty (use `/`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start_server.py`
5. Add Environment Variables:
   - `DOCGENIUS_ENV` = `production`
   - `OPENAI_API_KEY` = `sk-...` (your OpenAI key)
   - `GEMINI_API_KEY` = `...` (optional)
6. Click **"Create Web Service"**
7. Wait for deployment (~3-5 minutes)
8. Test: Visit `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok","service":"docgenius"}`

## 🎨 Deploy Frontend (Vercel) - 3 minutes

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `DocGenius/frontend`
   - **Build Command**: `pnpm run build` (auto-detected)
5. **No environment variables needed!** ✅
6. Click **"Deploy"**
7. Wait for deployment (~2-3 minutes)
8. Test: Visit your Vercel URL

## ✅ Verify Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.onrender.com/health
   ```
   Expected: `{"status":"ok","service":"docgenius"}`

2. **Frontend**:
   - Open your Vercel URL
   - Check the health badge shows "● Online"
   - Navigate to Dashboard → Chat or Generate pages

3. **Integration Test**:
   - Upload a PDF document
   - Ask a question about it
   - Verify you get a response

## 🔑 Important Notes

### Pre-configured URLs

The application is pre-configured with these production URLs:

- **Backend**: `https://docgenius-revolutionizing-pdfs-with-ai.onrender.com`
- **Frontend**: `https://doc-genius-revolutionizing-pd-fs-wi.vercel.app`

If your deployment URLs are different, you'll need to update:
- Frontend: `DocGenius/frontend/lib/api.ts` (line 39)
- Backend: `DocGenius/backend/app.py` (line 56)

### Required Environment Variables (Backend Only)

You MUST set these in Render:
- `DOCGENIUS_ENV=production` - Enables production mode
- `OPENAI_API_KEY=sk-...` - Required for PDF processing and Q&A

Optional:
- `GEMINI_API_KEY=...` - For Gemini text generation features

### No Frontend Environment Variables Needed! ✅

The frontend automatically:
- Uses `http://localhost:8000` when running on localhost
- Uses the hardcoded production backend URL when deployed

## 🐛 Troubleshooting

### Backend Issues

**Build fails**:
- Check that `requirements.txt` exists at root level
- Verify Python version is 3.11 (specified in `runtime.txt`)

**Server starts but health check fails**:
- Verify start command: `python start_server.py`
- Check logs for errors

**CORS errors**:
- Verify `DOCGENIUS_ENV=production` is set
- Check backend logs for CORS configuration

### Frontend Issues

**Build fails with lockfile error**:
- This is fixed in the latest version
- If you see this, ensure you have the latest code

**Can't connect to backend**:
- Verify backend health endpoint works
- Check browser console for errors
- Verify backend URL in `lib/api.ts`

## 📚 Full Documentation

For detailed information:
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Documentation**: [README.md](./README.md)
- **Backend API Docs**: Visit `https://your-backend.onrender.com/docs` after deployment

## 💰 Estimated Costs

### Free Tier (for testing)
- Render: 750 hours/month (backend sleeps after inactivity)
- Vercel: 100 GB bandwidth/month
- OpenAI: Pay-per-use (~$0.001-0.002 per query)

### Paid Tier (for production)
- Render Starter: $7/month (no sleep, 512 MB RAM)
- Vercel Pro: $20/month (1 TB bandwidth)
- OpenAI: Pay-per-use (budget-dependent)

## 🎉 That's It!

Your DocGenius application should now be fully deployed and functional!

**Total setup time**: ~10 minutes

For issues or questions, see the troubleshooting sections in [DEPLOYMENT.md](./DEPLOYMENT.md).
