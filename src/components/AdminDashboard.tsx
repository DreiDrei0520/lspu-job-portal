import { useState, useEffect } from 'react'
import { Briefcase, Users, FileText, Plus, Edit, Edit2, Trash2, X, Calendar, LayoutDashboard, TrendingUp, TrendingDown, Search, CalendarCheck, ClipboardList, CheckCircle, XCircle, UserX, User, Camera, Lock, Download, Award, Eye, History } from 'lucide-react'
import { api } from '../utils/api'
import { toast } from 'sonner@2.0.3'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../utils/supabase-client'
import { EvaluationForm } from './EvaluationForm'
import { PrintableEvaluationView } from './PrintableEvaluationView'

interface AdminDashboardProps {
  user: any
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'evaluations' | 'history' | 'settings'>('overview')
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [evaluatingApplication, setEvaluatingApplication] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingApplication, setViewingApplication] = useState<any>(null)
  const [showPrintableView, setShowPrintableView] = useState(false)
  const [viewingEvaluation, setViewingEvaluation] = useState<any>(null)

  // Job form state
  const [jobTitle, setJobTitle] = useState('')
  const [jobCategory, setJobCategory] = useState('teaching')
  const [jobType, setJobType] = useState('full-time')
  const [jobDepartment, setJobDepartment] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [jobPlaceOfAssignment, setJobPlaceOfAssignment] = useState('')
  const [jobEducationLevel, setJobEducationLevel] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobRequirements, setJobRequirements] = useState('')
  const [jobEligibility, setJobEligibility] = useState('')
  const [jobQualification, setJobQualification] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [jobTraining, setJobTraining] = useState('')
  const [jobSalary, setJobSalary] = useState('')
  const [jobDeadline, setJobDeadline] = useState('')

  // Evaluation form state
  const [potential, setPotential] = useState(0)
  const [interview, setInterview] = useState(0)
  const [personality, setPersonality] = useState(0)
  const [communication, setCommunication] = useState(0)
  const [comments, setComments] = useState('')

  // Scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleType, setScheduleType] = useState<'interview' | 'exam'>('interview')
  const [schedulingApplication, setSchedulingApplication] = useState<any>(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduleVenue, setScheduleVenue] = useState('')
  const [scheduleNotes, setScheduleNotes] = useState('')

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [evaluationSearchTerm, setEvaluationSearchTerm] = useState('')
  const [evaluationCategoryFilter, setEvaluationCategoryFilter] = useState<string>('all')
  const [evaluationScoreFilter, setEvaluationScoreFilter] = useState<string>('all')
  const [historySearchTerm, setHistorySearchTerm] = useState('')
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all')
  const [historyScoreFilter, setHistoryScoreFilter] = useState<string>('all')

  // Profile form state
  const [profile, setProfile] = useState<any>(null)
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

  // Filtered applications based on search term and status
  const filteredApplications = applications.filter((app: any) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchLower) ||
      app.applicantEmail?.toLowerCase().includes(searchLower) ||
      app.jobTitle?.toLowerCase().includes(searchLower)
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Filtered evaluations based on search and filters
  const filteredEvaluations = applications.filter((app: any) => {
    if (!app.evaluation) return false
    
    const searchLower = evaluationSearchTerm.toLowerCase()
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchLower) ||
      app.applicantEmail?.toLowerCase().includes(searchLower) ||
      app.jobTitle?.toLowerCase().includes(searchLower) ||
      app.evaluation?.evaluatorName?.toLowerCase().includes(searchLower)
    
    const matchesCategory = evaluationCategoryFilter === 'all' || 
      app.evaluation?.jobCategory?.toLowerCase() === evaluationCategoryFilter.toLowerCase()
    
    let matchesScore = true
    if (evaluationScoreFilter !== 'all') {
      const score = parseFloat(app.evaluation?.totalScore || '0')
      if (evaluationScoreFilter === 'excellent') matchesScore = score >= 90
      else if (evaluationScoreFilter === 'very-good') matchesScore = score >= 80 && score < 90
      else if (evaluationScoreFilter === 'good') matchesScore = score >= 70 && score < 80
      else if (evaluationScoreFilter === 'satisfactory') matchesScore = score >= 60 && score < 70
      else if (evaluationScoreFilter === 'needs-improvement') matchesScore = score < 60
    }
    
    return matchesSearch && matchesCategory && matchesScore
  })

  // Filtered history based on search and filters (duplicate of evaluations for history tab)
  const filteredHistory = applications.filter((app: any) => {
    if (!app.evaluation) return false
    
    const searchLower = historySearchTerm.toLowerCase()
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchLower) ||
      app.applicantEmail?.toLowerCase().includes(searchLower) ||
      app.jobTitle?.toLowerCase().includes(searchLower) ||
      app.evaluation?.evaluatorName?.toLowerCase().includes(searchLower)
    
    const matchesCategory = historyCategoryFilter === 'all' || 
      app.evaluation?.jobCategory?.toLowerCase() === historyCategoryFilter.toLowerCase()
    
    let matchesScore = true
    if (historyScoreFilter !== 'all') {
      const score = parseFloat(app.evaluation?.totalScore || '0')
      if (historyScoreFilter === 'excellent') matchesScore = score >= 90
      else if (historyScoreFilter === 'very-good') matchesScore = score >= 80 && score < 90
      else if (historyScoreFilter === 'good') matchesScore = score >= 70 && score < 80
      else if (historyScoreFilter === 'satisfactory') matchesScore = score >= 60 && score < 70
      else if (historyScoreFilter === 'needs-improvement') matchesScore = score < 60
    }
    
    return matchesSearch && matchesCategory && matchesScore
  })

  useEffect(() => {
    loadJobs()
    loadApplications()
    loadProfile()
  }, [])

  const loadJobs = async (showRefreshingIndicator = false) => {
    try {
      if (showRefreshingIndicator) {
        setRefreshing(true)
      }
      console.log('Loading jobs...')
      const { jobs } = await api.getJobs()
      console.log('Jobs loaded:', jobs)
      setJobs(jobs || [])
      console.log('Jobs state updated with', jobs?.length || 0, 'jobs')
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      if (showRefreshingIndicator) {
        setRefreshing(false)
      }
    }
  }

  const loadApplications = async () => {
    try {
      const { applications } = await api.getAllApplications()
      
      // Fetch evaluation data for each application
      const applicationsWithEvaluations = await Promise.all(
        (applications || []).map(async (app: any) => {
          try {
            const evaluationData = await api.getEvaluations(app.id)
            // API returns { evaluations: [...] }, get the first one
            return {
              ...app,
              evaluation: evaluationData.evaluations?.[0] || null
            }
          } catch (error) {
            // No evaluation yet for this application
            return {
              ...app,
              evaluation: null
            }
          }
        })
      )
      
      setApplications(applicationsWithEvaluations || [])
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load applications')
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

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string)
      }
      reader.readAsDataURL(file)
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

  const handleCreateJob = () => {
    setEditingJob(null)
    setJobTitle('')
    setJobCategory('teaching')
    setJobType('full-time')
    setJobDepartment('')
    setJobLocation('')
    setJobPlaceOfAssignment('')
    setJobEducationLevel('')
    setJobDescription('')
    setJobRequirements('')
    setJobEligibility('')
    setJobQualification('')
    setJobExperience('')
    setJobTraining('')
    setJobSalary('')
    setJobDeadline('')
    setShowJobForm(true)
  }

  const handleEditJob = (job: any) => {
    setEditingJob(job)
    setJobTitle(job.title)
    setJobCategory(job.category)
    setJobType(job.type)
    setJobDepartment(job.department || '')
    setJobLocation(job.location || '')
    setJobPlaceOfAssignment(job.placeOfAssignment || '')
    setJobEducationLevel(job.educationLevel || '')
    setJobDescription(job.description)
    setJobRequirements(job.requirements || '')
    setJobEligibility(job.eligibility || '')
    setJobQualification(job.qualification || '')
    setJobExperience(job.experience || '')
    setJobTraining(job.training || '')
    setJobSalary(job.salary)
    setJobDeadline(job.deadline)
    setShowJobForm(true)
  }

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const jobData = {
        title: jobTitle,
        category: jobCategory,
        type: jobType,
        department: jobDepartment,
        location: jobLocation,
        placeOfAssignment: jobPlaceOfAssignment,
        educationLevel: jobEducationLevel,
        description: jobDescription,
        requirements: jobRequirements,
        eligibility: jobEligibility,
        qualification: jobQualification,
        experience: jobExperience,
        training: jobTraining,
        salary: jobSalary,
        deadline: jobDeadline,
      }

      console.log('Submitting job:', jobData)

      if (editingJob) {
        console.log('Updating job:', editingJob.id)
        await api.updateJob(editingJob.id, jobData)
        console.log('Job updated successfully')
        toast.success('Job updated successfully!')
      } else {
        console.log('Creating new job')
        await api.createJob(jobData)
        console.log('Job created successfully')
        toast.success('Job created successfully!')
      }

      setShowJobForm(false)
      setEditingJob(null)
      
      console.log('Reloading jobs after submit...')
      await loadJobs()
      console.log('Jobs reloaded successfully')
      
      // Send email notification about new job (only for new jobs, not edits)
      if (!editingJob) {
        try {
          await api.sendJobNotification({
            title: jobTitle,
            category: jobCategory,
            type: jobType,
            department: jobDepartment,
            location: jobLocation,
            salary: jobSalary,
            deadline: jobDeadline,
            description: jobDescription
          })
          console.log('Job notification email sent to applicants')
        } catch (emailError) {
          console.error('Failed to send job notification:', emailError)
          // Don't show error to user
        }
      }
    } catch (error: any) {
      console.error('Job submission error:', error)
      toast.error(error.message || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      console.log('Deleting job:', jobId)
      await api.deleteJob(jobId)
      console.log('Job deleted successfully')
      toast.success('Job deleted successfully!')
      
      console.log('Reloading jobs after delete...')
      await loadJobs()
      console.log('Jobs reloaded successfully')
    } catch (error: any) {
      console.error('Job deletion error:', error)
      toast.error(error.message || 'Failed to delete job')
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      // Find the application to get applicant details
      const application = applications.find(app => app.id === applicationId)
      
      await api.updateApplication(applicationId, { status })
      toast.success('Application status updated!')
      
      // Send email notification to applicant
      if (application) {
        try {
          await api.sendStatusNotification(
            applicationId,
            status,
            application.applicantEmail || application.email,
            application.applicantName || `${application.firstName || ''} ${application.lastName || ''}`.trim(),
            application.jobTitle,
            application.interviewDate
          )
          console.log('Email notification sent successfully')
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError)
          // Don't show error to user, just log it
        }
      }
      
      loadApplications()
    } catch (error: any) {
      console.error('Status update error:', error)
      toast.error(error.message || 'Failed to update status')
    }
  }

  const handleScheduleInterview = (application: any) => {
    console.log('=== Schedule Interview Clicked ===')
    console.log('Application data:', application)
    console.log('Application ID:', application?.id)
    console.log('All application keys:', Object.keys(application || {}))
    
    setSchedulingApplication(application)
    setScheduleType('interview')
    setScheduleDate('')
    setScheduleTime('')
    setScheduleVenue('')
    setScheduleNotes('')
    setShowScheduleModal(true)
  }

  const handleScheduleExam = (application: any) => {
    console.log('=== Schedule Exam Clicked ===')
    console.log('Application data:', application)
    console.log('Application ID:', application?.id)
    console.log('All application keys:', Object.keys(application || {}))
    
    setSchedulingApplication(application)
    setScheduleType('exam')
    setScheduleDate('')
    setScheduleTime('')
    setScheduleVenue('')
    setScheduleNotes('')
    setShowScheduleModal(true)
  }

  const handleSubmitSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== Submitting Schedule ===')
    console.log('Schedule Type:', scheduleType)
    console.log('Scheduling Application:', schedulingApplication)
    console.log('Application ID:', schedulingApplication?.id)
    console.log('Date:', scheduleDate)
    console.log('Time:', scheduleTime)
    console.log('Venue:', scheduleVenue)
    console.log('Notes:', scheduleNotes)

    // Validate required fields
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please fill in date and time')
      return
    }

    if (!schedulingApplication) {
      toast.error('No application selected')
      return
    }

    const applicationId = schedulingApplication.id
    console.log('Using Application ID:', applicationId)

    if (!applicationId) {
      toast.error('Application ID is missing. Please try again.')
      console.error('Application object:', schedulingApplication)
      return
    }

    setLoading(true)

    try {
      // Combine date and time into ISO format
      const dateTimeStr = `${scheduleDate}T${scheduleTime}`
      const scheduleDateTime = new Date(dateTimeStr).toISOString()
      
      console.log('Combined DateTime:', scheduleDateTime)

      // Prepare update data
      const updateData: any = {
        interviewDate: scheduleDateTime,
        interviewVenue: scheduleVenue || '',
        interviewNotes: scheduleNotes || '',
      }

      // Set status based on schedule type
      if (scheduleType === 'interview') {
        updateData.status = 'interview scheduled'
      } else if (scheduleType === 'exam') {
        updateData.status = 'exam scheduled'
      }

      console.log('Update Data:', updateData)
      console.log('Calling API with ID:', applicationId)

      // Call API to update application
      await api.updateApplication(applicationId, updateData)

      // Show success message
      if (scheduleType === 'interview') {
        toast.success('Interview scheduled successfully!')
      } else {
        toast.success('Exam scheduled successfully!')
      }

      // Close modal and reset state
      setShowScheduleModal(false)
      setSchedulingApplication(null)
      setScheduleDate('')
      setScheduleTime('')
      setScheduleVenue('')
      setScheduleNotes('')
      
      // Reload applications to show updated data
      await loadApplications()
      
      // Send email notification about scheduled interview/exam
      try {
        await api.sendStatusNotification(
          applicationId,
          updateData.status,
          schedulingApplication.applicantEmail || schedulingApplication.email,
          schedulingApplication.applicantName || `${schedulingApplication.firstName || ''} ${schedulingApplication.lastName || ''}`.trim(),
          schedulingApplication.jobTitle,
          scheduleDateTime
        )
        console.log('Schedule notification email sent successfully')
      } catch (emailError) {
        console.error('Failed to send schedule notification:', emailError)
        // Don't show error to user
      }
      
      console.log('=== Schedule Submitted Successfully ===')
    } catch (error: any) {
      console.error('=== Scheduling Error ===')
      console.error('Error:', error)
      console.error('Error message:', error.message)
      console.error('Error details:', error)
      
      toast.error(error.message || 'Failed to schedule. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calculate total score based on LSPU criteria
      const totalScore = (potential * 0.15) + (interview * 0.10) + (personality * 0.10) + (communication * 0.10)

      await api.submitEvaluation({
        applicationId: selectedApplication.id,
        applicantId: selectedApplication.applicantId,
        scores: {
          potential,
          interview,
          personality,
          communication,
        },
        totalScore,
        comments,
      })

      toast.success('Evaluation submitted successfully!')
      setShowEvaluationForm(false)
      setPotential(0)
      setInterview(0)
      setPersonality(0)
      setCommunication(0)
      setComments('')
    } catch (error: any) {
      console.error('Evaluation submission error:', error)
      toast.error(error.message || 'Failed to submit evaluation')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'under review': 'bg-blue-100 text-blue-800',
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

  // Calculate statistics
  const totalApplications = applications.length
  const pending = applications.filter(app => app.status?.toLowerCase() === 'pending').length
  const underReview = applications.filter(app => app.status?.toLowerCase() === 'under review').length
  const interviewScheduled = applications.filter(app => app.status?.toLowerCase() === 'interview scheduled').length
  const underInterviews = applications.filter(app => app.status?.toLowerCase() === 'under interviews').length
  const interviewed = applications.filter(app => app.status?.toLowerCase() === 'interviewed').length
  const examScheduled = applications.filter(app => app.status?.toLowerCase() === 'exam scheduled').length
  const examCompleted = applications.filter(app => app.status?.toLowerCase() === 'exam completed').length
  const forRequirements = applications.filter(app => app.status?.toLowerCase() === 'for requirements').length
  const hired = applications.filter(app => app.status?.toLowerCase() === 'hired').length
  const notShortlisted = applications.filter(app => app.status?.toLowerCase() === 'not shortlisted').length
  const notSelected = applications.filter(app => app.status?.toLowerCase() === 'not selected').length

  // Chart data for pie chart
  const pieChartData = [
    { name: 'Pending', value: pending, color: '#EAB308' },
    { name: 'Under Review', value: underReview, color: '#3B82F6' },
    { name: 'Interview Scheduled', value: interviewScheduled, color: '#6366F1' },
    { name: 'Under Interviews', value: underInterviews, color: '#8B5CF6' },
    { name: 'Interviewed', value: interviewed, color: '#A855F7' },
    { name: 'Exam Scheduled', value: examScheduled, color: '#06B6D4' },
    { name: 'Exam Completed', value: examCompleted, color: '#0EA5E9' },
    { name: 'For Requirements', value: forRequirements, color: '#F59E0B' },
    { name: 'Hired', value: hired, color: '#10B981' },
    { name: 'Not Shortlisted', value: notShortlisted, color: '#FB923C' },
    { name: 'Not Selected', value: notSelected, color: '#EF4444' },
  ].filter(item => item.value > 0)

  // Chart data for bar chart
  const barChartData = [
    { status: 'Pending', count: pending },
    { status: 'Under Review', count: underReview },
    { status: 'Interview Scheduled', count: interviewScheduled },
    { status: 'Under Interviews', count: underInterviews },
    { status: 'Interviewed', count: interviewed },
    { status: 'Exam Scheduled', count: examScheduled },
    { status: 'Exam Completed', count: examCompleted },
    { status: 'For Requirements', count: forRequirements },
    { status: 'Hired', count: hired },
    { status: 'Not Shortlisted', count: notShortlisted },
    { status: 'Not Selected', count: notSelected },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex flex-row items-center border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'jobs'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Job Postings</span>
              {jobs.length > 0 && (
                <span className="bg-[#e0f2f7] text-[#116d8a] px-2 py-1 rounded-full text-xs" key={jobs.length}>
                  {jobs.length}
                </span>
              )}
              {refreshing && (
                <span className="text-xs text-gray-500">Refreshing...</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'applications'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Applications</span>
              {applications.length > 0 && (
                <span className="bg-[#e0f2f7] text-[#116d8a] px-2 py-1 rounded-full text-xs">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'evaluations'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Evaluations</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-5 h-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Account Settings</span>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#116d8a] px-6 py-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-lg border-4 border-white">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Admin Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#116d8a]" />
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl mb-1">
                      Hello, {profile?.name || profile?.firstName || user?.email?.split('@')[0] || 'Admin'}!
                    </h2>
                    <p className="text-white/90">
                      Manage job applications and track applicant progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div>
              <h3 className="text-lg text-gray-900 mb-4">Application Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Applications */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-[#e0f2f7] rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#116d8a]" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{totalApplications}</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>

                {/* Under Review */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Search className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>8%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{underReview}</div>
                  <div className="text-sm text-gray-600">Under Review</div>
                </div>

                {/* Interviews */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-[#b8dce5] rounded-lg flex items-center justify-center">
                      <CalendarCheck className="w-6 h-6 text-[#116d8a]" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{interviewed}</div>
                  <div className="text-sm text-gray-600">Interviews</div>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>New</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>

                {/* Interview Scheduled */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{interviewScheduled}</div>
                  <div className="text-sm text-gray-600">Interview Scheduled</div>
                </div>

                {/* Exam Scheduled */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>3%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{examScheduled}</div>
                  <div className="text-sm text-gray-600">Exam Scheduled</div>
                </div>

                {/* For Requirements */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>7%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{forRequirements}</div>
                  <div className="text-sm text-gray-600">For Requirements</div>
                </div>

                {/* Hired */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>15%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{hired}</div>
                  <div className="text-sm text-gray-600">Hired</div>
                </div>

                {/* Not Shortlisted */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <UserX className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span>10%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{notShortlisted}</div>
                  <div className="text-sm text-gray-600">Not Shortlisted</div>
                </div>

                {/* Not Selected */}
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-900 mb-1">{notSelected}</div>
                  <div className="text-sm text-gray-600">Not Selected</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg text-gray-900 mb-4">Application Status Distribution</h3>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No application data available
                  </div>
                )}
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg text-gray-900 mb-4">Application Status Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#14B8A6" name="Applications" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">
                  Job Postings
                  {jobs.length > 0 && (
                    <span className="ml-2 text-lg text-gray-500">({jobs.length})</span>
                  )}
                </h2>
                <p className="text-gray-600">Manage teaching and non-teaching positions</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadJobs(true)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={refreshing}
                >
                  <CalendarCheck className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={handleCreateJob}
                  className="flex items-center gap-2 bg-[#116d8a] text-white px-4 py-2 rounded-lg hover:bg-[#0d5469] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Job</span>
                </button>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No Jobs Posted</h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first job posting
                </p>
                <button
                  onClick={handleCreateJob}
                  className="bg-[#116d8a] text-white px-6 py-2 rounded-lg hover:bg-[#0d5469] transition-colors"
                >
                  Create Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={`${job.id}-${job.updatedAt || job.createdAt}`} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <span className="capitalize">{job.category}</span>
                          <span>•</span>
                          <span className="capitalize">{job.type}</span>
                          {job.department && (
                            <>
                              <span>•</span>
                              <span>{job.department}</span>
                            </>
                          )}
                        </div>
                        {job.salary && (
                          <div className="text-sm text-[#116d8a] mb-2">
                            Salary: {job.salary}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 text-[#116d8a]" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      {job.deadline && (
                        <p className="text-gray-500">
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </p>
                      )}
                      {job.updatedAt && (
                        <p className="text-xs text-gray-400">
                          Last updated: {new Date(job.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">
                Applications
                {applications.length > 0 && (
                  <span className="ml-2 text-lg text-gray-500">
                    ({filteredApplications.length} of {applications.length})
                  </span>
                )}
              </h2>
              <p className="text-gray-600">Review and manage applicant submissions</p>
            </div>

            {/* Search and Filter */}
            {applications.length > 0 && (
              <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or job title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="md:w-64">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="under review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview scheduled">Interview Scheduled</option>
                      <option value="exam scheduled">Exam Scheduled</option>
                      <option value="for requirements">For Requirements</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || statusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('all')
                      }}
                      className="px-4 py-2 text-sm text-[#116d8a] hover:text-[#0d5469] hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {applications.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600">
                  Applications will appear here once candidates start applying
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                  }}
                  className="text-[#116d8a] hover:text-[#0d5469]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {/* Profile Picture */}
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                          {app.profilePictureUrl ? (
                            <img
                              src={app.profilePictureUrl}
                              alt={app.applicantName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none'
                                if (e.currentTarget.nextElementSibling) {
                                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-full h-full flex items-center justify-center bg-[#E3F2FD] text-[#0D47A1]"
                            style={{ display: app.profilePictureUrl ? 'none' : 'flex' }}
                          >
                            <span className="text-xl">
                              {app.applicantName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AP'}
                            </span>
                          </div>
                        </div>

                        {/* Applicant Info */}
                        <div>
                          <h3 className="text-lg text-gray-900 mb-1">
                            {app.applicantName} - {app.jobTitle}
                          </h3>
                          <p className="text-sm text-gray-600">{app.applicantEmail}</p>
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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

                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#116d8a] hover:underline"
                        >
                          View Resume
                        </a>
                      )}
                      {app.certificatesUrl && (
                        <a
                          href={app.certificatesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#116d8a] hover:underline"
                        >
                          View Certificates
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
                      >
                        <option value="pending">Pending</option>
                        <option value="under review">Under Review</option>
                        <option value="interview scheduled">Interview Scheduled</option>
                        <option value="under interviews">Under Interviews</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="exam scheduled">Exam Scheduled</option>
                        <option value="exam completed">Exam Completed</option>
                        <option value="for requirements">For Requirements</option>
                        <option value="hired">Hired</option>
                        <option value="not shortlisted">Not Shortlisted</option>
                        <option value="not selected">Not Selected</option>
                      </select>

                      <button
                        onClick={() => {
                          console.log('=== View Details Clicked ===')
                          console.log('Application data:', app)
                          console.log('Work Experiences:', app.workExperiences)
                          console.log('Educations:', app.educations)
                          console.log('Documents:', {
                            pds: app.pdsUrl,
                            resume: app.resumeUrl,
                            letter: app.applicationLetterUrl,
                            tor: app.torUrl,
                            eligibility: app.eligibilityUrl,
                            other: app.otherDocsUrl
                          })
                          setViewingApplication(app)
                          setShowViewModal(true)
                        }}
                        className="px-3 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors text-sm flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        View Details
                      </button>

                      <button
                        onClick={() => handleScheduleInterview(app)}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Interview
                      </button>

                      <button
                        onClick={() => handleScheduleExam(app)}
                        className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Schedule Exam
                      </button>

                      <button
                        onClick={() => {
                          setEvaluatingApplication(app)
                          setShowEvaluationForm(true)
                        }}
                        className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Award className="w-4 h-4" />
                        Evaluate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evaluations Tab */}
        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">
                Applicant Evaluations
                {applications.filter((app: any) => app.evaluation).length > 0 && (
                  <span className="ml-2 text-lg text-gray-500">
                    ({filteredEvaluations.length} of {applications.filter((app: any) => app.evaluation).length})
                  </span>
                )}
              </h2>
              <p className="text-gray-600">View, edit, and print evaluation forms</p>
            </div>

            {/* Search and Filter Options */}
            {applications.filter((app: any) => app.evaluation).length > 0 && (
              <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by applicant name, position, or evaluator..."
                      value={evaluationSearchTerm}
                      onChange={(e) => setEvaluationSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Category Filter */}
                    <div className="flex-1">
                      <select
                        value={evaluationCategoryFilter}
                        onChange={(e) => setEvaluationCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="teaching">Teaching Positions</option>
                        <option value="non-teaching">Non-Teaching Positions</option>
                      </select>
                    </div>

                    {/* Score Range Filter */}
                    <div className="flex-1">
                      <select
                        value={evaluationScoreFilter}
                        onChange={(e) => setEvaluationScoreFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Score Ranges</option>
                        <option value="excellent">Excellent (90-100%)</option>
                        <option value="very-good">Very Good (80-89%)</option>
                        <option value="good">Good (70-79%)</option>
                        <option value="satisfactory">Satisfactory (60-69%)</option>
                        <option value="needs-improvement">Needs Improvement (&lt;60%)</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {(evaluationSearchTerm || evaluationCategoryFilter !== 'all' || evaluationScoreFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setEvaluationSearchTerm('')
                          setEvaluationCategoryFilter('all')
                          setEvaluationScoreFilter('all')
                        }}
                        className="px-4 py-2 text-sm text-[#116d8a] hover:text-[#0d5469] hover:bg-teal-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Evaluated Applications List */}
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading evaluations...</div>
            ) : applications.filter((app: any) => app.evaluation).length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No evaluations found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Evaluations will appear here after you evaluate applications
                </p>
              </div>
            ) : filteredEvaluations.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No Evaluations Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setEvaluationSearchTerm('')
                    setEvaluationCategoryFilter('all')
                    setEvaluationScoreFilter('all')
                  }}
                  className="text-[#116d8a] hover:text-[#0d5469]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((app: any) => (
                  <div key={app.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#64B5F6] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Applicant Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg text-gray-900">
                              {app.applicantName}
                            </h3>
                            <span className="px-2 py-0.5 bg-[#BBDEFB] text-[#0D47A1] text-xs rounded-full">
                              Evaluated
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="text-[#1565C0]">{app.jobTitle}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Email: {app.applicantEmail}
                          </p>
                          <p className="text-sm text-gray-500">
                            Evaluated by: {app.evaluation.evaluatorName || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total Score: <span className="text-[#1565C0]">{typeof app.evaluation.totalScore === 'string' ? app.evaluation.totalScore : app.evaluation.totalScore.toFixed(2)}%</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEvaluatingApplication(app)
                            setShowEvaluationForm(true)
                          }}
                          className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors text-sm flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setViewingEvaluation(app.evaluation)
                            setShowPrintableView(true)
                          }}
                          className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View as PDF
                        </button>
                      </div>
                    </div>

                    {/* Evaluation Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Potential</p>
                          <p className="text-gray-900">{app.evaluation.summary?.potential || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Education</p>
                          <p className="text-gray-900">{app.evaluation.summary?.education || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Experience</p>
                          <p className="text-gray-900">{app.evaluation.summary?.experience || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Training</p>
                          <p className="text-gray-900">{app.evaluation.summary?.training || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Eligibility</p>
                          <p className="text-gray-900">{app.evaluation.summary?.eligibility || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Accomplishments</p>
                          <p className="text-gray-900">{app.evaluation.summary?.accomplishments || '0.00'}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">
                Application History
                {applications.filter((app: any) => app.evaluation).length > 0 && (
                  <span className="ml-2 text-lg text-gray-500">
                    ({filteredHistory.length} of {applications.filter((app: any) => app.evaluation).length})
                  </span>
                )}
              </h2>
              <p className="text-gray-600">Complete evaluation history and records</p>
            </div>

            {/* Search and Filter Options */}
            {applications.filter((app: any) => app.evaluation).length > 0 && (
              <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by applicant name, position, or evaluator..."
                      value={historySearchTerm}
                      onChange={(e) => setHistorySearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Category Filter */}
                    <div className="flex-1">
                      <select
                        value={historyCategoryFilter}
                        onChange={(e) => setHistoryCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="teaching">Teaching Positions</option>
                        <option value="non-teaching">Non-Teaching Positions</option>
                      </select>
                    </div>

                    {/* Score Range Filter */}
                    <div className="flex-1">
                      <select
                        value={historyScoreFilter}
                        onChange={(e) => setHistoryScoreFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Score Ranges</option>
                        <option value="excellent">Excellent (90-100%)</option>
                        <option value="very-good">Very Good (80-89%)</option>
                        <option value="good">Good (70-79%)</option>
                        <option value="satisfactory">Satisfactory (60-69%)</option>
                        <option value="needs-improvement">Needs Improvement (&lt;60%)</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {(historySearchTerm || historyCategoryFilter !== 'all' || historyScoreFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setHistorySearchTerm('')
                          setHistoryCategoryFilter('all')
                          setHistoryScoreFilter('all')
                        }}
                        className="px-4 py-2 text-sm text-[#116d8a] hover:text-[#0d5469] hover:bg-teal-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* History List */}
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading history...</div>
            ) : applications.filter((app: any) => app.evaluation).length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No evaluation history found</p>
                <p className="text-sm text-gray-500 mt-2">
                  History will appear here after evaluations are completed
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No History Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setHistorySearchTerm('')
                    setHistoryCategoryFilter('all')
                    setHistoryScoreFilter('all')
                  }}
                  className="text-[#116d8a] hover:text-[#0d5469]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((app: any) => (
                  <div key={app.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#64B5F6] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Applicant Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg text-gray-900">
                              {app.applicantName}
                            </h3>
                            <span className="px-2 py-0.5 bg-[#BBDEFB] text-[#0D47A1] text-xs rounded-full">
                              Evaluated
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="text-[#116d8a]">{app.jobTitle}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Email: {app.applicantEmail}
                          </p>
                          <p className="text-sm text-gray-500">
                            Evaluated by: {app.evaluation.evaluatorName || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {app.evaluation.evaluationDate ? new Date(app.evaluation.evaluationDate).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total Score: <span className="text-[#116d8a]">{typeof app.evaluation.totalScore === 'string' ? app.evaluation.totalScore : app.evaluation.totalScore.toFixed(2)}%</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setViewingEvaluation(app.evaluation)
                            setShowPrintableView(true)
                          }}
                          className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => {
                            console.log('=== View Details Clicked (History) ===')
                            console.log('Application data:', app)
                            setViewingApplication(app)
                            setShowViewModal(true)
                          }}
                          className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors text-sm flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Evaluation Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Potential</p>
                          <p className="text-gray-900">{app.evaluation.summary?.potential || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Education</p>
                          <p className="text-gray-900">{app.evaluation.summary?.education || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Experience</p>
                          <p className="text-gray-900">{app.evaluation.summary?.experience || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Training</p>
                          <p className="text-gray-900">{app.evaluation.summary?.training || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Eligibility</p>
                          <p className="text-gray-900">{app.evaluation.summary?.eligibility || '0.00'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Accomplishments</p>
                          <p className="text-gray-900">{app.evaluation.summary?.accomplishments || '0.00'}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl text-gray-900 mb-2">Account Settings</h2>
              <p className="text-gray-600">
                Manage your personal information and account security
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
            <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
              <h3 className="text-lg text-gray-900 mb-4">Account Security</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your password and security settings
              </p>
              
              <div>
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="flex items-center gap-2 px-4 py-2 border border-[#116d8a] text-[#116d8a] rounded-lg hover:bg-[#f0f8fa] transition-colors"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                        className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors disabled:bg-gray-400"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a]"
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
                        className="flex-1 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors disabled:bg-gray-400"
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

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-gray-900">
                  {editingJob ? 'Edit Job' : 'Create New Job'}
                </h3>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitJob} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-3 pb-2 border-b">Basic Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Category *</label>
                        <select
                          value={jobCategory}
                          onChange={(e) => setJobCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="teaching">Teaching</option>
                          <option value="non-teaching">Non-Teaching</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Position Type *</label>
                        <select
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Education Level</label>
                        <select
                          value={jobEducationLevel}
                          onChange={(e) => setJobEducationLevel(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Level</option>
                          <option value="Primary Education">Primary Education</option>
                          <option value="Secondary Education">Secondary Education</option>
                          <option value="Higher Education">Higher Education</option>
                          <option value="Graduate Studies">Graduate Studies</option>
                          <option value="Not Applicable">Not Applicable</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Location</label>
                        <input
                          type="text"
                          value={jobLocation}
                          onChange={(e) => setJobLocation(e.target.value)}
                          placeholder="e.g., Los Baños Campus"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Place of Assignment</label>
                        <input
                          type="text"
                          value={jobPlaceOfAssignment}
                          onChange={(e) => setJobPlaceOfAssignment(e.target.value)}
                          placeholder="e.g., College of Engineering"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Department</label>
                        <input
                          type="text"
                          value={jobDepartment}
                          onChange={(e) => setJobDepartment(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Salary Range</label>
                        <input
                          type="text"
                          value={jobSalary}
                          onChange={(e) => setJobSalary(e.target.value)}
                          placeholder="e.g., PHP 25,000 - 35,000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Application Deadline</label>
                      <input
                        type="date"
                        value={jobDeadline}
                        onChange={(e) => setJobDeadline(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-3 pb-2 border-b">Job Description</h4>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the main responsibilities and duties..."
                    required
                  />
                </div>

                {/* Requirements & Qualifications */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-3 pb-2 border-b">Requirements & Qualifications</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Eligibility</label>
                      <input
                        type="text"
                        value={jobEligibility}
                        onChange={(e) => setJobEligibility(e.target.value)}
                        placeholder="e.g., LET Passer, CSC Eligible"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Qualification</label>
                      <input
                        type="text"
                        value={jobQualification}
                        onChange={(e) => setJobQualification(e.target.value)}
                        placeholder="e.g., Bachelor's in Computer Science"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Experience</label>
                      <input
                        type="text"
                        value={jobExperience}
                        onChange={(e) => setJobExperience(e.target.value)}
                        placeholder="e.g., 2 years teaching experience"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Training</label>
                      <input
                        type="text"
                        value={jobTraining}
                        onChange={(e) => setJobTraining(e.target.value)}
                        placeholder="e.g., None required or specific training needed"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Additional Requirements</label>
                      <textarea
                        value={jobRequirements}
                        onChange={(e) => setJobRequirements(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List any other requirements..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Form Modal */}
      {showEvaluationForm && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-gray-900">
                  Evaluate: {selectedApplication.applicantName}
                </h3>
                <button
                  onClick={() => setShowEvaluationForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitEvaluation} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2">Potential (15%) - Score out of 100</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={potential}
                    onChange={(e) => setPotential(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Interview Performance (10%) - Score out of 100</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={interview}
                    onChange={(e) => setInterview(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Personality - Score out of 100</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={personality}
                    onChange={(e) => setPersonality(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Communication Skills - Score out of 100</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={communication}
                    onChange={(e) => setCommunication(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Additional Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide additional feedback..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm mb-2">Weighted Score Preview:</h4>
                  <p className="text-sm text-gray-700">
                    Total: {((potential * 0.15) + (interview * 0.10) + (personality * 0.10) + (communication * 0.10)).toFixed(2)}%
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEvaluationForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Submitting...' : 'Submit Evaluation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview/Exam Modal */}
      {showScheduleModal && schedulingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-gray-900">
                  Schedule {scheduleType === 'interview' ? 'Interview' : 'Exam'}
                </h3>
                <button
                  onClick={() => {
                    setShowScheduleModal(false)
                    setSchedulingApplication(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm text-gray-900 mb-1">
                  {schedulingApplication.applicantName || 'N/A'}
                </h4>
                <p className="text-sm text-gray-600">
                  {schedulingApplication.jobTitle || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {schedulingApplication.applicantEmail || 'N/A'}
                </p>
                {schedulingApplication.id && (
                  <p className="text-xs text-gray-400 mt-2">
                    ID: {schedulingApplication.id}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmitSchedule} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {scheduleType === 'interview' ? 'Interview Venue/Location' : 'Exam Venue/Location'}
                  </label>
                  <input
                    type="text"
                    value={scheduleVenue}
                    onChange={(e) => setScheduleVenue(e.target.value)}
                    placeholder={scheduleType === 'interview' ? 'e.g., Admin Office, Room 201' : 'e.g., Computer Laboratory 1'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {scheduleType === 'interview' ? 'Interview Instructions' : 'Exam Instructions'}
                  </label>
                  <textarea
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    rows={4}
                    placeholder={scheduleType === 'interview' 
                      ? 'e.g., Please bring:\n• Valid Government ID\n• Resume/CV\n• Original and photocopies of credentials\n• Portfolio (if applicable)'
                      : 'e.g., Exam Requirements:\n• Valid Government ID\n• Pen and calculator\n• No electronic devices allowed\n• Exam duration: 2 hours'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className={`${scheduleType === 'interview' ? 'bg-blue-50 border-blue-200' : 'bg-cyan-50 border-cyan-200'} border rounded-lg p-3`}>
                  <p className="text-xs text-gray-700">
                    <strong>ℹ️ Note:</strong> {scheduleType === 'interview' 
                      ? 'The interview schedule will be visible to the applicant in their dashboard. You may also send them a separate email notification with the details.'
                      : 'The exam schedule will be visible to the applicant in their dashboard. Make sure they receive all necessary instructions.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleModal(false)
                      setSchedulingApplication(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Scheduling...' : `Schedule ${scheduleType === 'interview' ? 'Interview' : 'Exam'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Application Details Modal */}
      {showViewModal && viewingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-gray-900">Application Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setViewingApplication(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-3">Personal Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Full Name</p>
                    <p className="text-gray-900">{viewingApplication.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Email Address</p>
                    <p className="text-gray-900">{viewingApplication.applicantEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Phone Number</p>
                    <p className="text-gray-900">{viewingApplication.applicantPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Application Date</p>
                    <p className="text-gray-900">{new Date(viewingApplication.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-3">Job Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Position</p>
                    <p className="text-gray-900">{viewingApplication.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Category</p>
                    <p className="text-gray-900 capitalize">{viewingApplication.jobCategory || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Status</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(viewingApplication.status)}`}>
                      {viewingApplication.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {viewingApplication.coverLetter && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Cover Letter</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {viewingApplication.coverLetter}
                  </p>
                </div>
              )}

              {/* Documents */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-3">Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingApplication.resumeUrl && (
                    <a
                      href={viewingApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors text-sm"
                    >
                      View Resume
                    </a>
                  )}
                  {viewingApplication.certificatesUrl && (
                    <a
                      href={viewingApplication.certificatesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors text-sm"
                    >
                      View Certificates
                    </a>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              {viewingApplication.workExperiences && viewingApplication.workExperiences.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Work Experience</h4>
                  <div className="space-y-3">
                    {viewingApplication.workExperiences.map((exp: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-900">{exp.position}</p>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {viewingApplication.educations && viewingApplication.educations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Education</h4>
                  <div className="space-y-3">
                    {viewingApplication.educations.map((edu: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-900">{edu.degree}</p>
                        <p className="text-xs text-gray-600">{edu.school}</p>
                        <p className="text-xs text-gray-500">
                          {edu.startYear} - {edu.endYear}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview/Exam Modal */}
      {showScheduleModal && schedulingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-gray-900">
                  Schedule {scheduleType === 'interview' ? 'Interview' : 'Exam'}
                </h3>
                <button
                  onClick={() => {
                    setShowScheduleModal(false)
                    setSchedulingApplication(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm text-gray-900 mb-1">
                  {schedulingApplication.applicantName || 'N/A'}
                </h4>
                <p className="text-sm text-gray-600">
                  {schedulingApplication.jobTitle || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {schedulingApplication.applicantEmail || 'N/A'}
                </p>
                {schedulingApplication.id && (
                  <p className="text-xs text-gray-400 mt-2">
                    ID: {schedulingApplication.id}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmitSchedule} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {scheduleType === 'interview' ? 'Interview Venue/Location' : 'Exam Venue/Location'}
                  </label>
                  <input
                    type="text"
                    value={scheduleVenue}
                    onChange={(e) => setScheduleVenue(e.target.value)}
                    placeholder={scheduleType === 'interview' ? 'e.g., Admin Office, Room 201' : 'e.g., Computer Laboratory 1'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {scheduleType === 'interview' ? 'Interview Instructions' : 'Exam Instructions'}
                  </label>
                  <textarea
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    rows={4}
                    placeholder={scheduleType === 'interview' 
                      ? 'e.g., Please bring:\n• Valid Government ID\n• Resume/CV\n• Original and photocopies of credentials\n• Portfolio (if applicable)'
                      : 'e.g., Exam Requirements:\n• Valid Government ID\n• Pen and calculator\n• No electronic devices allowed\n• Exam duration: 2 hours'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className={`${scheduleType === 'interview' ? 'bg-blue-50 border-blue-200' : 'bg-cyan-50 border-cyan-200'} border rounded-lg p-3`}>
                  <p className="text-xs text-gray-700">
                    <strong>ℹ️ Note:</strong> {scheduleType === 'interview' 
                      ? 'The interview schedule will be visible to the applicant in their dashboard. You may also send them a separate email notification with the details.'
                      : 'The exam schedule will be visible to the applicant in their dashboard. Make sure they receive all necessary instructions.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleModal(false)
                      setSchedulingApplication(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Scheduling...' : `Schedule ${scheduleType === 'interview' ? 'Interview' : 'Exam'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Application Details Modal */}
      {showViewModal && viewingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-gray-900">Application Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setViewingApplication(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Debug Info - Remove after testing */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-xs">
                <p className="text-yellow-800 mb-2"><strong>Debug Information:</strong></p>
                <p className="text-yellow-700">Work Experiences: {viewingApplication.workExperiences?.length || 0} entries</p>
                <p className="text-yellow-700">Educations: {viewingApplication.educations?.length || 0} entries</p>
                <p className="text-yellow-700">Documents: {[
                  viewingApplication.pdsUrl && 'PDS',
                  viewingApplication.resumeUrl && 'Resume',
                  viewingApplication.applicationLetterUrl && 'Letter',
                  viewingApplication.torUrl && 'TOR',
                  viewingApplication.eligibilityUrl && 'Eligibility',
                  viewingApplication.otherDocsUrl && 'Other'
                ].filter(Boolean).join(', ') || 'None'}</p>
              </div>

              {/* Applicant Header */}
              <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Profile Picture */}
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-white shadow-md">
                      {viewingApplication.profilePictureUrl ? (
                        <img
                          src={viewingApplication.profilePictureUrl}
                          alt={viewingApplication.applicantName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.nextElementSibling) {
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'
                            }
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full flex items-center justify-center bg-[#116d8a] text-white"
                        style={{ display: viewingApplication.profilePictureUrl ? 'none' : 'flex' }}
                      >
                        <span className="text-2xl">
                          {viewingApplication.applicantName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AP'}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Info */}
                    <div>
                      <h4 className="text-xl text-gray-900 mb-2">
                        {viewingApplication.applicantName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {viewingApplication.applicantEmail}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {viewingApplication.phone}
                      </p>
                      <p className="text-sm text-gray-500">
                        Applied for: <span className="text-[#1565C0]">{viewingApplication.jobTitle}</span>
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(viewingApplication.status)}`}>
                    {viewingApplication.status}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#90CAF9]">
                  <p className="text-xs text-gray-500">
                    Applied on: {new Date(viewingApplication.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h5 className="text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#116d8a]" />
                  Personal Information
                </h5>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Full Name</label>
                      <p className="text-sm text-gray-900">{viewingApplication.applicantName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Email</label>
                      <p className="text-sm text-gray-900">{viewingApplication.applicantEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Phone</label>
                      <p className="text-sm text-gray-900">{viewingApplication.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Address</label>
                      <p className="text-sm text-gray-900">{viewingApplication.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {viewingApplication.coverLetter && (
                <div className="mb-6">
                  <h5 className="text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#116d8a]" />
                    Cover Letter
                  </h5>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewingApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {viewingApplication.workExperiences && viewingApplication.workExperiences.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#116d8a]" />
                    Work Experience ({viewingApplication.workExperiences.length})
                  </h5>
                  <div className="space-y-3">
                    {viewingApplication.workExperiences.map((exp: any, index: number) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h6 className="text-sm text-gray-900">{exp.position}</h6>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap ml-2">
                            {exp.from} - {exp.to || 'Present'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {exp.salary && (
                            <div>
                              <span className="text-gray-500">Salary: </span>
                              <span className="text-gray-900">{exp.salary}</span>
                            </div>
                          )}
                          {exp.grade && (
                            <div>
                              <span className="text-gray-500">Grade: </span>
                              <span className="text-gray-900">{exp.grade}</span>
                            </div>
                          )}
                          {exp.appointmentStatus && (
                            <div>
                              <span className="text-gray-500">Status: </span>
                              <span className="text-gray-900">{exp.appointmentStatus}</span>
                            </div>
                          )}
                          {exp.governmentService && (
                            <div>
                              <span className="text-gray-500">Govt Service: </span>
                              <span className="text-gray-900">{exp.governmentService}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Background */}
              {viewingApplication.educations && viewingApplication.educations.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#116d8a]" />
                    Educational Background ({viewingApplication.educations.length})
                  </h5>
                  <div className="space-y-3">
                    {viewingApplication.educations.map((edu: any, index: number) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h6 className="text-sm text-gray-900">{edu.level}</h6>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            {edu.course && (
                              <p className="text-xs text-gray-500 mt-1">Course: {edu.course}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap ml-2">
                            {edu.from} - {edu.to || 'Present'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {edu.units && (
                            <div>
                              <span className="text-gray-500">Units Earned: </span>
                              <span className="text-gray-900">{edu.units}</span>
                            </div>
                          )}
                          {edu.yearGraduated && (
                            <div>
                              <span className="text-gray-500">Year Graduated: </span>
                              <span className="text-gray-900">{edu.yearGraduated}</span>
                            </div>
                          )}
                        </div>
                        {edu.honors && (
                          <p className="text-xs text-[#116d8a] mt-2">🏆 {edu.honors}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              <div className="mb-6">
                <h5 className="text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#116d8a]" />
                  Uploaded Documents
                </h5>
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {viewingApplication.pdsUrl && (
                      <a
                        href={viewingApplication.pdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div className="flex-1">
                          <p className="text-sm text-indigo-900">Personal Data Sheet (PDS)</p>
                          <p className="text-xs text-indigo-600">Click to view</p>
                        </div>
                        <Download className="w-4 h-4 text-indigo-600" />
                      </a>
                    )}
                    {viewingApplication.resumeUrl && (
                      <a
                        href={viewingApplication.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-900">Resume/CV</p>
                          <p className="text-xs text-blue-600">Click to view</p>
                        </div>
                        <Download className="w-4 h-4 text-blue-600" />
                      </a>
                    )}
                    {viewingApplication.applicationLetterUrl && (
                      <a
                        href={viewingApplication.applicationLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm text-green-900">Application Letter</p>
                          <p className="text-xs text-green-600">Click to view</p>
                        </div>
                        <Download className="w-4 h-4 text-green-600" />
                      </a>
                    )}
                    {viewingApplication.torUrl && (
                      <a
                        href={viewingApplication.torUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-sm text-purple-900">Transcript of Records (TOR)</p>
                          <p className="text-xs text-purple-600">Click to view</p>
                        </div>
                        <Download className="w-4 h-4 text-purple-600" />
                      </a>
                    )}
                    {viewingApplication.eligibilityUrl && (
                      <a
                        href={viewingApplication.eligibilityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-cyan-600" />
                        <div className="flex-1">
                          <p className="text-sm text-cyan-900">Proof of Eligibility</p>
                          <p className="text-xs text-cyan-600">Click to view</p>
                        </div>
                        <Download className="w-4 h-4 text-cyan-600" />
                      </a>
                    )}
                    {viewingApplication.otherDocsUrl && (
                      <a
                        href={viewingApplication.otherDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm text-amber-900">Other Documents</p>
                          <p className="text-xs text-amber-600">Click to view</p>
                        </div>
                        <Download className="w-4 h-4 text-amber-600" />
                      </a>
                    )}
                  </div>
                  {!viewingApplication.pdsUrl && !viewingApplication.resumeUrl && !viewingApplication.applicationLetterUrl && !viewingApplication.torUrl && !viewingApplication.eligibilityUrl && !viewingApplication.otherDocsUrl && (
                    <p className="text-sm text-gray-500 text-center py-4">No documents uploaded</p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {viewingApplication.additionalInfo && (
                <div className="mb-6">
                  <h5 className="text-lg text-gray-900 mb-3">Additional Information</h5>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewingApplication.additionalInfo}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Application ID: <span className="text-gray-900 font-mono">{viewingApplication.id}</span>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setViewingApplication(null)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Form Modal */}
      {showEvaluationForm && evaluatingApplication && (
        <EvaluationForm
          application={evaluatingApplication}
          onClose={() => {
            setShowEvaluationForm(false)
            setEvaluatingApplication(null)
          }}
          onSuccess={() => {
            loadApplications()
          }}
        />
      )}

      {/* Printable Evaluation View Modal */}
      {showPrintableView && viewingEvaluation && (
        <PrintableEvaluationView
          evaluation={viewingEvaluation}
          onClose={() => {
            setShowPrintableView(false)
            setViewingEvaluation(null)
          }}
        />
      )}
    </div>
  )
}
