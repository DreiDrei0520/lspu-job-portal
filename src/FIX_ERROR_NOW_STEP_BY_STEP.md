# 🚨 FIX THE ERROR NOW - Step by Step

## ❌ Current Error:
```
GMAIL_USER is not a valid email: 1234
```

## ✅ The Fix (2 Minutes):

You need to **EDIT** the existing secrets in Supabase. Here's exactly how:

---

## 📋 Step 1: Copy These Values

**Open a text editor and copy these:**

```
jadesupremo@gmail.com
```

```
lfnsyegcvqbaywbq
```

---

## 🌐 Step 2: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Click on your **LSPU-LBC** project
3. Wait for it to load

---

## ⚙️ Step 3: Navigate to Secrets

1. On the left sidebar, click: **Settings** (gear icon at bottom)
2. In the Settings menu, find and click: **Edge Functions**
3. Look for the **Secrets** section (usually near the bottom)

You should see:
```
GMAIL_USER              1234
GMAIL_APP_PASSWORD      1234
```

---

## 📝 Step 4: Edit GMAIL_USER

1. Find the row that says: **GMAIL_USER** with value **1234**
2. Click the **[Edit]** or **[...]** button on that row
3. You'll see a text box with "1234"
4. **DELETE** "1234"
5. **PASTE**: `jadesupremo@gmail.com`
6. Click **[Update]** or **[Save]**

**After editing, it should show:**
```
GMAIL_USER              jadesupremo@gmail.com ✅
```

---

## 🔐 Step 5: Edit GMAIL_APP_PASSWORD

1. Find the row that says: **GMAIL_APP_PASSWORD** with value **1234**
2. Click the **[Edit]** or **[...]** button on that row
3. You'll see a text box with "1234"
4. **DELETE** "1234"
5. **PASTE**: `lfnsyegcvqbaywbq`
6. Click **[Update]** or **[Save]**

**After editing, it should show:**
```
GMAIL_APP_PASSWORD      •••••••••••••••• ✅
```
(The password will be hidden with dots, that's normal!)

---

## ⏱️ Step 6: Wait

**Wait 30-60 seconds** for the changes to take effect.

Supabase needs time to update the Edge Function environment.

---

## 🧪 Step 7: Test

1. Go back to your LSPU-LBC app
2. Click **"Forgot Password?"**
3. Enter a test email (e.g., `jadesupremo@gmail.com`)
4. Click **"Send Reset Link"**
5. **Check your Gmail inbox**

---

## ✅ Success Indicators

### You'll know it worked when:

1. **No more error about "1234"**
2. **Success message**: "Password reset email sent!"
3. **Email arrives** in Gmail inbox from `jadesupremo@gmail.com`
4. **Server logs show**:
   ```
   ✅ GMAIL_USER is valid email
   ✅ Cleaned username: jadesupremo@gmail.com
   ✅ Cleaned password length: 16
   ✅✅✅ SUCCESS! ✅✅✅
   Email sent successfully!
   ```

---

## 🎯 Quick Visual Guide

```
Current State (WRONG):
┌─────────────────────────────────┐
│ GMAIL_USER          1234    ❌ │
│ GMAIL_APP_PASSWORD  1234    ❌ │
└─────────────────────────────────┘

After Fix (RIGHT):
┌──────────────────────────────────────────────┐
│ GMAIL_USER          jadesupremo@gmail.com ✅│
│ GMAIL_APP_PASSWORD  ••••••••••••••••      ✅│
└──────────────────────────────────────────────┘
```

---

## 🚨 Important Notes

- ✅ Use `jadesupremo@gmail.com` (NO "0" at the end!)
- ✅ Password is `lfnsyegcvqbaywbq` (16 characters, no spaces)
- ✅ Copy/paste exactly - no typos!
- ✅ NO quotes around the values
- ✅ NO spaces before or after
- ✅ Click Update/Save on BOTH secrets
- ✅ Wait 30-60 seconds before testing

---

## 📍 Can't Find Secrets?

### Try these locations:

**Option A:**
```
Dashboard → Settings → Edge Functions → Secrets
```

**Option B:**
```
Dashboard → Project Settings → Edge Functions → Environment Variables
```

**Option C:**
```
Dashboard → Edge Functions → Settings → Secrets
```

Look for the section where you can **edit** environment variables/secrets.

---

## 🆘 Still Stuck?

If you can't find where to edit secrets:

1. Look for **"Settings"** (gear icon)
2. Look for **"Edge Functions"**
3. Look for **"Secrets"** or **"Environment Variables"**
4. You should see GMAIL_USER and GMAIL_APP_PASSWORD listed
5. Each should have an **Edit** or **...** button

---

## 📋 Checklist

- [ ] Copy `jadesupremo@gmail.com`
- [ ] Copy `lfnsyegcvqbaywbq`
- [ ] Open Supabase Dashboard
- [ ] Go to Settings → Edge Functions → Secrets
- [ ] Edit GMAIL_USER → Paste email → Save
- [ ] Edit GMAIL_APP_PASSWORD → Paste password → Save
- [ ] Wait 60 seconds
- [ ] Test password reset
- [ ] Verify email arrives in Gmail

---

## 🎯 THE FIX IN ONE SENTENCE:

**Go to Supabase → Settings → Edge Functions → Secrets, then edit GMAIL_USER to `jadesupremo@gmail.com` and GMAIL_APP_PASSWORD to `lfnsyegcvqbaywbq`**

---

**DO THIS NOW! It takes 2 minutes!** 🚀
