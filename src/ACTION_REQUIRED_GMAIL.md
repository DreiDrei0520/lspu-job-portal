# ⚠️ ACTION REQUIRED: Configure Gmail

## 🚨 What Just Happened

I've removed the dev mode from your password reset system.

**IMPORTANT**: Password reset will **NOT work** until you configure Gmail!

---

## ⚡ Quick Action (2 Minutes)

### Your Gmail Credentials:

```
Email: jadesupremo0@gmail.com
Password: lfnsyegcvqbaywbq
```

⚠️ Password must have **NO SPACES**!

---

## 🔧 Setup Now

### 1. Open Supabase Dashboard
```
https://supabase.com/dashboard
→ Select: LSPU-LBC Job Portal
→ Go to: Settings → Secrets
```

### 2. Add Two Variables

**First Variable:**
```
Name: GMAIL_USER
Value: jadesupremo0@gmail.com
```

**Second Variable:**
```
Name: GMAIL_APP_PASSWORD
Value: lfnsyegcvqbaywbq
```

**Click Save!**

---

## ✅ Test It

1. Go to: **Login** → **Forgot Password**
2. Enter: Any existing email (e.g., admin@lspu.edu.ph)
3. Click: **Send Verification Code**
4. Check: Gmail inbox
5. Expected: Email with 6-digit code arrives in < 10 seconds

---

## 🎯 Success Indicators

✅ Toast: "✅ Verification code sent to your email!"  
✅ Email received from: jadesupremo0@gmail.com  
✅ Email subject: "LSPU-LBC Job Portal - Password Reset Code"  
✅ 6-digit code visible in email  
✅ Code works when entered  

---

## 🚨 If Not Working

### Check These:

1. **Both variables set?**
   - GMAIL_USER
   - GMAIL_APP_PASSWORD

2. **Password has NO spaces?**
   - Should be: `lfnsyegcvqbaywbq`
   - NOT: `lfns yegc vqba ywbq`

3. **Check spam folder**
   - Gmail might filter it initially

4. **Check server logs**
   - Look for: "Email Sent: YES ✅"

5. **Wait 30 seconds**
   - After setting variables, allow deployment time

---

## 📊 What Changed

### Before:
```
┌─────────────────────────────────┐
│ Development Mode - Your Code:   │
│                                 │
│       3 9 9 6 2 1              │ ← Code shown in UI
│                                 │
└─────────────────────────────────┘
```

### After:
```
No code in UI!
User must check Gmail inbox!

Gmail Inbox:
┌─────────────────────────────────┐
│ From: jadesupremo0@gmail.com    │
│ Subject: Password Reset Code    │
│                                 │
│       8 4 7 2 9 1              │ ← Code in email
│                                 │
└─────────────────────────────────┘
```

---

## 📚 Detailed Guides

| Guide | Link |
|-------|------|
| Quick Setup | `/SETUP_GMAIL_CREDENTIALS_NOW.md` |
| Before/After | `/BEFORE_AFTER_DEV_MODE.md` |
| Ultra Quick | `/GMAIL_QUICK_SETUP.md` |
| Full Docs | `/EMAIL_DOCS_INDEX.md` |

---

## ⏰ Time Estimate

- **Setup**: 2 minutes
- **Test**: 1 minute
- **Total**: 3 minutes

---

## 🎉 End Result

Once configured:

✅ **Professional** password reset emails  
✅ **Secure** (code only in email, not in UI)  
✅ **Branded** with LSPU-LBC colors  
✅ **Production-ready** immediately  

---

## 🚀 Status

- ✅ **Code Updated**: Dev mode removed
- ⚠️ **Gmail Config**: Required (2 minutes)
- 🎯 **Next Step**: Set environment variables NOW!

---

**Priority**: 🔥 **HIGH** - Required for password reset to work  
**Time**: ⏱️ 2 minutes  
**Difficulty**: 🎯 Easy  

👉 **Configure Gmail NOW!** 👈
