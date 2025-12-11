# 🔧 Fix Gmail Authentication Error

## ❌ Current Error

```
Error: 535: 5.7.8 Username and Password not accepted
Error: The specified from address is not a valid email address
```

## ✅ What I Just Fixed

1. **Fixed email format issue** - Changed `from: gmailUser` to proper object format:
   ```typescript
   from: {
     name: 'LSPU-LBC Job Portal',
     mail: cleanUsername,
   }
   ```

2. **Added credential cleaning** - Removes spaces from app password:
   ```typescript
   const cleanPassword = gmailAppPassword.trim().replace(/\s/g, '')
   ```

3. **Added detailed logging** - Shows what's configured:
   ```typescript
   console.log('GMAIL_USER exists:', !!gmailUser)
   console.log('GMAIL_APP_PASSWORD length:', gmailAppPassword?.length)
   ```

---

## ⚡ ACTION REQUIRED: Set Environment Variables

The error means your Gmail credentials are **NOT** configured in Supabase yet!

### Step 1: Go to Supabase Dashboard

1. **Open**: https://supabase.com/dashboard
2. **Select**: Your LSPU-LBC Job Portal project
3. **Navigate to**: 
   - **Settings** → **Edge Functions** → **Secrets**
   - OR **Settings** → **Configuration** → **Environment Variables**

### Step 2: Add These Two Variables

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

⚠️ **CRITICAL NOTES**:
- Password must be: `lfnsyegcvqbaywbq` (16 characters)
- **NO SPACES** in the password!
- If you copy-pasted with spaces like `lfns yegc vqba ywbq`, it won't work
- The code now automatically removes spaces, but it's better to set it correctly

### Step 3: Save and Wait

1. Click **"Save"** or **"Add Secret"**
2. Wait **30 seconds** for deployment
3. The Edge Function will automatically pick up the new variables

---

## 🔍 Verify Credentials Are Set

### Check Server Logs

After setting the variables, test password reset and check logs:

**Expected to see**:
```
=== Email Configuration Check ===
GMAIL_USER exists: true
GMAIL_USER value: jades***
GMAIL_APP_PASSWORD exists: true
GMAIL_APP_PASSWORD length: 16
Cleaned password length: 16
Attempting Gmail SMTP connection...
Sending email...
From: jadesupremo0@gmail.com
To: user@example.com
Subject: LSPU-LBC Job Portal - Password Reset Code
✅ Email sent successfully to user@example.com
```

**If you see this instead**:
```
GMAIL_USER exists: false
GMAIL_APP_PASSWORD exists: false
Gmail credentials not configured. Email sending disabled.
GMAIL_USER: MISSING
GMAIL_APP_PASSWORD: MISSING
```
→ **Environment variables are NOT set!** Go back to Step 1.

---

## 🧪 Test It

### Test Password Reset:

1. **Go to**: Your Job Portal → Login
2. **Click**: "Forgot Password?"
3. **Enter**: Any existing user email (e.g., admin@lspu.edu.ph)
4. **Click**: "Send Verification Code"
5. **Check**: 
   - Toast notification (should say success)
   - Server logs (check for errors)
   - Gmail inbox (should receive email within 10 seconds)

### Expected Result:

✅ **Toast**: "✅ Verification code sent to your email!"  
✅ **Server Log**: "✅ Email sent successfully"  
✅ **Gmail Inbox**: Email from jadesupremo0@gmail.com  
✅ **Email Contains**: 6-digit code  

---

## 🚨 Common Issues & Solutions

### Issue 1: "Username and Password not accepted"

**Causes**:
- ❌ GMAIL_USER not set correctly
- ❌ GMAIL_APP_PASSWORD not set correctly
- ❌ App password has spaces
- ❌ Wrong credentials

**Solutions**:
1. ✅ Verify GMAIL_USER = `jadesupremo0@gmail.com`
2. ✅ Verify GMAIL_APP_PASSWORD = `lfnsyegcvqbaywbq` (no spaces!)
3. ✅ Check for typos
4. ✅ Ensure both variables are saved in Supabase
5. ✅ Wait 30 seconds after saving
6. ✅ Check server logs to confirm variables exist

### Issue 2: "from address is not a valid email address"

**Cause**: Email format was wrong (now fixed!)

**Solution**: 
✅ Already fixed in the code update above!

### Issue 3: "Gmail credentials not configured"

**Cause**: Environment variables not set

**Solution**:
1. Go to Supabase Dashboard
2. Settings → Secrets
3. Add both GMAIL_USER and GMAIL_APP_PASSWORD
4. Save and wait 30 seconds

### Issue 4: Still getting errors after setting variables

**Try these**:

1. **Redeploy the function**:
   - Go to Supabase Dashboard
   - Functions → server
   - Click "Redeploy"
   - Wait 1 minute

2. **Verify the app password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in as: jadesupremo0@gmail.com
   - Check if `lfnsyegcvqbaywbq` is the correct app password
   - If not, generate a new one and update GMAIL_APP_PASSWORD

