# 📍 Supabase Secrets - Exact Location Guide

## 🎯 Where to Set Gmail Credentials

This guide shows you **EXACTLY** where to add the environment variables in Supabase.

---

## 🗺️ Navigation Path

### Option 1: Edge Functions Secrets (Recommended)

```
Supabase Dashboard
  ↓
[Your Project: LSPU-LBC Job Portal]
  ↓
Left Sidebar → "Edge Functions"
  ↓
Click "Manage secrets" or "Settings" icon
  ↓
You should see: "Edge Function Secrets"
  ↓
Click "Add new secret"
```

### Option 2: Project Settings

```
Supabase Dashboard
  ↓
[Your Project: LSPU-LBC Job Portal]
  ↓
Left Sidebar → "Settings" (gear icon)
  ↓
Click "Edge Functions" tab
  ↓
Scroll to "Secrets" section
  ↓
Click "Add new secret"
```

### Option 3: Configuration

```
Supabase Dashboard
  ↓
[Your Project: LSPU-LBC Job Portal]
  ↓
Left Sidebar → "Project Settings"
  ↓
Click "Configuration" or "API"
  ↓
Look for "Environment Variables" or "Secrets"
  ↓
Click "Add variable"
```

---

## 📝 What to Enter

### Secret 1:

```
┌─────────────────────────────────────┐
│ Add new secret                      │
├─────────────────────────────────────┤
│                                     │
│ Name:                               │
│ ┌─────────────────────────────────┐│
│ │ GMAIL_USER                      ││
│ └─────────────────────────────────┘│
│                                     │
│ Value:                              │
│ ┌─────────────────────────────────┐│
│ │ jadesupremo0@gmail.com          ││
│ └─────────────────────────────────┘│
│                                     │
│          [Cancel]  [Add secret]     │
└─────────────────────────────────────┘
```

**Click "Add secret"**

### Secret 2:

```
┌─────────────────────────────────────┐
│ Add new secret                      │
├─────────────────────────────────────┤
│                                     │
│ Name:                               │
│ ┌─────────────────────────────────┐│
│ │ GMAIL_APP_PASSWORD              ││
│ └─────────────────────────────────┘│
│                                     │
│ Value:                              │
│ ┌─────────────────────────────────┐│
│ │ lfnsyegcvqbaywbq                ││
│ └─────────────────────────────────┘│
│                                     │
│          [Cancel]  [Add secret]     │
└─────────────────────────────────────┘
```

**Click "Add secret"**

---

## ✅ Verification

After adding both secrets, you should see:

```
┌─────────────────────────────────────────────────────┐
│ Edge Function Secrets                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ GMAIL_USER                                         │
│ Value: jade************com                        │
│ [Edit] [Delete]                                    │
│                                                     │
│ GMAIL_APP_PASSWORD                                 │
│ Value: ****************                            │
│ [Edit] [Delete]                                    │
│                                                     │
│ [+ Add new secret]                                 │
└─────────────────────────────────────────────────────┘
```

---

## 🚨 Important Notes

### 1. Secret Names (Case Sensitive!)

- ✅ `GMAIL_USER` (all caps, underscore)
- ❌ `gmail_user` (wrong)
- ❌ `GmailUser` (wrong)
- ❌ `GMAIL USER` (wrong - has space)

- ✅ `GMAIL_APP_PASSWORD` (all caps, underscores)
- ❌ `gmail_app_password` (wrong)
- ❌ `GMAIL-APP-PASSWORD` (wrong - has dashes)
- ❌ `GmailAppPassword` (wrong)

### 2. Values (Exact Match!)

**GMAIL_USER**:
- ✅ `jadesupremo0@gmail.com`
- ❌ `jadesupremo0@gmail.com ` (extra space at end)
- ❌ ` jadesupremo0@gmail.com` (extra space at start)
- ❌ `jadesupremo0` (missing @gmail.com)

