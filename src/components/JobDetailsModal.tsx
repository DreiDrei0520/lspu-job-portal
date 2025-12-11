import { X, MapPin, Building2, Calendar, DollarSign, Briefcase, GraduationCap, Award, Clock, FileText } from 'lucide-react'

interface JobDetailsModalProps {
  job: any
  onClose: () => void
  onApply?: () => void
}

export function JobDetailsModal({ job, onClose, onApply }: JobDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl text-gray-900">{job.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Overview Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm text-blue-900">Education Level</h3>
              </div>
              <p className="text-blue-800">{job.educationLevel || 'Not specified'}</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm text-purple-900">Position Type</h3>
              </div>
              <p className="text-purple-800 capitalize">{job.type || 'Full-Time'}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-green-600" />
                <h3 className="text-sm text-green-900">Category</h3>
              </div>
              <p className="text-green-800 capitalize">{job.category || 'Teaching'}</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm text-orange-900">Date Posted</h3>
              </div>
              <p className="text-orange-800">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Location & Assignment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm text-gray-700">Location</h3>
              </div>
              <p className="text-gray-900">{job.location || 'Los Baños Campus'}</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm text-gray-700">Place of Assignment</h3>
              </div>
              <p className="text-gray-900">{job.placeOfAssignment || job.department || 'Not specified'}</p>
            </div>
          </div>

          {/* Salary Range */}
          {job.salary && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-sm text-green-900">Salary Range</h3>
              </div>
              <p className="text-green-800 text-lg">{job.salary}</p>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-lg text-gray-900 mb-3 pb-2 border-b">Job Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description || 'No description available'}
            </p>
          </div>

          {/* Qualifications Section */}
          <div className="space-y-4">
            <h3 className="text-lg text-gray-900 mb-3 pb-2 border-b">Requirements & Qualifications</h3>

            {/* Eligibility */}
            {job.eligibility && (
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm text-gray-700">Eligibility</h4>
                </div>
                <p className="text-gray-900">{job.eligibility}</p>
              </div>
            )}

            {/* Qualification */}
            {job.qualification && (
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm text-gray-700">Qualification</h4>
                </div>
                <p className="text-gray-900">{job.qualification}</p>
              </div>
            )}

            {/* Experience */}
            {job.experience && (
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h4 className="text-sm text-gray-700">Experience</h4>
                </div>
                <p className="text-gray-900">{job.experience}</p>
              </div>
            )}

            {/* Training */}
            {job.training && (
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <h4 className="text-sm text-gray-700">Training</h4>
                </div>
                <p className="text-gray-900">{job.training}</p>
              </div>
            )}

            {/* General Requirements */}
            {job.requirements && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm text-gray-700 mb-2">Additional Requirements</h4>
                <p className="text-gray-900 whitespace-pre-line">{job.requirements}</p>
              </div>
            )}
          </div>

          {/* Deadline */}
          {job.deadline && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="text-sm text-red-900">Application Deadline</h4>
                  <p className="text-red-800">
                    {new Date(job.deadline).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {onApply && (
              <button
                onClick={() => {
                  onApply()
                  onClose()
                }}
                className="flex-1 px-6 py-3 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors"
              >
                Apply for This Position
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
