# Talkit - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

---

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Talkit

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../
npm install
```

---

## Step 2: Setup Environment Variables

### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talkit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talkit?retryWrites=true&w=majority
```

### Frontend (.env)

Create `web/.env` (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 3: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### Terminal 2 - Frontend
```bash
cd web
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

---

## Step 4: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

---

## Step 5: Create Your First Account

1. Click "Get Started" or "Register"
2. Fill in the registration form:
   - Username: `testuser`
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Role: `citizen`
3. Click "Register"
4. You'll be automatically logged in!

---

## 🎯 Test the Features

### Create a Post
1. Click "+ Create" in navbar
2. Write a caption
3. Add hashtags (optional)
4. Click "Post"

### Create a Report
1. Click "Reports" in navbar
2. Click "+ New Report"
3. Fill in:
   - Category: Infrastructure
   - Title: "Pothole on Main Street"
   - Description: "Large pothole causing issues"
   - Upload a photo
   - Click "Get Current Location"
   - Enter address
4. Click "Submit Report"

### View as Authority
1. Register a new account with role: `authority`
2. Go to "Dashboard"
3. View reports and update status

---

## 📁 Project Structure

```
Talkit/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   └── server.ts # Entry point
│   └── package.json
│
├── src/              # React frontend
│   ├── pages/        # Page components
│   ├── components/   # Reusable components
│   ├── context/      # React Context
│   └── App.tsx       # Main app
│
└── package.json      # Frontend dependencies
```

---

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas connection string
- Check firewall settings

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Issue: CORS Error
**Solution:**
- Make sure backend is running
- Check API URL in frontend config
- Verify CORS is enabled in backend

### Issue: JWT Error
**Solution:**
- Clear browser localStorage
- Re-login
- Check JWT_SECRET in .env

---

## 🧪 Test Accounts

Create these accounts for testing:

**Citizen:**
- Email: `citizen@test.com`
- Password: `password123`
- Role: `citizen`

**Authority:**
- Email: `authority@test.com`
- Password: `password123`
- Role: `authority`

**Admin:**
- Email: `admin@test.com`
- Password: `password123`
- Role: `admin`

---

## 📚 API Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "citizen"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Feed (with token)
```bash
curl http://localhost:5000/api/posts/feed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 Customize

### Change Theme Colors
Edit `src/index.css`:
```css
:root {
  --accent: #3b82f6;  /* Change primary color */
}
```

### Change App Name
1. Edit `public/index.html` - Update `<title>`
2. Edit `src/components/Navbar.tsx` - Update logo text
3. Edit `README.md` - Update project name

---

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd web
npm run build
# Output in dist/ folder
```

---

## 🚀 Deploy

See detailed guides:
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Full deployment guide
- [API_DOCS.md](./API_DOCS.md) - API documentation
- [MOBILE_APP_GUIDE.md](./MOBILE_APP_GUIDE.md) - Mobile app guide

---

## 🐛 Debug Mode

### Backend Logs
```bash
cd backend
DEBUG=* npm run dev
```

### Frontend Logs
Open browser console (F12) to see logs

---

## 📖 Learn More

- [README.md](./README.md) - Full feature list
- [ROADMAP.md](./ROADMAP.md) - Future features
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's built

---

## 💡 Tips

1. **Use MongoDB Compass** for database visualization
2. **Use Postman** for API testing
3. **Use React DevTools** for debugging
4. **Enable auto-save** in your editor
5. **Use nodemon** for auto-restart (already configured)

---

## 🆘 Need Help?

1. Check the documentation files
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify environment variables

---

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env file configured
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can register a new account
- [ ] Can create a post
- [ ] Can create a report

---

## 🎉 You're Ready!

Start building amazing civic engagement features!

**Next Steps:**
1. Explore the codebase
2. Try all features
3. Read the API docs
4. Plan your customizations
5. Deploy to production

---

**Happy Coding! 🚀**
