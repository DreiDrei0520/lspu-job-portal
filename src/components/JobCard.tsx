import { Briefcase, MapPin, Clock, DollarSign, Info } from 'lucide-react'

interface JobCardProps {
  job: any
  onApply?: (job: any) => void
  onViewDetails?: (job: any) => void
}

export function JobCard({ job, onApply, onViewDetails }: JobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span className="capitalize">{job.type || 'Full-time'}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs ${
          job.category === 'teaching' 
            ? 'bg-[#b8dce5] text-[#0d5468]' 
            : 'bg-purple-100 text-purple-700'
        }`}>
          {job.category || 'Teaching'}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="space-y-2 mb-4">
        {(job.location || job.department) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location || job.department}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
        {job.deadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(job)}
            className="flex-1 px-4 py-2 border border-[#116d8a] text-[#116d8a] rounded-lg hover:bg-[#e0f2f7] transition-colors flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            Details
          </button>
        )}
        {onApply && (
          <button
            onClick={() => onApply(job)}
            className="flex-1 px-4 py-2 bg-[#116d8a] text-white rounded-lg hover:bg-[#0d5468] transition-colors"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  )
}