**GMAIL_APP_PASSWORD**:
- ✅ `lfnsyegcvqbaywbq` (16 chars, no spaces)
- ❌ `lfns yegc vqba ywbq` (has spaces)
- ❌ `lfns-yegc-vqba-ywbq` (has dashes)
- ❌ `lfnsyegcvqbaywbq ` (extra space)

### 3. After Adding

- ⏱️ Wait **30 seconds** for deployment
- 🔄 No need to restart anything
- 🧪 Test immediately after waiting

---

## 🔍 Can't Find Secrets Section?

### Try These Locations:

1. **Dashboard Home**
   - Project selector → Your project
   - Look for "Settings" icon or text

2. **Left Sidebar Menu Items**:
   - Edge Functions
   - Settings
   - Project Settings
   - Configuration
   - API
   - Functions

3. **Search Bar**:
   - Type: "secrets"
   - Type: "environment variables"
   - Type: "edge function secrets"

4. **URL Method**:
   - Go to: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/functions`
   - Replace YOUR_PROJECT_ID with your actual project ID

---

## 📸 Visual Indicators

### Look for These UI Elements:

**Page Title**:
- "Edge Function Secrets"
- "Environment Variables"
- "Secrets Management"
- "Function Configuration"

**Buttons**:
- "Add new secret"
- "Add variable"
- "New secret"
- "+ Secret"

**Icons**:
- 🔐 Lock icon
- ⚙️ Settings/gear icon
- 🔑 Key icon

---

## 🎯 Quick URL Paths

If your project ID is `zodduukuwfatmqejxnsf` (example):

### Direct Links:

1. **Edge Functions**:
   ```
   https://supabase.com/dashboard/project/zodduukuwfatmqejxnsf/functions
   ```

2. **Settings**:
   ```
   https://supabase.com/dashboard/project/zodduukuwfatmqejxnsf/settings
   ```

3. **API Settings**:
   ```
   https://supabase.com/dashboard/project/zodduukuwfatmqejxnsf/settings/api
   ```

Replace `zodduukuwfatmqejxnsf` with your actual project ID!

---

## ✅ After Adding Secrets

### Test Immediately:

1. **Open your app**
2. **Click**: Login → Forgot Password
3. **Enter**: admin@lspu.edu.ph
4. **Check**: Server logs

### Expected Logs:

```
=== Email Configuration Check ===
GMAIL_USER exists: true ✅
GMAIL_USER value: jades***
GMAIL_APP_PASSWORD exists: true ✅
GMAIL_APP_PASSWORD length: 16
```

If you see `false`, the secrets weren't added correctly!

---

## 🚨 Troubleshooting

### "I don't see a Secrets section"

**Try**:
1. Refresh the page
2. Look under "Edge Functions" → Settings icon
3. Look under "Project Settings" → "Functions" tab
4. Contact Supabase support (they have a chat widget)

### "I added secrets but they don't work"

**Check**:
1. Names are EXACTLY: `GMAIL_USER` and `GMAIL_APP_PASSWORD`
2. Values have no extra spaces
3. You clicked "Save" or "Add secret"
4. You waited 30 seconds
5. You're testing the right project

### "I see other secrets but not mine"

**Possible causes**:
1. You didn't click "Save"
2. There was an error (check for red error messages)
3. You're in the wrong project
4. You added them as database variables instead of function secrets

---

## 📋 Checklist

Before testing:

- [ ] Found the Secrets/Environment Variables section
- [ ] Added `GMAIL_USER` with value `jadesupremo0@gmail.com`
- [ ] Added `GMAIL_APP_PASSWORD` with value `lfnsyegcvqbaywbq`
- [ ] Clicked "Save" or "Add secret" for both
- [ ] See both secrets listed in the UI
- [ ] Waited 30 seconds
- [ ] Ready to test!

---

## 🎉 Success!

Once both secrets are added and you've waited 30 seconds:

✅ Environment variables are set  
✅ Gmail SMTP will work  
✅ Password reset emails will send  
✅ Users will receive codes in Gmail  

---

**Next**: Test password reset and check your Gmail inbox!
