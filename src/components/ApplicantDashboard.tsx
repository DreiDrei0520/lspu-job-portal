import { useState, useEffect } from 'react'
import { Briefcase, FileText, User, Upload, X, CheckCircle, Clock, Calendar, TrendingUp, FileCheck2, Home, Camera, Lock, History, Download, Eye, Mail, Phone, MapPin, GraduationCap, Award, AlertCircle } from 'lucide-react'
import { api } from '../utils/api'
import { supabase } from '../utils/supabase-client'
import { JobCard } from './JobCard'
import { JobApplicationForm } from './JobApplicationForm'
import { JobDetailsModal } from './JobDetailsModal'
import { toast } from 'sonner@2.0.3'

interface ApplicantDashboardProps {
  user: any
}

export function ApplicantDashboard({ user }: ApplicantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'browse' | 'applications' | 'profile'>('dashboard')
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showApplicationDetails, setShowApplicationDetails] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Application form state
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [certificatesFile, setCertificatesFile] = useState<File | null>(null)
  
  // Profile form state
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileBirthdate, setProfileBirthdate] = useState('')
  const [profileAddress, setProfileAddress] = useState('')
  const [profileEducation, setProfileEducation] = useState('')
  const [profileExperience, setProfileExperience] = useState('')
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  
  // Security verification state
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('')
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [emailChangeError, setEmailChangeError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  useEffect(() => {
    loadJobs()
    loadApplications()
    loadProfile()
  }, [])

  const loadJobs = async () => {
    try {
      const { jobs } = await api.getJobs()
      setJobs(jobs || [])
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load job listings')
    }
  }

  const loadApplications = async () => {
    try {
      const { applications } = await api.getMyApplications()
      setApplications(applications || [])
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load your applications')
    }
  }

  const loadProfile = async () => {
    try {
      const { profile } = await api.getProfile()
      setProfile(profile)
      
      // Parse name into components
      const nameParts = (profile?.name || '').split(' ')
      setFirstName(profile?.firstName || nameParts[0] || '')
      setMiddleName(profile?.middleName || nameParts[1] || '')
      setLastName(profile?.lastName || nameParts.slice(2).join(' ') || '')
      
      setProfileEmail(user?.email || '')
      setProfilePhone(profile?.phone || '')
      setProfileBirthdate(profile?.birthdate || '')
      setProfileAddress(profile?.address || '')
      setProfileEducation(profile?.education || '')
      setProfileExperience(profile?.experience || '')
      setProfilePicture(profile?.profilePictureUrl || null)
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const handleApply = (job: any) => {
    setSelectedJob(job)
    setShowApplicationForm(true)
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let resumeUrl = ''
      let certificatesUrl = ''

      // Upload resume
      if (resumeFile) {
        const { url } = await api.uploadDocument(resumeFile, 'resume')
        resumeUrl = url
      }

      // Upload certificates
      if (certificatesFile) {
        const { url } = await api.uploadDocument(certificatesFile, 'certificates')
        certificatesUrl = url
      }

      // Submit application
      await api.submitApplication({
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        coverLetter,
        resumeUrl,
        certificatesUrl,
        applicantName: profile?.name || user.email,
        applicantEmail: user.email,
      })

      toast.success('Application submitted successfully!')
      setShowApplicationForm(false)
      setCoverLetter('')
      setResumeFile(null)
      setCertificatesFile(null)
      loadApplications()
    } catch (error: any) {
      console.error('Application submission error:', error)
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if email has changed - require password confirmation
    if (profileEmail !== user?.email) {
      setShowEmailConfirmation(true)
      toast.info('Please confirm your current password to change your email address')
      return
    }

    setLoading(true)

    try {
      let profilePictureUrl = profilePicture

      // Upload profile picture if changed
      if (profilePictureFile) {
        const { url } = await api.uploadDocument(profilePictureFile, 'profile_picture')
        profilePictureUrl = url
      }

      const fullName = `${firstName} ${middleName} ${lastName}`.trim()

      await api.updateProfile({
        name: fullName,
        firstName,
        middleName,
        lastName,
        phone: profilePhone,
        birthdate: profileBirthdate,
        address: profileAddress,
        education: profileEducation,
        experience: profileExperience,
        profilePictureUrl,
      })

      toast.success('Profile updated successfully!')
      setProfilePictureFile(null)
      loadProfile()
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setEmailChangeError(null)

    try {
      console.log('Starting email change verification...')
      console.log('Current email:', user?.email)
      console.log('New email:', profileEmail)

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileEmail)) {
        const errorMsg = 'Please enter a valid email address format'
        setEmailChangeError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      // Check if email is the same as current
      if (profileEmail.toLowerCase() === user?.email?.toLowerCase()) {
        const errorMsg = 'New email is the same as your current email'
        setEmailChangeError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      // Check if email already exists in the system
      console.log('Checking if email already exists...')
      const emailExists = await api.checkEmailExists(profileEmail)
      console.log('Email exists check result:', emailExists)
      
      if (emailExists) {
        const errorMsg = 'This email address is already registered. Please use a different email.'
        setEmailChangeError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      console.log('Updating email via server...')

      // Update email using server endpoint (no email confirmation required)
      try {
        const result = await api.updateEmail(profileEmail.trim().toLowerCase(), currentPasswordForEmail)
        
        console.log('Email update result:', result)

        if (result.success) {
          console.log('Email updated successfully')
          toast.success('Email updated successfully! You can now use your new email to log in.')
          setShowEmailConfirmation(false)
          setCurrentPasswordForEmail('')
          setEmailChangeError(null)
          
          // Reload profile to get updated data
          await loadProfile()
          
          // Log out the user so they can log in with new email
          toast.info('Please log in again with your new email address.')
          setTimeout(async () => {
            await supabase.auth.signOut()
            window.location.href = '/'
          }, 2000)
        }
      } catch (error: any) {
        console.error('Email update failed:', error)
        let errorMsg = error.message || 'Failed to update email'
        
        // Provide user-friendly error messages
        if (errorMsg.includes('already registered')) {
          errorMsg = 'This email address is already registered. Please use a different email.'
        } else if (errorMsg.includes('incorrect')) {
          errorMsg = 'Current password is incorrect.'
        } else if (errorMsg.includes('rate limit')) {
          errorMsg = 'Too many attempts. Please wait a few minutes and try again.'
        }
        
        setEmailChangeError(errorMsg)
        toast.error('Email update error: ' + errorMsg)
      }
    } catch (error: any) {
      console.error('Email update error:', error)
      const errorMsg = error.message || 'Failed to update email'
      setEmailChangeError(errorMsg)
      toast.error('Unexpected error: ' + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')
        setLoading(false)
        return
      }

      console.log('Starting password change verification...')

      // Verify current password by attempting to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: currentPassword
      })

      console.log('Password verification result:', { signInData, signInError })

      if (signInError) {
        console.error('Current password verification failed:', signInError)
        toast.error('Current password is incorrect: ' + signInError.message)
        setLoading(false)
        return
      }

      console.log('Current password verified, updating to new password...')

      // Update password using Supabase
      const { data: updateData, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      console.log('Password update result:', { updateData, error })

      if (error) throw error

      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setShowPasswordSection(false)
    } catch (error: any) {
      console.error('Password change error:', error)
      toast.error(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile picture must be less than 5MB')
        return
      }
      setProfilePictureFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'under review': 'bg-[#b8dce5] text-[#094050]',
      'interview scheduled': 'bg-indigo-100 text-indigo-800',
      'under interviews': 'bg-purple-100 text-purple-800',
      'interviewed': 'bg-violet-100 text-violet-800',
      'exam scheduled': 'bg-cyan-100 text-cyan-800',
      'exam completed': 'bg-sky-100 text-sky-800',
      'for requirements': 'bg-amber-100 text-amber-800',
      'hired': 'bg-green-100 text-green-800',
      'not shortlisted': 'bg-orange-100 text-orange-800',
      'not selected': 'bg-red-100 text-red-800',
    }
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  // Dashboard metrics
  const totalApplications = applications.length
  const interviewedApps = applications.filter(app => 
    app.status?.toLowerCase().includes('interview')
  )
  const latestApplication = applications.length > 0 
    ? applications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null
  const upcomingInterviews = applications.filter(app => 
    app.interviewDate && new Date(app.interviewDate) > new Date()
  )

  // Get application progress stage
  const getProgressStage = (status: string) => {
    const statusLower = status?.toLowerCase() || 'pending'
    if (statusLower === 'pending' || statusLower === 'under review') return 1
    if (statusLower.includes('interview')) return 2
    if (statusLower.includes('exam') || statusLower === 'for requirements') return 3
    if (statusLower === 'hired' || statusLower === 'not selected' || statusLower === 'not shortlisted') return 4
    return 1
  }

  const currentStage = latestApplication ? getProgressStage(latestApplication.status) : 0

  const progressStages = [
    { id: 1, name: 'Application Review', description: 'Initial screening of submitted applications' },
    { id: 2, name: 'Interview Stage', description: 'Interview scheduling and evaluation' },
    { id: 3, name: 'Assessment & Requirements', description: 'Exams and document verification' },
    { id: 4, name: 'Final Decision', description: 'Hiring decision is being made' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Browse Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>My Applications</span>
              {applications.length > 0 && (
                <span className="bg-[#e0f2f7] text-[#094050] px-2 py-1 rounded-full text-xs">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>My Profile</span>
            </button>
          </div>
        </div>

        {/* Dashboard Overview Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-[#116d8a] to-[#1a8bad] rounded-lg p-8 mb-6 text-white">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 border-4 border-white shadow-xl flex-shrink-0">
                  {profile?.profilePictureUrl ? (
                    <img
                      src={profile.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#e0f2f7]">
                      <User className="w-12 h-12 text-[#116d8a]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl mb-2">
                    Welcome back, {profile?.name || user.email}!
                  </h2>
                  <p className="text-[#e0f2f7]">
                    Track your job applications and stay updated with the latest opportunities at LSPU-LBC
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Total Applications */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#116d8a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#b8dce5] rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#116d8a]" />
                  </div>
                  <div className="text-3xl text-[#116d8a]">{totalApplications}</div>
                </div>
                <h3 className="text-lg text-gray-900 mb-1">Total Applications</h3>
                <p className="text-sm text-gray-600">
                  Applications submitted to date
                </p>
              </div>

              {/* Current Status */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#116d8a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#e0f2f7] rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#116d8a]" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm capitalize ${
                    latestApplication ? getStatusColor(latestApplication.status) : 'bg-gray-100 text-gray-600'
                  }`}>
                    {latestApplication?.status || 'No Status'}
                  </div>
                </div>
                <h3 className="text-lg text-gray-900 mb-1">Current Status</h3>
                <p className="text-sm text-gray-600">
                  {latestApplication 
                    ? `Latest: ${latestApplication.jobTitle}`
                    : 'No applications yet'}
                </p>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl text-purple-600">
                    {upcomingInterviews.length}
                  </div>
                </div>
                <h3 className="text-lg text-gray-900 mb-1">Upcoming Events</h3>
                <p className="text-sm text-gray-600">
                  {upcomingInterviews.length > 0 
                    ? `${upcomingInterviews.length} scheduled interview${upcomingInterviews.length > 1 ? 's' : ''}`
                    : 'No scheduled interviews'}
                </p>
              </div>
            </div>

            {/* Application Progress Section */}
            {latestApplication && (
              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <h3 className="text-2xl text-gray-900 mb-6">Application Progress</h3>

                {/* Progress Timeline */}
                <div className="relative mb-8">
                  {/* Progress Bar */}
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-200">
                    <div 
                      className="h-full bg-[#116d8a] transition-all duration-500"
                      style={{ width: `${((currentStage) / progressStages.length) * 100}%` }}
                    />
                  </div>

                  {/* Progress Stages */}
                  <div className="relative grid grid-cols-4 gap-4">
                    {progressStages.map((stage, index) => {
                      const isCompleted = index + 1 < currentStage
                      const isCurrent = index + 1 === currentStage
                      const isPending = index + 1 > currentStage

                      return (
                        <div key={stage.id} className="flex flex-col items-center">
                          {/* Stage Circle */}
                          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#116d8a] border-[#116d8a]' 
                              : isCurrent 
                              ? 'bg-white border-[#116d8a] ring-4 ring-[#e0f2f7]' 
                              : 'bg-white border-gray-300'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <div className={`w-6 h-6 rounded-full ${
                                isCurrent ? 'bg-[#116d8a]' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>

                          {/* Stage Info */}
                          <div className="mt-4 text-center">
                            <h4 className={`text-sm mb-1 ${
                              isCurrent ? 'text-[#116d8a]' : 'text-gray-900'
                            }`}>
                              {stage.name}
                            </h4>
                            <p className="text-xs text-gray-600 hidden md:block">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current Status Message */}
                <div className="bg-[#e6f7f9] border border-[#80d3d9] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#b3e5ec] rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#116d8a]" />
                    </div>
                    <div>
                      <h4 className="text-sm text-[#073340] mb-1">
                        {latestApplication.jobTitle}
                      </h4>
                      <p className="text-sm text-[#0a3f4d]">
                        Your application is currently at the <span className="font-semibold capitalize">"{latestApplication.status}"</span> stage.
                      </p>
                      {latestApplication.interviewDate && (
                        <p className="text-sm text-[#0d5468] mt-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Interview scheduled: {new Date(latestApplication.interviewDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('browse')}
                  className="flex items-center gap-3 p-4 border-2 border-[#b8dce5] rounded-lg hover:border-[#116d8a] hover:bg-[#e0f2f7] transition-all group"
                >
                  <div className="w-10 h-10 bg-[#e0f2f7] rounded-lg flex items-center justify-center group-hover:bg-[#b8dce5] transition-colors">
                    <Briefcase className="w-5 h-5 text-[#116d8a]" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-900">Browse Jobs</div>
                    <div className="text-xs text-gray-600">Find new opportunities</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className="flex items-center gap-3 p-4 border-2 border-[#80d3d9] rounded-lg hover:border-[#14899e] hover:bg-[#e6f7f9] transition-all group"
                >
                  <div className="w-10 h-10 bg-[#b3e5ec] rounded-lg flex items-center justify-center group-hover:bg-[#80d3d9] transition-colors">
                    <FileCheck2 className="w-5 h-5 text-[#116d8a]" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-900">My Applications</div>
                    <div className="text-xs text-gray-600">Track your progress</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-900">Update Profile</div>
                    <div className="text-xs text-gray-600">Keep info current</div>
                  </div>
                </button>
              </div>
            </div>

            {/* No Applications State */}
            {applications.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm mt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start your career journey by browsing available positions
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors"
                >
                  Browse Available Jobs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Browse Jobs Tab */}
        {activeTab === 'browse' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl text-gray-900 mb-2">Available Positions</h2>
              <p className="text-gray-600">
                Browse and apply for teaching and non-teaching positions at LSPU-LBC
              </p>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No Jobs Available</h3>
                <p className="text-gray-600">
                  There are currently no open positions. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                    onViewDetails={(job) => {
                      setSelectedJob(job)
                      setShowJobDetails(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl text-gray-900 mb-2">My Applications</h2>
              <p className="text-gray-600">
                Track the status of your job applications
              </p>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any applications. Start by browsing available jobs.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-[#116d8a] text-white px-6 py-2 rounded-lg hover:bg-[#0d5468] transition-colors"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg text-gray-900 mb-1">{app.jobTitle}</h3>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(app.status)}`}>
                        {app.status}
                      </div>
                    </div>

                    {app.coverLetter && (
                      <div className="mb-4">
                        <h4 className="text-sm text-gray-700 mb-2">Cover Letter:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    {app.interviewDate && (
                      <div className="bg-[#e6f7f9] border border-[#80d3d9] rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#b3e5ec] rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-[#116d8a]" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-[#073340] mb-1">
                              {app.status?.toLowerCase().includes('exam') ? 'Exam Scheduled' : 'Interview Scheduled'}
                            </div>
                            <div className="text-sm text-[#0a3f4d] mb-2">
                              <strong>Date & Time:</strong> {new Date(app.interviewDate).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {app.interviewVenue && (
                              <div className="text-sm text-[#0d5468] mb-1">
                                <strong>Venue:</strong> {app.interviewVenue}
                              </div>
                            )}
                            {app.interviewNotes && (
                              <div className="text-sm text-[#0d5468]">
                                <strong>Important Notes:</strong> {app.interviewNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedApplication(app)
                        setShowApplicationDetails(true)
                      }}
                      className="w-full px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Application Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl text-gray-900 mb-2">My Profile</h2>
              <p className="text-gray-600">
                Manage your personal information and account settings
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] cursor-pointer transition-colors">
                      <Camera className="w-5 h-5" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-4">Personal Information</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email will be updated immediately after password confirmation
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileBirthdate}
                      onChange={(e) => setProfileBirthdate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                      placeholder="Street, Barangay, City"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2 text-gray-700">
                    Complete Address
                  </label>
                  <textarea
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                    rows={2}
                    placeholder="Complete address including Barangay, City, Province, ZIP Code"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2 text-gray-700">
                    Educational Background
                  </label>
                  <textarea
                    value={profileEducation}
                    onChange={(e) => setProfileEducation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                    rows={3}
                    placeholder="List your educational qualifications"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Work Experience
                  </label>
                  <textarea
                    value={profileExperience}
                    onChange={(e) => setProfileExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                    rows={4}
                    placeholder="Describe your work experience"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#116d8a] text-white px-6 py-3 rounded-lg hover:bg-[#0d5468] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={loadProfile}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Changes
                </button>
              </div>
            </form>

            {/* Account Security - Separate Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg text-gray-900 mb-4">Account Security</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your password and security settings
              </p>
              
              <div>
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="flex items-center gap-2 px-4 py-2 border border-[#1976D2] text-[#1976D2] rounded-lg hover:bg-[#E3F2FD] transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  <span>{showPasswordSection ? 'Hide Password Change' : 'Change Password'}</span>
                </button>

                {showPasswordSection && (
                  <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                        placeholder="Enter new password"
                        minLength={8}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-[#1565C0] transition-colors disabled:bg-gray-400"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordSection(false)
                          setCurrentPassword('')
                          setNewPassword('')
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Email Change Confirmation Modal */}
            {showEmailConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl text-gray-900 mb-4">Confirm Email Change</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    To change your email from <strong>{user?.email}</strong> to <strong>{profileEmail}</strong>, please enter your current password.
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                      ⚠️ <strong>Important:</strong> After changing your email, you'll be logged out and must log in again using your new email address.
                    </p>
                  </div>

                  {emailChangeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-red-800">
                        ❌ <strong>Error:</strong> {emailChangeError}
                      </p>
                      {emailChangeError.includes('already registered') && (
                        <p className="text-xs text-red-700 mt-2">
                          <strong>Possible reasons:</strong>
                          <br />• Another account already uses this email
                          <br />• You previously registered with this email
                          <br />• Try a different email address
                        </p>
                      )}
                      <p className="text-xs text-red-600 mt-1">
                        Check the browser console (F12) for detailed logs
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleConfirmEmailChange} className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={currentPasswordForEmail}
                        onChange={(e) => {
                          setCurrentPasswordForEmail(e.target.value)
                          setEmailChangeError(null)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
                        placeholder="Enter your current password"
                        required
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the password for {user?.email}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmailConfirmation(false)
                          setCurrentPasswordForEmail('')
                          setProfileEmail(user?.email || '')
                        }}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-[#1565C0] transition-colors disabled:bg-gray-400"
                      >
                        {loading ? 'Confirming...' : 'Confirm Change'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}


      </div>

      {/* Comprehensive Application Form */}
      {showApplicationForm && selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          user={user}
          profile={profile}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={() => {
            loadApplications()
            setActiveTab('dashboard')
          }}
        />
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setShowJobDetails(false)}
          onApply={() => {
            setShowJobDetails(false)
            setShowApplicationForm(true)
          }}
        />
      )}

      {/* Application Details Modal */}
      {showApplicationDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#116d8a] to-[#14899e] text-white p-6 rounded-t-lg flex items-center justify-between">
              <h2 className="text-2xl">Application Details</h2>
              <button
                onClick={() => setShowApplicationDetails(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1976D2]" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Full Name:</label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.applicantName || 
                       `${selectedApplication.firstName || ''} ${selectedApplication.middleName || ''} ${selectedApplication.lastName || ''}`.trim() || 
                       'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Email:</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedApplication.email || selectedApplication.applicantEmail || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Phone:</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedApplication.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="bg-blue-50 rounded-lg p-5">
                <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-700" />
                  Application Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Position Applied:</label>
                    <p className="text-sm text-gray-900">{selectedApplication.jobTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Date Applied:</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedApplication.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600">Current Status:</label>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              {selectedApplication.workExperiences && selectedApplication.workExperiences.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-700" />
                    Work Experience
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-purple-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Inclusive Dates</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Position Title</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Company</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Monthly Salary</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Salary Grade</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Appointment Status</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Govt Service</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedApplication.workExperiences.map((exp: any, idx: number) => (
                          <tr key={idx} className="border-b border-purple-200">
                            <td className="px-3 py-2 text-gray-900">{exp.from} - {exp.to}</td>
                            <td className="px-3 py-2 text-gray-900">{exp.position}</td>
                            <td className="px-3 py-2 text-gray-900">{exp.company}</td>
                            <td className="px-3 py-2 text-gray-900">{exp.salary}</td>
                            <td className="px-3 py-2 text-gray-900">{exp.grade}</td>
                            <td className="px-3 py-2 text-gray-900">{exp.appointmentStatus}</td>
                            <td className="px-3 py-2 text-gray-900">{exp.governmentService}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Education */}
              {selectedApplication.educations && selectedApplication.educations.length > 0 && (
                <div className="bg-[#E3F2FD] rounded-lg p-5">
                  <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#1976D2]" />
                    Education
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#BBDEFB]">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Level</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">School</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Degree/Course</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Attendance Period</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Units/Highest Level</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Year Graduated</th>
                          <th className="px-3 py-2 text-left text-xs text-gray-700">Honors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedApplication.educations.map((edu: any, idx: number) => (
                          <tr key={idx} className="border-b border-[#BBDEFB]">
                            <td className="px-3 py-2 text-gray-900">{edu.level}</td>
                            <td className="px-3 py-2 text-gray-900">{edu.school}</td>
                            <td className="px-3 py-2 text-gray-900">{edu.course}</td>
                            <td className="px-3 py-2 text-gray-900">{edu.from} - {edu.to}</td>
                            <td className="px-3 py-2 text-gray-900">{edu.units}</td>
                            <td className="px-3 py-2 text-gray-900">{edu.yearGraduated}</td>
                            <td className="px-3 py-2 text-gray-900">{edu.honors}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submitted Documents */}
              <div className="bg-yellow-50 rounded-lg p-5">
                <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-yellow-700" />
                  Submitted Documents
                </h3>
                
                {/* Info banner for old applications */}
                {!selectedApplication.resumePath && !selectedApplication.pdsPath && !selectedApplication.torPath && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="mb-1">
                          <span>This application was submitted before the download feature was implemented.</span>
                        </p>
                        <p className="text-blue-700">
                          You can still <span>view</span> documents using the "View" button, but downloads are not available for this application.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {selectedApplication.resumeUrl && (
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-900">Resume</p>
                          <p className="text-xs text-gray-600">{selectedApplication.resumePath?.split('/').pop() || 'Resume.pdf'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedApplication.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1976D2] text-white rounded text-xs hover:bg-[#1565C0] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                        {selectedApplication.resumePath ? (
                          <button
                            onClick={async () => {
                              try {
                                toast.info('Downloading...')
                                await api.downloadDocument(selectedApplication.resumePath, selectedApplication.resumePath?.split('/').pop() || 'Resume.pdf')
                                toast.success('Download started!')
                              } catch (error: any) {
                                console.error('Download failed:', error)
                                toast.error(error.message || 'Failed to download document')
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] text-white rounded text-xs hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs cursor-not-allowed flex items-center gap-1"
                            title="Download not available for this application"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.applicationLetterUrl && (
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-900">Application Letter</p>
                          <p className="text-xs text-gray-600">{selectedApplication.applicationLetterPath?.split('/').pop() || 'Application Letter.pdf'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedApplication.applicationLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1976D2] text-white rounded text-xs hover:bg-[#1565C0] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                        {selectedApplication.applicationLetterPath ? (
                          <button
                            onClick={async () => {
                              try {
                                toast.info('Downloading...')
                                await api.downloadDocument(selectedApplication.applicationLetterPath, selectedApplication.applicationLetterPath?.split('/').pop() || 'Application Letter.pdf')
                                toast.success('Download started!')
                              } catch (error: any) {
                                console.error('Download failed:', error)
                                toast.error(error.message || 'Failed to download document')
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] text-white rounded text-xs hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs cursor-not-allowed flex items-center gap-1"
                            title="Download not available for this application"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.pdsUrl && (
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-900">Personal Data Sheet</p>
                          <p className="text-xs text-gray-600">{selectedApplication.pdsPath?.split('/').pop() || 'PDS_Form.xlsx'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedApplication.pdsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1976D2] text-white rounded text-xs hover:bg-[#1565C0] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                        {selectedApplication.pdsPath ? (
                          <button
                            onClick={async () => {
                              try {
                                toast.info('Downloading...')
                                await api.downloadDocument(selectedApplication.pdsPath, selectedApplication.pdsPath?.split('/').pop() || 'PDS_Form.xlsx')
                                toast.success('Download started!')
                              } catch (error: any) {
                                console.error('Download failed:', error)
                                toast.error(error.message || 'Failed to download document')
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] text-white rounded text-xs hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs cursor-not-allowed flex items-center gap-1"
                            title="Download not available for this application"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.torUrl && (
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-900">Transcript of Records</p>
                          <p className="text-xs text-gray-600">{selectedApplication.torPath?.split('/').pop() || 'TOR.pdf'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedApplication.torUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1976D2] text-white rounded text-xs hover:bg-[#1565C0] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                        {selectedApplication.torPath ? (
                          <button
                            onClick={async () => {
                              try {
                                toast.info('Downloading...')
                                await api.downloadDocument(selectedApplication.torPath, selectedApplication.torPath?.split('/').pop() || 'TOR.pdf')
                                toast.success('Download started!')
                              } catch (error: any) {
                                console.error('Download failed:', error)
                                toast.error(error.message || 'Failed to download document')
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] text-white rounded text-xs hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs cursor-not-allowed flex items-center gap-1"
                            title="Download not available for this application"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.eligibilityUrl && (
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-900">Proof of Eligibility</p>
                          <p className="text-xs text-gray-600">{selectedApplication.eligibilityPath?.split('/').pop() || 'Proof of Eligibility.pdf'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedApplication.eligibilityUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                        {selectedApplication.eligibilityPath ? (
                          <button
                            onClick={async () => {
                              try {
                                toast.info('Downloading...')
                                await api.downloadDocument(selectedApplication.eligibilityPath, selectedApplication.eligibilityPath?.split('/').pop() || 'Proof of Eligibility.pdf')
                                toast.success('Download started!')
                              } catch (error: any) {
                                console.error('Download failed:', error)
                                toast.error(error.message || 'Failed to download document')
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] text-white rounded text-xs hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs cursor-not-allowed flex items-center gap-1"
                            title="Download not available for this application"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.otherDocsUrl && (
                    <div className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-900">Other Documents</p>
                          <p className="text-xs text-gray-600">{selectedApplication.otherDocsPath?.split('/').pop() || 'Other Documents.pdf'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedApplication.otherDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1976D2] text-white rounded text-xs hover:bg-[#1565C0] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                        {selectedApplication.otherDocsPath ? (
                          <button
                            onClick={async () => {
                              try {
                                toast.info('Downloading...')
                                await api.downloadDocument(selectedApplication.otherDocsPath, selectedApplication.otherDocsPath?.split('/').pop() || 'Other Documents.pdf')
                                toast.success('Download started!')
                              } catch (error: any) {
                                console.error('Download failed:', error)
                                toast.error(error.message || 'Failed to download document')
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] text-white rounded text-xs hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs cursor-not-allowed flex items-center gap-1"
                            title="Download not available for this application"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowApplicationDetails(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
