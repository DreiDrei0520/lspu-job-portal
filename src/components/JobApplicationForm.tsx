import { useState } from 'react'
import { X, Plus, Trash2, Download, Upload, FileText, AlertCircle } from 'lucide-react'
import { api } from '../utils/api'
import { toast } from 'sonner@2.0.3'

interface JobApplicationFormProps {
  job: any
  user: any
  profile: any
  onClose: () => void
  onSuccess: () => void
}

interface WorkExperience {
  id: string
  position: string
  company: string
  from: string
  to: string
  salary: string
  grade: string
  appointmentStatus: string
  governmentService: string
}

interface Education {
  id: string
  level: string
  school: string
  course: string
  from: string
  to: string
  units: string
  yearGraduated: string
  honors: string
}

export function JobApplicationForm({ job, user, profile, onClose, onSuccess }: JobApplicationFormProps) {
  const [loading, setLoading] = useState(false)

  // Basic Information
  const [firstName, setFirstName] = useState(profile?.name?.split(' ')[0] || '')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState(profile?.name?.split(' ').slice(1).join(' ') || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(profile?.phone || '')

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      id: Date.now().toString(),
      position: '',
      company: '',
      from: '',
      to: '',
      salary: '',
      grade: '',
      appointmentStatus: '',
      governmentService: 'No'
    }
  ])

  // Education
  const [educations, setEducations] = useState<Education[]>([
    {
      id: Date.now().toString(),
      level: '',
      school: '',
      course: '',
      from: '',
      to: '',
      units: '',
      yearGraduated: '',
      honors: ''
    }
  ])

  // Documents
  const [pdsFile, setPdsFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [applicationLetterFile, setApplicationLetterFile] = useState<File | null>(null)
  const [torFile, setTorFile] = useState<File | null>(null)
  const [eligibilityFile, setEligibilityFile] = useState<File | null>(null)
  const [otherDocsFile, setOtherDocsFile] = useState<File | null>(null)

  // Declaration
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(false)

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      id: Date.now().toString(),
      position: '',
      company: '',
      from: '',
      to: '',
      salary: '',
      grade: '',
      appointmentStatus: '',
      governmentService: 'No'
    }])
  }

  const removeWorkExperience = (id: string) => {
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter(exp => exp.id !== id))
    }
  }

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setWorkExperiences(workExperiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const addEducation = () => {
    setEducations([...educations, {
      id: Date.now().toString(),
      level: '',
      school: '',
      course: '',
      from: '',
      to: '',
      units: '',
      yearGraduated: '',
      honors: ''
    }])
  }

  const removeEducation = (id: string) => {
    if (educations.length > 1) {
      setEducations(educations.filter(edu => edu.id !== id))
    }
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const validateFileSize = (file: File, maxSizeMB: number = 50): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`${file.name} exceeds the maximum file size of ${maxSizeMB}MB. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToDeclaration) {
      toast.error('Please agree to the declaration statement')
      return
    }

    if (!pdsFile || !resumeFile || !applicationLetterFile || !torFile) {
      toast.error('Please upload all required documents')
      return
    }

    // Validate file sizes (50MB max)
    const filesToValidate = [
      { file: pdsFile, name: 'PDS' },
      { file: resumeFile, name: 'Resume' },
      { file: applicationLetterFile, name: 'Application Letter' },
      { file: torFile, name: 'Transcript of Records' },
    ]

    if (eligibilityFile) {
      filesToValidate.push({ file: eligibilityFile, name: 'Proof of Eligibility' })
    }

    if (otherDocsFile) {
      filesToValidate.push({ file: otherDocsFile, name: 'Other Documents' })
    }

    for (const { file, name } of filesToValidate) {
      if (!validateFileSize(file, 50)) {
        return
      }
    }

    setLoading(true)

    try {
      // Upload documents one by one with better error handling
      const documentUrls: any = {}
      
      console.log('Starting document uploads...')
      
      if (pdsFile) {
        console.log('Uploading PDS...')
        const result = await api.uploadDocument(pdsFile, 'pds')
        documentUrls.pdsUrl = result.url
        documentUrls.pdsPath = result.path
        console.log('PDS uploaded successfully')
      }
      
      if (resumeFile) {
        console.log('Uploading Resume...')
        const result = await api.uploadDocument(resumeFile, 'resume')
        documentUrls.resumeUrl = result.url
        documentUrls.resumePath = result.path
        console.log('Resume uploaded successfully')
      }
      
      if (applicationLetterFile) {
        console.log('Uploading Application Letter...')
        const result = await api.uploadDocument(applicationLetterFile, 'application_letter')
        documentUrls.applicationLetterUrl = result.url
        documentUrls.applicationLetterPath = result.path
        console.log('Application Letter uploaded successfully')
      }
      
      if (torFile) {
        console.log('Uploading TOR...')
        const result = await api.uploadDocument(torFile, 'tor')
        documentUrls.torUrl = result.url
        documentUrls.torPath = result.path
        console.log('TOR uploaded successfully')
      }
      
      if (eligibilityFile) {
        console.log('Uploading Eligibility...')
        const result = await api.uploadDocument(eligibilityFile, 'eligibility')
        documentUrls.eligibilityUrl = result.url
        documentUrls.eligibilityPath = result.path
        console.log('Eligibility uploaded successfully')
      }
      
      if (otherDocsFile) {
        console.log('Uploading Other Documents...')
        const result = await api.uploadDocument(otherDocsFile, 'other_docs')
        documentUrls.otherDocsUrl = result.url
        documentUrls.otherDocsPath = result.path
        console.log('Other Documents uploaded successfully')
      }

      console.log('All documents uploaded successfully')

      // Submit application with all data
      await api.submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        jobCategory: job.category || 'non-teaching',
        
        // Basic Information
        firstName,
        middleName,
        lastName,
        email,
        phone,
        
        // Work Experience
        workExperiences: workExperiences.filter(exp => exp.position || exp.company),
        
        // Education
        educations: educations.filter(edu => edu.level || edu.school),
        
        // Documents
        ...documentUrls,
        
        // Meta
        applicantName: `${firstName} ${middleName} ${lastName}`.trim(),
        applicantEmail: email,
        submittedAt: new Date().toISOString(),
        agreedToDeclaration: true
      })

      toast.success('Application submitted successfully!')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Application submission error:', error)
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const educationLevels = [
    'Elementary',
    'Secondary',
    'Vocational/Trade Course',
    'College',
    'Graduate Studies'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-2xl text-gray-900">Job Application</h2>
            <p className="text-sm text-gray-600 mt-1">
              Submit your application for: <span className="font-medium">{job.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4 pb-2 border-b-2 border-green-600">
              A. Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Position Applied For</label>
                <input
                  type="text"
                  value={job.title}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you don't see your desired position, it may not be currently available.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              B. Work Experience
            </h3>
            
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm text-gray-700">Work Experience #{index + 1}</h4>
                    {workExperiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(exp.id)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Position Title</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Department / Agency / Office / Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">From</label>
                      <input
                        type="date"
                        value={exp.from}
                        onChange={(e) => updateWorkExperience(exp.id, 'from', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">To</label>
                      <input
                        type="date"
                        value={exp.to}
                        onChange={(e) => updateWorkExperience(exp.id, 'to', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Monthly Salary</label>
                      <input
                        type="text"
                        value={exp.salary}
                        onChange={(e) => updateWorkExperience(exp.id, 'salary', e.target.value)}
                        placeholder="₱"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Salary / Job / Pay Grade</label>
                      <input
                        type="text"
                        value={exp.grade}
                        onChange={(e) => updateWorkExperience(exp.id, 'grade', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Status of Appointment</label>
                      <input
                        type="text"
                        value={exp.appointmentStatus}
                        onChange={(e) => updateWorkExperience(exp.id, 'appointmentStatus', e.target.value)}
                        placeholder="e.g., Permanent, Contractual"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Government Service</label>
                      <select
                        value={exp.governmentService}
                        onChange={(e) => updateWorkExperience(exp.id, 'governmentService', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addWorkExperience}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors w-full justify-center"
              >
                <Plus className="w-5 h-5" />
                Add Another Work Experience
              </button>
            </div>
          </div>

          {/* Educational Background */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4 pb-2 border-b-2 border-purple-600">
              C. Educational Background
            </h3>
            
            <div className="space-y-6">
              {educations.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm text-gray-700">Education #{index + 1}</h4>
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Level</label>
                      <select
                        value={edu.level}
                        onChange={(e) => updateEducation(edu.id, 'level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Level</option>
                        {educationLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Name of School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Basic Education / Degree / Course</label>
                      <input
                        type="text"
                        value={edu.course}
                        onChange={(e) => updateEducation(edu.id, 'course', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Period of Attendance - From</label>
                      <input
                        type="text"
                        value={edu.from}
                        onChange={(e) => updateEducation(edu.id, 'from', e.target.value)}
                        placeholder="YYYY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Period of Attendance - To</label>
                      <input
                        type="text"
                        value={edu.to}
                        onChange={(e) => updateEducation(edu.id, 'to', e.target.value)}
                        placeholder="YYYY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Highest Level / Units Earned</label>
                      <input
                        type="text"
                        value={edu.units}
                        onChange={(e) => updateEducation(edu.id, 'units', e.target.value)}
                        placeholder="If not graduated"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Year Graduated</label>
                      <input
                        type="text"
                        value={edu.yearGraduated}
                        onChange={(e) => updateEducation(edu.id, 'yearGraduated', e.target.value)}
                        placeholder="YYYY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Scholarships / Academic Honors Received</label>
                      <input
                        type="text"
                        value={edu.honors}
                        onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors w-full justify-center"
              >
                <Plus className="w-5 h-5" />
                Add Another Education
              </button>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4 pb-2 border-b-2 border-orange-600">
              D. Required Documents
            </h3>
            
            <div className="space-y-4">
              {/* PDS Download Link */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-blue-900 mb-1">Personal Data Sheet (PDS)</h4>
                    <p className="text-xs text-blue-700 mb-2">
                      Download the PDS form, fill it out, and upload it below
                    </p>
                    <a
                      href="https://www.csc.gov.ph/phocadownload/userupload/jobseekers/CS%20Form%20No.%20212%20(Revised%202017)%20-%20Personal%20Data%20Sheet_v2.xlsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download PDS Form
                    </a>
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Important:</strong> Maximum file size is 50MB per document. Accepted formats: PDF for most documents, PDF/Word for Resume and Application Letter.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Filled-out PDS * (PDF, max 50MB)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && validateFileSize(file, 50)) {
                        setPdsFile(file)
                      } else {
                        e.target.value = ''
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    required
                  />
                  {pdsFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {pdsFile.name} ({(pdsFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Resume / CV * (PDF/Word, max 50MB)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && validateFileSize(file, 50)) {
                        setResumeFile(file)
                      } else {
                        e.target.value = ''
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    required
                  />
                  {resumeFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Application Letter * (PDF/Word, max 50MB)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && validateFileSize(file, 50)) {
                        setApplicationLetterFile(file)
                      } else {
                        e.target.value = ''
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    required
                  />
                  {applicationLetterFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {applicationLetterFile.name} ({(applicationLetterFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Transcript of Records (TOR) * (PDF, max 50MB)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && validateFileSize(file, 50)) {
                        setTorFile(file)
                      } else {
                        e.target.value = ''
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    required
                  />
                  {torFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {torFile.name} ({(torFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Proof of Eligibility (PDF, max 50MB)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && validateFileSize(file, 50)) {
                        setEligibilityFile(file)
                      } else if (file) {
                        e.target.value = ''
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {eligibilityFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {eligibilityFile.name} ({(eligibilityFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Other Supporting Documents (PDF, max 50MB)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file && validateFileSize(file, 50)) {
                        setOtherDocsFile(file)
                      } else if (file) {
                        e.target.value = ''
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {otherDocsFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {otherDocsFile.name} ({(otherDocsFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Declaration Statement */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
              E. Declaration Statement
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={agreedToDeclaration}
                  onChange={(e) => setAgreedToDeclaration(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  required
                />
                <label htmlFor="declaration" className="text-sm text-gray-700 cursor-pointer">
                  <span className="text-red-600">*</span> I hereby declare that all the information provided in this application is true and correct to the best of my knowledge. I understand that any false statement may result in the rejection of my application or termination of employment if discovered later.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !agreedToDeclaration}
                className="flex-1 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 animate-spin" />
                    Submitting Application...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
