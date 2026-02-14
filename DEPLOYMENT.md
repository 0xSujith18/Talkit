# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. MongoDB Atlas account (for production database)

## Environment Variables
Set these in Vercel dashboard:

### Backend
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `PORT` - 5000

## Deploy Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add MONGODB_URI and JWT_SECRET

4. **Update API URLs**
   - Replace `http://localhost:5000` with your Vercel backend URL in all frontend files

## Important Notes
- Backend will be at: `https://your-project.vercel.app/api`
- Frontend will be at: `https://your-project.vercel.app`
- Make sure to use MongoDB Atlas (not local MongoDB)
