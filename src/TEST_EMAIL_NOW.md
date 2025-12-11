# 🧪 Test Email Setup NOW - Quick Guide

## ⚡ 3-Minute Test

### Your Gmail Credentials:
- **Email**: `jadesupremo0@gmail.com`
- **App Password**: `lfnsyegcvqbaywbq` ← **NO SPACES!**

---

## 🚀 Test Steps

### 1️⃣ Verify Environment Variables (1 min)

Go to your Supabase Dashboard:
1. Open: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **Secrets** (or **Environment Variables**)
4. Verify these exist:

```
GMAIL_USER = jadesupremo0@gmail.com
GMAIL_APP_PASSWORD = lfnsyegcvqbaywbq
```

⚠️ **Critical**: The app password must have **NO SPACES**!
- ❌ Wrong: `lfns yegc vqba ywbq`
- ✅ Right: `lfnsyegcvqbaywbq`

---

### 2️⃣ Test Password Reset (1 min)

1. **Open your Job Portal**
2. Click **"Login"**
3. Click **"Forgot Password?"**
4. **Enter a test email** (any email that exists in your system)
5. Click **"Send Verification Code"**

---

### 3️⃣ Check Results (1 min)

#### ✅ SUCCESS - Email Configured:
You'll see this toast:
```
✅ Verification code sent to your email!
Please check your inbox and spam folder
```

**Then**:
1. Open the recipient's email inbox
2. Look for email from: `jadesupremo0@gmail.com`
3. Subject: "LSPU-LBC Job Portal - Password Reset Code"
4. Email contains a 6-digit code
5. Enter the code and complete password reset

#### ❌ FAIL - Email NOT Configured:
You'll see this toast:
```
⚠️ Email not configured. Your code is: 123456
Enter this code in the next step
```

**This means**: Gmail credentials are not properly set.

---

## 🔧 If Email NOT Working

### Quick Fix:

1. **Go to Supabase Dashboard** → Settings → Secrets

2. **Set or Update**:
   ```
   GMAIL_USER
   Value: jadesupremo0@gmail.com
   ```

   ```
   GMAIL_APP_PASSWORD
   Value: lfnsyegcvqbaywbq
   ```

3. **Save changes**

4. **Redeploy the server function** (if needed):
   - Go to: Functions → server
   - Click "Redeploy"

5. **Wait 30 seconds** for deployment

6. **Test again** (repeat Step 2)

---

## 📊 Check Server Logs

### How to View Logs:

1. Go to Supabase Dashboard
2. Navigate to: **Functions** → **server**
3. Click on the function
4. Click **"Logs"** tab
5. Request a password reset
6. Watch the logs in real-time

### ✅ What You Want to See:

```
Password reset requested for: user@example.com
Generated reset code: 123456
Reset code stored successfully in KV
Email sent successfully to user@example.com
✅ Password reset email sent successfully to: user@example.com

═══════════════════════════════════════════
PASSWORD RESET CODE
═══════════════════════════════════════════
Email: user@example.com
Code: 123456
Email Sent: YES ✅      ← LOOK FOR THIS!
Expires: Nov 5, 2025, 3:45 PM
═══════════════════════════════════════════
```

### ❌ What Means It's NOT Working:

```
Gmail credentials not configured. Email sending disabled.
```

Or:

```
Email sending error: [some error message]
Email Sent: NO ❌      ← This means it failed
```

---

## 🎯 Common Issues & Solutions

### Issue 1: "Gmail credentials not configured"

**Cause**: Environment variables not set or incorrect

**Fix**:
1. Set GMAIL_USER = `jadesupremo0@gmail.com`
2. Set GMAIL_APP_PASSWORD = `lfnsyegcvqbaywbq` (no spaces!)
3. Redeploy function
4. Test again

---

### Issue 2: "Authentication failed"

**Cause**: App password is wrong or has spaces

**Fix**:
1. Use app password WITHOUT spaces: `lfnsyegcvqbaywbq`
2. If still failing, generate a new app password:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in to: jadesupremo0@gmail.com
   - Create new app password for "Mail"
   - Update GMAIL_APP_PASSWORD with new value
   - Test again

---

### Issue 3: "No email received"

**Cause**: Multiple possibilities

**Fix**:
1. **Check spam folder** first!
2. **Wait 30 seconds** (Gmail can be slow)
3. **Check server logs** - does it say "Email Sent: YES ✅"?
4. If YES but still no email: Check spam settings
5. If NO: Fix authentication issue first

---

### Issue 4: Email from wrong address

**Expected**: Emails come FROM `jadesupremo0@gmail.com`

**If different**: Update GMAIL_USER to the correct address

---

## 🔐 Security Checklist

Before going live, verify:

- [ ] 2FA is enabled on jadesupremo0@gmail.com
- [ ] App password is stored in environment variables (NOT in code)
- [ ] App password has NO spaces: `lfnsyegcvqbaywbq`
- [ ] Gmail account has strong password
- [ ] Only you have access to these credentials

---

## 📧 What Users Will See

When everything is working, users receive:

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

┌─────────────────────────┐
│                          │
│       1 2 3 4 5 6       │
│                          │
└─────────────────────────┘

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

## ✅ Success Criteria

You know it's working when:

1. ✅ Toast shows "✅ Verification code sent to your email!"
2. ✅ Server logs show "Email Sent: YES ✅"
3. ✅ Email arrives in inbox within 10 seconds
4. ✅ Email shows LSPU-LBC branding
5. ✅ 6-digit code is visible
6. ✅ Code works when entered
7. ✅ Password reset completes successfully

---

## 🎉 After Successful Test

Once you see the email arrive:

1. ✅ **Test with 2-3 different users** to confirm consistency
2. ✅ **Document your setup** (save these credentials securely)
3. ✅ **Monitor first few real uses** (check server logs)
4. ✅ **Announce to users** that password reset is working!

---

## 📞 Still Having Issues?

If after following all steps above, emails still aren't sending:

1. **Double-check app password**:
   - Must be: `lfnsyegcvqbaywbq`
   - NO spaces, NO dashes
   - Exactly 16 characters

2. **Verify Gmail account**:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in as: jadesupremo0@gmail.com
   - Check if app password still exists
   - If deleted, generate new one

3. **Check Gmail sending limits**:
   - Free Gmail: ~500 emails/day
   - Have you hit the limit?

4. **Review complete logs**:
   - Any error messages?
   - What's the exact error?

---

**Quick Reference**:
- Email: `jadesupremo0@gmail.com`
- App Password: `lfnsyegcvqbaywbq` (16 chars, no spaces)
- Test URL: Your Job Portal → Login → Forgot Password

**Ready? Go test it now!** 🚀
