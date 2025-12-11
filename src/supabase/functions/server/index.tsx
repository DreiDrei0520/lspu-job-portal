import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { get, set, del, getByPrefix, mset, mdel } from './kv_store.tsx'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Email sending function using Gmail SMTP
async function sendEmail(to: string, subject: string, htmlBody: string) {
  console.log('\n╔════════════════════════════════════════╗')
  console.log('║   ATTEMPTING TO SEND EMAIL             ║')
  console.log('╚════════════════════════════════════════╝')
  console.log('To:', to)
  console.log('Subject:', subject)
  
  try {
    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD')

    console.log('\n=== ENVIRONMENT VARIABLES CHECK ===')
    console.log('GMAIL_USER exists:', !!gmailUser)
    console.log('GMAIL_USER value:', gmailUser || '❌ NOT SET - GO TO SUPABASE DASHBOARD!')
    console.log('GMAIL_APP_PASSWORD exists:', !!gmailAppPassword)
    console.log('GMAIL_APP_PASSWORD length:', gmailAppPassword ? gmailAppPassword.length : '❌ NOT SET - GO TO SUPABASE DASHBOARD!')

    if (!gmailUser || !gmailAppPassword) {
      console.error('\n❌❌❌ CRITICAL ERROR ❌❌❌')
      console.error('Gmail credentials are NOT CONFIGURED in Supabase!')
      console.error('GMAIL_USER:', gmailUser ? '✅ SET' : '❌ MISSING - ADD IT NOW!')
      console.error('GMAIL_APP_PASSWORD:', gmailAppPassword ? '✅ SET' : '❌ MISSING - ADD IT NOW!')
      console.error('\n📍 ACTION REQUIRED:')
      console.error('1. Go to: https://supabase.com/dashboard')
      console.error('2. Select your project')
      console.error('3. Settings → Secrets')
      console.error('4. Add: GMAIL_USER = jadesupremo0@gmail.com')
      console.error('5. Add: GMAIL_APP_PASSWORD = lfnsyegcvqbaywbq')
      console.error('6. Save and wait 30 seconds')
      console.error('7. Try again\n')
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(gmailUser)) {
      console.error('❌ GMAIL_USER is not a valid email:', gmailUser)
      return false
    }

    // Clean and validate credentials
    const cleanUsername = gmailUser.trim()
    const cleanPassword = gmailAppPassword.trim().replace(/\s/g, '') // Remove all spaces
    
    console.log('\n=== CREDENTIALS VALIDATION ===')
    console.log('✅ GMAIL_USER is valid email')
    console.log('✅ Cleaned username:', cleanUsername)
    console.log('✅ Cleaned password length:', cleanPassword.length)
    console.log('Expected password length: 16')
    
    if (cleanPassword.length !== 16) {
      console.error('❌ WARNING: Gmail app password should be 16 characters!')
      console.error('Current length:', cleanPassword.length)
      console.error('This might cause authentication to fail.')
    }

    console.log('\n=== SMTP CONNECTION ===')
    console.log('Connecting to: smtp.gmail.com:465')
    console.log('Using TLS: true')
    console.log('Username:', cleanUsername)

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: cleanUsername,
          password: cleanPassword,
        },
      },
    })

    console.log('\n=== SENDING EMAIL ===')
    console.log('From Name: LSPU-LBC Job Portal')
    console.log('From Email:', cleanUsername)
    console.log('To:', to)
    console.log('Subject:', subject)

    await client.send({
      from: cleanUsername, // Try simple format first
      to: to,
      subject: subject,
      content: 'auto',
      html: htmlBody,
    })

    await client.close()
    
    console.log('\n✅✅✅ SUCCESS! ✅✅✅')
    console.log(`Email sent successfully to ${to}`)
    console.log('Check the recipient\'s inbox!\n')
    return true
  } catch (error) {
    console.error('\n❌❌❌ EMAIL SENDING FAILED ❌❌❌')
    console.error('Error:', error)
    console.error('Error message:', error.message)
    console.error('Error name:', error.name)
    
    if (error.message?.includes('535')) {
      console.error('\n🔍 DIAGNOSIS: Gmail authentication failed')
      console.error('Possible causes:')
      console.error('1. ❌ GMAIL_USER or GMAIL_APP_PASSWORD not set in Supabase')
      console.error('2. ❌ Wrong email address')
      console.error('3. ❌ Wrong app password')
      console.error('4. ❌ App password has been revoked')
      console.error('5. ❌ 2FA not enabled on Gmail account')
      console.error('\n📍 SOLUTION:')
      console.error('1. Verify GMAIL_USER = jadesupremo0@gmail.com')
      console.error('2. Verify GMAIL_APP_PASSWORD = lfnsyegcvqbaywbq')
      console.error('3. Check both are set in Supabase Secrets')
      console.error('4. Regenerate app password if needed')
    } else if (error.message?.includes('email') || error.message?.includes('adress')) {
      console.error('\n🔍 DIAGNOSIS: Email format issue')
      console.error('The from address validation failed')
      console.error('This usually means GMAIL_USER environment variable is not set')
    }
    
    console.error('\n')
    return false
  }
}

