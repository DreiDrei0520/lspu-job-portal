# ⚡ Gmail Setup - Ultra Quick Guide

## 🎯 What Just Happened

✅ **Removed**: Dev mode that showed code in UI  
✅ **Now**: Real Gmail emails required  
⚡ **Need**: 2 minutes to configure Gmail  

---

## 🔑 Your Credentials

```
Email: jadesupremo0@gmail.com
App Password: lfnsyegcvqbaywbq
```

⚠️ **NO SPACES** in the password!

---

## ⚡ 60-Second Setup

### 1. Open Supabase (30 sec)
1. Go to: https://supabase.com/dashboard
2. Select: **LSPU-LBC Job Portal** project
3. Click: **Settings** → **Edge Functions** → **Secrets**

### 2. Add Variables (30 sec)
```
GMAIL_USER
jadesupremo0@gmail.com
```

```
GMAIL_APP_PASSWORD
lfnsyegcvqbaywbq
```

Click **Save**

---

## ✅ Test (30 sec)

1. Go to: Login → Forgot Password
2. Enter: admin@lspu.edu.ph
3. Click: Send Code
4. Check: Gmail inbox
5. See: 6-digit code

---

## 🎯 Expected Result

### Success:
```
✅ Toast: "Code sent to your email!"
✅ Email arrives in < 10 seconds
✅ From: jadesupremo0@gmail.com
✅ Contains: 6-digit code
✅ Code works!
```

### If No Email:
1. Check spam folder
2. Verify variables set
3. Check password has NO spaces
4. Wait 30 seconds
5. Try again

---

## 📧 Email Preview

```
From: jadesupremo0@gmail.com
Subject: LSPU-LBC Job Portal - Password Reset Code

🔐 Password Reset Request

Your verification code:

  8 4 7 2 9 1

⏰ Expires in 15 minutes
```

---

## 🚨 Quick Troubleshooting

### No email received?
→ Check spam folder first!

### "Gmail not configured"?
→ Verify both variables are set

### Authentication failed?
→ Password must be: `lfnsyegcvqbaywbq` (no spaces!)

### Still not working?
→ Check server logs in Supabase

---

## 📞 Detailed Help

| Issue | Guide |
|-------|-------|
| Setup steps | `/SETUP_GMAIL_CREDENTIALS_NOW.md` |
| Before/After | `/BEFORE_AFTER_DEV_MODE.md` |
| Full verification | `/VERIFY_GMAIL_SETUP.md` |
| All docs | `/EMAIL_DOCS_INDEX.md` |

---

## ✅ Checklist

Before testing:
- [ ] GMAIL_USER set
- [ ] GMAIL_APP_PASSWORD set (no spaces!)
- [ ] Variables saved
- [ ] Waited 30 seconds

After testing:
- [ ] Toast shows success
- [ ] Email received
- [ ] Code visible
- [ ] Code works
- [ ] Password resets

---

**Time**: 2 minutes  
**Difficulty**: Easy  
**Status**: Ready to configure

🚀 **Do it now!**
