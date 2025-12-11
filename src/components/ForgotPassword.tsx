import { useState } from 'react'
import { Mail, Lock, ArrowLeft, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../utils/api'

interface ForgotPasswordProps {
  onBack: () => void
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setLoading(true)

    try {
      console.log('Attempting to send reset code to:', email)
      const response = await api.sendPasswordResetCode(email)
      console.log('Reset code response received:', response)
      
      // Show success message
      toast.success('✅ Verification code sent to your email!', { 
        duration: 8000,
        description: 'Please check your inbox and spam folder' 
      })
      
      setStep('code')
    } catch (error: any) {
      console.error('Send code error details:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      toast.error(error.message || 'Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('=== VERIFY CODE FORM SUBMIT ===')
      console.log('Email:', email)
      console.log('Verification code:', verificationCode)
      
      await api.verifyResetCode(email, verificationCode)
      toast.success('Code verified! Please set your new password')
      setStep('password')
    } catch (error: any) {
      console.error('Verify code error:', error)
      toast.error(error.message || 'Invalid or expired verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      console.log('=== RESET PASSWORD FORM SUBMIT ===')
      console.log('Email:', email)
      console.log('Code:', verificationCode)
      console.log('New password length:', newPassword.length)
      
      const response = await api.resetPassword(email, verificationCode, newPassword)
      console.log('Reset response:', response)
      
      toast.success('✅ Password reset successfully! You can now login with your new password', {
        duration: 5000
      })
      
      // Wait a moment before redirecting to ensure password is updated
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (error: any) {
      console.error('Reset password error:', error)
      toast.error(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f9] to-[#e6f7f9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d5468] to-[#116d8a] px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl mb-1">Reset Password</h2>
          <p className="text-[#b3e5ec] text-sm">
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'code' && 'Enter the 6-digit code sent to your email'}
            {step === 'password' && 'Create a new password for your account'}
          </p>
        </div>

        <div className="p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step === 'email' ? 'bg-[#0d5468]' : 'bg-[#80d3d9]'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'code' ? 'bg-[#0d5468]' : step === 'password' ? 'bg-[#80d3d9]' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'password' ? 'bg-[#0d5468]' : 'bg-gray-300'}`}></div>
          </div>

          {/* Step 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14899e] focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send a 6-digit verification code to this email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0d5468] text-white py-3 rounded-lg hover:bg-[#0a3f4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14899e] focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Code sent to: <span className="text-[#0d5468]">{email}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-[#0d5468] text-white py-3 rounded-lg hover:bg-[#0a3f4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Step 3: Set New Password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14899e] focus:border-transparent"
                    placeholder="Enter new password"
                    minLength={8}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  At least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14899e] focus:border-transparent"
                    placeholder="Confirm new password"
                    minLength={8}
                    required
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                className="w-full bg-[#0d5468] text-white py-3 rounded-lg hover:bg-[#0a3f4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-[#0d5468] transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