3. **Check 2FA is enabled**:
   - App passwords only work if 2-Step Verification is enabled
   - Go to: https://myaccount.google.com/security
   - Ensure 2-Step Verification is ON

4. **Try regenerating app password**:
   - Delete old app password
   - Create new app password for "Mail"
   - Copy the new 16-character password (without spaces!)
   - Update GMAIL_APP_PASSWORD in Supabase

---

## 🔐 Security Notes

### App Password vs Regular Password

⚠️ **DO NOT** use your regular Gmail password!

- ❌ **Regular password**: Your normal login password
- ✅ **App password**: Special 16-character password for apps

### How to Get App Password

1. **Enable 2FA first**:
   - Go to: https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Generate app password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in as: jadesupremo0@gmail.com
   - App name: "LSPU Job Portal" or "Mail"
   - Google generates: 16-character password
   - Copy it: `lfnsyegcvqbaywbq`
   - Use this in GMAIL_APP_PASSWORD

---

## 📊 Environment Variables Checklist

Before testing, verify:

- [ ] **GMAIL_USER** is set in Supabase Secrets
- [ ] Value is exactly: `jadesupremo0@gmail.com`
- [ ] **GMAIL_APP_PASSWORD** is set in Supabase Secrets
- [ ] Value is exactly: `lfnsyegcvqbaywbq`
- [ ] Password has **NO SPACES** (or spaces are okay now, code removes them)
- [ ] Both variables are **saved**
- [ ] Waited **30 seconds** after saving
- [ ] **2FA is enabled** on jadesupremo0@gmail.com
- [ ] App password is **valid** and not revoked

---

## 🎯 Quick Verification Steps

### 1. Check if Variables Exist

**Server logs should show**:
```
GMAIL_USER exists: true
GMAIL_APP_PASSWORD exists: true
```

If you see `false`, the variables are NOT set!

### 2. Check Password Length

**Server logs should show**:
```
GMAIL_APP_PASSWORD length: 16
Cleaned password length: 16
```

If you see a different number, the password is wrong!

### 3. Test Connection

**Server logs should show**:
```
Attempting Gmail SMTP connection...
Sending email...
✅ Email sent successfully
```

If you see errors here, check credentials!

---

## 🎉 Expected Behavior (When Working)

### User Flow:
1. User clicks "Forgot Password?"
2. Enters email: admin@lspu.edu.ph
3. Clicks "Send Verification Code"
4. Sees toast: "✅ Verification code sent to your email!"
5. Checks Gmail inbox
6. Receives email from: jadesupremo0@gmail.com
7. Email contains: 6-digit code
8. Enters code
9. Resets password
10. Success!

### Server Logs:
```
=== Password Reset Code Request ===
Request body: { email: 'admin@lspu.edu.ph' }
Password reset requested for: admin@lspu.edu.ph
Generated reset code: 847291 for email: admin@lspu.edu.ph
Reset code stored successfully in KV

=== Email Configuration Check ===
GMAIL_USER exists: true
GMAIL_USER value: jades***
GMAIL_APP_PASSWORD exists: true
GMAIL_APP_PASSWORD length: 16
Cleaned password length: 16
Attempting Gmail SMTP connection...
Sending email...
From: jadesupremo0@gmail.com
To: admin@lspu.edu.ph
Subject: LSPU-LBC Job Portal - Password Reset Code
✅ Email sent successfully to admin@lspu.edu.ph

═══════════════════════════════════════════
PASSWORD RESET CODE
═══════════════════════════════════════════
Email: admin@lspu.edu.ph
Code: 847291
Email Sent: YES ✅
Expires: [15 minutes from now]
═══════════════════════════════════════════
```

---

## 🔄 What Changed in Code

### Before:
```typescript
await client.send({
  from: gmailUser,  // ❌ Invalid format
  to: to,
  subject: subject,
  content: htmlBody,
  html: htmlBody,
})
```

### After:
```typescript
const cleanPassword = gmailAppPassword.trim().replace(/\s/g, '')

await client.send({
  from: {
    name: 'LSPU-LBC Job Portal',  // ✅ Proper format
    mail: cleanUsername,
  },
  to: to,
  subject: subject,
  content: 'auto',  // ✅ Auto-detect
  html: htmlBody,
})
```

---

## ✅ Summary

### What I Fixed:
1. ✅ Email `from` format (was invalid, now correct)
2. ✅ Added credential cleaning (removes spaces)
3. ✅ Added detailed logging (easier debugging)
4. ✅ Better error messages

### What You Need to Do:
1. ⚡ Set GMAIL_USER in Supabase Secrets
2. ⚡ Set GMAIL_APP_PASSWORD in Supabase Secrets
3. ⚡ Wait 30 seconds
4. ⚡ Test password reset
5. ⚡ Check Gmail inbox

### Time Required:
- **Setup**: 2 minutes
- **Testing**: 1 minute
- **Total**: 3 minutes

---

**Next Step**: 👉 **Set environment variables NOW!** 👈

Then test and you should receive emails in Gmail!
