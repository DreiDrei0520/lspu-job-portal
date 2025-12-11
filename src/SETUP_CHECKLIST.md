# ✅ Gmail Setup Checklist - jadesupremo0@gmail.com

## 📋 Pre-Setup

- [x] Gmail account exists: `jadesupremo0@gmail.com`
- [x] App password generated: `lfnsyegcvqbaywbq`
- [ ] 2FA enabled on Gmail account (verify at: https://myaccount.google.com/security)
- [ ] App password still valid (check at: https://myaccount.google.com/apppasswords)

---

## 🔧 Configuration Steps

### Step 1: Set Environment Variables

- [ ] Go to Supabase Dashboard
- [ ] Navigate to: Settings → Secrets (or Environment Variables)
- [ ] Add/Update: `GMAIL_USER`
  ```
  Value: jadesupremo0@gmail.com
  ```
- [ ] Add/Update: `GMAIL_APP_PASSWORD`
  ```
  Value: lfnsyegcvqbaywbq
  ```
  ⚠️ **CRITICAL**: NO SPACES in the password!
  - ❌ Wrong: `lfns yegc vqba ywbq`
  - ✅ Right: `lfnsyegcvqbaywbq`

- [ ] Save changes
- [ ] Redeploy server function (if needed)

### Step 2: Wait for Deployment

- [ ] Wait 30-60 seconds for changes to take effect
- [ ] Verify no errors in deployment logs

---

## 🧪 Testing Steps

### Test 1: Basic Password Reset

- [ ] Open Job Portal
- [ ] Go to: Login → Forgot Password
- [ ] Enter a test email (existing user)
- [ ] Click "Send Verification Code"
- [ ] **Expected**: Toast shows "✅ Verification code sent to your email!"
- [ ] **Check**: Email arrives in inbox within 10 seconds
- [ ] **Verify**: Email is from `jadesupremo0@gmail.com`
- [ ] **Verify**: Email has subject "LSPU-LBC Job Portal - Password Reset Code"
- [ ] **Verify**: Email contains 6-digit code

### Test 2: Code Verification

- [ ] Enter the code from email
- [ ] **Expected**: Code is accepted
- [ ] Set a new password
- [ ] **Expected**: Success message shown
- [ ] Log out and log in with new password
- [ ] **Expected**: Login successful

### Test 3: Server Logs

- [ ] Go to: Supabase Dashboard → Functions → server → Logs
- [ ] Request another password reset
- [ ] **Check logs for**:
  ```
  Email sent successfully to [email]
  ✅ Password reset email sent successfully
  Email Sent: YES ✅
  ```
- [ ] **No errors** in logs related to email sending

---

## 🔍 Verification Checklist

### Email Content Verification

Open the received email and verify:

- [ ] **From**: jadesupremo0@gmail.com
- [ ] **Subject**: LSPU-LBC Job Portal - Password Reset Code
- [ ] **Header**: Shows 🔐 and "Password Reset Request"
- [ ] **Branding**: LSPU-LBC mentioned
- [ ] **Code**: 6-digit code clearly visible
- [ ] **Design**: Surfie Green/teal colors (#0d5468, #116d8a)
- [ ] **Warning**: "Expires in 15 minutes" shown
- [ ] **Security tips**: Listed in email
- [ ] **Footer**: LSPU-LBC Los Baños Campus mentioned

### Functionality Verification

- [ ] Email arrives within 10 seconds
- [ ] Code is exactly 6 digits
- [ ] Code works when entered
- [ ] Code expires after 15 minutes (test if needed)
- [ ] Old codes don't work after reset
- [ ] Can request new code if needed
- [ ] Multiple users can request codes simultaneously

---

## 📊 Server Log Checks

### ✅ Success Indicators:

Look for these in server logs:

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
Email Sent: YES ✅      ← THIS IS KEY!
Expires: [timestamp]
═══════════════════════════════════════════
```

### ❌ Failure Indicators:

If you see these, email is NOT working:

```
Gmail credentials not configured. Email sending disabled.
```

Or:

```
Email sending error: [error message]
Email Sent: NO ❌
```

---

## 🚨 Troubleshooting Checklist

### If "Email Sent: NO ❌"

- [ ] Verify `GMAIL_USER` = `jadesupremo0@gmail.com`
- [ ] Verify `GMAIL_APP_PASSWORD` = `lfnsyegcvqbaywbq` (no spaces!)
- [ ] Check 2FA is enabled on Gmail
- [ ] Verify app password is still active at: https://myaccount.google.com/apppasswords
- [ ] Try regenerating app password
- [ ] Redeploy server function after changes
- [ ] Clear browser cache and test again

### If "Authentication failed"

- [ ] App password must have NO SPACES
- [ ] Should be exactly 16 characters
- [ ] Check for typos in password
- [ ] Regenerate app password if needed
- [ ] Update environment variable with new password
- [ ] Redeploy and test again

### If "No email received"

- [ ] Check spam/junk folder FIRST
- [ ] Wait up to 30 seconds
- [ ] Check server logs - does it say "Email Sent: YES ✅"?
- [ ] If YES but no email: Gmail delivery issue, check spam settings
- [ ] If NO: Fix authentication first (see above)
- [ ] Verify recipient email is correct
- [ ] Try with different recipient email

### If "Wrong sender email"

- [ ] Verify `GMAIL_USER` is set to: `jadesupremo0@gmail.com`
- [ ] Redeploy server function
- [ ] Test again

---

## 🔐 Security Verification

- [ ] App password stored in environment variables ONLY
- [ ] App password NOT in code files
- [ ] App password NOT in git repository
- [ ] 2FA enabled on jadesupremo0@gmail.com
- [ ] Gmail account has strong password
- [ ] Only authorized people have access to credentials
- [ ] Credentials documented in secure location
- [ ] `/GMAIL_CREDENTIALS.txt` will be deleted after setup

---

## 📈 Post-Setup Monitoring

### First Week:

- [ ] Monitor all password reset requests
- [ ] Check server logs daily
- [ ] Verify email delivery rate
- [ ] Watch for spam reports
- [ ] Track any user complaints about emails

### Ongoing:

- [ ] Weekly check of Gmail sending limits
- [ ] Monthly review of app password validity
- [ ] Monitor spam folder placement
- [ ] Track email delivery success rate
- [ ] Update credentials if compromised

---

## ✅ Final Sign-Off

After completing all checks above:

- [ ] All environment variables set correctly
- [ ] Test email received successfully
- [ ] Server logs show "Email Sent: YES ✅"
- [ ] Code verification works
- [ ] Password reset completes successfully
- [ ] User can login with new password
- [ ] Email design looks professional
- [ ] No errors in any test
- [ ] Security checklist completed
- [ ] Documentation reviewed
- [ ] Ready for production use!

---

## 📞 Support Resources

If you need help:

1. **Quick Test**: `/TEST_EMAIL_NOW.md`
2. **Verify Setup**: `/VERIFY_GMAIL_SETUP.md`
3. **Credentials**: `/GMAIL_CREDENTIALS.txt`
4. **Full Guide**: `/GMAIL_SETUP_INSTRUCTIONS.md`
5. **Email Preview**: `/EMAIL_PREVIEW.md`

---

## 🎉 Success!

When all boxes are checked:

✅ Gmail integration is LIVE!  
✅ Users can reset passwords via email!  
✅ Professional LSPU-LBC branded emails!  
✅ Secure and reliable system!

---

**Setup Date**: _______________  
**Tested By**: _______________  
**Status**: [ ] Complete [ ] In Progress [ ] Issues Found

---

**Credentials Summary**:
- Email: `jadesupremo0@gmail.com`
- App Password: `lfnsyegcvqbaywbq`
- Environment Variables: Set in Supabase
- Status: Ready to test!

---

🚀 **Ready to go live!**
