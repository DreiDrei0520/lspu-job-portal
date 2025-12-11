# 📬 Password Reset Email Preview

## What Users Will See

When a user requests a password reset, they receive a professional, branded email:

---

## 📧 Email Structure

```
┌─────────────────────────────────────────────────────────┐
│  [HEADER - Surfie Green Gradient Background]           │
│                                                         │
│            🔐 Password Reset Request                    │
│         LSPU-LBC Online Job Portal                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [CONTENT AREA - Light Gray Background]                │
│                                                         │
│  Hello,                                                 │
│                                                         │
│  You have requested to reset your password for the     │
│  LSPU-LBC Online Job Portal.                           │
│                                                         │
│  Please use the following verification code to         │
│  complete the password reset process:                  │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │  [CODE BOX - White with Teal Border]      │        │
│  │                                             │        │
│  │              1 2 3 4 5 6                   │        │
│  │         (Large, Bold, Spaced)              │        │
│  │                                             │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ ⏰ Important: This code will expire in     │        │
│  │    15 minutes.                              │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  Security Tips:                                         │
│  • Never share this code with anyone                   │
│  • LSPU-LBC staff will never ask for this code        │
│  • If you didn't request this reset, ignore this email│
│                                                         │
│  If you have any questions, contact the LSPU-LBC      │
│  IT Department.                                         │
│                                                         │
│  Best regards,                                          │
│  LSPU-LBC HR Department                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [FOOTER - Small Gray Text]                            │
│                                                         │
│  Laguna State Polytechnic University                   │
│  Los Baños Campus                                       │
│                                                         │
│  This is an automated email.                           │
│  Please do not reply to this message.                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Header Gradient Start | Dark Surfie Green | `#0d5468` |
| Header Gradient End | Surfie Green | `#116d8a` |
| Code Text | Dark Surfie Green | `#0d5468` |
| Code Border | Surfie Green | `#116d8a` |
| Background | Light Gray | `#f9f9f9` |
| Warning Box | Yellow | `#fff3cd` |

---

## 📱 Features

✅ **Responsive Design** - Works on mobile and desktop  
✅ **High Readability** - Large code font (36px)  
✅ **Professional Branding** - LSPU-LBC colors and logo  
✅ **Security Warnings** - Expiration time and security tips  
✅ **HTML Formatted** - Beautiful styling with inline CSS  
✅ **Clear Call-to-Action** - Code prominently displayed  

---

## 📨 Email Details

**From**: Your configured Gmail address (e.g., `lspu.jobs@gmail.com`)  
**To**: User's email address  
**Subject**: `LSPU-LBC Job Portal - Password Reset Code`  
**Format**: HTML with text fallback  

---

## ⏱️ Email Delivery

- **Average delivery time**: 2-10 seconds
- **Code validity**: 15 minutes from generation
- **Spam score**: Low (professional format, Gmail SMTP)
- **Deliverability**: High (using Gmail's trusted servers)

---

## 🔄 User Flow

1. **User clicks** "Forgot Password?"
2. **User enters** their email address
3. **System generates** 6-digit code
4. **Email sent** via Gmail SMTP
5. **User receives** professional email
6. **User enters** the code
7. **User sets** new password
8. **Success** - User can log in

---

## 💡 Pro Tips

### For best delivery rates:

1. **Use a professional Gmail address**  
   ✅ `lspu.jobs@gmail.com`  
   ❌ `random123@gmail.com`

2. **Warm up your email**  
   - Send a few test emails first
   - Don't send 1000 emails immediately

3. **Monitor spam reports**  
   - Check Gmail's "Sent Mail" folder
   - Look for bounce notifications

4. **Keep credentials secure**  
   - Never share App Password
   - Use environment variables only

---

## 📊 Expected Results

| Metric | Expected Value |
|--------|----------------|
| Delivery Rate | 99%+ |
| Spam Rate | <1% |
| Open Rate | 80%+ (users need the code) |
| Time to Inbox | <10 seconds |
| Code Entry Success | 95%+ |

---

## 🎯 Next Steps

1. ✅ Configure Gmail credentials
2. ✅ Test with your own email
3. ✅ Test with a few users
4. ✅ Monitor server logs
5. ✅ Go live!

---

**Questions?** Check `/GMAIL_SETUP_INSTRUCTIONS.md` for full setup guide.
