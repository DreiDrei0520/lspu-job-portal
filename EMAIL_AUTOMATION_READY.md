# LSPU-LBC Job Portal - Email Automation Setup

## ✅ Email System Ready

Your Gmail email automation system is now fully configured and ready to send automated notifications!

## 📧 Email Credentials Configured

- **Gmail Account:** jadesupremo0@gmail.com
- **App Password:** lfnsyegcvqbaywbq
- **SMTP Server:** smtp.gmail.com:587

## 🎯 Automated Email Features

### 1. Status Update Notifications
Automatically sends emails when application status changes:

- ✉️ **Pending** - Application received confirmation
- ✉️ **Applied** - Application submitted successfully  
- ✉️ **Under Review** - Currently being reviewed
- ✉️ **Interview Scheduled** - Interview details with date/time
- ✉️ **Exam Scheduled** - Exam details with date/time
- ✉️ **Under Interviews** - Interview process started
- ✉️ **Interviewed** - Thank you after interview
- ✉️ **Exam Completed** - Exam completion acknowledgment
- ✉️ **For Requirements** - List of required documents
- ✉️ **Not Shortlisted** - Application not proceeding
- ✉️ **Not Selected** - Not selected after interview
- ✉️ **Hired** - Congratulations! Welcome email

### 2. Interview/Exam Scheduling
When admin schedules an interview or exam:
- Sends formatted date and time
- Lists what to bring
- Important reminders
- Venue information

### 3. New Job Postings
When admin posts a new job:
- Emails ALL registered applicants
- Shows job title, category, salary, deadline
- Direct link to apply
- Job description

## 🚀 Quick Deployment Guide

### Option 1: Deploy to Supabase (Recommended)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (you'll need your project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy make-server-cc72773f

# Set environment variables
supabase secrets set GMAIL_USER=jadesupremo0@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=lfnsyegcvqbaywbq
supabase secrets set APP_URL=https://your-app-url.com
```

### Option 2: Test Locally First

```bash
# Start Supabase locally
supabase start

# Serve the function locally
supabase functions serve make-server-cc72773f --env-file .env.local

# Test the endpoint
curl -X POST http://localhost:54321/functions/v1/make-server-cc72773f/send-status-notification \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Pending",
    "applicantEmail": "test@example.com",
    "applicantName": "Test User",
    "jobTitle": "Software Developer"
  }'
```

## 📝 Create .env.local for Local Testing

Create a file named `.env.local` in the `supabase` folder:

```env
GMAIL_USER=jadesupremo0@gmail.com
GMAIL_APP_PASSWORD=lfnsyegcvqbaywbq
APP_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ✨ Features Included

### Professional Email Design
- LSPU-LBC branded header
- Clean, modern HTML layout
- Mobile-responsive design
- Color-coded status messages
- Professional footer with disclaimers

### Smart Email Logic
- ✅ Email validation
- ✅ Template selection by status
- ✅ Date formatting for schedules
- ✅ Error handling (won't break if email fails)
- ✅ Batch sending for job postings
- ✅ Console logging for debugging

### Integration Points
All email triggers are already integrated in AdminDashboard:
1. **Status Updates** → `handleUpdateApplicationStatus()`
2. **Job Creation** → `handleSubmitJob()` (only for new jobs)
3. **Scheduling** → `handleSubmitSchedule()`

## 🔧 Troubleshooting

### Gmail Blocks the Connection
- Make sure 2FA is enabled on your Google account
- Verify the app password is correct (no spaces)
- Check that "Less secure app access" is NOT needed (app passwords work with 2FA)

### Emails Not Sending
1. Check Supabase function logs:
   ```bash
   supabase functions logs make-server-cc72773f
   ```
2. Verify environment variables are set
3. Check that the email endpoint URL is correct in `api.ts`

### Test Individual Email

```javascript
// Test in browser console or use this curl command
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-cc72773f/send-status-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    status: 'Interview Scheduled',
    applicantEmail: 'your-test-email@gmail.com',
    applicantName: 'Test User',
    jobTitle: 'Test Position',
    interviewDate: new Date().toISOString()
  })
})
```

## 📊 What Happens When...

### Admin Updates Status to "Interview Scheduled"
1. Status saved to database ✓
2. Email notification triggered automatically
3. Email sent to applicant with interview details
4. Admin sees success toast
5. Applicant receives professional email with date/time/instructions

### Admin Posts New Job
1. Job saved to database ✓
2. System queries all applicant profiles
3. Sends email to EVERY registered applicant
4. Each email personalized with their name
5. Includes job details and apply link
6. Admin sees count of emails sent

### Admin Schedules Interview/Exam
1. Schedule saved to database ✓
2. Email sent with formatted date and time
3. Includes venue, what to bring, reminders
4. Professional formatting

## 🎉 You're All Set!

Your email automation system is **100% ready** to send professional Gmail notifications for:
- ✅ Status updates (12 different statuses)
- ✅ Interview scheduling with details
- ✅ Exam scheduling with instructions  
- ✅ New job posting broadcasts

**Next Step:** Deploy the Edge Function to Supabase and test with a real application!

---

**Created:** December 8, 2025  
**System:** LSPU-LBC Job Portal Automated Email Notifications  
**Email Provider:** Gmail SMTP (jadesupremo0@gmail.com)
