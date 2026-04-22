# Quick Deployment Checklist

## CRITICAL: Fix MongoDB First ⚠️

Your MongoDB connection is currently failing. **You MUST fix this before deployment will work.**

### Fix MongoDB Atlas Connection:

1. **Allow your IP in MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Click **Network Access** in left sidebar
   - Click **Add IP Address**
   - Choose "Allow access from anywhere" → add `0.0.0.0/0`
   - Click Confirm

2. **Test locally:**
   ```bash
   cd react-migration/backend
   node seedAdmin.js
   ```
   Should output: `Admin account created successfully!`

3. **Once working, proceed with deployment below**

---

## Deployment to Render (Step by Step)

### 1. Prepare Your Repository

```bash
cd d:\Documents\Web_Portfolio\react-migration
git init
git add .
git commit -m "Blog app - ready for deployment"
```

Then push to GitHub at https://github.com/new

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy Backend on Render

1. Go to https://render.com → Sign Up with GitHub
2. Click **Dashboard** → **New +** → **Web Service**
3. Select your repository
4. Fill in:
   - **Name:** `blog-backend`
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Instance Type:** Free

5. Click **Add Environment Variable** 4 times:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://Grimuru12:Grimuru15@cluster0.6bbk7l8.mongodb.net/blog?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-random-secret-key-here` |
| `FRONTEND_URL` | `https://blog-frontend-xxx.onrender.com` (You'll get this later) |
| `NODE_ENV` | `production` |

6. Click **Create Web Service** and wait for deployment
7. **Copy the service URL** (e.g., `https://blog-backend-xxx.onrender.com`)

### 3. Deploy Frontend on Render

1. Click **Dashboard** → **New +** → **Static Site**
2. Select same repository
3. Fill in:
   - **Name:** `blog-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. Click **Add Environment Variable**:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://blog-backend-xxx.onrender.com` (from step 7 above)

5. Click **Create Static Site** → Wait for deployment
6. You'll get a URL like `https://blog-frontend-xxx.onrender.com`

### 4. Update Backend FRONTEND_URL

1. Go back to your backend service on Render
2. Click **Environment** tab
3. Edit `FRONTEND_URL` and set it to your frontend URL from step 6
4. Click Deploy again

### 5. Seed Admin User

After both services are deployed:

1. Open your backend service on Render
2. Click **Shell** tab at the top
3. Run:
   ```bash
   cd backend && npm run seed
   ```
4. Should print admin credentials

### 6. Test Your Live Site

1. Visit your frontend URL: `https://blog-frontend-xxx.onrender.com`
2. Click **Register** and create an account
3. Log in
4. If you seeded an admin, use: `admin@thefolio.com` / `Admin@1234`
5. Admin users can click **Write** to create posts
6. All users can comment on posts

---

## Updating Your App (Ongoing)

After making code changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically redeploys! ✨

---

## Files Created for Deployment

- ✅ `Procfile` - Tells Render how to start the app
- ✅ `render.yaml` - Render configuration (alternative method)
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `ENV_VARIABLES.md` - Environment variables reference
- ✅ `backend/package.json` - Updated with dependencies
- ✅ `backend/server.js` - Updated for production CORS

---

## Need Help?

**Common Errors:**

| Error | Fix |
|-------|-----|
| `querySrv ECONNREFUSED` | MongoDB IP whitelist not set - go to Atlas → Network Access |
| Blank page on frontend | Check browser console, verify `REACT_APP_API_URL` |
| API 404 errors | Backend not running - check Render logs |
| CORS errors | Update `FRONTEND_URL` in backend environment variables |

See `DEPLOYMENT.md` for detailed troubleshooting!