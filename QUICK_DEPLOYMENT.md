# Quick Start Deployment

Your Mindfulness Tracker is now ready to deploy! Follow these steps:

## 🚀 Deploy in 3 Easy Steps

### Step 1: Deploy Frontend to Vercel (2 minutes)

1. Visit https://vercel.com/new
2. Sign in with GitHub
3. Select your `mindfullness-tracker` repository
4. Click "Import"
5. **Settings:**
   - Framework: Angular
   - Build Command: `npm run build`
   - Output Directory: `dist/mindfulness-tracker-frontend`
   - Root Directory: `mindfulness-tracker-frontend`
6. Click "Deploy"
7. Wait ~2 minutes for deployment ✅

**Your Frontend URL:** `https://your-name-mindfulness.vercel.app`

---

### Step 2: Deploy Backend to Render (2 minutes)

1. Visit https://render.com
2. Sign in with GitHub
3. Click "New +"
4. Select "Web Service"
5. Select your `mindfullness-tracker` repository
6. Click "Connect"
7. **Settings:**
   - Name: `mindfulness-tracker-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `mindfulness-tracker-backend`
   - Plan: `Free`
8. Click "Create Web Service"
9. Wait ~2 minutes for deployment ✅

**Your Backend URL:** `https://your-name-mindfulness-tracker.onrender.com`

---

### Step 3: Connect Frontend to Backend (1 minute)

1. Go to your Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add new variable:
   - **Key:** `API_URL`
   - **Value:** `https://your-name-mindfulness-tracker.onrender.com/api`
5. Click "Save"
6. Vercel will auto-redeploy 🚀

---

## ✅ You're Done!

Your app is now live! Share the URL:
```
https://your-name-mindfulness.vercel.app
```

## Testing the Live App

1. Click "Log Presence"
2. Add an entry with your current hour
3. Click "View Progress" 
4. Select "Today" from dropdown
5. See your hourly chart update in real-time! 📊

## Important Notes

- **First request slow?** Render's free tier takes ~30 seconds to wake up
- **Data persistence?** Currently using in-memory storage (resets when backend restarts)
- **Want permanent data?** Add MongoDB Atlas (free tier available)

## Troubleshooting

### Frontend shows errors
- Check browser console (F12)
- Verify backend URL in environment variable
- Make sure backend is running

### Backend not responding
- Render free tier may be sleeping (first request takes 30 seconds)
- Check Render logs in dashboard

### CORS errors
- Backend CORS is configured for Vercel domains
- Should auto-work with your Vercel URL

---

## Next Steps

1. ✅ Share your app with friends!
2. Consider upgrading to paid tier if you want:
   - Faster backend response
   - Persistent backend
3. Add MongoDB Atlas for data persistence
4. Add more features and redeploy!

---

**Deployed by:** Sanket Deshmukh
**Repository:** https://github.com/sanketdeshmukh/mindfullness-tracker
