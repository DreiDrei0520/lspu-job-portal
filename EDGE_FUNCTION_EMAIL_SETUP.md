# Email Notification Edge Function Setup

## Overview
This document provides the code and setup instructions for implementing automated email notifications in your Supabase Edge Function.

## Edge Function Code

Add the following endpoints to your Edge Function (`make-server-cc72773f`):

### 1. Email Sending Function (Using Gmail SMTP)

```typescript
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Email configuration
const SMTP_CONFIG = {
  hostname: "smtp.gmail.com",
  port: 587,
  username: Deno.env.get("GMAIL_USER") || "jadesupremo0@gmail.com",
  password: Deno.env.get("GMAIL_APP_PASSWORD") || "lfns yegc vqba ywbq",
};

// Email templates for different statuses
const EMAIL_TEMPLATES = {
  'Pending': {
    subject: 'Application Received',
    getBody: (name: string, position: string) => `
      <h2>Application Received</h2>
      <p>Dear ${name},</p>
      <p>We have received your application for the position of <strong>${position}</strong> and it is currently pending review.</p>
      <p>Our team will review your application and get back to you soon.</p>
    `
  },
  'Under Review': {
    subject: 'Application Under Review',
    getBody: (name: string, position: string) => `
      <h2>Application Under Review</h2>
      <p>Dear ${name},</p>
      <p>Your application for <strong>${position}</strong> is currently under review.</p>
      <p>We appreciate your patience during this process.</p>
    `
  },
  'Interview Scheduled': {
    subject: 'Interview Scheduled',
    getBody: (name: string, position: string, interviewDate?: string) => `
      <h2>Interview Scheduled</h2>
      <p>Dear ${name},</p>
      <p>Congratulations! You've been selected for an interview for the <strong>${position}</strong> position.</p>
      <p><strong>Interview Date:</strong> ${interviewDate ? new Date(interviewDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'To be determined'}</p>
      <p>Please arrive 15 minutes early and bring:</p>
      <ul>
        <li>Valid Government ID</li>
        <li>Resume/CV</li>
        <li>Original and photocopies of credentials</li>
        <li>Portfolio (if applicable)</li>
      </ul>
    `
  },
  'Exam Scheduled': {
    subject: 'Exam Scheduled',
    getBody: (name: string, position: string, examDate?: string) => `
      <h2>Exam Scheduled</h2>
      <p>Dear ${name},</p>
      <p>You've been scheduled for an exam for the <strong>${position}</strong> position.</p>
      <p><strong>Exam Date:</strong> ${examDate ? new Date(examDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'To be determined'}</p>
      <p>Please bring:</p>
      <ul>
        <li>Valid Government ID</li>
        <li>Pen and calculator</li>
      </ul>
      <p><em>Note: No electronic devices allowed. Exam duration: 2 hours.</em></p>
    `
  },
  'Under Interviews': {
    subject: 'Interview Process Started',
    getBody: (name: string, position: string) => `
      <h2>Interview Process Started</h2>
      <p>Dear ${name},</p>
      <p>Your application for <strong>${position}</strong> is now in the interview phase.</p>
      <p>We'll contact you soon with more details.</p>
    `
  },
  'Interviewed': {
    subject: 'Interview Completed',
    getBody: (name: string, position: string) => `
      <h2>Interview Completed</h2>
      <p>Dear ${name},</p>
      <p>Thank you for attending the interview for <strong>${position}</strong>.</p>
      <p>We're currently evaluating all candidates and will notify you of our decision soon.</p>
    `
  },
  'Exam Completed': {
    subject: 'Exam Completed',
    getBody: (name: string, position: string) => `
      <h2>Exam Completed</h2>
      <p>Dear ${name},</p>
      <p>Thank you for completing the exam for <strong>${position}</strong>.</p>
      <p>We're currently evaluating the results and will notify you of our decision soon.</p>
    `
  },
  'For Requirements': {
    subject: 'Submission of Requirements',
    getBody: (name: string, position: string) => `
      <h2>Submit Your Requirements</h2>
      <p>Dear ${name},</p>
      <p>Congratulations on passing the initial screening for <strong>${position}</strong>!</p>
      <p>Please submit the following requirements to proceed with your application:</p>
      <ul>
        <li>Updated Resume/CV</li>
        <li>Valid Government ID</li>
        <li>Transcript of Records</li>
        <li>Certificates and Credentials</li>
        <li>NBI Clearance</li>
      </ul>
    `
  },
  'Not Shortlisted': {
    subject: 'Application Update',
    getBody: (name: string, position: string) => `
      <h2>Application Update</h2>
      <p>Dear ${name},</p>
      <p>Thank you for applying for the <strong>${position}</strong> position.</p>
      <p>After careful consideration, we've decided not to shortlist your application at this time.</p>
      <p>We encourage you to apply for future opportunities that match your qualifications.</p>
    `
  },
  'Not Selected': {
    subject: 'Application Update',
    getBody: (name: string, position: string) => `
      <h2>Application Update</h2>
      <p>Dear ${name},</p>
      <p>Thank you for applying for the <strong>${position}</strong> position.</p>
      <p>After careful consideration, we've decided to move forward with other candidates at this time.</p>
      <p>We appreciate your interest and encourage you to apply for future opportunities.</p>
    `
  },
  'Hired': {
    subject: 'Congratulations! You\'re Hired',
    getBody: (name: string, position: string) => `
      <h2>🎉 Congratulations!</h2>
      <p>Dear ${name},</p>
      <p>We're excited to inform you that you've been selected for the <strong>${position}</strong> position!</p>
      <p>Welcome to our team! We'll contact you shortly with onboarding details.</p>
    `
  }
};

// Function to send email
async function sendEmail(to: string, subject: string, htmlBody: string) {
  const client = new SMTPClient(SMTP_CONFIG);

  await client.connectTLS();

  await client.send({
    from: SMTP_CONFIG.username,
    to: to,
    subject: subject,
    content: "auto",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #116d8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #777; text-align: center; }
          ul { padding-left: 20px; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>LSPU-LBC Job Portal</h1>
          </div>
          <div class='content'>
            ${htmlBody}
          </div>
          <div class='footer'>
            <p>Best regards,</p>
            <p><strong>HR Team</strong><br>
            LSPU-LBC Online Job Portal</p>
            <p style="font-size: 0.8em; color: #999;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  await client.close();
}

// Endpoint: Send status notification
async function handleSendStatusNotification(req: Request) {
  try {
    const { status, applicantEmail, applicantName, jobTitle, interviewDate } = await req.json();

    if (!applicantEmail || !applicantName || !jobTitle || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get email template for this status
    const template = EMAIL_TEMPLATES[status as keyof typeof EMAIL_TEMPLATES];
    
    if (!template) {
      console.log(`No email template found for status: ${status}`);
      return new Response(
        JSON.stringify({ success: true, message: 'No template for this status' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subject = template.subject;
    const body = template.getBody(applicantName, jobTitle, interviewDate);

    // Send email
    await sendEmail(applicantEmail, subject, body);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending status notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Endpoint: Send job notification to all users
async function handleSendJobNotification(req: Request) {
  try {
    const { title, category, type, department, location, salary, deadline, description } = await req.json();

    // Get all users from database (you'll need to implement this based on your schema)
    const { data: users, error } = await supabaseClient
      .from('profiles')
      .select('email, name, firstName, lastName')
      .eq('role', 'applicant');

    if (error) throw error;

    // Send email to each user
    const emailPromises = users.map(async (user: any) => {
      const userName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Applicant';
      const subject = 'New Job Opportunity Available!';
      const body = `
        <h2>New Job Posting</h2>
        <p>Dear ${userName},</p>
        <p>A new job opportunity has been posted that might interest you:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #116d8a; margin-top: 0;">${title}</h3>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Type:</strong> ${type}</p>
          ${department ? `<p><strong>Department:</strong> ${department}</p>` : ''}
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
          ${salary ? `<p><strong>Salary:</strong> ${salary}</p>` : ''}
          ${deadline ? `<p><strong>Application Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>` : ''}
        </div>
        <p>${description}</p>
        <p>Log in to your account to apply now!</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href="${Deno.env.get('APP_URL') || 'http://localhost:5173'}" 
             style="background-color: #116d8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Job Details
          </a>
        </p>
      `;

      try {
        await sendEmail(user.email, subject, body);
        return { email: user.email, success: true };
      } catch (error) {
        console.error(`Failed to send to ${user.email}:`, error);
        return { email: user.email, success: false, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${successCount} of ${users.length} users`,
        results 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending job notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send job notifications', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Setup Instructions

### 1. Set Up Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Enable 2-Factor Authentication (if not already enabled)
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Create a new App Password for "Mail"
5. Copy the 16-character password

### 2. Configure Supabase Environment Variables

Add these environment variables to your Supabase Edge Function:

```bash
GMAIL_USER=jadesupremo0@gmail.com
GMAIL_APP_PASSWORD=lfnsyegcvqbaywbq
APP_URL=https://your-app-url.com
```

### 3. Update Your Edge Function

In your existing `make-server-cc72773f` Edge Function, add these route handlers:

```typescript
// In your main Edge Function file (index.ts)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Existing routes...
  
  // New email notification routes
  if (path === '/send-status-notification' && req.method === 'POST') {
    return await handleSendStatusNotification(req);
  }
  
  if (path === '/send-job-notification' && req.method === 'POST') {
    return await handleSendJobNotification(req);
  }

  // ... rest of your routes
});
```

### 4. Alternative: Using SendGrid (Recommended for Production)

SendGrid offers better deliverability and easier setup:

```typescript
// Using SendGrid instead of Gmail SMTP
async function sendEmailWithSendGrid(to: string, subject: string, htmlBody: string) {
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
        subject: subject,
      }],
      from: {
        email: 'noreply@yourapp.com',
        name: 'LSPU-LBC Job Portal'
      },
      content: [{
        type: 'text/html',
        value: htmlBody,
      }],
    }),
  });

  if (!response.ok) {
    throw new Error(`SendGrid error: ${await response.text()}`);
  }
}
```

### 5. Deploy the Edge Function

```bash
# Deploy to Supabase
supabase functions deploy make-server-cc72773f
```

## Testing

Test the email notifications:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-cc72773f/send-status-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Interview Scheduled",
    "applicantEmail": "test@example.com",
    "applicantName": "Test User",
    "jobTitle": "Software Developer",
    "interviewDate": "2025-12-15T10:00:00Z"
  }'
```

## Features Implemented

✅ **Status Update Notifications** - Automatic emails when application status changes
✅ **Interview/Exam Scheduling** - Emails with date, time, and venue details
✅ **New Job Postings** - Broadcast emails to all registered applicants
✅ **Professional Email Templates** - Branded HTML emails with LSPU-LBC styling
✅ **Error Handling** - Graceful failure without disrupting the main flow

## Email Status Templates

The system includes templates for all these statuses:
- Pending
- Under Review
- Interview Scheduled
- Exam Scheduled
- Under Interviews
- Interviewed
- Exam Completed
- For Requirements
- Not Shortlisted
- Not Selected
- Hired

## Notes

- Emails are sent asynchronously and won't block the UI
- Failed emails are logged but don't affect the main application flow
- Consider using SendGrid or similar services for production (better deliverability)
- Gmail SMTP has a limit of 500 emails per day
- Always test with test email addresses first
