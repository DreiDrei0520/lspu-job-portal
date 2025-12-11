# 🎨 VISUAL GUIDE: Fix Gmail Error

## 🚨 Current Error
```
❌ GMAIL_USER is not a valid email: 1234
```

---

## 🔍 What's Wrong?

Your Supabase secrets look like this:

```
┌───────────────────────────────────────┐
│ Secret Name         │ Value           │
├───────────────────────────────────────┤
│ GMAIL_USER          │ 1234        ❌  │
│ GMAIL_APP_PASSWORD  │ 1234        ❌  │
└───────────────────────────────────────┘
```

They should look like this:

```
┌─────────────────────────────────────────────────┐
│ Secret Name         │ Value                     │
├─────────────────────────────────────────────────┤
│ GMAIL_USER          │ jadesupremo@gmail.com  ✅ │
│ GMAIL_APP_PASSWORD  │ ••••••••••••••••       ✅ │
└─────────────────────────────────────────────────┘
```

---

## 📍 Where to Go

### Step 1: Open Supabase
```
🌐 https://supabase.com/dashboard
   👇
🏢 Click your "LSPU-LBC" project
   👇
⚙️ Click "Settings" (gear icon on left sidebar)
   👇
⚡ Click "Edge Functions"
   👇
🔐 Scroll to "Secrets" section
```

---

## 🎯 What You'll See

You should see something like this:

```
╔════════════════════════════════════════════════╗
║           Edge Functions - Secrets             ║
╠════════════════════════════════════════════════╣
║                                                ║
║  Name: GMAIL_USER                              ║
║  Value: 1234                      [Edit] [🗑️] ║
║                                                ║
║  Name: GMAIL_APP_PASSWORD                      ║
║  Value: 1234                      [Edit] [🗑️] ║
║                                                ║
╚════════════════════════════════════════════════╝
```

---

## ✏️ How to Edit

### For GMAIL_USER:

1. Click the **[Edit]** button next to GMAIL_USER
2. You'll see a popup or inline editor:
   ```
   ┌─────────────────────────────────────┐
   │ Edit Secret                         │
   ├─────────────────────────────────────┤
   │ Name: GMAIL_USER                    │
   │                                     │
   │ Value: [1234________________]       │
   │                 👆                  │
   │        Delete this and type:        │
   │     jadesupremo@gmail.com          │
   │                                     │
   │     [Cancel]  [Update] ← Click!     │
   └─────────────────────────────────────┘
   ```

3. Delete "1234"
4. Type: `jadesupremo@gmail.com`
5. Click **[Update]**

### For GMAIL_APP_PASSWORD:

1. Click the **[Edit]** button next to GMAIL_APP_PASSWORD
2. You'll see a popup or inline editor:
   ```
   ┌─────────────────────────────────────┐
   │ Edit Secret                         │
   ├─────────────────────────────────────┤
   │ Name: GMAIL_APP_PASSWORD            │
   │                                     │
   │ Value: [1234________________]       │
   │                 👆                  │
   │        Delete this and type:        │
   │        lfnsyegcvqbaywbq            │
   │                                     │
   │     [Cancel]  [Update] ← Click!     │
   └─────────────────────────────────────┘
   ```

3. Delete "1234"
4. Type: `lfnsyegcvqbaywbq`
5. Click **[Update]**

---

## ⏱️ After Editing

### Wait 30-60 seconds!

Supabase needs time to deploy the new values to your Edge Function.

```
🕐 Updating secrets...
🕑 Deploying to Edge Function...
🕒 Almost ready...
✅ Done!
```

---

## 🧪 Test It

1. Go to your LSPU-LBC app
2. Click "Forgot Password?"
3. Enter: `jadesupremo@gmail.com`
4. Click "Send Reset Link"
5. Check Gmail inbox!

---

## ✅ Success Looks Like

### Before (WRONG):
```
🔴 Error: GMAIL_USER is not a valid email: 1234
```

### After (RIGHT):
```
🟢 Password reset email sent successfully!
📧 Email arrives in Gmail inbox
✅ No errors in console
```

---

## 🎯 Quick Reference Card

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  What to Copy                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  GMAIL_USER:                            ┃
┃  jadesupremo@gmail.com                  ┃
┃                                         ┃
┃  GMAIL_APP_PASSWORD:                    ┃
┃  lfnsyegcvqbaywbq                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Where to Go                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Supabase → Settings → Edge Functions   ┃
┃  → Secrets                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  What to Do                             ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  1. Click [Edit] on GMAIL_USER          ┃
┃  2. Replace "1234" with email           ┃
┃  3. Click [Update]                      ┃
┃  4. Click [Edit] on GMAIL_APP_PASSWORD  ┃
┃  5. Replace "1234" with password        ┃
┃  6. Click [Update]                      ┃
┃  7. Wait 30 seconds                     ┃
┃  8. Test!                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🆘 Troubleshooting

### Can't find "Secrets"?

Try looking for:
- "Environment Variables"
- "Edge Function Settings"
- "Function Variables"

### Can't find "Edit" button?

Try:
- Click the row itself
- Look for "..." (three dots) button
- Right-click the secret name

### Changes not working?

- Wait longer (up to 2 minutes)
- Refresh the page
- Check you clicked [Update] on BOTH secrets

---

## 🎯 Summary

```
Error:    GMAIL_USER is not a valid email: 1234
Problem:  Secrets have test value "1234"
Solution: Edit secrets in Supabase Dashboard
Where:    Settings → Edge Functions → Secrets
Time:     1 minute
Result:   Working emails! 🎉
```

---

**GO TO SUPABASE AND EDIT THOSE SECRETS NOW!** 🚀

The error will disappear once you update the values!