// Create storage bucket for documents
async function initializeBuckets() {
  const bucketName = 'make-cc72773f-documents'
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log('Creating bucket:', bucketName)
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB (increased from 10MB)
        allowedMimeTypes: [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml'
        ]
      })
      if (error) {
        console.error('Error creating bucket:', error)
      } else {
        console.log('Bucket created successfully:', bucketName)
      }
    } else {
      console.log('Bucket already exists:', bucketName)
      // Update bucket configuration if it exists
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml'
        ]
      })
      if (updateError) {
        console.error('Error updating bucket:', updateError)
      } else {
        console.log('Bucket updated successfully:', bucketName)
      }
    }
  } catch (error) {
    console.error('Bucket initialization error:', error)
  }
}

initializeBuckets()

// Check if email exists
app.post('/make-server-cc72773f/check-email', async (c) => {
  try {
    const body = await c.req.json()
    const email = body.email?.toLowerCase().trim()

    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    // Check in auth users
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error checking email in auth:', error)
      return c.json({ exists: false })
    }

    const emailExists = users.some(user => user.email?.toLowerCase() === email)
    
    return c.json({ exists: emailExists })
  } catch (error) {
    console.error('Email check error:', error)
    return c.json({ error: 'Failed to check email', exists: false }, 500)
  }
})

// Update user email (with admin privileges - no email confirmation required)
app.post('/make-server-cc72773f/update-email', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    // Verify the user's token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const newEmail = body.newEmail?.toLowerCase().trim()
    const currentPassword = body.currentPassword

    if (!newEmail || !currentPassword) {
      return c.json({ error: 'New email and current password are required' }, 400)
    }

    // Verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError) {
      console.error('Password verification failed:', signInError)
      return c.json({ error: 'Current password is incorrect' }, 401)
    }

    // Check if new email already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error checking email:', listError)
      return c.json({ error: 'Failed to verify email availability' }, 500)
    }

    const emailExists = users.some(u => u.email?.toLowerCase() === newEmail && u.id !== user.id)
    
    if (emailExists) {
      return c.json({ error: 'Email address already registered' }, 400)
    }

    // Update the email using admin API (bypasses email confirmation)
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        email: newEmail,
        email_confirm: true // Auto-confirm the new email
      }
    )

    if (updateError) {
      console.error('Email update error:', updateError)
      return c.json({ error: updateError.message || 'Failed to update email' }, 500)
    }

    console.log('Email updated successfully for user:', user.id)
    
    return c.json({ 
      success: true, 
      message: 'Email updated successfully',
      newEmail: newEmail
    })
  } catch (error) {
    console.error('Update email error:', error)
    return c.json({ error: 'Failed to update email' }, 500)
  }
})

