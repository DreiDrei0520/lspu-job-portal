# 🔧 Authentication Error Fix Guide

## Error: "Invalid login credentials"

This error occurs when trying to log in with credentials that don't match any account in the database.

---

## 🚀 Quick Fix Steps

### Step 1: Create Demo Accounts

The demo accounts need to be created first before you can log in.

**Method A: Use the Demo Seeder (RECOMMENDED)**

1. **Go to the Landing Page** (reload the page if needed)
2. **Look for the 🎭 Button** in the bottom-left corner that says "Create Demo Accounts"
3. **Click it** to open the Demo Account Setup modal
4. **Click "Create Demo Accounts"** button
5. **Wait** for all 3 accounts to be created (you'll see success toasts)
6. **Click "Get Started"** and proceed to login

**Method B: Manual Sign Up**

If the demo seeder doesn't appear or doesn't work:

1. Click "Get Started" on landing page
2. Click "Don't have an account? Sign up"
3. Fill in these details:
   - **Email:** `applicant@lspu.edu.ph`
   - **Password:** `applicant123`
   - **Name:** `Juan dela Cruz`
   - **Role:** Applicant
4. Click "Create Account"
5. You should be automatically logged in

---

### Step 2: Verify Credentials

Make sure you're using the **exact** credentials (case-sensitive for password):

#### Applicant Account
```
Email:    applicant@lspu.edu.ph
Password: applicant123
```

#### Admin Account
```
Email:    admin@lspu.edu.ph
Password: admin123
```

#### Superadmin Account
```
Email:    superadmin@lspu.edu.ph
Password: superadmin123
```

---

## 🔍 Common Mistakes

### ❌ Wrong Email Format
- **Wrong:** `applicant@lspu.com`
- **Correct:** `applicant@lspu.edu.ph`

### ❌ Wrong Password
- **Wrong:** `Applicant123` (capital A)
- **Correct:** `applicant123` (all lowercase)

### ❌ Extra Spaces
- **Wrong:** `applicant@lspu.edu.ph ` (space at end)
- **Correct:** `applicant@lspu.edu.ph` (no spaces)

### ❌ Account Not Created Yet
- You must create the demo accounts first before logging in
- Use the 🎭 Demo Seeder button on the landing page

---

## 🛠️ Advanced Troubleshooting

### Check if Accounts Exist

1. Open browser **Developer Console** (F12)
2. Go to the **Console** tab
3. Try to log in
4. Look for error messages like:
   - `"User not found"` → Account doesn't exist, create it first
   - `"Invalid password"` → Account exists but wrong password
   - `"Invalid login credentials"` → Either account doesn't exist or wrong credentials

### Clear Browser Cache

Sometimes old auth tokens can cause issues:

1. **Chrome/Edge:** Ctrl+Shift+Delete → Clear cached images and files
2. **Firefox:** Ctrl+Shift+Delete → Cached Web Content
3. **Safari:** Cmd+Option+E
4. Reload the page (Ctrl+R or Cmd+R)

### Reset Everything

If nothing works, reset the demo accounts:

1. Create a **NEW** account with different credentials:
   ```
   Email:    test@lspu.edu.ph
   Password: test123456
   Name:     Test User
   Role:     Applicant
   ```
2. Sign up with these new credentials
3. You should be automatically logged in after signup

---

## 🎯 Testing Login Flow

### Correct Flow:

1. **Landing Page** → See the portal homepage
2. **Click "Create Demo Accounts"** (🎭 button bottom-left)
3. **Wait for accounts to be created** → Should see 3 success messages
4. **Click "Get Started"** → Go to login page
5. **Enter credentials:**
   - Email: `applicant@lspu.edu.ph`
   - Password: `applicant123`
6. **Click "Sign In"** → Should successfully log in
7. **See Applicant Dashboard** → Success!

---

## 📝 Manual Account Creation (If Demo Seeder Fails)

If the demo seeder button doesn't work, you can manually create accounts:

### Create Applicant Account
```
1. Click "Get Started"
2. Click "Don't have an account? Sign up"
3. Fill in:
   - Name: Juan dela Cruz
   - Email: applicant@lspu.edu.ph
   - Password: applicant123
   - Role: Applicant
4. Click "Create Account"
```

### Create Admin Account
```
1. Sign out (if logged in)
2. Click "Don't have an account? Sign up"
3. Fill in:
   - Name: Maria Santos
   - Email: admin@lspu.edu.ph
   - Password: admin123
   - Role: Admin
4. Click "Create Account"
```

### Create Superadmin Account
```
1. Sign out (if logged in)
2. Click "Don't have an account? Sign up"
3. Fill in:
   - Name: Dr. Jose Rizal
   - Email: superadmin@lspu.edu.ph
   - Password: superadmin123
   - Role: Superadmin
4. Click "Create Account"
```

---

## 🔐 Security Notes

- Passwords are **case-sensitive**
- Emails are **not case-sensitive** (automatically converted to lowercase)
- Make sure there are **no extra spaces** before or after credentials
- The system uses Supabase Auth, which is secure and production-ready

---

## 💡 Still Having Issues?

### Check Console Logs

1. Open Developer Tools (F12)
2. Go to Console tab
3. Try to log in
4. Look for error messages starting with "Auth error:"
5. Copy the full error message

### Common Error Messages and Solutions

| Error Message | Solution |
|--------------|----------|
| `Invalid login credentials` | Create demo accounts first or check credentials |
| `User not found` | Account doesn't exist, create it via signup |
| `Email already registered` | Account exists, use correct password |
| `Network error` | Check internet connection |
| `Failed to fetch` | Server might be down, wait and retry |

---

## ✅ Success Indicators

You know login worked when:
- ✅ See "Logged in successfully!" toast message
- ✅ Redirected to dashboard (not stuck on login page)
- ✅ See user name in top-right corner
- ✅ See navigation menu
- ✅ Can browse the dashboard

---

## 📞 Need Help?

If you've tried everything and still can't log in:

1. **Clear all browser data** (cookies, cache, local storage)
2. **Use Incognito/Private mode** to test
3. **Try a different browser** (Chrome, Firefox, Edge, Safari)
4. **Check if Supabase is working** (backend server status)

The issue is almost always one of these:
- ✅ Demo accounts not created yet
- ✅ Typing wrong password (check caps lock!)
- ✅ Using wrong email domain (.com instead of .edu.ph)
- ✅ Extra spaces in email or password

---

Last Updated: November 5, 2025
Status: Ready to Help! 🚀
