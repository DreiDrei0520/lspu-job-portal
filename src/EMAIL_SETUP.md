# Email Setup for Password Reset

The forgot password feature has been implemented with email verification code functionality. To enable email sending in production, you need to configure an email service.

## 🔧 Current Setup

The system generates a **6-digit verification code** that expires in **15 minutes**. Currently, the code is logged to the server console for development purposes.

## 📧 Email Service Integration Options

Choose one of the following email services to send verification codes:

### Option 1: Supabase Auth Email (Recommended for Simple Setup)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Configure SMTP settings or use Supabase's built-in email service
4. The system already attempts to use `supabase.auth.resetPasswordForEmail()`

**Pros:**
- Already integrated
- No additional code needed
- Built into Supabase

**Cons:**
- Requires Supabase email configuration
- Less customization

### Option 2: Resend (Recommended for Production)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Install the Resend client:
   ```bash
   # Not needed for Deno, uses npm: specifier
   ```

4. Add to `/supabase/functions/server/index.tsx`:
   ```typescript
   import { Resend } from 'npm:resend@2.0.0'
   
   const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
   
   // In the send-code endpoint:
   await resend.emails.send({
     from: 'LSPU Job Portal <noreply@yourdomain.com>',
     to: email,
     subject: 'Password Reset Code - LSPU-LBC Job Portal',
     html: `
       <h2>Password Reset Request</h2>
       <p>Your verification code is: <strong style="font-size: 24px; letter-spacing: 4px;">${code}</strong></p>
       <p>This code will expire in 15 minutes.</p>
       <p>If you didn't request this, please ignore this email.</p>
     `
   })
   ```

5. Set the environment variable in Supabase:
   - Go to **Project Settings** → **Edge Functions** → **Secrets**
   - Add `RESEND_API_KEY` with your API key

### Option 3: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to server code:
   ```typescript
   const sgMail = require('@sendgrid/mail')
   sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'))
   
   await sgMail.send({
     to: email,
     from: 'noreply@yourdomain.com',
     subject: 'Password Reset Code - LSPU-LBC Job Portal',
     text: `Your password reset code is: ${code}. This code will expire in 15 minutes.`,
     html: `<strong>Your password reset code is: ${code}</strong><br>This code will expire in 15 minutes.`
   })
   ```

### Option 4: Nodemailer (SMTP)

If you have your own SMTP server:

```typescript
import nodemailer from 'npm:nodemailer'

const transporter = nodemailer.createTransport({
  host: Deno.env.get('SMTP_HOST'),
  port: 587,
  secure: false,
  auth: {
    user: Deno.env.get('SMTP_USER'),
    pass: Deno.env.get('SMTP_PASS')
  }
})

await transporter.sendMail({
  from: '"LSPU Job Portal" <noreply@yourdomain.com>',
  to: email,
  subject: 'Password Reset Code',
  html: `Your verification code is: <strong>${code}</strong>`
})
```

## 🔐 Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent abuse
2. **IP Tracking**: Log password reset attempts by IP
3. **Email Verification**: Ensure user's email is verified before allowing reset
4. **Code Complexity**: 6-digit codes provide 1,000,000 possible combinations
5. **Expiration**: Codes expire in 15 minutes (configurable)

## 🧪 Testing in Development

For development, the verification code is:
- Logged to the server console
- Included in the API response when `DENO_ENV=development`

To test:
1. Click "Forgot Password" on login page
2. Enter your email
3. Check server logs for the code
4. Enter the code in the verification step
5. Set your new password

## 📝 Implementation Location

The password reset endpoints are in:
- **Frontend**: `/components/ForgotPassword.tsx`
- **Backend**: `/supabase/functions/server/index.tsx`
  - `POST /make-server-cc72773f/forgot-password/send-code`
  - `POST /make-server-cc72773f/forgot-password/verify-code`
  - `POST /make-server-cc72773f/forgot-password/reset-password`

## 🎨 User Flow

1. User clicks "Forgot your password?" on login page
2. User enters their email address
3. System generates 6-digit code and stores in KV store
4. Code is sent to user's email (or logged in development)
5. User enters the 6-digit code
6. System verifies the code hasn't expired
7. User creates a new password
8. Password is updated in Supabase Auth
9. User is redirected to login with new password

## 🚀 Production Checklist

- [ ] Choose and configure email service
- [ ] Add email service API key to environment variables
- [ ] Update send-code endpoint with email sending logic
- [ ] Remove development code logging
- [ ] Test complete flow in staging
- [ ] Set up email templates with your branding
- [ ] Configure SPF/DKIM records for your domain
- [ ] Add rate limiting to prevent abuse
- [ ] Monitor email delivery rates
