# 📸 Supabase Secrets - Visual Step-by-Step Guide

## 🎯 Goal

Add two environment variables to Supabase so Gmail SMTP works.

---

## 📍 Step-by-Step Instructions

### STEP 1️⃣: Open Supabase Dashboard

1. **Open your browser**
2. **Go to**: `https://supabase.com/dashboard`
3. **You should see**: List of your projects

**What you see**:
```
┌─────────────────────────────────────┐
│ Supabase Dashboard                  │
├─────────────────────────────────────┤
│                                     │
│ Your projects:                      │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 🟢 LSPU-LBC Job Portal          ││
│ │ Organization: Your Org          ││
│ │ [Open project]                  ││
│ └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Action**: Click on **LSPU-LBC Job Portal** project

---

### STEP 2️⃣: Navigate to Settings

**After clicking your project, you see the project dashboard.**

**Look at the left sidebar**:
```
┌──────────────────┐
│ Home             │
│ Table Editor     │
│ SQL Editor       │
│ Storage          │
│ Functions        │ ← Click this OR
│ ...              │
│ ⚙️ Settings      │ ← Click this
└──────────────────┘
```

**Two options**:

**OPTION A** (Recommended):
1. Click **"Settings"** (gear icon) at the bottom of sidebar
2. You'll see settings tabs at the top

**OPTION B**:
1. Click **"Edge Functions"** in the sidebar
2. Click on the **"server"** function
3. Look for **"Secrets"** or **"Settings"** tab

---

### STEP 3️⃣: Find Secrets Section

**If you clicked Settings** (Option A):

You'll see tabs at the top:
```
┌────────────────────────────────────────┐
│ General | API | Database | Edge        │
│         |     |          | Functions ← │
└────────────────────────────────────────┘
```

**Action**: Click **"Edge Functions"** tab

**Then scroll down to find**:
```
┌─────────────────────────────────────┐
│ Edge Function Secrets               │
├─────────────────────────────────────┤
│                                     │
│ Secrets are environment variables   │
│ available to your edge functions    │
│                                     │
│ [+ Add new secret]  ← Click this   │
└─────────────────────────────────────┘
```

---

**If you clicked Edge Functions** (Option B):

You'll see:
```
┌─────────────────────────────────────┐
│ Edge Functions                      │
├─────────────────────────────────────┤
│                                     │
│ server                              │
│ [View] [Invoke] [Settings]         │
│                        ↑            │
│                        └── Click    │
│                                     │
└─────────────────────────────────────┘
```

**Action**: Click **Settings** or **Manage secrets**

---

### STEP 4️⃣: Add First Secret (GMAIL_USER)

**Click**: **[+ Add new secret]** button

**You'll see a modal/form**:
```
┌─────────────────────────────────────┐
│ Add new secret                      │
├─────────────────────────────────────┤
│                                     │
│ Secret name *                       │
│ ┌─────────────────────────────────┐│
│ │ [Type here]                     ││
│ └─────────────────────────────────┘│
│                                     │
│ Secret value *                      │
│ ┌─────────────────────────────────┐│
│ │ [Type here]                     ││
│ └─────────────────────────────────┘│
│                                     │
│ Description (optional)              │
│ ┌─────────────────────────────────┐│
│ │                                 ││
│ └─────────────────────────────────┘│
│                                     │
│     [Cancel]  [Add secret]          │
└─────────────────────────────────────┘
```

**Fill in**:

1. **Secret name**: Type exactly: `GMAIL_USER`
   ```
   ┌─────────────────────────────────┐
   │ GMAIL_USER                      │
   └─────────────────────────────────┘
   ```

2. **Secret value**: Type exactly: `jadesupremo0@gmail.com`
   ```
   ┌─────────────────────────────────┐
   │ jadesupremo0@gmail.com          │
   └─────────────────────────────────┘
   ```

3. **Description** (optional): `Gmail account for sending emails`

**Action**: Click **[Add secret]** button

---

### STEP 5️⃣: Add Second Secret (GMAIL_APP_PASSWORD)

**Click**: **[+ Add new secret]** button again

**The same modal appears**:

**Fill in**:

1. **Secret name**: Type exactly: `GMAIL_APP_PASSWORD`
   ```
   ┌─────────────────────────────────┐
   │ GMAIL_APP_PASSWORD              │
   └─────────────────────────────────┘
   ```

2. **Secret value**: Type exactly: `lfnsyegcvqbaywbq`
   ```
   ┌─────────────────────────────────┐
   │ lfnsyegcvqbaywbq                │
   └─────────────────────────────────┘
   ```

   ⚠️ **IMPORTANT**: 
   - 16 characters
   - All lowercase
   - NO SPACES!
   - Copy it: `lfnsyegcvqbaywbq`

3. **Description** (optional): `Gmail app password (16 chars, no spaces)`

**Action**: Click **[Add secret]** button

---

### STEP 6️⃣: Verify Both Secrets Are Listed

**After adding both, you should see**:

```
┌─────────────────────────────────────────────┐
│ Edge Function Secrets                       │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ GMAIL_USER                              ││
│ │ Value: jade************com             ││
│ │ [Edit] [Delete]                         ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ GMAIL_APP_PASSWORD                      ││
│ │ Value: ****************                 ││
│ │ [Edit] [Delete]                         ││
│ └─────────────────────────────────────────┘│
│                                             │
│ [+ Add new secret]                          │
└─────────────────────────────────────────────┘
```

**Check**:
- ✅ You see **GMAIL_USER** listed
- ✅ Value shows: `jade************com` (masked for security)
- ✅ You see **GMAIL_APP_PASSWORD** listed
- ✅ Value shows: `****************` (masked)

---

### STEP 7️⃣: Wait for Deployment

**Important**: After adding secrets, Supabase needs time to deploy them.

**Action**: 
```
⏱️ WAIT 30 SECONDS ⏱️
```

**What's happening**:
```
Supabase is:
1. Saving your secrets
2. Redeploying the Edge Function
3. Making secrets available to the function
4. This takes ~30 seconds
```

**Do NOT test immediately!** Wait the full 30 seconds.

---

### STEP 8️⃣: Test Password Reset

**After waiting 30 seconds**:

1. **Go to your app**: Login page
2. **Click**: "Forgot Password?"
3. **Enter**: `admin@lspu.edu.ph` (or any user email)
4. **Click**: "Send Verification Code"
5. **Watch**: 
   - Toast notification
   - Server logs (Supabase → Functions → server → Logs)

---

### STEP 9️⃣: Check Server Logs

**Go to**: Supabase Dashboard → Edge Functions → server → Logs

**Look for**:

**✅ SUCCESS - You should see**:
```
╔════════════════════════════════════════╗
║   ATTEMPTING TO SEND EMAIL             ║
╚════════════════════════════════════════╝

