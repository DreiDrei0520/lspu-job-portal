# ✅ Verify Gmail Setup - jadesupremo0@gmail.com

## 🔑 Your Credentials

### Gmail Address:
```
jadesupremo0@gmail.com
```

### App Password (with spaces):
```
lfns yegc vqba ywbq
```

### ⚠️ App Password (WITHOUT spaces - USE THIS):
```
lfnsyegcvqbaywbq
```

**IMPORTANT**: The app password must be entered **without spaces**!

---

## 🔧 Environment Variables Required

Make sure these are set in your Supabase environment:

1. **GMAIL_USER**:
   ```
   jadesupremo0@gmail.com
   ```

2. **GMAIL_APP_PASSWORD**:
   ```
   lfnsyegcvqbaywbq
   ```
   ⚠️ **No spaces!** Just the 16 characters together.

---

## 🧪 Quick Test

### Step 1: Go to Password Reset
1. Open your Job Portal
2. Click **"Login"**
3. Click **"Forgot Password?"**

### Step 2: Request Reset Code
1. Enter any email that exists in your system
2. Click **"Send Verification Code"**
3. Wait 5-10 seconds

### Step 3: Check Email
1. Open Gmail inbox for the user's email
2. Look for email from: **jadesupremo0@gmail.com**
3. Subject: **"LSPU-LBC Job Portal - Password Reset Code"**
4. You should see a 6-digit code

### Step 4: Verify Code Works
1. Enter the 6-digit code from the email
2. Set a new password
3. Login with the new password

---

## 📊 Expected Results

### ✅ Success - Email Configured:
```
Toast Message:
✅ Verification code sent to your email!
Please check your inbox and spam folder
```

### ❌ If Email Not Configured:
```
Toast Message:
⚠️ Email not configured. Your code is: 123456
Enter this code in the next step
```

If you see the second message, the Gmail credentials are not properly set.

---

## 🔍 Check Server Logs

After requesting a password reset, check the Supabase Functions logs:

### ✅ If Working:
```
Password reset requested for: user@example.com
Generated reset code: 123456 for email: user@example.com
Reset code stored successfully in KV
Email sent successfully to user@example.com
✅ Password reset email sent successfully to: user@example.com

═══════════════════════════════════════════
PASSWORD RESET CODE
═══════════════════════════════════════════
Email: user@example.com
Code: 123456
Email Sent: YES ✅
Expires: Nov 5, 2025, 3:45 PM
═══════════════════════════════════════════
```

### ❌ If Not Working:
```
Gmail credentials not configured. Email sending disabled.
Email Sent: NO ❌
```

---

## 🚨 Troubleshooting

### Issue: "Gmail credentials not configured"

**Solution**: Verify both environment variables are set:
- Go to Supabase Dashboard
- Navigate to: Settings → Secrets
- Verify both `GMAIL_USER` and `GMAIL_APP_PASSWORD` exist
- Make sure `GMAIL_APP_PASSWORD` has NO SPACES

### Issue: "Authentication failed"

**Solution**: 
1. Make sure app password has no spaces: `lfnsyegcvqbaywbq`
2. Verify 2FA is enabled on jadesupremo0@gmail.com
3. Try regenerating the app password at: https://myaccount.google.com/apppasswords

### Issue: "Email not received"

**Solution**:
1. Check spam/junk folder
2. Wait up to 30 seconds (Gmail can be slow)
3. Verify the recipient email exists in your system
4. Check server logs for errors

### Issue: Email from wrong address

**Solution**:
- Emails will be sent FROM: jadesupremo0@gmail.com
- Make sure this is the email you want to use
- Users will see this as the sender

---

## 🔐 Security Checklist

- [ ] App password entered WITHOUT spaces
- [ ] 2FA enabled on jadesupremo0@gmail.com
- [ ] App password stored in environment variables (not in code)
- [ ] Gmail account secured with strong password
- [ ] Regular monitoring of sent emails

---

## 📧 Test Email Preview

When working, users will receive:

```
From: jadesupremo0@gmail.com
To: [user's email]
Subject: LSPU-LBC Job Portal - Password Reset Code

┌─────────────────────────────────────────┐
│  🔐 Password Reset Request              │
│  LSPU-LBC Online Job Portal             │
├─────────────────────────────────────────┤
│  Your verification code:                │
│                                         │
│  ┌─────────────────┐                   │
│  │   1 2 3 4 5 6   │                   │
│  └─────────────────┘                   │
│                                         │
│  ⏰ Expires in 15 minutes               │
└─────────────────────────────────────────┘
```

---

## ✅ Final Verification Steps

1. **Verify credentials are set**:
   - GMAIL_USER = `jadesupremo0@gmail.com`
   - GMAIL_APP_PASSWORD = `lfnsyegcvqbaywbq` (no spaces!)

2. **Test password reset**:
   - Request code for a test user
   - Check email arrives
   - Verify code works

3. **Check server logs**:
   - Look for "Email Sent: YES ✅"
   - No error messages

4. **Test with different users**:
   - Try 2-3 different email addresses
   - Verify all receive emails

---

## 🎯 Quick Commands

### Check if credentials are set (in Supabase Dashboard):
```
Settings → Secrets → Look for:
- GMAIL_USER
- GMAIL_APP_PASSWORD
```

### Test from browser console:
```javascript
// This will trigger the password reset
// Check the network tab and server logs
```

---

## 📞 Need Help?

If emails still aren't sending after:
1. ✅ Verifying credentials are set correctly
2. ✅ Removing spaces from app password
3. ✅ Checking 2FA is enabled
4. ✅ Reviewing server logs

Then check:
- Is the Gmail account active?
- Are there any Gmail sending limits reached?
- Is the app password still valid? (check https://myaccount.google.com/apppasswords)

---

**Status**: Ready to test!  
**Gmail**: jadesupremo0@gmail.com  
**App Password**: lfnsyegcvqbaywbq (16 chars, no spaces)
