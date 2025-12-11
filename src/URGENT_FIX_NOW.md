# 🚨 URGENT: Environment Variables NOT SET!

## ❌ The Error You're Seeing

```
Error: 535: Username and Password not accepted
Error: The specified from adress is not a valid email adress
```

## 🎯 Root Cause

**YOUR ENVIRONMENT VARIABLES ARE NOT SET IN SUPABASE!**

The errors mean:
1. ❌ `GMAIL_USER` is NOT set (or is empty/invalid)
2. ❌ `GMAIL_APP_PASSWORD` is NOT set (or is empty/invalid)

## 📊 Check Your Server Logs

Look for this section in your logs:

```
=== ENVIRONMENT VARIABLES CHECK ===
GMAIL_USER exists: false
GMAIL_USER value: ❌ NOT SET - GO TO SUPABASE DASHBOARD!
GMAIL_APP_PASSWORD exists: false
GMAIL_APP_PASSWORD length: ❌ NOT SET - GO TO SUPABASE DASHBOARD!
```

If you see "false" and "NOT SET", the variables **ARE NOT CONFIGURED**.

---

## ⚡ FIX IT NOW (2 Minutes)

### Step 1: Open Supabase Dashboard

Go to: **https://supabase.com/dashboard**

### Step 2: Find Your Project

Click on: **LSPU-LBC Job Portal** project

### Step 3: Navigate to Secrets

**METHOD A** (Recommended):
```
Click: Settings (left sidebar)
  ↓
Click: Edge Functions (or Configuration)
  ↓
Scroll to: Secrets section
  ↓
Click: Add new secret
```

**METHOD B**:
```
Click: Edge Functions (left sidebar)
  ↓
Click: server function
  ↓
Click: Settings or Manage secrets
  ↓
Click: Add new secret
```

**METHOD C**:
```
Click: Project Settings
  ↓
Click: API or Configuration
  ↓
Look for: Environment Variables or Secrets
  ↓
Click: Add variable/secret
```

### Step 4: Add First Secret

```
┌───────────────────────────────────┐
│ Name: GMAIL_USER                  │
│ Value: jadesupremo0@gmail.com     │
└───────────────────────────────────┘
```

Click **"Add secret"** or **"Save"**

### Step 5: Add Second Secret

```
┌───────────────────────────────────┐
│ Name: GMAIL_APP_PASSWORD          │
│ Value: lfnsyegcvqbaywbq           │
└───────────────────────────────────┘
```

Click **"Add secret"** or **"Save"**

### Step 6: Wait

⏱️ **Wait 30 seconds** for the Edge Function to redeploy

---

## ✅ Verify They're Set

After adding, you should see both secrets listed:

```
Secrets:
  ● GMAIL_USER
    jade************com
  
  ● GMAIL_APP_PASSWORD
    ****************
```

---

## 🧪 Test Again

1. **Go to**: Login → Forgot Password
2. **Enter**: Any user email
3. **Click**: Send Code
4. **Check**: Server logs

### Expected Logs (Success):

```
=== ENVIRONMENT VARIABLES CHECK ===
GMAIL_USER exists: true ✅
GMAIL_USER value: jadesupremo0@gmail.com
GMAIL_APP_PASSWORD exists: true ✅
GMAIL_APP_PASSWORD length: 16

=== CREDENTIALS VALIDATION ===
✅ GMAIL_USER is valid email
✅ Cleaned username: jadesupremo0@gmail.com
✅ Cleaned password length: 16

✅✅✅ SUCCESS! ✅✅✅
Email sent successfully to user@example.com
```

### If Still Failing:

```
❌❌❌ CRITICAL ERROR ❌❌❌
GMAIL_USER: ❌ MISSING - ADD IT NOW!
GMAIL_APP_PASSWORD: ❌ MISSING - ADD IT NOW!
```

→ **The variables are STILL not set!** Go back and add them!

---

## 🔍 Common Issues

### Issue 1: "I added them but still getting errors"

**Possible causes**:
1. ❌ You added them in the wrong section (wrong project, wrong location)
2. ❌ Names have typos (must be EXACT: `GMAIL_USER` and `GMAIL_APP_PASSWORD`)
3. ❌ You didn't click "Save"
4. ❌ You didn't wait 30 seconds

**Solution**:
- Double-check you're in the correct project
- Verify the names are exactly: `GMAIL_USER` and `GMAIL_APP_PASSWORD` (all caps!)
- Click Save/Add secret
- Wait 30 seconds
- Try again

### Issue 2: "I can't find where to add secrets"

**Try these URLs** (replace PROJECT_ID):

