# Frontend Deployment (Vercel)

## Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Frontend ready for deployment"
   git push
   ```

2. **Deploy to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Framework Preset: **Vite**
   - Root Directory: **Leave as is (root)**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables** (Add in Vercel)
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app/api`)

4. **Update API URLs**
   - Replace all `http://localhost:5000/api` with `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`

## Backend Deployment (Railway/Render)

Deploy your backend folder separately to Railway or Render.
Then use that URL in VITE_API_URL.
