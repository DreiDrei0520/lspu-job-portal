import { useState } from 'react'
import { User, Lock, Mail, UserPlus, LogIn, ArrowLeft } from 'lucide-react'
import { supabase } from '../utils/supabase-client'
import { api } from '../utils/api'
import { toast } from 'sonner@2.0.3'
import { ForgotPassword } from './ForgotPassword'
import lspuLogo from 'figma:asset/632e126b3f1d7e670d648c8751062fdf02606f8b.png'

interface AuthFormProps {
  onSuccess: (user: any) => void
  onBack: () => void
}

export function AuthForm({ onSuccess, onBack }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        toast.success('Logged in successfully!')
        onSuccess(data.user)
      } else {
        // Signup - always register as applicant
        const result = await api.signup(email, password, name, 'applicant')
        
        if (!result.success) {
          throw new Error(result.error || 'Signup failed')
        }

        // Auto login after signup
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        toast.success('Account created successfully!')
        onSuccess(data.user)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      // Provide more helpful error messages
      let errorMessage = error.message || 'Authentication failed'
      
      if (isLogin) {
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = '❌ Invalid email or password. Please check your credentials and try again.'
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before logging in'
        }
      } else {
        if (errorMessage.includes('already') || errorMessage.includes('duplicate')) {
          errorMessage = 'An account with this email already exists. Please log in instead.'
        }
      }
      
      toast.error(errorMessage, { duration: 6000 })
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2f7] to-[#e0f2f7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#116d8a] to-[#1a8bad] px-8 py-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <img src={lspuLogo} alt="LSPU Logo" className="w-14 h-14 object-contain bg-white/10 rounded-lg p-1" />
              <div>
                <div className="text-sm opacity-90">LSPU-LBC</div>
                <div className="text-xs opacity-75">Job Portal</div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl mb-1">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-[#e0f2f7] text-sm">
            {isLogin ? 'Sign in to continue' : 'Join our job portal today'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a] focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a] focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#116d8a] focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  At least 8 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#116d8a] text-white py-3 rounded-lg hover:bg-[#0d5468] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Please wait...'
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Forgot Password Link (Login Only) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#116d8a] hover:text-[#0d5468] hover:underline transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setEmail('')
                setPassword('')
                setName('')
              }}
              className="text-[#116d8a] hover:text-[#0d5468] transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}