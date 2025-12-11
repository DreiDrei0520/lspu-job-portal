# 🚀 LSPU-LBC Job Portal - GO LIVE GUIDE

## ✅ DEPLOYMENT READY

Your app is ready to deploy! Here's how to go live:

---

## 🟢 **OPTION 1: VERCEL (RECOMMENDED)**

### Why Vercel?
- ✅ Free hosting for React/Vite apps
- ✅ Automatic deployments from GitHub
- ✅ 50GB bandwidth/month (free)
- ✅ Custom domain support
- ✅ SSL certificate included
- ✅ Environment variables management

### Steps:

#### 1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "LSPU-LBC Job Portal - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lspu-job-portal.git
git push -u origin main
```

#### 2. **Create Vercel Account**
- Go to: https://vercel.com
- Sign up (free) with GitHub account
- Authorize Vercel

#### 3. **Deploy Your Project**
- Click "Add New..." → "Project"
- Select your GitHub repo
- Click "Import"
- Vercel will auto-detect Vite

#### 4. **Add Environment Variables**
In Vercel dashboard, add:
```
VITE_SUPABASE_URL=https://zodduukuwfatmqejxnsf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 5. **Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your site is LIVE! 🎉

#### 6. **Get Your URL**
- Vercel gives you a free URL: `https://your-project.vercel.app`
- Add custom domain (optional): Point DNS to Vercel

---

## 🟡 **OPTION 2: NETLIFY**

### Steps:

#### 1. **Connect GitHub to Netlify**
- Go to: https://netlify.com
- Click "Add new site"
- "Connect to Git" → Choose GitHub
- Select your repo

#### 2. **Configure Build**
- Build command: `npm run build`
- Publish directory: `build`
- Click "Deploy site"

#### 3. **Add Environment Variables**
- Site settings → Build & deploy → Environment
- Add your Supabase keys

#### 4. **Your Site is Live!**
- Netlify gives you a free URL
- Add custom domain later

---

## 🔴 **OPTION 3: TRADITIONAL VPS/HOSTING**

If you want to use your current server:

### 1. **Production Build**
```bash
npm run build
```
This creates a `build/` folder with optimized files.

### 2. **Upload to Server**
Upload the `build/` folder to your web server's public directory:
```
/var/www/html/
/home/username/public_html/
```

### 3. **Configure Web Server (nginx/Apache)**
Create `.htaccess` (for Apache):
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 📋 **FINAL CHECKLIST**

- [ ] Code built successfully: `npm run build`
- [ ] All dependencies installed: `npm install`
- [ ] Environment variables configured
- [ ] Supabase edge functions deployed
- [ ] Demo accounts created
- [ ] App tested locally
- [ ] GitHub repo ready
- [ ] Vercel/Netlify account created
- [ ] Domain name ready (optional)

---

## 🎯 **LAUNCH CHECKLIST**

Before going live:

1. ✅ **Test all features:**
   - Signup/Login works
   - Jobs display
   - Applications submit
   - Profiles save
   - Notifications work

2. ✅ **Performance:**
   - Check Lighthouse score (aim for 80+)
   - Test on mobile
   - Test on slow connection

3. ✅ **Security:**
   - No sensitive data in code
   - HTTPS enabled (automatic on Vercel/Netlify)
   - Environment variables not exposed
   - Supabase RLS policies enabled

4. ✅ **Analytics:**
   - Add Google Analytics (optional)
   - Monitor errors with Sentry (optional)

---

## 🚀 **POST-DEPLOYMENT**

After deploying:

1. **Monitor Your Site**
   - Check error logs
   - Monitor performance
   - Test all features work

2. **Continuous Deployment**
   - Push to GitHub → Auto-deploys to Vercel/Netlify
   - No manual uploads needed

3. **Scale When Needed**
   - Free tier handles ~1000 concurrent users
   - Upgrade when needed

---

## 📞 **SUPPORT**

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev/guide/

---

**Your app is ready! Choose your option and go live! 🎉**
