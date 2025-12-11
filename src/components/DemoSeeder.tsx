import { useState } from 'react'
import { api } from '../utils/api'
import { toast } from 'sonner@2.0.3'

interface DemoSeederProps {
  onComplete: () => void
}

export function DemoSeeder({ onComplete }: DemoSeederProps) {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<string[]>([])

  const sampleAccounts = [
    {
      email: 'applicant@lspu.edu.ph',
      password: 'applicant123',
      name: 'Juan dela Cruz',
      role: 'applicant',
    },
    {
      email: 'admin@lspu.edu.ph',
      password: 'admin123',
      name: 'Maria Santos',
      role: 'admin',
    },
    {
      email: 'superadmin@lspu.edu.ph',
      password: 'superadmin123',
      name: 'Dr. Jose Rizal',
      role: 'superadmin',
    },
  ]

  const createSampleAccounts = async () => {
    setLoading(true)
    const createdAccounts: string[] = []

    for (const account of sampleAccounts) {
      try {
        const result = await api.signup(account.email, account.password, account.name, account.role)
        
        if (result.success) {
          createdAccounts.push(`${account.role}: ${account.email}`)
          toast.success(`Created ${account.role} account`)
        } else {
          throw new Error(result.error || 'Failed to create account')
        }
        
        // Add small delay between account creations
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
        console.error(`Failed to create ${account.role}:`, error)
        // If account already exists, still add it to the list
        const errorMsg = error.message || ''
        if (errorMsg.includes('already') || errorMsg.includes('exists') || errorMsg.includes('duplicate')) {
          createdAccounts.push(`${account.role}: ${account.email} (already exists)`)
          toast.info(`${account.role} account already exists`)
        } else {
          toast.error(`Failed to create ${account.role}: ${errorMsg}`)
        }
      }
    }

    if (createdAccounts.length === sampleAccounts.length) {
      toast.success('All demo accounts are ready!')
    }

    setCreated(createdAccounts)
    setLoading(false)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">Demo Account Setup</h3>
        <button
          onClick={onComplete}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Create sample accounts for testing all roles
      </p>

      {created.length === 0 ? (
        <div className="space-y-3 mb-4">
          {sampleAccounts.map((account, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium capitalize">{account.role}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  account.role === 'applicant' ? 'bg-green-100 text-green-700' :
                  account.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {account.role}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <div>📧 {account.email}</div>
                <div>🔑 {account.password}</div>
                <div>👤 {account.name}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <p className="text-sm text-green-600 mb-2">✅ Accounts created:</p>
          {created.map((account, index) => (
            <div key={index} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
              {account}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={createSampleAccounts}
        disabled={loading || created.length > 0}
        className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating accounts...' : created.length > 0 ? 'Accounts Created' : 'Create Demo Accounts'}
      </button>

      {created.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-blue-900 mb-2">
            You can now sign in with any of these accounts!
          </p>
          <button
            onClick={onComplete}
            className="text-blue-600 hover:underline text-sm"
          >
            Close and go to login →
          </button>
        </div>
      )}
    </div>
  )
}
