# Deployment Guide - Mindfulness Tracker

This guide will help you deploy your Mindfulness Tracker application to free hosting services.

## Recommended Deployment Strategy

### Frontend: Vercel (Free)
- **Why**: Perfect for Angular apps, automatic deployments from GitHub, free SSL
- **Limits**: Unlimited deployments, very generous free tier
- **Setup Time**: ~5 minutes

### Backend: Render (Free)
- **Why**: Free tier for Node.js, auto-deploys from GitHub, good for this size app
- **Limits**: Spins down after 15 minutes of inactivity (acceptable for personal use)
- **Setup Time**: ~5 minutes

## Step-by-Step Deployment

### PART 1: Deploy Frontend to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub

2. **Create New Project**
   - Click "New Project"
   - Select your `mindfullness-tracker` repository
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/mindfulness-tracker-frontend`
   - **Root Directory**: `mindfulness-tracker-frontend`
   - Click "Deploy"

4. **Set Environment Variable**
   - After deployment, go to Settings → Environment Variables
   - Add: `ANGULAR_API_URL=https://mindfulness-tracker-backend.onrender.com`
   - Redeploy

### PART 2: Deploy Backend to Render

1. **Go to Render**
   - Visit https://render.com
   - Click "Sign Up"
   - Choose "GitHub"
   - Authorize Render

2. **Create New Service**
   - Click "New +"
   - Select "Web Service"
   - Select your `mindfullness-tracker` repository
   - Click "Connect"

3. **Configure Service**
   - **Name**: `mindfulness-tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `mindfulness-tracker-backend`
   - **Plan**: Free
   - Click "Create Web Service"

4. **Set Environment Variables** (if using MongoDB)
   - Go to Settings → Environment Variables
   - Add: `MONGODB_URI=your_mongodb_url` (if you have MongoDB Atlas)
   - Add: `PORT=3000`

### PART 3: Update Frontend API URL

1. **Update the service to point to your backend**
   - Edit `mindfulness-tracker-frontend/src/app/services/mindfulness.service.ts`
   - Update `API_URL` to your Render backend URL

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

3. **Vercel will auto-redeploy**

## Troubleshooting

### Frontend not connecting to backend
- Check CORS is enabled in backend
- Verify backend URL in frontend service
- Check browser console for errors

### Backend timing out
- Render's free tier spins down after 15 minutes
- This is normal - it will wake up on first request
- For critical use, consider upgrading to paid tier

### Port issues
- Frontend default: 3000
- Backend should use process.env.PORT || 3000

## Alternative Services

### Backend Alternatives:
- **Railway.app** (Free tier: $5/month credit)
- **Fly.io** (Generous free tier)
- **Heroku** (Paid now, but consider Railway/Render)

### Frontend Alternatives:
- **Netlify** (Similar to Vercel)
- **GitHub Pages** (Limited for SPA routing)
- **Firebase Hosting** (Google's free hosting)

## Production Checklist

- [ ] Environment variables configured
- [ ] API URL pointing to production backend
- [ ] CORS properly configured
- [ ] Database configured (or in-memory mode)
- [ ] Error handling working
- [ ] Dark mode persisting
- [ ] Mobile view responsive
- [ ] Date validation working
- [ ] SSL certificates installed (automatic on Vercel/Render)

## Accessing Your Live App

After deployment:
1. Frontend will be at: `https://your-project.vercel.app`
2. Backend will be at: `https://your-project.onrender.com`
3. Share the Vercel URL with users

## Important Notes

- **Free tier limitations**: 
  - Render spins down inactive apps (acceptable for personal use)
  - Vercel has generous free tier (perfect for this app)
  
- **Data persistence**:
  - With in-memory database: Data resets when backend restarts
  - Add MongoDB Atlas for permanent storage (free tier available)

- **Scaling**:
  - For production use with many users, upgrade hosting
  - Current setup handles personal/small team use perfectly

## Next Steps

1. Push this repo to GitHub (✅ Already done)
2. Deploy frontend to Vercel
3. Deploy backend to Render
4. Test the live application
5. Share the URL!

For more details, visit:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
