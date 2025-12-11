# Custom SMTP Setup Guide - Password Reset Email Fix

## Current Issue
Password reset verification codes are not being received via Gmail because the SMTP credentials haven't been configured in Supabase.

## Solution: Add SMTP Secrets to Supabase

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project: **zodduukuwfatmqejxnsf**
3. Click **Settings** (bottom left)
4. Click **Secrets** tab

### Step 2: Add SMTP Configuration
Click **+ New Secret** and add these 6 secrets:

#### Secret 1: SMTP Host
- **Name:** `SMTP_HOST`
- **Value:** `smtp.gmail.com`

#### Secret 2: SMTP Port
- **Name:** `SMTP_PORT`
- **Value:** `465`

#### Secret 3: SMTP Username
- **Name:** `SMTP_USER`
- **Value:** `jadesupremo0@gmail.com`

#### Secret 4: SMTP Password (NEW)
- **Name:** `SMTP_PASSWORD`
- **Value:** `ltymbiwjuqirorth`

#### Secret 5: Sender Email Address
- **Name:** `SENDER_EMAIL`
- **Value:** `admin@lspu.edu.ph`

#### Secret 6: Sender Name
- **Name:** `SENDER_NAME`
- **Value:** `LSPU-LBC Online Job Portal`

### Step 3: Verify Configuration
After adding all secrets:
1. **Wait 30 seconds** for Supabase to apply the changes
2. Your edge function will automatically use these credentials
3. Test by triggering a password reset from the app

## Why Email Wasn't Working
- The code was looking for `SMTP_USER` and `SMTP_PASSWORD` environment variables
- These weren't set in Supabase Secrets, so emails failed to send
- Now the code has fallbacks to `SMTP_HOST`, `SMTP_PORT`, `SENDER_EMAIL`, `SENDER_NAME`

## Testing Password Reset
1. Go to login page
2. Click "Forgot Password?"
3. Enter an email address (e.g., test@example.com or your Gmail)
4. You should receive an email within 30 seconds
5. Copy the 6-digit code from the email
6. Paste it and create a new password

## Email Limits
- **Minimum interval per user:** 60 seconds (set in Supabase SMTP settings)
- **Rate limit:** Gmail allows ~500 emails per day from this account
- **Important:** Don't share the `SMTP_PASSWORD` with anyone

## Troubleshooting

### Issue: Still not receiving emails after 30 seconds
1. Check email spam/junk folder
2. Verify `SMTP_PASSWORD` is correct: `ltymbiwjuqirorth`
3. Check that all 6 secrets are added correctly
4. Check Supabase Function logs for errors:
   - Go to Functions → make-server-cc72773f → Invocations tab
   - Look for error messages

### Issue: "SMTP authentication failed"
- The password `ltymbiwjuqirorth` might be incorrect
- Verify it matches your Gmail App Password exactly
- If changed, update the `SMTP_PASSWORD` secret

### Gmail App Password Requirements
For Gmail to accept SMTP connections:
- ✅ 2-Factor Authentication must be enabled on the Gmail account
- ✅ You must use an "App Password", not your regular Gmail password
- ✅ App Passwords are unique 16-character strings

## Configuration Summary
```
Sender: admin@lspu.edu.ph (LSPU-LBC Online Job Portal)
SMTP Server: smtp.gmail.com:465
Authentication: jadesupremo0@gmail.com / ltymbiwjuqirorth
TLS: Enabled
```

Your edge function has been updated to use these settings automatically! 🎉