=== ENVIRONMENT VARIABLES CHECK ===
GMAIL_USER exists: true
GMAIL_USER value: jadesupremo0@gmail.com
GMAIL_APP_PASSWORD exists: true
GMAIL_APP_PASSWORD length: 16

=== CREDENTIALS VALIDATION ===
✅ GMAIL_USER is valid email
✅ Cleaned username: jadesupremo0@gmail.com
✅ Cleaned password length: 16

=== SMTP CONNECTION ===
Connecting to: smtp.gmail.com:465

=== SENDING EMAIL ===
From Email: jadesupremo0@gmail.com
To: admin@lspu.edu.ph

✅✅✅ SUCCESS! ✅✅✅
Email sent successfully to admin@lspu.edu.ph
```

**❌ FAILURE - If you see**:
```
=== ENVIRONMENT VARIABLES CHECK ===
GMAIL_USER exists: false
GMAIL_USER value: ❌ NOT SET - GO TO SUPABASE DASHBOARD!

❌❌❌ CRITICAL ERROR ❌❌❌
GMAIL_USER: ❌ MISSING - ADD IT NOW!
```

→ **Go back to Step 4 and add the secrets again!**

---

### STEP 🔟: Check Gmail Inbox

**If server logs show success**:

1. **Open Gmail**: https://gmail.com
2. **Sign in as**: Recipient email
3. **Look for**: Email from `jadesupremo0@gmail.com`
4. **Subject**: "LSPU-LBC Job Portal - Password Reset Code"
5. **Contains**: 6-digit code

**Expected email**:
```
┌─────────────────────────────────────┐
│ From: jadesupremo0@gmail.com        │
│ Subject: LSPU-LBC... Password Reset │
├─────────────────────────────────────┤
│                                     │
│ Hello,                              │
│                                     │
│ Your password reset code is:        │
│                                     │
│     847291                          │
│                                     │
│ This code expires in 15 minutes.    │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Success Checklist

