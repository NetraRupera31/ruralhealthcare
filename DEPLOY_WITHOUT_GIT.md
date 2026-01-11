# Deploy to Vercel Using GitHub Web Interface (No Git Installation)

## ✅ Simple Browser-Based Deployment

You don't need to install Git! Use GitHub's web interface instead.

---

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Sign in (or create account if needed)
3. Repository settings:
   - **Name:** `healthcare-app` (or any name you want)
   - **Description:** Healthcare management web application
   - **Privacy:** Public (required for free Vercel deployment)
   - **DO NOT** check "Add a README file"
   - **DO NOT** add .gitignore or license
4. Click **"Create repository"**

---

## Step 2: Upload Your Code (5 minutes)

### Option A: Upload via Web Interface (Easiest)

1. On your new repository page, click **"uploading an existing file"** link
2. **Drag and drop** these folders/files from your `App layout` folder:
   - `Update Login Screen Text (2)` folder
   - `backend` folder
   - `package.json`
   - `package-lock.json`
   - `.gitignore`
   - `vercel.json`
   
   **Do NOT upload:**
   - `node_modules` folder
   - `healthcare-mobile` folder (Expo project - not needed for web)
   - `dist` folder (will be built automatically)

3. Scroll down and click **"Commit changes"**

### Option B: Upload as ZIP (Alternative)

1. Create a ZIP file of your project:
   - Right-click `App layout` folder
   - Send to → Compressed (zipped) folder
   
2. On GitHub repository page:
   - Click **"Add file"** → **"Upload files"**
   - Upload the ZIP file
   - GitHub will extract it automatically
   - Click **"Commit changes"**

---

## Step 3: Deploy to Vercel (2 minutes)

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub
5. Click **"Add New..."** → **"Project"**
6. Find your `healthcare-app` repository
7. Click **"Import"**

### Configure Deployment Settings:

Vercel will auto-detect, but verify these settings:

- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build`
- **Output Directory:** `Update Login Screen Text (2)/dist`
- **Install Command:** `npm install`

8. Click **"Deploy"**

**Your app will be live in ~2 minutes!** 🎉

Vercel will give you a URL like: `https://healthcare-app.vercel.app`

---

## Step 4: Deploy Backend (Required for Full Functionality)

Since Vercel doesn't support Java backends, use Railway (free):

### Deploy Backend to Railway:

1. Go to https://railway.app
2. Sign in with **GitHub** (same account)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `healthcare-app` repository
6. Railway auto-detects Spring Boot
7. Click **"Deploy"**

Railway will give you a backend URL like: `https://healthcare-app-production.up.railway.app`

---

## Step 5: Connect Frontend to Backend

Once Railway backend is deployed:

1. Copy your Railway backend URL (e.g., `https://healthcare-app-production.up.railway.app`)
2. Go back to your GitHub repository
3. Navigate to: `Update Login Screen Text (2)/src/services/api.ts`
4. Click the **pencil icon** (Edit this file)
5. Find line ~5: `const API_BASE_URL = 'http://localhost:8080/api';`
6. Change it to: `const API_BASE_URL = 'https://YOUR-RAILWAY-URL/api';`
7. Click **"Commit changes"**

Vercel will automatically rebuild and redeploy (takes ~1 minute).

---

## Your Live URLs

After deployment:

- **Frontend:** `https://your-app.vercel.app` (Vercel provides this)
- **Backend:** `https://your-app.railway.app` (Railway provides this)

---

## Update Files Later (Without Git)

To make changes after deployment:

1. Go to your GitHub repository
2. Navigate to the file you want to edit
3. Click the **pencil icon** (Edit)
4. Make your changes
5. Click **"Commit changes"**
6. Vercel auto-deploys the update in ~1 minute

---

## Alternative: Direct Vercel Upload (No GitHub)

If you don't want to use GitHub at all:

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Deploy from your project folder:
   ```powershell
   cd "c:\Users\Netra Rupera\Desktop\App layout"
   vercel
   ```

3. Follow the prompts, and it deploys directly!

---

## What Gets Deployed

✅ Your React web app (`Update Login Screen Text (2)`)  
✅ Built automatically by Vercel  
✅ Hosted on Vercel's CDN (fast worldwide)  
✅ HTTPS enabled automatically  
✅ Auto-deploys on every GitHub commit  

---

## Testing Your Deployed App

Once deployed:

1. Visit your Vercel URL
2. Login with any email/password (e.g., `test@example.com`)
3. Create a patient
4. View dashboards
5. Test all features

If backend is deployed, data persists. If not, app still works in "demo mode."

---

## Free Tier Limits

Both services offer generous free tiers:

**Vercel Free:**
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Perfect for this project ✅

**Railway Free:**
- 500 hours/month runtime
- $5 free credit/month
- Enough for development/testing ✅

---

## Need Help?

- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- GitHub upload guide: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

**Next Step:** Go to https://github.com/new and create your repository!