```
https://supabase.com/dashboard/project/PROJECT_ID/settings/functions
https://supabase.com/dashboard/project/PROJECT_ID/functions
https://supabase.com/dashboard/project/PROJECT_ID/settings/api
```

**Or use the search**:
- Press `/` or click search
- Type: "secrets"
- Look for "Edge Function Secrets" or "Environment Variables"

### Issue 3: "Still says username/password not accepted"

After setting variables correctly, if you still get error:

**Check**:
1. ✅ GMAIL_USER = `jadesupremo0@gmail.com` (exact match)
2. ✅ GMAIL_APP_PASSWORD = `lfnsyegcvqbaywbq` (exact match, no spaces)
3. ✅ 2FA is enabled on the Gmail account
4. ✅ App password is still valid (not revoked)

**Test the credentials**:
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in as: jadesupremo0@gmail.com
3. Check if `lfnsyegcvqbaywbq` is listed as an active app password
4. If not, generate a NEW one:
   - Click "Create app password"
   - Select: Mail
   - Copy the 16-character password
   - Update GMAIL_APP_PASSWORD in Supabase with the new password

---

## 📍 Exact Values to Use

**Copy these EXACTLY**:

### Variable 1:
```
Name: GMAIL_USER
```
```
Value: jadesupremo0@gmail.com
```

### Variable 2:
```
Name: GMAIL_APP_PASSWORD
```
```
Value: lfnsyegcvqbaywbq
```

**IMPORTANT**:
- Names are case-sensitive: MUST be all caps
- Use underscores, not dashes or spaces
- Values must match exactly
- Password is 16 characters, no spaces

---

## 🎯 Quick Checklist

Before testing, verify:

- [ ] Logged into https://supabase.com/dashboard
- [ ] Selected correct project (LSPU-LBC Job Portal)
- [ ] Found Secrets/Environment Variables section
- [ ] Added `GMAIL_USER` = `jadesupremo0@gmail.com`
- [ ] Added `GMAIL_APP_PASSWORD` = `lfnsyegcvqbaywbq`
- [ ] Clicked "Save" or "Add secret" for both
- [ ] See both variables listed in the UI
- [ ] Waited 30 seconds after saving
- [ ] Tested password reset
- [ ] Checked server logs for success message

---

## 🚀 What Happens After You Set Them

### Before (Now):
```
User requests reset
  ↓
Server checks for GMAIL_USER
  ↓
❌ NOT FOUND!
  ↓
❌ Error: credentials not configured
  ↓
Email not sent
```

### After (When You Set Them):
```
User requests reset
  ↓
Server checks for GMAIL_USER
  ↓
✅ FOUND: jadesupremo0@gmail.com
  ↓
Server checks for GMAIL_APP_PASSWORD
  ↓
✅ FOUND: lfnsyegcvqbaywbq (16 chars)
  ↓
✅ Connects to Gmail SMTP
  ↓
✅ Sends email
  ↓
✅ User receives email with code!
```

---

## 🎉 Expected Result

Once variables are set correctly:

1. ✅ No more "Username and Password not accepted" errors
2. ✅ No more "invalid email address" errors
3. ✅ Server logs show "✅✅✅ SUCCESS! ✅✅✅"
4. ✅ Email arrives in Gmail inbox within 10 seconds
5. ✅ Email has 6-digit code
6. ✅ Code works for password reset

---

## 📞 Still Having Issues?

If you've:
- ✅ Added both variables in Supabase
- ✅ Waited 30 seconds
- ✅ Verified the names and values are exact
- ✅ Still getting errors

**Then**:

1. **Check 2FA**: 
   - https://myaccount.google.com/security
   - Ensure 2-Step Verification is ON

2. **Regenerate app password**:
   - https://myaccount.google.com/apppasswords
   - Delete old password
   - Create new one for "Mail"
   - Copy new 16-char password (remove spaces!)
   - Update GMAIL_APP_PASSWORD in Supabase

3. **Redeploy function**:
   - Supabase Dashboard → Edge Functions → server
   - Click "Redeploy"
   - Wait 1 minute
   - Test again

---

## 🎯 Summary

**Problem**: Environment variables NOT set in Supabase  
**Solution**: Add GMAIL_USER and GMAIL_APP_PASSWORD in Supabase Secrets  
**Location**: Supabase Dashboard → Settings → Secrets  
**Time**: 2 minutes  
**Result**: Gmail emails work!  

---

**👉 STOP READING AND DO THIS NOW! 👈**

Go to Supabase Dashboard and add those two secrets!

The errors will NOT stop until you set the environment variables!
