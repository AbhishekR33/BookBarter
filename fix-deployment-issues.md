# 🔧 Deployment Troubleshooting Guide

## ❌ "Cannot connect to server" Error Fix

### Issue: Missing `/api` in backend URL
**Problem**: API calls are going to wrong endpoint
**Solution**: Added `/api` to baseURL in axios.js

### 🔍 Debug Steps:

#### 1. Test Backend Health
Open these URLs in browser:
- `https://your-backend-name.onrender.com/` → Should show "📚 BookBarter API is running!"
- `https://your-backend-name.onrender.com/api/` → Should return API data

#### 2. Check Frontend Environment
In Vercel dashboard:
- Go to your project → Settings → Environment Variables
- Add: `VITE_API_URL` = `https://your-backend-name.onrender.com/api`
- Redeploy frontend

#### 3. Test API Endpoints
Try these in browser/Postman:
- `https://your-backend-name.onrender.com/api/users/test`
- `https://your-backend-name.onrender.com/api/books`

### 🚨 Common Issues:

#### A. Backend Sleep (Render Free Tier)
- **Problem**: Backend sleeps after 15 min inactivity
- **Solution**: Wait 30-60 seconds for cold start
- **Check**: Visit backend URL directly first

#### B. CORS Issues
- **Error**: "CORS policy error"
- **Solution**: Add your Vercel URL to backend CORS settings

#### C. Environment Variables
- **Problem**: API URL not set correctly
- **Check**: Vercel → Project → Settings → Environment Variables

### 🔧 Quick Fixes:

#### Fix 1: Update Frontend Environment
```bash
# In Vercel dashboard
VITE_API_URL=https://your-backend-name.onrender.com/api
```

#### Fix 2: Wake Up Backend
- Visit backend URL directly
- Wait for "📚 BookBarter API is running!" message
- Then test frontend

#### Fix 3: Check Mobile Network
- Try on WiFi vs mobile data
- Clear browser cache on mobile
- Try incognito/private browsing

### ✅ Working URLs Should Be:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Base**: `https://your-backend.onrender.com/api`

### 📱 Mobile Testing Tips:
1. **Wait for backend wake-up** (30-60 seconds first time)
2. **Check network connection**
3. **Try refreshing page**
4. **Clear mobile browser cache**

## 🎯 Next Steps:
1. **Redeploy frontend** after axios.js fix
2. **Test backend URL directly**
3. **Try login again on mobile**

Your BookBarter should work after these fixes! 🚀
