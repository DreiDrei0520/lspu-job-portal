# 🚀 Quick Start: Enable Gmail Password Reset

## What Changed?

✅ Password reset codes are now sent via **real Gmail emails** instead of just showing in the UI.

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. If prompted, enable **2-Step Verification** first
3. Create an app password:
   - App: **Mail**
   - Device: **Other (Custom name)** → Enter: "LSPU Job Portal"
4. Click **Generate**
5. **COPY the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Configure in Figma Make

You've already entered these in the environment variable prompts:

- **GMAIL_USER**: Your Gmail address (e.g., `admin@gmail.com`)
- **GMAIL_APP_PASSWORD**: The 16-character code (no spaces: `abcdefghijklmnop`)

### Step 3: Test It!

1. Go to Login → Click **"Forgot Password?"**
2. Enter a valid email from your system
3. Check your email inbox (and spam folder)
4. You should receive a professional email with a 6-digit code
5. Enter the code and reset your password

---

## 📧 What Users Receive

Professional email with:
- **LSPU-LBC branding** in Surfie Green colors
- **Large 6-digit code** (easy to read)
- **15-minute expiration warning**
- **Security tips**
- Responsive HTML design

---

## 🔍 How to Verify It's Working

### Check the server logs:

```
═══════════════════════════════════════════
PASSWORD RESET CODE
═══════════════════════════════════════════
Email: user@example.com
Code: 123456
Email Sent: YES ✅
Expires: [timestamp]
═══════════════════════════════════════════
```

If you see **"Email Sent: YES ✅"**, emails are working!

If you see **"Email Sent: NO ❌"**, check your Gmail credentials.

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No email received | Check spam folder first |
| "Gmail credentials not configured" | Verify both GMAIL_USER and GMAIL_APP_PASSWORD are set |
| "Authentication failed" | Verify App Password is correct (no spaces) |
| 2FA error | Enable 2-Step Verification on your Google Account |

---

## 🔐 Security Features

- Codes expire in **15 minutes**
- Stored securely in KV database
- Professional branded emails
- No code shown in UI when email is sent successfully
- Fallback to dev mode if email fails

---

## 📝 Full Documentation

See `/GMAIL_SETUP_INSTRUCTIONS.md` for complete setup guide.

---

**Ready to test?** Go to the Forgot Password page and try it! 🎉
