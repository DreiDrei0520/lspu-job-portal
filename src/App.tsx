import { useState, useEffect } from 'react'
import { supabase, getCurrentUser } from './utils/supabase-client'
import { api } from './utils/api'
import { LandingPage } from './components/LandingPage'
import { AuthForm } from './components/AuthForm'
import { ApplicantDashboard } from './components/ApplicantDashboard'
import { AdminDashboard } from './components/AdminDashboard'
import { SuperadminDashboard } from './components/SuperadminDashboard'
import { Navbar } from './components/Navbar'
import { Toaster } from './components/ui/sonner'
type View = 'landing' | 'auth' | 'dashboard'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDemoSeeder, setShowDemoSeeder] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        await loadUserRole(currentUser.id)
        setView('dashboard')
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserRole = async (userId: string) => {
    try {
      const { profile } = await api.getProfile()
      setUserRole(profile?.role || 'applicant')
    } catch (error) {
      console.error('Error loading user role:', error)
      setUserRole('applicant')
    }
  }

  const handleGetStarted = () => {
    setView('auth')
  }

  const handleAuthSuccess = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      await loadUserRole(currentUser.id)
      setView('dashboard')
    }
  }

  const handleBack = () => {
    setView('landing')
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setUserRole(null)
      setView('landing')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0f2f7] to-[#e0f2f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#116d8a] rounded-lg flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <span className="text-2xl">LS</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {view === 'landing' && (
        <>
          <LandingPage onGetStarted={handleGetStarted} />
          
          {/* Demo Seeder Button */}
         
        </>
      )}
      
      {view === 'auth' && <AuthForm onSuccess={handleAuthSuccess} onBack={handleBack} />}
      
      {view === 'dashboard' && user && (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          
          {userRole === 'applicant' && <ApplicantDashboard user={user} />}
          {userRole === 'admin' && <AdminDashboard user={user} />}
          {userRole === 'superadmin' && <SuperadminDashboard user={user} onLogout={handleLogout} />}
          
          {!userRole && (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          )}
        </>
      )}

    </div>
  )
}