# 🚀 Set Up Gmail NOW - 2 Minutes

## ✅ What I Just Fixed

**REMOVED**: Dev mode message that showed the code in the UI  
**NOW**: You'll receive the code via real Gmail email

---

## ⚡ Quick Setup (2 Steps)

### Your Credentials:
- **Email**: `jadesupremo0@gmail.com`
- **App Password**: `lfnsyegcvqbaywbq` ← **NO SPACES!**

---

## Step 1: Set Environment Variables (1 min)

### Go to Supabase Dashboard:

1. Open: https://supabase.com/dashboard
2. Click on your **LSPU-LBC Job Portal** project
3. Go to: **Settings** → **Edge Functions** → **Secrets**
   (Or: **Settings** → **Environment Variables**)

### Add These Two Variables:

**Variable 1:**
```
Name: GMAIL_USER
Value: jadesupremo0@gmail.com
```

**Variable 2:**
```
Name: GMAIL_APP_PASSWORD
Value: lfnsyegcvqbaywbq
```

⚠️ **CRITICAL**: The password must have **NO SPACES**!
- ❌ **WRONG**: `lfns yegc vqba ywbq`
- ✅ **RIGHT**: `lfnsyegcvqbaywbq`

4. Click **Save** or **Add Secret**

---

## Step 2: Test It! (1 min)

### Test Password Reset:

1. **Open your Job Portal**
2. Click **"Login"**
3. Click **"Forgot Password?"**
4. **Enter any existing user email** (e.g., admin@lspu.edu.ph)
5. Click **"Send Verification Code"**

### Expected Result:

✅ **Toast shows**: "✅ Verification code sent to your email!"  
✅ **Check Gmail inbox** for the test email  
✅ **Email from**: jadesupremo0@gmail.com  
✅ **Subject**: "LSPU-LBC Job Portal - Password Reset Code"  
✅ **Contains**: 6-digit code (e.g., 847291)

### If Email Received:
🎉 **SUCCESS!** Your Gmail is configured correctly!

### If No Email:
1. **Check spam folder** first!
2. **Wait 30 seconds** (Gmail can be slow)
3. **Verify** both environment variables are set
4. **Check** app password has NO spaces
5. **Redeploy** the server function if needed

---

## 🔍 Verify Server Logs

After requesting a password reset:

1. Go to: **Supabase Dashboard** → **Functions** → **server** → **Logs**
2. Look for this:

### ✅ SUCCESS:
```
Email sent successfully to user@example.com
✅ Password reset email sent successfully
Email Sent: YES ✅
```

### ❌ FAILURE:
```
Gmail credentials not configured. Email sending disabled.
Email Sent: NO ❌
```

If you see the failure message, the environment variables are not set correctly.

---

## 📧 What Users Will Receive

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: jadesupremo0@gmail.com
Subject: LSPU-LBC Job Portal - Password Reset Code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Password Reset Request
LSPU-LBC Online Job Portal

Hello,

You have requested to reset your password for the 
LSPU-LBC Online Job Portal.

Please use the following verification code:

┌─────────────────────────────────┐
│                                 │
│         8 4 7 2 9 1            │
│                                 │
└─────────────────────────────────┘

⏰ Important: This code will expire in 15 minutes.

Security Tips:
• Never share this code with anyone
• LSPU-LBC staff will never ask for this code
• If you didn't request this reset, ignore this email

Best regards,
LSPU-LBC HR Department

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Laguna State Polytechnic University - Los Baños Campus
This is an automated email. Please do not reply.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Quick Checklist

Before testing:
- [ ] GMAIL_USER = `jadesupremo0@gmail.com`
- [ ] GMAIL_APP_PASSWORD = `lfnsyegcvqbaywbq` (no spaces!)
- [ ] Both variables saved in Supabase
- [ ] Waited 30 seconds for deployment

After testing:
- [ ] Toast shows success message
- [ ] Email received in inbox
- [ ] Email is from jadesupremo0@gmail.com
- [ ] Code is visible in email
- [ ] Code works when entered
- [ ] Password reset completes
- [ ] Can login with new password

---

## 🚨 Common Issues

### Issue: "No email received"

**Solutions**:
1. **Check spam folder!** This is the #1 reason
2. Wait 30 seconds (Gmail can be slow)
3. Verify environment variables are set
4. Check server logs for errors
5. Make sure app password has NO spaces

### Issue: "Gmail credentials not configured"

**Solutions**:
1. Go to Supabase Dashboard → Settings → Secrets
2. Verify both GMAIL_USER and GMAIL_APP_PASSWORD exist
3. Make sure GMAIL_APP_PASSWORD = `lfnsyegcvqbaywbq` (no spaces!)
4. Save changes
5. Redeploy function if needed
6. Test again

### Issue: "Authentication failed"

**Solutions**:
1. App password must be: `lfnsyegcvqbaywbq`
2. NO spaces, NO dashes
3. If still failing, regenerate app password:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in as: jadesupremo0@gmail.com
   - Create new app password
   - Update GMAIL_APP_PASSWORD
   - Test again

---

## ✅ What Changed

### Before (Old Behavior):
```
User requests password reset
  ↓
If Gmail NOT configured:
  ↓
Shows: "⚠️ Email not configured. Your code is: 399621"
  ↓
Code appears in UI below input field:
┌─────────────────────────────────────┐
│ Development Mode - Your Code:       │
│ 399621                              │
└─────────────────────────────────────┘
```

### After (New Behavior):
```
User requests password reset
  ↓
Shows: "✅ Verification code sent to your email!"
  ↓
User checks Gmail inbox
  ↓
Receives professional email with code
  ↓
User enters code from email
```

---

## 🎉 Ready!

**Status**: ✅ Dev mode removed  
**Next Step**: Set up Gmail credentials  
**Time needed**: 2 minutes  
**Result**: Real emails via Gmail!

---

## 📞 Need Help?

If you set up the credentials and it's still not working:

1. **Check server logs** for error messages
2. **Verify 2FA is enabled** on jadesupremo0@gmail.com
3. **Try regenerating** the app password
4. **Check Gmail sending limits** (500/day for free accounts)
5. **Review** `/VERIFY_GMAIL_SETUP.md` for detailed troubleshooting

---

**Quick Reference**:
- Email: `jadesupremo0@gmail.com`
- Password: `lfnsyegcvqbaywbq` (16 chars, no spaces)
- Set in: Supabase → Settings → Secrets
- Test at: Your Portal → Login → Forgot Password

🚀 **Go set it up now!**