After completing all steps:

- [ ] Opened Supabase Dashboard
- [ ] Navigated to Settings → Edge Functions → Secrets
- [ ] Added `GMAIL_USER` = `jadesupremo0@gmail.com`
- [ ] Added `GMAIL_APP_PASSWORD` = `lfnsyegcvqbaywbq`
- [ ] Saw both secrets listed in UI
- [ ] Waited 30 seconds
- [ ] Tested password reset
- [ ] Server logs show `GMAIL_USER exists: true`
- [ ] Server logs show `✅✅✅ SUCCESS! ✅✅✅`
- [ ] Email received in Gmail inbox
- [ ] Email contains 6-digit code
- [ ] Code works for password reset

If all checked: **🎉 YOU'RE DONE! 🎉**

---

## 🚨 Troubleshooting

### Can't Find "Secrets" Section?

**Try these locations**:

1. **Settings → Edge Functions tab**
   ```
   Dashboard → ⚙️ Settings → Edge Functions → Secrets
   ```

2. **Functions → Server → Settings**
   ```
   Dashboard → Edge Functions → server → Settings
   ```

3. **Project Settings → API**
   ```
   Dashboard → Project Settings → API → Secrets
   ```

4. **Search for it**
   ```
   Press '/' → Type "secrets" → Look for results
   ```

### Added Secrets But Still Not Working?

**Check these**:

1. **Names are EXACT**:
   - ✅ `GMAIL_USER` (all caps, underscore)
   - ❌ `gmail_user` (wrong)
   - ❌ `GmailUser` (wrong)

2. **Values are EXACT**:
   - ✅ `jadesupremo0@gmail.com`
   - ✅ `lfnsyegcvqbaywbq`

3. **You clicked "Save" or "Add secret"**

4. **You waited 30 seconds**

5. **You're in the right project**

### Still Getting "Username and Password not accepted"?

**After confirming secrets are set**:

1. **Check 2FA on Gmail**:
   - Go to: https://myaccount.google.com/security
   - Verify: 2-Step Verification is ON

2. **Regenerate app password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in: jadesupremo0@gmail.com
   - Delete: Old app password
   - Create: New app password for "Mail"
   - Copy: New 16-character password
   - Update: GMAIL_APP_PASSWORD in Supabase

---

## 🎯 Quick Reference

### What to Add:

```
Secret 1:
  Name: GMAIL_USER
  Value: jadesupremo0@gmail.com

Secret 2:
  Name: GMAIL_APP_PASSWORD
  Value: lfnsyegcvqbaywbq
```

### Where to Add:

```
Supabase Dashboard
  → Settings
  → Edge Functions tab
  → Secrets section
  → [+ Add new secret]
```

### How Long:

```
Adding secrets: 2 minutes
Deployment: 30 seconds
Testing: 1 minute
Total: 3-4 minutes
```

---

## 🎉 What Success Looks Like

### In Supabase UI:
- ✅ Both secrets visible in list
- ✅ Values are masked for security

### In Server Logs:
- ✅ "GMAIL_USER exists: true"
- ✅ "✅✅✅ SUCCESS! ✅✅✅"

### In Gmail:
- ✅ Email arrives within 10 seconds
- ✅ Professional LSPU-LBC formatting
- ✅ 6-digit code visible

### In App:
- ✅ Toast shows "Code sent!"
- ✅ User can enter code
- ✅ Password reset works

---

**👉 Start with STEP 1 NOW! 👈**

Follow each step carefully and you'll have Gmail working in 3 minutes!
