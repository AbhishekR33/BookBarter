# Login Failed - Troubleshooting Guide

## 🔍 Common Causes and Solutions

### 1. **Backend Server Not Running** ❌ → ✅
**Check**: Open browser and go to `http://localhost:5000`
- Should see: "📚 BookBarter API is running!"
- If not working: Start backend server

```cmd
cd backend
npm start
```

### 2. **Database Connection Issues** ❌ → ✅
**Check**: Backend console logs when starting server
- Should see: "✅ Connected to MongoDB"
- If not: Check MongoDB connection string in `.env` file

### 3. **User Account Issues** ❌ → ✅
**Scenarios**:
- User doesn't exist → Register first
- Wrong password → Check password
- Email typo → Check email spelling

### 4. **Network/CORS Issues** ❌ → ✅
**Check**: Browser Network tab (F12)
- Look for failed requests to `localhost:5000`
- CORS errors in console
- Connection refused errors

### 5. **Frontend-Backend URL Mismatch** ❌ → ✅
**Check**: `frontend/src/api/axios.js`
- Should be: `http://localhost:5000/api`
- Backend should be running on port 5000

## 🛠️ Quick Diagnostic Steps

### Step 1: Test Backend
```cmd
# In backend folder
npm start
```
Should show:
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

### Step 2: Test Database Connection
- Backend logs should show MongoDB connection
- If MongoDB is down, install and start it

### Step 3: Test User Registration
- Try registering a new user first
- Then try logging in with that user

### Step 4: Check Browser Console
- Open DevTools (F12)
- Look for error messages in Console tab
- Check Network tab for failed requests

### Step 5: Clear Browser Data
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🔧 Improved Error Messages

The login form now shows specific errors:
- ✅ "User not found. Please check your email or register first."
- ✅ "Invalid password. Please try again."
- ✅ "Cannot connect to server. Please check if the backend is running."
- ✅ "Server error. Please try again later."

## 📝 Debug Scripts

### Run `debug-login.js` in browser console:
1. Go to login page
2. Open DevTools (F12)
3. Go to Console tab
4. Copy and paste the debug script
5. Check the output for specific issues

### Test a working login:
1. Make sure backend is running
2. Register a new user first
3. Then try logging in with those credentials

## ⚠️ Most Common Issue
**Backend not running** - Make sure to start the backend server before trying to login!
