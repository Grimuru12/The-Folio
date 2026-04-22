# Environment Variables

## Backend (.env)

```
MONGO_URI=mongodb+srv://[username]:[password]@cluster0.xxxxx.mongodb.net/[database]?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-secret-key-here
```

## Production (Render)

When deploying to Render, set these environment variables in the Render dashboard:

- **MONGO_URI** - Your MongoDB Atlas connection string with database specified
- **JWT_SECRET** - A secure random string (generate with: `openssl rand -base64 32`)
- **FRONTEND_URL** - Your deployed frontend URL (e.g., https://yourdomain.com)
- **NODE_ENV** - Set to "production"
- **PORT** - Render will set this automatically (usually 10000)

## Obtaining Values

### MongoDB URI
1. Go to https://cloud.mongodb.com
2. Click "Databases" → "Connect"
3. Copy the "Node.js" connection string
4. Replace `<username>`, `<password>`, and add your database name at the end

### JWT_SECRET
Generate a secure secret:
```bash
openssl rand -base64 32
```
Or use any long random string (minimum 32 characters recommended)
