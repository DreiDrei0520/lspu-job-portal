# Troubleshooting Guide - LSPU-LBC Job Portal

## Common Issues and Solutions

### 1. Login Failed After Password Reset

**Problem:** Getting "Invalid login credentials" after resetting password.

**Solution:**
1. Wait 2-3 seconds after the success message before trying to log in
2. Make sure you're using the NEW password, not the old one
3. Check browser console for detailed logs
4. Verify the password was actually updated (check server logs)

**What to check:**
```
✅✅✅ PASSWORD RESET COMPLETED SUCCESSFULLY ✅✅✅
```
This message in server logs confirms the password was updated.

### 2. Verification Code Not Working

**Problem:** "Invalid or expired verification code" error.

**Causes:**
- Code has expired (15 minutes timeout)
- Typing error in the code
- Used the wrong email address

**Solution:**
1. Copy the code from the blue box (don't type manually)
2. Check if more than 15 minutes have passed
3. Request a new code if expired
4. Verify you're using the same email

### 3. Email Not Receiving Code

**Problem:** Not receiving the verification code email.

**Current Setup:**
- Codes are shown in toast notifications (development mode)
- Codes are displayed in a blue box on the verification screen
- Server logs show the code in console

**For Production:**
- Follow instructions in `/EMAIL_SETUP.md`
- Configure email service (Resend, SendGrid, etc.)

### 4. Password Requirements

**Requirements:**
- Minimum 8 characters
- Must match confirmation password

**Common errors:**
- "Password must be at least 8 characters"
- "Passwords do not match"

### 5. 401 Unauthorized Error

**Problem:** Getting 401 errors on forgot password endpoints.

**Cause:** Missing authorization header.

**Solution:** Already fixed - the public anon key is now included in all requests.

### 6. User Not Found

**Problem:** "User not found" error when trying to reset password.

**Causes:**
- Email not registered in the system
- Typo in email address
- User was deleted

**Solution:**
1. Verify email is correct
2. Create an account if you don't have one
3. Check with admin if account exists

## Debug Mode

### Enable Detailed Logging

All forgot password operations now have extensive logging:

**Frontend (Browser Console):**
```javascript
=== SENDING PASSWORD RESET CODE ===
=== VERIFYING RESET CODE ===
=== RESET PASSWORD FORM SUBMIT ===
```

**Backend (Server Logs):**
```javascript
=== Password Reset Code Request ===
=== VERIFY RESET CODE ENDPOINT ===
=== RESET PASSWORD ENDPOINT ===
```

### How to Debug

1. **Open Browser DevTools (F12)**
2. **Go to Console tab**
3. **Attempt password reset**
4. **Look for log messages with === headers**
5. **Check for ✅ (success) or ❌ (error) markers**

### What to Look For

**Successful Flow:**
```
✅ Code sent! Your verification code is: 123456
✅ Code verified successfully
✅✅✅ PASSWORD RESET COMPLETED SUCCESSFULLY ✅✅✅
✅ Password reset successfully!
```

**Error Indicators:**
```
❌ No reset data found
❌ Code mismatch
❌ Code has expired
❌ User not found
❌ Supabase password update error
```

## Testing Checklist

Before reporting an issue, verify:

- [ ] Using a registered email address
- [ ] Code is copied correctly (use blue box, don't type)
- [ ] Less than 15 minutes since code was sent
- [ ] New password is at least 8 characters
- [ ] Passwords match
- [ ] Browser console shows no errors
- [ ] Waited 2-3 seconds after success before logging in

## Still Having Issues?

1. **Clear browser cache and cookies**
2. **Try in incognito/private mode**
3. **Check server logs for detailed error messages**
4. **Copy and share console logs** (both browser and server)
5. **Verify Supabase project is running**

## Known Limitations

1. **Email sending:** Currently in development mode - codes shown in UI
2. **Rate limiting:** Not implemented - can request unlimited codes
3. **Code complexity:** 6 digits provides basic security
4. **Session handling:** Must log out/in after password reset

## Contact Support

If the issue persists after following this guide:
1. Take screenshots of error messages
2. Copy browser console logs
3. Copy server console logs
4. Note the exact steps to reproduce
5. Contact system administrator
