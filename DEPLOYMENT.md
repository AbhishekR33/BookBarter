# BookBarter Complete Deployment Guide

## � Pre-Deployment Checklist
- ✅ Frontend works locally
- ✅ Backend works locally  
- ✅ MongoDB database set up
- ✅ All features tested

## 🚀 Step 1: Prepare for Deployment

### A. Create Production Environment Files

#### Frontend Environment (.env.production)
```
VITE_API_URL=https://bookbarter-backend.onrender.com/api
```

#### Backend Environment (will be set on hosting platform)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookbarter
PORT=5000
NODE_ENV=production
```

## 🌐 Step 2: Deploy Backend (Render.com - Free)

### A. Prepare Backend for Deployment
1. **Create Render.com account**: https://render.com
2. **Connect GitHub**: Link your GitHub account
3. **Create Web Service**: 
   - Repository: Your backend repo
   - Branch: main
   - Root Directory: backend (if separate folder)
   - Build Command: `npm install`
   - Start Command: `npm start`

### B. Environment Variables on Render
- MONGO_URI: Your MongoDB connection string
- NODE_ENV: production
- PORT: 5000

### C. Backend will be available at:
`https://your-app-name.onrender.com`

## 🎨 Step 3: Deploy Frontend (Vercel - Free)

### A. Prepare Frontend
1. **Create Vercel account**: https://vercel.com
2. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

### B. Deploy Options

#### Option 1: GitHub Integration (Recommended)
1. Push frontend to GitHub
2. Import project on Vercel
3. Set environment variables:
   - VITE_API_URL: Your backend URL from Step 2

#### Option 2: Direct Upload
```bash
cd frontend
npm run build
# Upload dist folder to Vercel
```

## 🔧 Step 4: Production Configuration

### A. Update Frontend API URL
```javascript
// src/api/axios.js
const instance = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### B. Update Backend CORS
```javascript
// server.js
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## 🗄️ Step 5: Database Setup (MongoDB Atlas)

### A. If not already set up:
1. **Create MongoDB Atlas account**: https://mongodb.com/atlas
2. **Create cluster** (free tier available)
3. **Create database user**
4. **Whitelist IP addresses**: 0.0.0.0/0 (for production)
5. **Get connection string**

### B. Connection String Format:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookbarter?retryWrites=true&w=majority
```

## 🧪 Step 6: Testing Production

### A. Test Checklist:
- [ ] Backend health check: `https://your-backend.onrender.com`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] User registration works
- [ ] User login works
- [ ] Book upload works
- [ ] Book browsing works
- [ ] Contact system works

## � Troubleshooting

### Common Issues:
1. **CORS errors**: Update backend CORS settings
2. **API not found**: Check VITE_API_URL environment variable
3. **Database connection**: Verify MongoDB connection string
4. **Build errors**: Check package.json scripts

## 📝 Platform-Specific Instructions

### Render.com (Backend):
- Free tier: 750 hours/month
- Sleeps after 15 min inactivity
- Automatic SSL
- GitHub integration

### Vercel (Frontend):
- Unlimited free deployments
- Automatic SSL
- Global CDN
- GitHub integration

## 🎯 Final URLs
After deployment you'll have:
- **Frontend**: `https://bookbarter.vercel.app`
- **Backend**: `https://bookbarter-api.onrender.com`
- **Database**: MongoDB Atlas cloud

## 📞 Support
If deployment fails:
1. Check build logs
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity

Your BookBarter will be live and accessible worldwide! 🌍📚
