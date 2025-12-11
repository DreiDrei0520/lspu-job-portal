# ⚡ Setup Gmail Password Reset - DO THIS NOW

## 🎯 Goal
Enable real email sending for password reset codes in 5 minutes.

---

## 📋 Step-by-Step Instructions

### STEP 1: Enable 2-Factor Authentication
**Time: 2 minutes**

1. Open: https://myaccount.google.com/security
2. Find: **"2-Step Verification"**
3. Click: **"Get Started"**
4. Follow the prompts to set up 2FA
5. ✅ **Done!** You now have 2FA enabled

---

### STEP 2: Generate App Password
**Time: 1 minute**

1. Open: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. **Select app**: Choose **"Mail"**
4. **Select device**: Choose **"Other (Custom name)"**
5. Type: `LSPU Job Portal`
6. Click: **"Generate"**
7. 📝 **COPY THIS PASSWORD** - It looks like: `abcd efgh ijkl mnop`
   - ⚠️ **IMPORTANT**: You'll only see this ONCE!

---

### STEP 3: Configure Environment Variables
**Time: 1 minute**

You've already been prompted for these values:

1. **GMAIL_USER**:
   ```
   Your Gmail address
   Example: admin@gmail.com
   ```

2. **GMAIL_APP_PASSWORD**:
   ```
   The 16-character password from Step 2
   Remove the spaces: abcdefghijklmnop
   Example: abcdefghijklmnop
   ```

---

### STEP 4: Test It!
**Time: 1 minute**

1. Go to your Job Portal login page
2. Click **"Forgot Password?"**
3. Enter a valid email (one that exists in your system)
4. Click **"Send Verification Code"**
5. 📬 **Check your email inbox!**
   - Subject: "LSPU-LBC Job Portal - Password Reset Code"
   - Look for a 6-digit code
6. Enter the code
7. Set a new password
8. ✅ **Success!**

---

## 🎨 What You'll See

### In the App:
```
┌─────────────────────────────────────┐
│  ✅ Verification code sent to       │
│     your email!                     │
│                                     │
│  Please check your inbox and       │
│  spam folder                        │
└─────────────────────────────────────┘
```

### In Your Email:
```
┌─────────────────────────────────────┐
│ From: admin@gmail.com               │
│ Subject: LSPU-LBC Job Portal -      │
│          Password Reset Code        │
├─────────────────────────────────────┤
│                                     │
│  🔐 Password Reset Request          │
│  LSPU-LBC Online Job Portal         │
│                                     │
│  Your verification code:            │
│                                     │
│  ┌─────────────────────────┐       │
│  │                          │       │
│  │      1 2 3 4 5 6        │       │
│  │                          │       │
│  └─────────────────────────┘       │
│                                     │
│  ⏰ Expires in 15 minutes           │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After completing the setup, verify:

- [ ] Email arrives in inbox (not spam)
- [ ] Email shows LSPU-LBC branding
- [ ] 6-digit code is visible
- [ ] Code works when entered
- [ ] Password reset completes
- [ ] Can login with new password

---

## 🚨 Common Issues

### "No email received"
1. **Check spam folder** first!
2. Wait 30 seconds (sometimes Gmail is slow)
3. Check server logs for errors
4. Verify GMAIL_USER and GMAIL_APP_PASSWORD are correct

### "Authentication failed"
1. Make sure you're using the **App Password**, not your regular Gmail password
2. Remove spaces from the app password
3. Regenerate app password if needed

### "Gmail credentials not configured"
1. Verify both environment variables are set:
   - GMAIL_USER
   - GMAIL_APP_PASSWORD
2. Check for typos
3. Restart the server after setting variables

---

## 🎯 Quick Reference

| What | Where |
|------|-------|
| Enable 2FA | https://myaccount.google.com/security |
| Generate App Password | https://myaccount.google.com/apppasswords |
| Test Password Reset | Your Job Portal → Login → Forgot Password |
| View Server Logs | Supabase Functions Dashboard |

---

## 📊 Expected Results

### Server Logs (Success):
```
═══════════════════════════════════════════
PASSWORD RESET CODE
═══════════════════════════════════════════
Email: user@example.com
Code: 123456
Email Sent: YES ✅
Expires: Nov 5, 2025, 3:45 PM
═══════════════════════════════════════════
```

### User Toast (Success):
```
✅ Verification code sent to your email!
Please check your inbox and spam folder
```

---

## 🔐 Security Reminders

- ✅ Use a dedicated Gmail account for the job portal
- ✅ Never share your App Password
- ✅ Enable 2FA on the Gmail account
- ✅ Monitor Gmail sending activity
- ✅ Keep the App Password in environment variables ONLY

---

## 💡 Pro Tips

1. **Use a professional email address**
   - ✅ `lspu.jobs@gmail.com`
   - ❌ `myemail123@gmail.com`

2. **Test first with your own email**
   - Verify it works before announcing to users

3. **Check spam folder during testing**
   - First email might go to spam
   - Mark as "Not Spam" to train Gmail

4. **Monitor Gmail sending limits**
   - Free Gmail: ~500 emails/day
   - Don't spam users!

---

## 🎉 You're Done!

Once you complete all 4 steps and see the email arrive, you're all set!

**Next steps:**
1. ✅ Document your Gmail credentials securely
2. ✅ Test with a few users
3. ✅ Monitor the first few password resets
4. ✅ Enjoy automated password resets!

---

**Need help?** Check:
- `/GMAIL_SETUP_INSTRUCTIONS.md` - Full setup guide
- `/PASSWORD_RESET_EMAIL_SUMMARY.md` - Complete documentation
- `/EMAIL_PREVIEW.md` - See what users receive

---

**Status**: Ready to configure! 🚀  
**Time needed**: 5 minutes  
**Difficulty**: Easy  
**Result**: Professional password reset emails
