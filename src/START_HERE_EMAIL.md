# 🚀 START HERE - Gmail Password Reset Setup

## ✅ What's Ready

Your LSPU-LBC Job Portal is configured to send password reset codes via **real Gmail emails**!

---

## 🔑 Your Credentials

**Gmail Account**: `jadesupremo0@gmail.com`

**App Password**: `lfnsyegcvqbaywbq` ← **NO SPACES!**

⚠️ **IMPORTANT**: The app password must be entered **without spaces**!

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Set Environment Variables (1 min)

Go to your Supabase Dashboard:

1. Open: https://supabase.com/dashboard
2. Select your LSPU-LBC project
3. Go to: **Settings** → **Secrets** (or **Environment Variables**)
4. Add or update these two variables:

```
Variable: GMAIL_USER
Value: jadesupremo0@gmail.com
```

```
Variable: GMAIL_APP_PASSWORD
Value: lfnsyegcvqbaywbq
```

5. Click **Save**
6. **Redeploy** your server function if needed

### Step 2: Test It! (1 min)

1. Open your Job Portal
2. Click **"Login"**
3. Click **"Forgot Password?"**
4. Enter any existing user's email
5. Click **"Send Verification Code"**

### Step 3: Verify Email Received (1 min)

1. Check the recipient's email inbox
2. Look for email from: `jadesupremo0@gmail.com`
3. Subject: "LSPU-LBC Job Portal - Password Reset Code"
4. Should contain a 6-digit code
5. Enter the code and complete password reset

---

## ✅ Expected Results

### Success Toast:
```
✅ Verification code sent to your email!
Please check your inbox and spam folder
```

### Email Received:
```
From: jadesupremo0@gmail.com
Subject: LSPU-LBC Job Portal - Password Reset Code

┌─────────────────────────────────────┐
│  🔐 Password Reset Request          │
│  LSPU-LBC Online Job Portal         │
├─────────────────────────────────────┤
│  Your verification code:            │
│                                     │
│  ┌─────────────────┐               │
│  │   1 2 3 4 5 6   │               │
│  └─────────────────┘               │
│                                     │
│  ⏰ Expires in 15 minutes           │
└─────────────────────────────────────┘
```

### Server Logs Show:
```
✅ Password reset email sent successfully to: user@example.com
Email Sent: YES ✅
```

---

## 🚨 If Not Working

### Quick Fixes:

1. **Verify app password has NO spaces**:
   - Should be: `lfnsyegcvqbaywbq` (16 characters)
   - NOT: `lfns yegc vqba ywbq`

2. **Check both environment variables are set**:
   - `GMAIL_USER` = `jadesupremo0@gmail.com`
   - `GMAIL_APP_PASSWORD` = `lfnsyegcvqbaywbq`

3. **Redeploy server function** after setting variables

4. **Wait 30 seconds** for changes to take effect

5. **Check server logs** for error messages

6. **Check spam folder** if email not in inbox

---

## 📚 Detailed Documentation

Need more help? Check these guides:

| Document | Purpose |
|----------|---------|
| **`/TEST_EMAIL_NOW.md`** | Quick testing guide |
| **`/VERIFY_GMAIL_SETUP.md`** | Verify your setup |
| **`/SETUP_CHECKLIST.md`** | Complete checklist |
| **`/GMAIL_CREDENTIALS.txt`** | Credential reference |
| **`/GMAIL_SETUP_INSTRUCTIONS.md`** | Full setup guide |
| **`/EMAIL_PREVIEW.md`** | What emails look like |
| **`/PASSWORD_RESET_EMAIL_SUMMARY.md`** | Technical docs |

---

## 🔐 Security Reminder

- ✅ App password has **NO SPACES**: `lfnsyegcvqbaywbq`
- ✅ Store credentials in **environment variables only**
- ✅ **Never** commit credentials to code
- ✅ Enable **2FA** on jadesupremo0@gmail.com
- ✅ Keep Gmail account **secure**

---

## 🎯 Quick Reference

```
═══════════════════════════════════════════
GMAIL CREDENTIALS FOR LSPU-LBC JOB PORTAL
═══════════════════════════════════════════

Email: jadesupremo0@gmail.com
App Password: lfnsyegcvqbaywbq

Environment Variables:
  GMAIL_USER = jadesupremo0@gmail.com
  GMAIL_APP_PASSWORD = lfnsyegcvqbaywbq

Test URL: 
  Your Portal → Login → Forgot Password

Expected Result:
  ✅ Email sent within 10 seconds
  ✅ Professional LSPU-LBC branded email
  ✅ 6-digit code visible
  ✅ Code works for password reset

═══════════════════════════════════════════
```

---

## ✨ What Users Get

Professional emails with:

✅ **LSPU-LBC branding** in Surfie Green colors  
✅ **Clear 6-digit code** (large, easy to read)  
✅ **15-minute expiration** for security  
✅ **Security tips** and warnings  
✅ **Responsive design** (works on mobile)  
✅ **Professional formatting** (HTML email)  

---

## 🎉 You're Ready!

Once you complete the 3 steps above:

1. ✅ Environment variables are set
2. ✅ Test email is received
3. ✅ Password reset works end-to-end

Then your system is **LIVE** and ready for users! 🚀

---

## 📞 Need Help?

1. **Test not working?** → See `/TEST_EMAIL_NOW.md`
2. **Setup questions?** → See `/VERIFY_GMAIL_SETUP.md`
3. **Complete guide?** → See `/GMAIL_SETUP_INSTRUCTIONS.md`
4. **Troubleshooting?** → See `/SETUP_CHECKLIST.md`

---

**Status**: ⚡ Ready to configure!  
**Time needed**: 3 minutes  
**Difficulty**: Easy  
**Result**: Professional password reset emails via Gmail

🚀 **Go set it up now!**
