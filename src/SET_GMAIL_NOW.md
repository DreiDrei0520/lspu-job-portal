# ⚡ Set Gmail NOW - Fix Auth Error

## 🚨 The Problem

Your Gmail credentials are **NOT SET** in Supabase!

```
Error: 535 Username and Password not accepted
```

This means the environment variables don't exist yet.

---

## ✅ The Solution (2 Minutes)

### Your Credentials:
```
Email: jadesupremo0@gmail.com
Password: lfnsyegcvqbaywbq
```

---

## 📝 Step-by-Step

### 1️⃣ Open Supabase (30 seconds)

```
https://supabase.com/dashboard
↓
Click: Your LSPU-LBC project
↓
Go to: Settings (left sidebar)
↓
Click: Edge Functions or Configuration
↓
Click: Secrets or Environment Variables
```

### 2️⃣ Add First Variable (30 seconds)

**Click**: "New Secret" or "Add Variable"

```
Name: GMAIL_USER
Value: jadesupremo0@gmail.com
```

**Click**: Save

### 3️⃣ Add Second Variable (30 seconds)

**Click**: "New Secret" or "Add Variable"

```
Name: GMAIL_APP_PASSWORD
Value: lfnsyegcvqbaywbq
```

⚠️ **Type it carefully! NO SPACES!**

**Click**: Save

### 4️⃣ Wait (30 seconds)

Wait 30 seconds for deployment to complete.

---

## 🧪 Test (1 minute)

1. **Go to**: Login → Forgot Password
2. **Enter**: admin@lspu.edu.ph
3. **Click**: Send Code
4. **Check**: Gmail inbox
5. **Expected**: Email arrives with 6-digit code

---

## ✅ Success Looks Like

### In Server Logs:
```
GMAIL_USER exists: true ✅
GMAIL_APP_PASSWORD exists: true ✅
GMAIL_APP_PASSWORD length: 16 ✅
✅ Email sent successfully to admin@lspu.edu.ph
```

### In Gmail Inbox:
```
From: jadesupremo0@gmail.com
Subject: LSPU-LBC Job Portal - Password Reset Code

Your code: 847291
```

---

## ❌ If Still Not Working

### Check These:

1. **Both variables set?**
   ```
   GMAIL_USER = jadesupremo0@gmail.com
   GMAIL_APP_PASSWORD = lfnsyegcvqbaywbq
   ```

2. **Password correct?**
   - Should be: `lfnsyegcvqbaywbq`
   - Length: 16 characters
   - NO spaces!

3. **2FA enabled?**
   - Go to: https://myaccount.google.com/security
   - Check: 2-Step Verification is ON

4. **App password valid?**
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in as: jadesupremo0@gmail.com
   - Verify: lfnsyegcvqbaywbq is still active
   - If not, create new one

---

## 🔄 If You Need New App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in: jadesupremo0@gmail.com
3. Click: Create app password
4. App: "Mail" or "LSPU Portal"
5. Copy: 16-character password
6. Paste: Into GMAIL_APP_PASSWORD (remove spaces!)
7. Save
8. Test again

---

## 📊 Quick Checklist

- [ ] GMAIL_USER set to `jadesupremo0@gmail.com`
- [ ] GMAIL_APP_PASSWORD set to `lfnsyegcvqbaywbq`
- [ ] Both variables saved in Supabase
- [ ] Waited 30 seconds
- [ ] 2FA enabled on Gmail account
- [ ] App password is valid
- [ ] Tested password reset
- [ ] Checked server logs
- [ ] Email received in Gmail

---

## 🎯 Summary

**Problem**: Environment variables not set  
**Solution**: Set them in Supabase Secrets  
**Time**: 2 minutes  
**Result**: Gmail emails working!  

---

**👉 DO THIS NOW! 👈**

Set the two environment variables and test!
