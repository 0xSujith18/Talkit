# Talkit Production Deployment Guide

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Web App   │────▶│   Backend    │────▶│  MongoDB    │
│  (Vercel)   │     │  (Railway)   │     │   Atlas     │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│ Mobile App  │     │ Cloud Storage│
│ (App Store) │     │   (AWS S3)   │
└─────────────┘     └──────────────┘
```

## Prerequisites

- MongoDB Atlas account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- AWS account (for media storage)
- Domain name (optional)

---

## 1. Database Setup (MongoDB Atlas)

### Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Choose region closest to your users
4. Wait for cluster to be created

### Configure Access
```bash
# 1. Database Access
- Create database user
- Username: talkit_admin
- Password: <generate-strong-password>
- Role: Atlas Admin

# 2. Network Access
- Add IP: 0.0.0.0/0 (Allow from anywhere)
- Or add specific IPs for production
```

### Get Connection String
```
mongodb+srv://talkit_admin:<password>@cluster0.xxxxx.mongodb.net/talkit?retryWrites=true&w=majority
```

---

## 2. Backend Deployment (Railway)

### Prepare Backend

1. **Update package.json**
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "nodemon src/server.ts"
  },
  "engines": {
    "node": "18.x"
  }
}
```

2. **Create .env.production**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generate-random-secret-256-bit>
CORS_ORIGIN=https://talkit.vercel.app
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Link to project
railway link

# Add environment variables
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-secret-key"
railway variables set CORS_ORIGIN="https://talkit.vercel.app"

# Deploy
railway up
```

### Alternative: Render

1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables
5. Deploy

---

## 3. Frontend Deployment (Vercel)

### Prepare Frontend

1. **Update vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

2. **Create vercel.json**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

3. **Update API endpoint**
```typescript
// src/config/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://talkit-api.railway.app/api'
});

export default api;
```

4. **Create .env.production**
```env
VITE_API_URL=https://talkit-api.railway.app/api
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd web
vercel

# Production deployment
vercel --prod

# Add environment variable
vercel env add VITE_API_URL production
```

### Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 4. Cloud Storage Setup (AWS S3)

### Create S3 Bucket

1. Go to AWS Console → S3
2. Create bucket: `talkit-media`
3. Region: Same as your backend
4. Uncheck "Block all public access"
5. Enable versioning

### Configure CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://talkit.vercel.app"],
    "ExposeHeaders": []
  }
]
```

### Create IAM User

1. IAM → Users → Add User
2. Username: `talkit-s3-uploader`
3. Access type: Programmatic access
4. Attach policy: `AmazonS3FullAccess`
5. Save Access Key ID and Secret

### Update Backend

```typescript
// backend/src/config/s3.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export const uploadToS3 = async (file: Buffer, filename: string) => {
  const params = {
    Bucket: 'talkit-media',
    Key: filename,
    Body: file,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;
};
```

---

## 5. Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/talkit
JWT_SECRET=your-256-bit-secret-key
CORS_ORIGIN=https://talkit.vercel.app
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=talkit-media
```

### Frontend (.env)
```env
VITE_API_URL=https://talkit-api.railway.app/api
```

---

## 6. Domain Configuration (Optional)

### Custom Domain for Backend

**Railway:**
```bash
railway domain
# Follow prompts to add custom domain
```

**Render:**
- Settings → Custom Domain → Add domain
- Update DNS records

### Custom Domain for Frontend

**Vercel:**
```bash
vercel domains add talkit.com
```

Update DNS:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## 7. SSL/HTTPS

Both Railway and Vercel provide automatic SSL certificates.

For custom domains:
- Railway: Automatic Let's Encrypt
- Vercel: Automatic Let's Encrypt

---

## 8. Monitoring & Logging

### Backend Monitoring

**Railway:**
- Built-in logs and metrics
- View at: railway.app/project/logs

**Sentry (Error Tracking):**
```bash
npm install @sentry/node

# backend/src/server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Frontend Monitoring

```bash
npm install @sentry/react

# src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE
});
```

---

## 9. Performance Optimization

### Backend
- Enable compression
- Add Redis caching
- Use CDN for static assets
- Database indexing
- Connection pooling

```typescript
// backend/src/server.ts
import compression from 'compression';

app.use(compression());
```

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Service worker for PWA

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
```

---

## 10. Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ Input validation
- ✅ SQL injection prevention (using Mongoose)
- ✅ XSS protection
- ✅ JWT token expiration
- ✅ Password hashing (bcrypt)
- ✅ Helmet.js for security headers

```typescript
// backend/src/server.ts
import helmet from 'helmet';

app.use(helmet());
```

---

## 11. Backup Strategy

### Database Backups
- MongoDB Atlas: Automatic daily backups
- Manual backup:
```bash
mongodump --uri="mongodb+srv://..." --out=./backup
```

### Media Backups
- S3 versioning enabled
- Cross-region replication (optional)

---

## 12. CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 13. Post-Deployment Testing

```bash
# Test API
curl https://talkit-api.railway.app/api

# Test authentication
curl -X POST https://talkit-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test frontend
open https://talkit.vercel.app
```

---

## 14. Scaling Considerations

### Horizontal Scaling
- Railway: Auto-scaling available
- Load balancer for multiple instances

### Database Scaling
- MongoDB Atlas: Upgrade cluster tier
- Add read replicas
- Sharding for large datasets

### CDN
- Cloudflare for static assets
- Image optimization service

---

## 15. Cost Estimation

### Free Tier (Development)
- MongoDB Atlas: Free (512MB)
- Railway: $5/month credit
- Vercel: Free (hobby)
- **Total: ~$0-5/month**

### Production (Small Scale)
- MongoDB Atlas: $9/month (Shared)
- Railway: $20/month
- Vercel: Free
- AWS S3: $1-5/month
- **Total: ~$30-35/month**

### Production (Medium Scale)
- MongoDB Atlas: $57/month (Dedicated)
- Railway: $50/month
- Vercel Pro: $20/month
- AWS S3: $10-20/month
- **Total: ~$137-147/month**

---

## Support & Maintenance

- Monitor error logs daily
- Update dependencies monthly
- Security patches immediately
- Database backups verified weekly
- Performance monitoring continuous

---

## Quick Deploy Commands

```bash
# Backend
cd backend
railway up

# Frontend
cd web
vercel --prod

# Check status
railway status
vercel ls
```

---

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Check CORS_ORIGIN in backend env
   - Verify frontend URL matches

2. **Database Connection Failed**
   - Check MongoDB URI
   - Verify IP whitelist

3. **Build Failed**
   - Check Node version
   - Verify all dependencies installed

4. **API 502 Error**
   - Check backend logs
   - Verify environment variables

---

## Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3)
