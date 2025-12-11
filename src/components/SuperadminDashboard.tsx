import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LayoutDashboard,
  UserPlus,
  Trash2,
  Download,
  Search,
  Filter,
  Calendar,
  SortAsc,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Mail,
  Shield,
  User,
  Briefcase,
  Camera
} from 'lucide-react'
import { supabase } from '../utils/supabase-client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cc72773f`

interface SuperadminDashboardProps {
  onLogout: () => void
  user: any
}

export function SuperadminDashboard({ onLogout, user }: SuperadminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allApplications, setAllApplications] = useState<any[]>([])
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Accounts tab state
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [accountsSearchTerm, setAccountsSearchTerm] = useState('')
  const [accountsRoleFilter, setAccountsRoleFilter] = useState('all')
  const [showCreateAdminDialog, setShowCreateAdminDialog] = useState(false)
  const [accountMessage, setAccountMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Applications tab state
  const [applicationsSearchTerm, setApplicationsSearchTerm] = useState('')
  const [applicationsStatusFilter, setApplicationsStatusFilter] = useState('all')
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [selectedApplicationToDelete, setSelectedApplicationToDelete] = useState<any>(null)
  
  // Reports tab state
  const [reportsSearchTerm, setReportsSearchTerm] = useState('')
  const [reportsStatusFilter, setReportsStatusFilter] = useState('all')
  const [reportsSortBy, setReportsSortBy] = useState('date-desc')
  const [reportsDateFrom, setReportsDateFrom] = useState('')
  const [reportsDateTo, setReportsDateTo] = useState('')
  
  // Settings tab state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Profile state
  const [profilePicture, setProfilePicture] = useState('')
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    fetchAllData()
    loadProfileData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) {
        console.error('No access token')
        setLoading(false)
        return
      }

      let usersData: any = { users: [] }

      // Fetch all users
      const usersResponse = await fetch(`${API_BASE}/superadmin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (usersResponse.ok) {
        usersData = await usersResponse.json()
        setAllUsers(usersData.users || [])
      }

      // Fetch all applications
      const appsResponse = await fetch(`${API_BASE}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (appsResponse.ok) {
        const appsData = await appsResponse.json()
        
        // Map applications with user names from users data
        const applicationsWithNames = (appsData.applications || []).map((app: any) => {
          // Try to find the user profile
          const userProfile = (usersData.users || []).find((u: any) => u.id === app.applicantId)
          
          return {
            ...app,
            fullName: app.fullName || app.applicantName || userProfile?.name || 'N/A',
            email: app.email || app.applicantEmail || userProfile?.email || 'N/A'
          }
        })
        
        setAllApplications(applicationsWithNames)
      }

      // Fetch all jobs
      const jobsResponse = await fetch(`${API_BASE}/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        setAllJobs(jobsData.jobs || [])
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfileData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      if (!token) return
      
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setProfilePicture(data.profile.profilePicture || '')
          setFirstName(data.profile.firstName || '')
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      setProfilePicture(base64String)
      
      // Save to backend
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        if (!token) return
        
        await fetch(`${API_BASE}/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            profilePicture: base64String
          })
        })
      } catch (error) {
        console.error('Error updating profile picture:', error)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCreateAdminAccount = async () => {
    setAccountMessage(null)

    if (!newAdminEmail || !newAdminPassword || !newAdminName) {
      setAccountMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    if (newAdminPassword.length < 6) {
      setAccountMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: newAdminEmail,
          password: newAdminPassword,
          name: newAdminName,
          role: 'admin'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setAccountMessage({ type: 'success', text: 'Admin account created successfully!' })
        setNewAdminEmail('')
        setNewAdminPassword('')
        setNewAdminName('')
        setShowCreateAdminDialog(false)
        fetchAllData()
      } else {
        setAccountMessage({ type: 'error', text: data.error || 'Failed to create admin account' })
      }
    } catch (error) {
      console.error('Error creating admin account:', error)
      setAccountMessage({ type: 'error', text: 'An error occurred while creating the account' })
    }
  }

  const handleDeleteAccount = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete the account for ${userEmail}? This action cannot be undone.`)) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch(`${API_BASE}/superadmin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setAccountMessage({ type: 'success', text: 'Account deleted successfully' })
        fetchAllData()
      } else {
        const data = await response.json()
        setAccountMessage({ type: 'error', text: data.error || 'Failed to delete account' })
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      setAccountMessage({ type: 'error', text: 'An error occurred while deleting the account' })
    }
  }

  const handleDeleteApplication = async () => {
    if (!selectedApplicationToDelete) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch(`${API_BASE}/superadmin/applications/${selectedApplicationToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setAccountMessage({ type: 'success', text: 'Application deleted successfully' })
        setShowDeleteConfirmDialog(false)
        setSelectedApplicationToDelete(null)
        fetchAllData()
      } else {
        const data = await response.json()
        setAccountMessage({ type: 'error', text: data.error || 'Failed to delete application' })
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      setAccountMessage({ type: 'error', text: 'An error occurred while deleting the application' })
    }
  }

  const handleChangePassword = async () => {
    setSettingsMessage(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSettingsMessage({ type: 'error', text: 'All password fields are required' })
      return
    }

    if (newPassword !== confirmPassword) {
      setSettingsMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setSettingsMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setSettingsMessage({ type: 'error', text: error.message })
      } else {
        setSettingsMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setSettingsMessage({ type: 'error', text: 'An error occurred while changing password' })
    }
  }

  const handleChangeEmail = async () => {
    setSettingsMessage(null)

    if (!newEmail || !currentPassword) {
      setSettingsMessage({ type: 'error', text: 'Email and current password are required' })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch(`${API_BASE}/update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newEmail,
          currentPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSettingsMessage({ type: 'success', text: 'Email updated successfully! Please log in again.' })
        setNewEmail('')
        setCurrentPassword('')
        setTimeout(() => onLogout(), 2000)
      } else {
        setSettingsMessage({ type: 'error', text: data.error || 'Failed to update email' })
      }
    } catch (error) {
      console.error('Error updating email:', error)
      setSettingsMessage({ type: 'error', text: 'An error occurred while updating email' })
    }
  }

  const generateReportPDF = () => {
    const doc = new jsPDF()
    
    // Filter and sort applications based on current filters
    let filteredApps = [...allApplications]
    
    // Apply search filter
    if (reportsSearchTerm) {
      filteredApps = filteredApps.filter(app =>
        app.fullName?.toLowerCase().includes(reportsSearchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(reportsSearchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(reportsSearchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (reportsStatusFilter !== 'all') {
      filteredApps = filteredApps.filter(app => app.status === reportsStatusFilter)
    }
    
    // Apply date range filter
    if (reportsDateFrom) {
      filteredApps = filteredApps.filter(app => new Date(app.createdAt) >= new Date(reportsDateFrom))
    }
    if (reportsDateTo) {
      filteredApps = filteredApps.filter(app => new Date(app.createdAt) <= new Date(reportsDateTo))
    }
    
    // Apply sorting
    if (reportsSortBy === 'date-desc') {
      filteredApps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (reportsSortBy === 'date-asc') {
      filteredApps.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (reportsSortBy === 'name-asc') {
      filteredApps.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''))
    } else if (reportsSortBy === 'name-desc') {
      filteredApps.sort((a, b) => (b.fullName || '').localeCompare(a.fullName || ''))
    }

    // Add LSPU Logo (simple circle with "LSPU" text as placeholder)
    doc.setFillColor(17, 109, 138)
    doc.circle(30, 20, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.text('LSPU', 30, 21, { align: 'center' })
    
    // Add clean header
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text('Republic of the Philippines', 105, 15, { align: 'center' })
    
    doc.setFontSize(16)
    doc.text('LAGUNA STATE POLYTECHNIC UNIVERSITY', 105, 22, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text('Province of Laguna', 105, 28, { align: 'center' })
    
    // Add horizontal line
    doc.setLineWidth(0.5)
    doc.line(20, 32, 190, 32)

    // Add report title and date
    doc.setFontSize(14)
    doc.text('Applications Report', 105, 42, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 48, { align: 'center' })

    // Add summary statistics
    doc.setFontSize(11)
    doc.text('Report Summary', 20, 58)
    doc.setFontSize(9)
    doc.text(`Total Applications: ${filteredApps.length}`, 20, 64)
    doc.text(`Pending: ${filteredApps.filter(a => a.status === 'pending').length}`, 20, 69)
    doc.text(`Under Review: ${filteredApps.filter(a => a.status === 'under_review').length}`, 70, 69)
    doc.text(`Hired: ${filteredApps.filter(a => a.status === 'hired').length}`, 120, 69)
    doc.text(`Rejected: ${filteredApps.filter(a => a.status === 'rejected').length}`, 20, 74)

    // Prepare table data
    const tableData = filteredApps.map(app => [
      app.fullName || 'N/A',
      app.email || 'N/A',
      app.jobTitle || 'N/A',
      app.status || 'N/A',
      new Date(app.createdAt).toLocaleDateString()
    ])

    // Add table
    autoTable(doc, {
      head: [['Name', 'Email', 'Position', 'Status', 'Date']],
      body: tableData,
      startY: 82,
      theme: 'striped',
      headStyles: {
        fillColor: [17, 109, 138],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 }
      }
    })

    // Save the PDF
    const filename = `LSPU_Applications_Report_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
  }

  // Filter accounts
  const filteredAccounts = allUsers.filter(account => {
    const matchesSearch = 
      account.email?.toLowerCase().includes(accountsSearchTerm.toLowerCase()) ||
      account.name?.toLowerCase().includes(accountsSearchTerm.toLowerCase())
    
    const matchesRole = accountsRoleFilter === 'all' || account.role === accountsRoleFilter
    
    return matchesSearch && matchesRole
  })

  // Filter applications for applications tab
  const filteredApplicationsTab = allApplications.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(applicationsSearchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(applicationsSearchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(applicationsSearchTerm.toLowerCase())
    
    const matchesStatus = applicationsStatusFilter === 'all' || app.status === applicationsStatusFilter
    
    return matchesSearch && matchesStatus
  })

  // Filter and sort applications for reports tab
  const getFilteredReportsData = () => {
    let filteredApps = [...allApplications]
    
    // Apply search filter
    if (reportsSearchTerm) {
      filteredApps = filteredApps.filter(app =>
        app.fullName?.toLowerCase().includes(reportsSearchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(reportsSearchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(reportsSearchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (reportsStatusFilter !== 'all') {
      filteredApps = filteredApps.filter(app => app.status === reportsStatusFilter)
    }
    
    // Apply date range filter
    if (reportsDateFrom) {
      filteredApps = filteredApps.filter(app => new Date(app.createdAt) >= new Date(reportsDateFrom))
    }
    if (reportsDateTo) {
      filteredApps = filteredApps.filter(app => new Date(app.createdAt) <= new Date(reportsDateTo))
    }
    
    // Apply sorting
    if (reportsSortBy === 'date-desc') {
      filteredApps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (reportsSortBy === 'date-asc') {
      filteredApps.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (reportsSortBy === 'name-asc') {
      filteredApps.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''))
    } else if (reportsSortBy === 'name-desc') {
      filteredApps.sort((a, b) => (b.fullName || '').localeCompare(a.fullName || ''))
    }
    
    return filteredApps
  }

  const filteredReportsData = getFilteredReportsData()

  // Statistics for overview
  const stats = {
    totalUsers: allUsers.length,
    totalAdmins: allUsers.filter(u => u.role === 'admin').length,
    totalApplicants: allUsers.filter(u => u.role === 'applicant').length,
    totalApplications: allApplications.length,
    pendingApplications: allApplications.filter(a => a.status === 'pending').length,
    underReviewApplications: allApplications.filter(a => a.status === 'under_review').length,
    hiredApplications: allApplications.filter(a => a.status === 'hired').length,
    rejectedApplications: allApplications.filter(a => a.status === 'rejected').length,
    totalJobs: allJobs.length,
    activeJobs: allJobs.filter(j => j.status === 'active').length
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      pending: 'default',
      under_review: 'secondary',
      hired: 'default',
      rejected: 'destructive'
    }
    
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      under_review: 'bg-blue-100 text-blue-800 border-blue-300',
      hired: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    }

    return (
      <Badge className={colors[status] || ''}>
        {status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const colors: { [key: string]: string } = {
      superadmin: 'bg-purple-100 text-purple-800 border-purple-300',
      admin: 'bg-blue-100 text-blue-800 border-blue-300',
      applicant: 'bg-gray-100 text-gray-800 border-gray-300'
    }

    return (
      <Badge className={colors[role] || ''}>
        {role === 'superadmin' ? 'Superadmin' : role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'accounts'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Accounts</span>
              {allUsers.length > 0 && (
                <span className="bg-[#e0f2f7] text-[#116d8a] px-2 py-1 rounded-full text-xs">
                  {allUsers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'applications'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Applications</span>
              {allApplications.length > 0 && (
                <span className="bg-[#e0f2f7] text-[#116d8a] px-2 py-1 rounded-full text-xs">
                  {allApplications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#116d8a] text-[#116d8a]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
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
                        alt="Superadmin Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#116d8a]" />
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl mb-1">
                      Hello, {firstName || user?.email?.split('@')[0] || 'Superadmin'}!
                    </h2>
                    <p className="text-white/90">
                      Complete system control and oversight of all operations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div>
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#116d8a]" />
                User Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-[#116d8a]">{stats.totalUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Admins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-blue-600">{stats.totalAdmins}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Applicants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-gray-600">{stats.totalApplicants}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Application Statistics */}
            <div>
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#116d8a]" />
                Application Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      Pending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-yellow-600">{stats.pendingApplications}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      Under Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-blue-600">{stats.underReviewApplications}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Hired
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-green-600">{stats.hiredApplications}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Rejected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-red-600">{stats.rejectedApplications}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Job Statistics */}
            <div>
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#116d8a]" />
                Job Postings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Total Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-[#116d8a]">{stats.totalJobs}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Active Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-green-600">{stats.activeJobs}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl mb-2">Account Management</h2>
                <p className="text-gray-600">Manage user accounts and create new admin accounts</p>
              </div>
              <Dialog open={showCreateAdminDialog} onOpenChange={setShowCreateAdminDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#116d8a] hover:bg-[#0d5468]">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Admin Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Admin Account</DialogTitle>
                    <DialogDescription>
                      Add a new administrator to the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminName">Full Name</Label>
                      <Input
                        id="adminName"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@lspu.edu.ph"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                    {accountMessage && (
                      <Alert className={accountMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                        <AlertDescription className={accountMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                          {accountMessage.text}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateAdminDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAdminAccount} className="bg-[#116d8a] hover:bg-[#0d5468]">
                      Create Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountsSearch">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="accountsSearch"
                        placeholder="Search by name or email..."
                        value={accountsSearchTerm}
                        onChange={(e) => setAccountsSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accountsRoleFilter">Filter by Role</Label>
                    <Select value={accountsRoleFilter} onValueChange={setAccountsRoleFilter}>
                      <SelectTrigger id="accountsRoleFilter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="applicant">Applicant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {accountMessage && (
              <Alert className={accountMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <AlertDescription className={accountMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {accountMessage.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Accounts List */}
            <div className="space-y-4">
              {filteredAccounts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    No accounts found
                  </CardContent>
                </Card>
              ) : (
                filteredAccounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0d5468] to-[#116d8a] flex items-center justify-center text-white">
                              {account.role === 'admin' || account.role === 'superadmin' ? (
                                <Shield className="h-5 w-5" />
                              ) : (
                                <User className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg">{account.name || 'N/A'}</h3>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {account.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            {getRoleBadge(account.role)}
                            <Badge variant="outline" className="text-xs">
                              Joined {new Date(account.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          {account.role !== 'superadmin' && account.id !== user?.id && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAccount(account.id, account.email)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Application Management</h2>
              <p className="text-gray-600">View and manage all job applications</p>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicationsSearch">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="applicationsSearch"
                        placeholder="Search by name, email, or position..."
                        value={applicationsSearchTerm}
                        onChange={(e) => setApplicationsSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="applicationsStatusFilter">Filter by Status</Label>
                    <Select value={applicationsStatusFilter} onValueChange={setApplicationsStatusFilter}>
                      <SelectTrigger id="applicationsStatusFilter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplicationsTab.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    No applications found
                  </CardContent>
                </Card>
              ) : (
                filteredApplicationsTab.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg mb-1">{app.fullName || 'N/A'}</h3>
                          <p className="text-sm text-gray-600 mb-2">{app.email}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{app.jobTitle}</Badge>
                            {getStatusBadge(app.status)}
                            <Badge variant="outline" className="text-xs">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedApplicationToDelete(app)
                            setShowDeleteConfirmDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this application? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                {selectedApplicationToDelete && (
                  <div className="py-4">
                    <p><strong>Applicant:</strong> {selectedApplicationToDelete.fullName}</p>
                    <p><strong>Position:</strong> {selectedApplicationToDelete.jobTitle}</p>
                    <p><strong>Status:</strong> {selectedApplicationToDelete.status}</p>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteApplication}>
                    Delete Application
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl mb-2">Reports & Analytics</h2>
                <p className="text-gray-600">Generate and export comprehensive reports</p>
              </div>
              <Button onClick={generateReportPDF} className="bg-[#116d8a] hover:bg-[#0d5468]">
                <Download className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Report Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reportsSearch">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="reportsSearch"
                        placeholder="Search applications..."
                        value={reportsSearchTerm}
                        onChange={(e) => setReportsSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reportsStatusFilter">Status</Label>
                    <Select value={reportsStatusFilter} onValueChange={setReportsStatusFilter}>
                      <SelectTrigger id="reportsStatusFilter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="reportsDateFrom">Date From</Label>
                    <Input
                      id="reportsDateFrom"
                      type="date"
                      value={reportsDateFrom}
                      onChange={(e) => setReportsDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportsDateTo">Date To</Label>
                    <Input
                      id="reportsDateTo"
                      type="date"
                      value={reportsDateTo}
                      onChange={(e) => setReportsDateTo(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportsSortBy">Sort By</Label>
                    <Select value={reportsSortBy} onValueChange={setReportsSortBy}>
                      <SelectTrigger id="reportsSortBy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                        <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  Preview of data that will be included in the exported report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl text-[#116d8a]">{stats.totalApplications}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl text-yellow-600">{stats.pendingApplications}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hired</p>
                      <p className="text-2xl text-green-600">{stats.hiredApplications}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rejected</p>
                      <p className="text-2xl text-red-600">{stats.rejectedApplications}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Sample Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Name</th>
                          <th className="text-left py-2 px-4">Email</th>
                          <th className="text-left py-2 px-4">Position</th>
                          <th className="text-left py-2 px-4">Status</th>
                          <th className="text-left py-2 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReportsData.slice(0, 5).map((app) => (
                          <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{app.fullName}</td>
                            <td className="py-2 px-4 text-gray-600">{app.email}</td>
                            <td className="py-2 px-4">{app.jobTitle}</td>
                            <td className="py-2 px-4">{getStatusBadge(app.status)}</td>
                            <td className="py-2 px-4 text-gray-600">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredReportsData.length > 5 && (
                    <p className="text-sm text-gray-600 text-center">
                      ... and {filteredReportsData.length - 5} more applications
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Account Settings</h2>
              <p className="text-gray-600">Manage your account preferences and security</p>
            </div>

            {settingsMessage && (
              <Alert className={settingsMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <AlertDescription className={settingsMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {settingsMessage.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile photo</CardDescription>
              </CardHeader>
              <CardContent>
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
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5469] cursor-pointer transition-colors">
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
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleChangePassword} className="bg-[#116d8a] hover:bg-[#0d5468]">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Change Email */}
            <Card>
              <CardHeader>
                <CardTitle>Change Email Address</CardTitle>
                <CardDescription>Update your account email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="newEmail">New Email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="newemail@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="currentPasswordEmail">Current Password (for verification)</Label>
                  <Input
                    id="currentPasswordEmail"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleChangeEmail} className="bg-[#116d8a] hover:bg-[#0d5468]">
                  Update Email
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}