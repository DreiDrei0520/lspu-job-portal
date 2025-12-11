import { X } from 'lucide-react'

interface LogoutModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-[#116d8a] text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl">Confirm Logout</h2>
          <button
            onClick={onCancel}
            className="text-white hover:bg-[#0d5468] rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-center mb-6">
            Are you sure you want to logout?
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
