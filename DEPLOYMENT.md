# Deployment Guide - Render

This guide walks you through deploying your blog application to Render.

## Prerequisites

Before deploying, ensure:
- ✅ MongoDB Atlas is set up with an account
- ✅ Your IP is whitelisted in MongoDB Atlas
- ✅ Admin account is created in MongoDB
- ✅ Git repository is initialized and pushed to GitHub
- ✅ All code is committed and pushed to main branch

## Step 1: Prepare MongoDB

1. Go to https://cloud.mongodb.com and log in
2. Go to **Network Access** → **Add IP Address**
3. Select "Allow access from anywhere" (use `0.0.0.0/0`)
4. Create a user with password (if not already done)
5. Get your connection string from **Databases** → **Connect** → **Drivers**
6. Ensure it includes the database name: `mongodb+srv://user:pass@cluster.xxxx.mongodb.net/blog`

## Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial blog deployment setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 3: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select your repository

## Step 4: Configure Backend Service

**Name:** `blog-backend`

**Settings:**
- Runtime: Node
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && node server.js`
- Instance Type: Free

**Environment Variables:**
Click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 10000 |
| MONGO_URI | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blog?retryWrites=true&w=majority` |
| JWT_SECRET | (Generate: `openssl rand -base64 32`) |
| FRONTEND_URL | https://your-frontend-domain.onrender.com |

**Deploy & Note the URL** (e.g., `https://blog-backend.onrender.com`)

## Step 5: Configure Frontend Service

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Toggle "Auto-Deploy" ON

**Settings:**
- Name: `blog-frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

**Environment Variables:**
| Key | Value |
|-----|-------|
| REACT_APP_API_URL | https://blog-backend.onrender.com |

**Deploy!**

## Step 6: Update Frontend API Configuration (if needed)

If you get CORS errors, update `src/utils/api.js`:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

And in `src/context/AuthContext.js`, update the login/register endpoints:
```javascript
const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`, {
```

## Step 7: Seed Admin User (First Time Only)

After deployment, create the admin account:

**Option A: Via Render Web Shell**
1. Open your backend service on Render
2. Click "Shell" tab
3. Run: `cd backend && node seedAdmin.js`

**Option B: Via MongoDB Compass**
1. Download MongoDB Compass
2. Connect with your MongoDB URI
3. Go to `db.users` collection
4. Insert the admin document (see `createAdmin.js` output)

## Step 8: Test Deployment

1. Visit your frontend URL: `https://your-app.onrender.com`
2. Click Register and create a test account
3. Log in
4. (If admin) Click "Write" to create a post
5. Comment on posts

## Troubleshooting

### **Blank Frontend Page**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Ensure backend service is running

### **API 404 Errors**
- Check backend logs on Render
- Verify `MONGO_URI` is correct
- Ensure MongoDB is connected

### **Database Connection Errors**
- Go to MongoDB Atlas
- Check Network Access → make sure your IP is whitelisted
- Test connection string locally first

### **Slow First Load**
- Free tier services sleep after 15 min inactivity
- First request wakes them up (slow)
- To fix: Upgrade to paid tier

## Updating Your App

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically rebuild and deploy!

## Production Checklist

- [ ] MongoDB IP whitelist configured
- [ ] Admin account created
- [ ] Environment variables set on Render
- [ ] Frontend can communicate with backend
- [ ] Can create and view posts
- [ ] Can comment on posts
- [ ] Images upload correctly
- [ ] Dark/light mode works
- [ ] Mobile responsive