// User Signup
app.post('/make-server-cc72773f/signup', async (c) => {
  try {
    const body = await c.req.json()
    const email = body.email
    const password = body.password
    const name = body.name
    const role = body.role
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    if (!['applicant', 'admin', 'superadmin'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400)
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // Auto-confirm since email server isn't configured
    })

    if (error) {
      console.error('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Store additional user data in KV store
    const userId = data.user.id
    const userKey = `user:${userId}`
    const userData = {
      id: userId,
      email,
      name,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    await set(userKey, userData)

    return c.json({ success: true, user: data.user })
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get current user profile
app.get('/make-server-cc72773f/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const profile = await get(userKey)
    
    return c.json({ profile: profile || authData.user.user_metadata })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update user profile
app.put('/make-server-cc72773f/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const updates = await c.req.json()
    const currentProfile = await get(userKey)
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: userId,
      updatedAt: new Date().toISOString()
    }

    await set(userKey, updatedProfile)

    return c.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Create job posting (Admin only)
app.post('/make-server-cc72773f/jobs', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile || !['admin', 'superadmin'].includes(userProfile.role)) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403)
    }

    const jobData = await c.req.json()
    const jobId = `job:${Date.now()}`

    const job = {
      id: jobId,
      ...jobData,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    await set(jobId, job)

    return c.json({ success: true, job })
  } catch (error) {
    console.error('Job creation error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get all jobs
app.get('/make-server-cc72773f/jobs', async (c) => {
  try {
    const allJobs = await getByPrefix('job:')
    const activeJobs = allJobs.filter((job: any) => job.status === 'active')
    return c.json({ jobs: activeJobs })
  } catch (error) {
    console.error('Jobs fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get single job
app.get('/make-server-cc72773f/jobs/:id', async (c) => {
  try {
    const jobId = c.req.param('id')
    const job = await get(jobId)
    
    if (!job) {
      return c.json({ error: 'Job not found' }, 404)
    }

    return c.json({ job })
  } catch (error) {
    console.error('Job fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update job (Admin only)
app.put('/make-server-cc72773f/jobs/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile || !['admin', 'superadmin'].includes(userProfile.role)) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403)
    }

    const jobId = c.req.param('id')
    const updates = await c.req.json()
    const currentJob = await get(jobId)

    if (!currentJob) {
      return c.json({ error: 'Job not found' }, 404)
    }

    const updatedJob = {
      ...currentJob,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await set(jobId, updatedJob)

    return c.json({ success: true, job: updatedJob })
  } catch (error) {
    console.error('Job update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete job (Admin only)
app.delete('/make-server-cc72773f/jobs/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile || !['admin', 'superadmin'].includes(userProfile.role)) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403)
    }

    const jobId = c.req.param('id')
    await del(jobId)

    return c.json({ success: true })
  } catch (error) {
    console.error('Job deletion error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Submit application
app.post('/make-server-cc72773f/applications', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const applicationData = await c.req.json()
    const applicationId = `application:${Date.now()}`

    const application = {
      id: applicationId,
      ...applicationData,
      applicantId: userId,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    await set(applicationId, application)

    // Create notification for admins
    const notificationId = `notification:${Date.now()}`
    const notificationData = {
      id: notificationId,
      type: 'new_application',
      applicationId,
      message: `New application received for job: ${applicationData.jobTitle}`,
      createdAt: new Date().toISOString(),
      read: false
    }
    await set(notificationId, notificationData)

    return c.json({ success: true, application })
  } catch (error) {
    console.error('Application submission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get user's applications
app.get('/make-server-cc72773f/applications/my', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const allApplications = await getByPrefix('application:')
    const userApplications = allApplications.filter((app: any) => app.applicantId === userId)

    return c.json({ applications: userApplications })
  } catch (error) {
    console.error('Applications fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get all applications (Admin only)
app.get('/make-server-cc72773f/applications', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile || !['admin', 'superadmin'].includes(userProfile.role)) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403)
    }

    const applications = await getByPrefix('application:')

    // Fetch profile pictures for each applicant
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app: any) => {
        if (app.applicantId) {
          const applicantProfile = await get(`user:${app.applicantId}`)
          if (applicantProfile?.profilePictureUrl) {
            return {
              ...app,
              profilePictureUrl: applicantProfile.profilePictureUrl
            }
          }
        }
        return app
      })
    )

    return c.json({ applications: applicationsWithProfiles })
  } catch (error) {
    console.error('Applications fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update application status (Admin only)
app.put('/make-server-cc72773f/applications/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile || !['admin', 'superadmin'].includes(userProfile.role)) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403)
    }

    const applicationId = c.req.param('id')
    const updates = await c.req.json()
    const currentApplication = await get(applicationId)

    if (!currentApplication) {
      return c.json({ error: 'Application not found' }, 404)
    }

    const updatedApplication = {
      ...currentApplication,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await set(applicationId, updatedApplication)

    // Create notification for applicant
    if (updates.status) {
      const notificationId = `notification:${Date.now()}`
      const notificationData = {
        id: notificationId,
        type: 'status_update',
        userId: currentApplication.applicantId,
        applicationId,
        message: `Your application status has been updated to: ${updates.status}`,
        createdAt: new Date().toISOString(),
        read: false
      }
      await set(notificationId, notificationData)
    }

    return c.json({ success: true, application: updatedApplication })
  } catch (error) {
    console.error('Application update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Submit evaluation (Admin only)
app.post('/make-server-cc72773f/evaluations', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile || !['admin', 'superadmin'].includes(userProfile.role)) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403)
    }

    const evaluationData = await c.req.json()
    const applicationId = evaluationData.applicationId

    // Check if evaluation already exists for this application
    const allEvaluations = await getByPrefix('evaluation:')
    const existingEvaluation = allEvaluations.find((evalItem: any) => evalItem.applicationId === applicationId)

    let evaluation
    let evaluationId

    if (existingEvaluation) {
      // Update existing evaluation
      evaluationId = existingEvaluation.id
      evaluation = {
        ...existingEvaluation,
        ...evaluationData,
        id: evaluationId,
        evaluatedBy: userId,
        updatedAt: new Date().toISOString(),
        createdAt: existingEvaluation.createdAt // Preserve original creation date
      }
      console.log('Updating existing evaluation:', evaluationId)
    } else {
      // Create new evaluation
      evaluationId = `evaluation:${Date.now()}`
      evaluation = {
        id: evaluationId,
        ...evaluationData,
        evaluatedBy: userId,
        createdAt: new Date().toISOString()
      }
      console.log('Creating new evaluation:', evaluationId)
    }

    await set(evaluationId, evaluation)

    return c.json({ success: true, evaluation })
  } catch (error) {
    console.error('Evaluation submission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get evaluations for an application
app.get('/make-server-cc72773f/evaluations/:applicationId', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const applicationId = c.req.param('applicationId')
    const allEvaluations = await getByPrefix('evaluation:')
    const evaluations = allEvaluations.filter((evalItem: any) => evalItem.applicationId === applicationId)

    return c.json({ evaluations })
  } catch (error) {
    console.error('Evaluations fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Upload document
app.post('/make-server-cc72773f/upload', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      console.error('Upload auth error:', error)
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('type') as string

    if (!file) {
      console.error('No file in formData')
      return c.json({ error: 'No file provided' }, 400)
    }

    console.log('Uploading file:', file.name, 'Type:', documentType, 'Size:', file.size, 'MIME:', file.type)

    // Validate file type - support both documents and images
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ]

    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return c.json({ error: `Upload failed: mime type ${file.type} is not supported` }, 400)
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return c.json({ error: 'File size exceeds 50MB limit' }, 400)
    }

    // Convert file to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${userId}/${documentType}_${Date.now()}_${file.name}`
    const bucketName = 'make-cc72773f-documents'

    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500)
    }

    console.log('Upload successful:', fileName)

    // Create signed URL valid for 1 year
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000)

    if (urlError) {
      console.error('Signed URL error:', urlError)
      return c.json({ error: 'Failed to create signed URL' }, 500)
    }

    return c.json({ 
      success: true, 
      path: fileName,
      url: urlData?.signedUrl 
    })
  } catch (error) {
    console.error('Upload exception:', error)
    return c.json({ error: `Internal server error: ${error.message || error}` }, 500)
  }
})

// Download document
app.get('/make-server-cc72773f/download/:fileId', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    
    console.log('Download request received')
    console.log('Auth header present:', !!authHeader)
    console.log('Access token present:', !!accessToken)

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)

    if (authError || !authData.user) {
      console.error('Authentication failed:', authError)
      return c.json({ error: 'Unauthorized' }, 401)
    }

    console.log('User authenticated:', authData.user.id)

    const fileId = decodeURIComponent(c.req.param('fileId'))
    const bucketName = 'make-cc72773f-documents'

    console.log('Downloading file from bucket:', bucketName)
    console.log('File ID:', fileId)

    // Validate fileId
    if (!fileId || fileId === 'undefined' || fileId === 'null' || fileId.trim() === '') {
      console.error('Invalid file ID provided:', fileId)
      return c.json({ error: 'Download not available. Document path is missing or invalid.' }, 400)
    }

    // Get file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(fileId)

    if (downloadError) {
      console.error('Storage download error:', downloadError)
      return c.json({ error: `File not found: ${downloadError.message}` }, 404)
    }

    console.log('File downloaded successfully, size:', fileData.size)

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    console.log('Buffer created, size:', buffer.length)

    // Determine content type from file extension
    const ext = fileId.split('.').pop()?.toLowerCase()
    const contentTypes: any = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xls': 'application/vnd.ms-excel'
    }
    const contentType = contentTypes[ext || ''] || 'application/octet-stream'

    console.log('Content type:', contentType)
    console.log('Sending file...')

    // Extract filename from path (last part after /)
    const filename = fileId.split('/').pop() || fileId

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      }
    })
  } catch (error: any) {
    console.error('Download exception:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return c.json({ error: `Internal server error: ${error.message}` }, 500)
  }
})

// Get user notifications
app.get('/make-server-cc72773f/notifications', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    const allNotifications = await getByPrefix('notification:')
    
    let notifications
    if (userProfile && ['admin', 'superadmin'].includes(userProfile.role)) {
      // Admins see all notifications
      notifications = allNotifications
    } else {
      // Applicants see only their notifications
      notifications = allNotifications.filter((notif: any) => notif.userId === userId)
    }

    const sortedNotifications = notifications.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return c.json({ notifications: sortedNotifications })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Mark notification as read
app.put('/make-server-cc72773f/notifications/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    const { data: authData, error } = await supabase.auth.getUser(accessToken)

    if (error || !authData.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notificationId = c.req.param('id')
    const notification = await get(notificationId)

    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404)
    }

    await set(notificationId, {
      ...notification,
      read: true
    })

    return c.json({ success: true })
  } catch (error) {
    console.error('Notification update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Send password reset code (PUBLIC - no auth required)
app.post('/make-server-cc72773f/forgot-password/send-code', async (c) => {
  try {
    console.log('=== Password Reset Code Request ===')
    
    const body = await c.req.json()
    console.log('Request body:', body)
    
    const { email } = body

    if (!email) {
      console.log('No email provided')
      return c.json({ error: 'Email is required' }, 400)
    }

    console.log('Password reset requested for:', email)

    // Check if user exists in our KV store
    const allUsers = await getByPrefix('user:')
    const userExists = allUsers.find((u: any) => u.email === email)
    
    if (!userExists) {
      // Don't reveal that user doesn't exist for security
      console.log('User not found, but returning success for security')
      return c.json({ 
        success: true, 
        message: 'If the email exists, a verification code has been sent',
        devCode: '000000' // Dummy code for non-existent users in dev
      })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    console.log('Generated reset code:', code, 'for email:', email)

    // Store code in KV
    const resetKey = `password_reset:${email}`
    await set(resetKey, {
      code,
      email,
      expiresAt,
      createdAt: new Date().toISOString()
    })

    console.log('Reset code stored successfully in KV')

    // Send email with verification code
    const emailSubject = 'LSPU-LBC Job Portal - Password Reset Code'
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0d5468 0%, #116d8a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .code-box { background: white; border: 2px solid #116d8a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0d5468; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>LSPU-LBC Online Job Portal</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password for the LSPU-LBC Online Job Portal.</p>
            <p>Please use the following verification code to complete the password reset process:</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This code will expire in <strong>15 minutes</strong>.
            </div>
            
            <p><strong>Security Tips:</strong></p>
            <ul>
              <li>Never share this code with anyone</li>
              <li>LSPU-LBC staff will never ask for this code</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
            
            <p>If you have any questions or concerns, please contact the LSPU-LBC IT Department.</p>
            
            <p>Best regards,<br><strong>LSPU-LBC HR Department</strong></p>
          </div>
          <div class="footer">
            <p>Laguna State Polytechnic University - Los Baños Campus</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email
    const emailSent = await sendEmail(email, emailSubject, emailHtml)

    if (emailSent) {
      console.log('✅ Password reset email sent successfully to:', email)
    } else {
      console.log('⚠️ Email sending failed, but code is stored. Code:', code)
    }

    // Log to console for development/debugging
    console.log('═══════════════════════════════════════════')
    console.log('PASSWORD RESET CODE')
    console.log('═══════════════════════════════════════════')
    console.log('Email:', email)
    console.log('Code:', code)
    console.log('Email Sent:', emailSent ? 'YES ✅' : 'NO ❌')
    console.log('Expires:', new Date(expiresAt).toLocaleString())
    console.log('═══════════════════════════════════════════')

    return c.json({ 
      success: true, 
      message: emailSent 
        ? 'Verification code sent to your email' 
        : 'Reset code generated (email not configured)',
      emailSent,
      // Include code in response for development ONLY (remove in production)
      devCode: emailSent ? undefined : code
    })
  } catch (error: any) {
    console.error('Send reset code error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// Verify reset code
app.post('/make-server-cc72773f/forgot-password/verify-code', async (c) => {
  try {
    console.log('=== VERIFY RESET CODE ENDPOINT ===')
    
    const body = await c.req.json()
    console.log('Request body:', body)
    
    const { email, code } = body

    if (!email || !code) {
      console.log('Missing email or code')
      return c.json({ error: 'Email and code are required' }, 400)
    }

    console.log('Email:', email)
    console.log('Code received:', code)
    console.log('Code type:', typeof code)
    console.log('Code length:', code.length)

    const resetKey = `password_reset:${email}`
    console.log('Looking up key:', resetKey)
    
    const resetData = await get(resetKey)
    console.log('Reset data from KV:', JSON.stringify(resetData, null, 2))

    if (!resetData) {
      console.log('❌ No reset data found for email:', email)
      
      // Debug: List all password reset keys
      const allResetKeys = await getByPrefix('password_reset:')
      console.log('All password reset keys in KV:', allResetKeys.map((r: any) => ({ email: r.email, code: r.code })))
      
      return c.json({ error: 'Invalid or expired verification code' }, 400)
    }

    console.log('Stored code:', resetData.code)
    console.log('Stored code type:', typeof resetData.code)
    console.log('Received code:', code)
    console.log('Codes match:', resetData.code === code)
    console.log('Strict equality:', resetData.code === code)
    console.log('Loose equality:', resetData.code == code)

    // Check if code matches (try both string comparison and trimmed comparison)
    const storedCode = String(resetData.code).trim()
    const receivedCode = String(code).trim()
    
    console.log('Trimmed stored code:', storedCode)
    console.log('Trimmed received code:', receivedCode)
    console.log('Trimmed codes match:', storedCode === receivedCode)

    if (storedCode !== receivedCode) {
      console.log('❌ Code mismatch!')
      console.log('Expected:', storedCode)
      console.log('Got:', receivedCode)
      return c.json({ error: 'Invalid verification code' }, 400)
    }

    // Check if expired
    const expiresAt = new Date(resetData.expiresAt)
    const now = new Date()
    console.log('Expires at:', expiresAt.toISOString())
    console.log('Current time:', now.toISOString())
    console.log('Is expired:', expiresAt < now)
    
    if (expiresAt < now) {
      console.log('❌ Code has expired')
      await del(resetKey)
      return c.json({ error: 'Verification code has expired' }, 400)
    }

    console.log('✅ Code verified successfully')
    return c.json({ success: true, message: 'Code verified successfully' })
  } catch (error: any) {
    console.error('❌ Verify code error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// Reset password
app.post('/make-server-cc72773f/forgot-password/reset-password', async (c) => {
  try {
    console.log('=== RESET PASSWORD ENDPOINT ===')
    
    const body = await c.req.json()
    const { email, code, newPassword } = body

    console.log('Email:', email)
    console.log('Code:', code)
    console.log('New password length:', newPassword?.length)

    if (!email || !code || !newPassword) {
      return c.json({ error: 'Email, code, and new password are required' }, 400)
    }

    if (newPassword.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400)
    }

    console.log('Resetting password for:', email)

    const resetKey = `password_reset:${email}`
    const resetData = await get(resetKey)

    console.log('Reset data:', resetData)

    if (!resetData) {
      console.log('❌ No reset data found')
      return c.json({ error: 'Invalid or expired verification code' }, 400)
    }

    // Verify code again
    const storedCode = String(resetData.code).trim()
    const receivedCode = String(code).trim()
    
    if (storedCode !== receivedCode) {
      console.log('❌ Code verification failed')
      console.log('Expected:', storedCode)
      console.log('Got:', receivedCode)
      return c.json({ error: 'Invalid verification code' }, 400)
    }

    // Check if expired
    if (new Date(resetData.expiresAt) < new Date()) {
      console.log('❌ Code has expired')
      await del(resetKey)
      return c.json({ error: 'Verification code has expired' }, 400)
    }

    console.log('✅ Code verified, proceeding with password update')

    // Get user from KV store to find their ID
    const allUsers = await getByPrefix('user:')
    console.log('Total users in KV:', allUsers.length)
    
    const user = allUsers.find((u: any) => u.email === email)
    
    if (!user || !user.id) {
      console.error('❌ User not found in KV store:', email)
      console.log('Available emails:', allUsers.map((u: any) => u.email))
      return c.json({ error: 'User not found' }, 404)
    }

    console.log('✅ Found user in KV - ID:', user.id)

    // Update password using Supabase Admin API
    try {
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      )

      if (updateError) {
        console.error('❌ Supabase password update error:', updateError)
        console.error('Error code:', updateError.code)
        console.error('Error message:', updateError.message)
        console.error('Error status:', updateError.status)
        return c.json({ error: `Failed to update password: ${updateError.message}` }, 500)
      }

      console.log('✅ Supabase password update successful')
      console.log('Update response:', updateData)
    } catch (updateException: any) {
      console.error('❌ Exception during password update:', updateException)
      return c.json({ error: `Exception updating password: ${updateException.message}` }, 500)
    }

    // Delete reset code
    await del(resetKey)
    console.log('✅ Reset code deleted')

    console.log('✅✅✅ PASSWORD RESET COMPLETED SUCCESSFULLY ✅✅✅')
    return c.json({ success: true, message: 'Password reset successfully. You can now login with your new password.' })
  } catch (error: any) {
    console.error('❌ Reset password error:', error)
    console.error('Error stack:', error.stack)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// Get all users (Superadmin only) - with better route naming
app.get('/make-server-cc72773f/superadmin/users', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    
    if (!accessToken) {
      console.log('No access token provided')
      return c.json({ error: 'Unauthorized - No token provided' }, 401)
    }

    let authData
    try {
      const { data, error } = await supabase.auth.getUser(accessToken)
      if (error) {
        console.error('Auth error in superadmin/users:', error)
        return c.json({ error: 'Unauthorized - Invalid token' }, 401)
      }
      authData = data
    } catch (authError: any) {
      console.error('Exception during auth check:', authError)
      return c.json({ error: 'Authentication service error' }, 503)
    }

    if (!authData?.user) {
      return c.json({ error: 'Unauthorized - No user found' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile) {
      console.error('User profile not found in KV store for:', userId)
      return c.json({ error: 'User profile not found' }, 404)
    }
    
    if (userProfile.role !== 'superadmin') {
      console.log('Access denied - user role:', userProfile.role)
      return c.json({ error: 'Forbidden: Superadmin access required' }, 403)
    }

    const users = await getByPrefix('user:')

    return c.json({ users })
  } catch (error: any) {
    console.error('Superadmin users fetch error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// Delete user account (Superadmin only)
app.delete('/make-server-cc72773f/superadmin/users/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401)
    }

    let authData
    try {
      const { data, error } = await supabase.auth.getUser(accessToken)
      if (error) {
        console.error('Auth error in delete user:', error)
        return c.json({ error: 'Unauthorized - Invalid token' }, 401)
      }
      authData = data
    } catch (authError: any) {
      console.error('Exception during auth check:', authError)
      return c.json({ error: 'Authentication service error' }, 503)
    }

    if (!authData?.user) {
      return c.json({ error: 'Unauthorized - No user found' }, 401)
    }

    const currentUserId = authData.user.id
    const userKey = `user:${currentUserId}`
    const userProfile = await get(userKey)
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }
    
    if (userProfile.role !== 'superadmin') {
      return c.json({ error: 'Forbidden: Superadmin access required' }, 403)
    }

    const targetUserId = c.req.param('id')
    
    // Prevent superadmin from deleting themselves
    if (targetUserId === currentUserId) {
      return c.json({ error: 'Cannot delete your own account' }, 400)
    }

    // Delete from KV store
    const targetUserKey = `user:${targetUserId}`
    await del(targetUserKey)

    // Delete from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId)
    
    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError)
      // Continue anyway as KV deletion was successful
    }

    return c.json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('User deletion error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// Delete application (Superadmin only)
app.delete('/make-server-cc72773f/superadmin/applications/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const accessToken = authHeader?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401)
    }

    let authData
    try {
      const { data, error } = await supabase.auth.getUser(accessToken)
      if (error) {
        console.error('Auth error in delete application:', error)
        return c.json({ error: 'Unauthorized - Invalid token' }, 401)
      }
      authData = data
    } catch (authError: any) {
      console.error('Exception during auth check:', authError)
      return c.json({ error: 'Authentication service error' }, 503)
    }

    if (!authData?.user) {
      return c.json({ error: 'Unauthorized - No user found' }, 401)
    }

    const userId = authData.user.id
    const userKey = `user:${userId}`
    const userProfile = await get(userKey)
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }
    
    if (userProfile.role !== 'superadmin') {
      return c.json({ error: 'Forbidden: Superadmin access required' }, 403)
    }

    const applicationId = c.req.param('id')
    
    // Delete application from KV store
    await del(applicationId)

    // Also delete associated evaluation if exists
    const allEvaluations = await getByPrefix('evaluation:')
    const associatedEvaluation = allEvaluations.find((e: any) => e.applicationId === applicationId)
    
    if (associatedEvaluation) {
      await del(associatedEvaluation.id)
    }

    return c.json({ success: true, message: 'Application deleted successfully' })
  } catch (error: any) {
    console.error('Application deletion error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// Health check endpoint (public)
app.get('/make-server-cc72773f/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)