import { useState, useEffect } from 'react'
import { X, Save, FileText, User } from 'lucide-react'
import { api } from '../utils/api'
import { toast } from 'sonner@2.0.3'

interface EvaluationFormProps {
  application: any
  onClose: () => void
  onSuccess: () => void
}

export function EvaluationForm({ application, onClose, onSuccess }: EvaluationFormProps) {
  const [loading, setLoading] = useState(false)
  const existingEvaluation = application.evaluation
  
  // Determine if this is a teaching position
  const isTeachingPosition = application.jobCategory?.toLowerCase() === 'teaching' || 
                             application.jobTitle?.toLowerCase().includes('teacher') ||
                             application.jobTitle?.toLowerCase().includes('instructor') ||
                             application.jobTitle?.toLowerCase().includes('professor')

  // EVALUATOR
  const [evaluatorName, setEvaluatorName] = useState(existingEvaluation?.evaluatorName || '')

  // POTENTIAL (15%)
  const [personality, setPersonality] = useState(existingEvaluation?.potential?.personality || 10)
  const [communication, setCommunication] = useState(existingEvaluation?.potential?.communication || 10)
  const [analytical, setAnalytical] = useState(existingEvaluation?.potential?.analytical || 10)
  const [achievement, setAchievement] = useState(existingEvaluation?.potential?.achievement || 10)
  const [leadership, setLeadership] = useState(existingEvaluation?.potential?.leadership || 10)
  const [relationship, setRelationship] = useState(existingEvaluation?.potential?.relationship || 10)
  const [jobFit, setJobFit] = useState(existingEvaluation?.potential?.jobFit || 10)
  const [aptitudeTest, setAptitudeTest] = useState(existingEvaluation?.potential?.aptitudeTest || 5)

  // EDUCATION (40%)
  const [educationRelevance, setEducationRelevance] = useState(existingEvaluation?.education?.relevance || 30)
  const [basicEducation, setBasicEducation] = useState(existingEvaluation?.education?.basic || 30)
  const [masteralUnits, setMasteralUnits] = useState(existingEvaluation?.education?.masteralUnits || 0)
  const [doctoralUnits, setDoctoralUnits] = useState(existingEvaluation?.education?.doctoralUnits || 0)

  // EXPERIENCE (20%)
  const [experienceYears, setExperienceYears] = useState(existingEvaluation?.experience?.years || 15)
  const [additionalExperience, setAdditionalExperience] = useState(existingEvaluation?.experience?.additional || 0)

  // TRAINING (10%)
  const [trainingRelevance, setTrainingRelevance] = useState(existingEvaluation?.training?.relevance || 5)
  const [additionalTraining, setAdditionalTraining] = useState(existingEvaluation?.training?.additional || 0)

  // ELIGIBILITY (10%)
  const [eligibility, setEligibility] = useState(existingEvaluation?.eligibility?.score ? parseFloat(existingEvaluation.eligibility.score) : 10)

  // OUTSTANDING ACCOMPLISHMENTS (5%)
  const [accomplishments, setAccomplishments] = useState(existingEvaluation?.accomplishments?.score ? parseFloat(existingEvaluation.accomplishments.score) : 5)

  // Calculate totals
  const interviewTotal = personality + communication + analytical + achievement + leadership + relationship + jobFit
  const potentialScore = ((interviewTotal / 70) * 10) + aptitudeTest
  
  const educationTotal = educationRelevance + (isTeachingPosition ? doctoralUnits : (masteralUnits + doctoralUnits))
  const educationScore = (educationTotal / 40) * 40
  
  const experienceTotal = experienceYears + additionalExperience
  const experienceScore = (experienceTotal / 20) * 20
  
  const trainingTotal = trainingRelevance + additionalTraining
  const trainingScore = (trainingTotal / 10) * 10
  
  const eligibilityScore = (eligibility / 10) * 10
  
  const accomplishmentsScore = (accomplishments / 5) * 5
  
  const totalScore = potentialScore + educationScore + experienceScore + trainingScore + eligibilityScore + accomplishmentsScore

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!evaluatorName.trim()) {
      toast.error('Please enter evaluator name')
      return
    }

    setLoading(true)

    try {
      const evaluationData = {
        applicationId: application.id,
        applicantName: application.applicantName,
        position: application.jobTitle,
        jobCategory: isTeachingPosition ? 'teaching' : 'non-teaching',
        evaluatorName,
        
        // Potential
        potential: {
          personality,
          communication,
          analytical,
          achievement,
          leadership,
          relationship,
          jobFit,
          interviewTotal,
          aptitudeTest,
          score: potentialScore.toFixed(2)
        },
        
        // Education
        education: {
          relevance: educationRelevance,
          basic: basicEducation,
          masteralUnits,
          doctoralUnits,
          total: educationTotal,
          score: educationScore.toFixed(2)
        },
        
        // Experience
        experience: {
          years: experienceYears,
          additional: additionalExperience,
          total: experienceTotal,
          score: experienceScore.toFixed(2)
        },
        
        // Training
        training: {
          relevance: trainingRelevance,
          additional: additionalTraining,
          total: trainingTotal,
          score: trainingScore.toFixed(2)
        },
        
        // Eligibility
        eligibility: {
          score: eligibilityScore.toFixed(2)
        },
        
        // Accomplishments
        accomplishments: {
          score: accomplishmentsScore.toFixed(2)
        },
        
        // Summary
        summary: {
          potential: potentialScore.toFixed(2),
          education: educationScore.toFixed(2),
          experience: experienceScore.toFixed(2),
          training: trainingScore.toFixed(2),
          eligibility: eligibilityScore.toFixed(2),
          accomplishments: accomplishmentsScore.toFixed(2),
          total: totalScore.toFixed(2)
        },
        
        totalScore: totalScore.toFixed(2),
        evaluatedAt: new Date().toISOString()
      }

      await api.submitEvaluation(evaluationData)
      
      toast.success(existingEvaluation ? 'Evaluation updated successfully!' : 'Evaluation submitted successfully!')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Evaluation submission error:', error)
      toast.error(error.message || 'Failed to submit evaluation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-gray-900">
                LSPU Personnel Selection Board {existingEvaluation && <span className="text-blue-600">- Editing</span>}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Assessment Criteria - {isTeachingPosition ? 'Teaching Position' : 'Non-Teaching Position'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-6">
            {/* Applicant Information */}
            <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Name of Applicant</label>
                  <p className="text-sm text-gray-900">{application.applicantName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Position</label>
                  <p className="text-sm text-gray-900">{application.jobTitle}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Category</label>
                  <p className="text-sm text-gray-900">
                    {isTeachingPosition ? 'Teaching Position' : 'Non-Teaching Position'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Evaluator Name</label>
                  <input
                    type="text"
                    value={evaluatorName}
                    onChange={(e) => setEvaluatorName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            </div>
          {/* I. POTENTIAL (15%) */}
          <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4 bg-[#BBDEFB] px-4 py-2 rounded">
                I. POTENTIAL (15%)
              </h3>
              
              {/* Interview (10%) */}
              <div className="mb-4">
                <h4 className="text-sm text-gray-700 mb-3">Interview (10%)</h4>
                <div className="space-y-3 ml-4">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Personality (Pleasing personal appearance)</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={personality}
                        onChange={(e) => setPersonality(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Communication Skills</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={communication}
                        onChange={(e) => setCommunication(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Analytical Skills</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={analytical}
                        onChange={(e) => setAnalytical(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Achievement Orientation</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={achievement}
                        onChange={(e) => setAchievement(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Leadership/Management</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={leadership}
                        onChange={(e) => setLeadership(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Relationship Management</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={relationship}
                        onChange={(e) => setRelationship(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-8">
                      <label className="text-xs text-gray-600">Job Fit</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={jobFit}
                        onChange={(e) => setJobFit(Number(e.target.value))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded">
                    <div className="col-span-8">
                      <label className="text-sm text-gray-900">Total Interview Score (Max: 70)</label>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={interviewTotal}
                        readOnly
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Aptitude Test (5%) */}
              <div className="ml-4">
                <h4 className="text-sm text-gray-700 mb-3">Aptitude Test (5%)</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Superior', value: 5 },
                    { label: 'Above Average', value: 4 },
                    { label: 'Average', value: 3 },
                    { label: 'Below Average', value: 2 },
                    { label: 'Lowest', value: 1 }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="aptitude"
                        value={option.value}
                        checked={aptitudeTest === option.value}
                        onChange={(e) => setAptitudeTest(Number(e.target.value))}
                        className="w-4 h-4 text-[#1976D2]"
                      />
                      <span className="text-gray-700">{option.label} ({option.value} points)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-[#E3F2FD] p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">Potential Score (15%)</span>
                  <span className="text-lg text-[#1565C0]">{potentialScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* II. EDUCATION (40%) */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4 bg-[#BBDEFB] px-4 py-2 rounded">
                II. EDUCATION (40%)
              </h3>
              
              <div className="space-y-3 ml-4">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-8">
                    <label className="text-xs text-gray-600">Relevance and Appropriateness of Education (Max: 40)</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={educationRelevance}
                      onChange={(e) => setEducationRelevance(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                {isTeachingPosition ? (
                  <>
                    {/* Teaching: Basic Minimum Requirement (Masteral) */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded">
                      <div className="col-span-8">
                        <label className="text-xs text-gray-600">Basic Minimum Requirement (Masteral) - 35 points</label>
                      </div>
                      <div className="col-span-4">
                        <span className="text-sm text-gray-900">35</span>
                      </div>
                    </div>

                    {/* Teaching: Doctoral Units */}
                    <div className="border-l-2 border-[#64B5F6] pl-4">
                      <p className="text-xs text-gray-600 mb-2">Additional points: Doctoral Degree or Units</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Completed 20% of Total units', value: 1 },
                          { label: 'Completed 40% of Total units', value: 2 },
                          { label: 'Completed 60% of Total units', value: 3 },
                          { label: 'Completed 80% of Total units (CAR)', value: 4 },
                          { label: 'Completed 100% of Total units', value: 5 }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 text-xs">
                            <input
                              type="radio"
                              name="doctoral"
                              value={option.value}
                              checked={doctoralUnits === option.value}
                              onChange={(e) => setDoctoralUnits(Number(e.target.value))}
                              className="w-3 h-3 text-[#1976D2]"
                            />
                            <span className="text-gray-700">{option.label} ({option.value} point{option.value > 1 ? 's' : ''})</span>
                          </label>
                        ))}
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="doctoral"
                            value={0}
                            checked={doctoralUnits === 0}
                            onChange={(e) => setDoctoralUnits(Number(e.target.value))}
                            className="w-3 h-3 text-[#1976D2]"
                          />
                          <span className="text-gray-700">None (0 points)</span>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Non-Teaching: Basic Minimum Requirement */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded">
                      <div className="col-span-8">
                        <label className="text-xs text-gray-600">Basic Minimum Requirement per QS - 30 points</label>
                      </div>
                      <div className="col-span-4">
                        <span className="text-sm text-gray-900">30</span>
                      </div>
                    </div>

                    {/* Non-Teaching: Masteral Units */}
                    <div className="border-l-2 border-blue-300 pl-4">
                      <p className="text-xs text-gray-600 mb-2">Additional points: Masteral Degree or Units</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Completed 25% of Total units', value: 1 },
                          { label: 'Completed 50% of Total units', value: 2 },
                          { label: 'Completed 75% of Total units', value: 3 },
                          { label: 'Completed Academic Requirements (CAR)', value: 4 },
                          { label: 'Completed 100% of Total units', value: 5 }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 text-xs">
                            <input
                              type="radio"
                              name="masteral"
                              value={option.value}
                              checked={masteralUnits === option.value}
                              onChange={(e) => setMasteralUnits(Number(e.target.value))}
                              className="w-3 h-3 text-blue-600"
                            />
                            <span className="text-gray-700">{option.label} ({option.value} point{option.value > 1 ? 's' : ''})</span>
                          </label>
                        ))}
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="masteral"
                            value={0}
                            checked={masteralUnits === 0}
                            onChange={(e) => setMasteralUnits(Number(e.target.value))}
                            className="w-3 h-3 text-blue-600"
                          />
                          <span className="text-gray-700">None (0 points)</span>
                        </label>
                      </div>
                    </div>

                    {/* Non-Teaching: Doctoral Units */}
                    <div className="border-l-2 border-purple-300 pl-4">
                      <p className="text-xs text-gray-600 mb-2">Additional points: Doctoral Degree or Units</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Completed 25% of Total units', value: 6 },
                          { label: 'Completed 50% of Total units', value: 7 },
                          { label: 'Completed 75% of Total units', value: 8 },
                          { label: 'Completed Academic Requirements (CAR)', value: 9 },
                          { label: 'Completed 100% of Total units', value: 10 }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 text-xs">
                            <input
                              type="radio"
                              name="doctoral-nt"
                              value={option.value}
                              checked={doctoralUnits === option.value}
                              onChange={(e) => setDoctoralUnits(Number(e.target.value))}
                              className="w-3 h-3 text-purple-600"
                            />
                            <span className="text-gray-700">{option.label} ({option.value} points)</span>
                          </label>
                        ))}
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="doctoral-nt"
                            value={0}
                            checked={doctoralUnits === 0}
                            onChange={(e) => setDoctoralUnits(Number(e.target.value))}
                            className="w-3 h-3 text-purple-600"
                          />
                          <span className="text-gray-700">None (0 points)</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 bg-[#E3F2FD] p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">Education Score (40%)</span>
                  <span className="text-lg text-[#1565C0]">{educationScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* III. EXPERIENCE (20%) */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4 bg-[#BBDEFB] px-4 py-2 rounded">
                III. EXPERIENCE (20%)
              </h3>
              
              <div className="space-y-3 ml-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Relevance and Appropriateness of Experience</p>
                  <div className="space-y-2">
                    {[
                      { label: '5 yrs to 10 yrs Experience', value: 15 },
                      { label: '3 yrs to 4 yrs Experience', value: 10 },
                      { label: '1 yr to 2 yrs Experience', value: 5 }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name="experience"
                          value={option.value}
                          checked={experienceYears === option.value}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-3 h-3 text-[#1976D2]"
                        />
                        <span className="text-gray-700">{option.label} ({option.value} points)</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-8">
                    <label className="text-xs text-gray-600">Additional points for every year (more than 10 yrs)</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={additionalExperience}
                      onChange={(e) => setAdditionalExperience(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#E3F2FD] p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">Experience Score (20%)</span>
                  <span className="text-lg text-[#1565C0]">{experienceScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* IV. TRAINING (10%) */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4 bg-[#BBDEFB] px-4 py-2 rounded">
                IV. TRAINING (10%)
              </h3>
              
              <div className="space-y-3 ml-4">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-8">
                    <label className="text-xs text-gray-600">Relevance and Appropriateness of Training (40hrs)</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={trainingRelevance}
                      onChange={(e) => setTrainingRelevance(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-8">
                    <label className="text-xs text-gray-600">Additional one point for every 8 hrs of training</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={additionalTraining}
                      onChange={(e) => setAdditionalTraining(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#E3F2FD] p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">Training Score (10%)</span>
                  <span className="text-lg text-[#1565C0]">{trainingScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* V. ELIGIBILITY (10%) */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4 bg-[#BBDEFB] px-4 py-2 rounded">
                V. ELIGIBILITY (10%)
              </h3>
              
              <div className="space-y-3 ml-4">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-8">
                    <label className="text-xs text-gray-600">RA 1080, CSC Exam, BAR/BOARD Exam</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={eligibility}
                      onChange={(e) => setEligibility(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#E3F2FD] p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">Eligibility Score (10%)</span>
                  <span className="text-lg text-[#1565C0]">{eligibilityScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* VI. OUTSTANDING ACCOMPLISHMENTS (5%) */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-4 bg-[#BBDEFB] px-4 py-2 rounded">
                VI. OUTSTANDING ACCOMPLISHMENTS (5%)
              </h3>
              
              <div className="space-y-3 ml-4">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-8">
                    <label className="text-xs text-gray-600">Citations, Recognitions, Honor Graduates, Board/Bar Topnotcher, CSC Topnotcher</label>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={accomplishments}
                      onChange={(e) => setAccomplishments(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#E3F2FD] p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">Outstanding Accomplishments Score (5%)</span>
                  <span className="text-lg text-[#1565C0]">{accomplishmentsScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

          {/* SUMMARY OF SCORES */}
          <div className="bg-[#1976D2] text-white rounded-lg p-6 mb-6">
            <h3 className="text-xl mb-4">SUMMARY OF SCORES</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-[#64B5F6] pb-2">
                <span>I. Potential (15%)</span>
                <span className="text-xl">{potentialScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#64B5F6] pb-2">
                <span>II. Education (40%)</span>
                <span className="text-xl">{educationScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#64B5F6] pb-2">
                <span>III. Experience (20%)</span>
                <span className="text-xl">{experienceScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#64B5F6] pb-2">
                <span>IV. Training (10%)</span>
                <span className="text-xl">{trainingScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#64B5F6] pb-2">
                <span>V. Eligibility (10%)</span>
                <span className="text-xl">{eligibilityScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#64B5F6] pb-2">
                <span>VI. Outstanding Accomplishment (5%)</span>
                <span className="text-xl">{accomplishmentsScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-white">
                <span className="text-xl">TOTAL (100%)</span>
                <span className="text-3xl">{totalScore.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

          {/* Footer Actions */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg flex-shrink-0">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-[#1565C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? (existingEvaluation ? 'Updating...' : 'Submitting...') : (existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
