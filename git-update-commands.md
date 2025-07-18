# 🔄 Git Commands to Update Deployment

## 📝 Step 1: Add and Commit Changes
```bash
# Navigate to your project folder
cd "C:\Users\abhis\OneDrive\Desktop\BookBarter"

# Add all changes
git add .

# Commit with message
git commit -m "Fix API endpoint - add /api to baseURL"
```

## 🚀 Step 2: Push to GitHub
```bash
# Push to your repository
git push origin main
```
*Note: Replace 'main' with 'master' if that's your default branch*

## 🔧 Step 3: Auto-Deploy
- **Vercel**: Will automatically redeploy when you push to GitHub
- **Render**: Will automatically redeploy when you push to GitHub

## 📱 Step 4: Test After Deploy
1. Wait 2-3 minutes for deployment
2. Check Vercel dashboard for "Ready" status
3. Check Render dashboard for "Live" status
4. Test login on mobile again

## ⚡ Quick Commands (Copy-Paste):
```bash
cd "C:\Users\abhis\OneDrive\Desktop\BookBarter"
git add .
git commit -m "Fix API endpoint for mobile login"
git push origin main
```

## 🔍 Check Status:
```bash
# See what files changed
git status

# See commit history
git log --oneline
```

## 🎯 Alternative: If Git Not Initialized
```bash
# Initialize git (first time only)
git init
git add .
git commit -m "Initial commit with API fix"
git branch -M main
git remote add origin https://github.com/AbhishekR33/BookBarter.git
git push -u origin main
```

After pushing, both Vercel and Render will automatically redeploy with your fixes! 🚀
