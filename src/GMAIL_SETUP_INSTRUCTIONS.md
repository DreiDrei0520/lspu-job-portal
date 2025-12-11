# 📧 Gmail Setup for Password Reset Emails

## Overview
The LSPU-LBC Job Portal now sends real password reset codes via Gmail SMTP. Follow these instructions to configure your Gmail account.

---

## ⚙️ Setup Steps

### 1. Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable 2FA (required for App Passwords)

### 2. Generate a Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Enter a name like: **"LSPU Job Portal"**
6. Click **"Generate"**
7. **COPY THE 16-CHARACTER PASSWORD** (it will look like: `xxxx xxxx xxxx xxxx`)
   - ⚠️ **Important**: You can only see this password ONCE. Save it securely!

### 3. Configure Environment Variables

You've already been prompted to enter these values in Figma Make:

- **GMAIL_USER**: Your full Gmail address (e.g., `yourname@gmail.com`)
- **GMAIL_APP_PASSWORD**: The 16-character app password (remove spaces, e.g., `xxxxxxxxxxxxxxxx`)

---

## 🧪 Testing

1. Go to the **Login page**
2. Click **"Forgot Password?"**
3. Enter an email address that exists in your system
4. Click **"Send Verification Code"**
5. **Check your email inbox** (and spam folder)
6. You should receive an email with a 6-digit code
7. Enter the code to reset your password

---

## 📋 Email Template

Users will receive a professional email containing:

- **Subject**: "LSPU-LBC Job Portal - Password Reset Code"
- **6-digit verification code** (large, easy to read)
- **Expiration warning** (15 minutes)
- **Security tips**
- LSPU-LBC branding with Surfie Green colors

---

## 🔧 Troubleshooting

### Email not sending?

1. **Check environment variables**:
   - Verify `GMAIL_USER` is your full Gmail address
   - Verify `GMAIL_APP_PASSWORD` is the 16-character app password (no spaces)

2. **Check Gmail settings**:
   - Ensure 2-Factor Authentication is enabled
   - Ensure the App Password is still active (go to https://myaccount.google.com/apppasswords)

3. **Check spam folder**:
   - The email might be in the recipient's spam folder

4. **Server logs**:
   - Check the Supabase Functions logs for error messages
   - Look for "Email sent successfully" or error messages

### "Less secure app" error?

- This is an old setting. You **must** use **App Passwords** instead.
- Do NOT enable "Less secure app access" - it's deprecated and insecure.

### Gmail blocks the email?

- Make sure you're using an App Password, not your regular Gmail password
- Check if Gmail has locked your account due to suspicious activity

---

## 🔒 Security Notes

- **Never share your App Password** with anyone
- **Never commit** App Passwords to version control
- App Passwords bypass 2FA, so keep them secure
- Revoke App Passwords you're not using: https://myaccount.google.com/apppasswords
- The verification code expires in **15 minutes** for security

---

## 🎨 Email Design

The email uses LSPU-LBC's Surfie Green color scheme:
- Header: `#0d5468` to `#116d8a` gradient
- Code highlight: `#0d5468`
- Border: `#116d8a`
- Professional, responsive HTML design

---

## 📞 Support

If you encounter issues:
1. Check the setup steps above
2. Review the troubleshooting section
3. Check server logs in Supabase Functions dashboard
4. Contact LSPU-LBC IT Department

---

## ✅ Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] Gmail App Password generated
- [ ] `GMAIL_USER` environment variable set
- [ ] `GMAIL_APP_PASSWORD` environment variable set
- [ ] Tested password reset flow
- [ ] Verified email received in inbox

---

**Last Updated**: November 5, 2025  
**System**: LSPU-LBC Online Job Portal  
**Feature**: Password Reset via Gmail SMTP
