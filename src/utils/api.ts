import { projectId, publicAnonKey } from './supabase/info.tsx'
import { getAccessToken } from './supabase-client'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cc72773f`

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken()
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token || publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()
  
  if (!response.ok) {
    console.error(`API Error at ${endpoint}:`, data)
    throw new Error(data.error || 'API request failed')
  }

  return data
}

export const api = {
  // Email validation
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const data = await fetchAPI('/check-email', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })
      return data.exists || false
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  },

  // Update user email
  updateEmail: async (newEmail: string, currentPassword: string) => {
    return fetchAPI('/update-email', {
      method: 'POST',
      body: JSON.stringify({ newEmail, currentPassword }),
    })
  },

  // Auth
  signup: (email: string, password: string, name: string, role: string) =>
    fetchAPI('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    }),

  // Profile
  getProfile: () => fetchAPI('/profile'),
  updateProfile: (updates: any) =>
    fetchAPI('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Jobs
  getJobs: () => fetchAPI('/jobs'),
  getJob: (id: string) => fetchAPI(`/jobs/${id}`),
  createJob: (jobData: any) =>
    fetchAPI('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),
  updateJob: (id: string, updates: any) =>
    fetchAPI(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteJob: (id: string) =>
    fetchAPI(`/jobs/${id}`, {
      method: 'DELETE',
    }),

  // Applications
  submitApplication: (applicationData: any) =>
    fetchAPI('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),
  getMyApplications: () => fetchAPI('/applications/my'),
  getAllApplications: () => fetchAPI('/applications'),
  updateApplication: (id: string, updates: any) =>
    fetchAPI(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Evaluations
  submitEvaluation: (evaluationData: any) =>
    fetchAPI('/evaluations', {
      method: 'POST',
      body: JSON.stringify(evaluationData),
    }),
  getEvaluations: (applicationId: string) =>
    fetchAPI(`/evaluations/${applicationId}`),

  // Notifications
  getNotifications: () => fetchAPI('/notifications'),
  markNotificationRead: (id: string) =>
    fetchAPI(`/notifications/${id}`, {
      method: 'PUT',
    }),

  // Email Notifications
  sendStatusNotification: async (applicationId: string, status: string, applicantEmail: string, applicantName: string, jobTitle: string, interviewDate?: string) => {
    return fetchAPI('/send-status-notification', {
      method: 'POST',
      body: JSON.stringify({ 
        applicationId, 
        status, 
        applicantEmail, 
        applicantName, 
        jobTitle,
        interviewDate 
      }),
    })
  },

  sendJobNotification: async (jobData: any) => {
    return fetchAPI('/send-job-notification', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })
  },

  // Users (Superadmin)
  getUsers: () => fetchAPI('/users'),
  updateUser: (id: string, updates: any) =>
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Download document
  downloadDocument: async (fileId: string, fileName: string) => {
    try {
      // Validate fileId
      if (!fileId || fileId === 'undefined' || fileId === 'null') {
        console.error('Invalid file ID:', fileId)
        throw new Error('Download not available for this application. The document path is missing.')
      }

      console.log('Downloading document:', { fileId, fileName })
      const token = await getAccessToken()
      
      if (!token) {
        console.error('No access token available')
        throw new Error('Authentication required to download documents')
      }

      console.log('Fetching from:', `${API_BASE}/download/${encodeURIComponent(fileId)}`)
      
      const response = await fetch(`${API_BASE}/download/${encodeURIComponent(fileId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('Download response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Download failed:', errorText)
        throw new Error(`Failed to download document: ${response.status} - ${errorText}`)
      }

      const blob = await response.blob()
      console.log('Blob received, size:', blob.size)
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
      
      console.log('Download initiated successfully')
    } catch (error: any) {
      console.error('Download error:', error)
      throw new Error(error.message || 'Failed to download document')
    }
  },

  // Upload
  uploadDocument: async (file: File, type: string) => {
    try {
      const token = await getAccessToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      console.log('Uploading document:', file.name, 'Type:', type, 'Size:', file.size)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Upload error response:', data)
        throw new Error(data.error || 'Upload failed')
      }

      console.log('Upload successful:', data)
      return data
    } catch (error) {
      console.error('Upload exception:', error)
      throw error
    }
  },

  // Password Reset
  sendPasswordResetCode: async (email: string) => {
    try {
      console.log('=== SENDING PASSWORD RESET CODE ===')
      console.log('Email:', email)
      console.log('API_BASE:', API_BASE)
      console.log('Full URL:', `${API_BASE}/forgot-password/send-code`)
      
      // Test health endpoint first
      try {
        const healthResponse = await fetch(`${API_BASE}/health`)
        console.log('Health check status:', healthResponse.status)
        const healthData = await healthResponse.json()
        console.log('Health check data:', healthData)
      } catch (healthError) {
        console.error('Health check failed:', healthError)
      }
      
      const response = await fetch(`${API_BASE}/forgot-password/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.log('Response text:', text)
        data = { error: `Server returned non-JSON response: ${text}` }
      }
      
      console.log('Response data:', data)
      
      if (!response.ok) {
        console.error('Request failed with status:', response.status)
        console.error('Error data:', data)
        throw new Error(data.error || `Failed to send reset code (${response.status})`)
      }

      return data
    } catch (error: any) {
      console.error('=== sendPasswordResetCode ERROR ===')
      console.error('Error type:', error.constructor.name)
      console.error('Error message:', error.message)
      console.error('Error:', error)
      throw error
    }
  },

  verifyResetCode: async (email: string, code: string) => {
    try {
      console.log('=== VERIFYING RESET CODE ===')
      console.log('Email:', email)
      console.log('Code:', code)
      console.log('Code type:', typeof code)
      console.log('Code length:', code.length)
      
      const response = await fetch(`${API_BASE}/forgot-password/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, code }),
      })

      console.log('Verify response status:', response.status)
      const data = await response.json()
      console.log('Verify response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired code')
      }

      return data
    } catch (error) {
      console.error('verifyResetCode error:', error)
      throw error
    }
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    try {
      console.log('=== RESETTING PASSWORD ===')
      console.log('Email:', email)
      console.log('Code:', code)
      
      const response = await fetch(`${API_BASE}/forgot-password/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, code, newPassword }),
      })

      console.log('Reset password response status:', response.status)
      const data = await response.json()
      console.log('Reset password response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      return data
    } catch (error) {
      console.error('resetPassword error:', error)
      throw error
    }
  },
}