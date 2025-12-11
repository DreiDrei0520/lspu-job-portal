import { X, Printer } from 'lucide-react'
import lspuLogo from 'figma:asset/632e126b3f1d7e670d648c8751062fdf02606f8b.png'

interface PrintableEvaluationViewProps {
  evaluation: any
  onClose: () => void
}

export function PrintableEvaluationView({ evaluation, onClose }: PrintableEvaluationViewProps) {
  // Add null safety checks
  if (!evaluation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <p className="text-gray-900 mb-4">Evaluation data not available</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const isTeaching = evaluation.jobCategory === 'teaching'
  
  // Ensure all nested objects exist with default values
  const potential = evaluation.potential || {}
  const education = evaluation.education || {}
  const experience = evaluation.experience || {}
  const training = evaluation.training || {}
  const eligibility = evaluation.eligibility || {}
  const accomplishments = evaluation.accomplishments || {}
  const summary = evaluation.summary || {}
  
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-evaluation, #printable-evaluation * {
            visibility: visible;
          }
          #printable-evaluation {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20mm;
          }
          .no-print {
            display: none !important;
          }
          .print-page-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 rounded-t-lg flex-shrink-0 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-gray-900">Print Evaluation Form</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {evaluation.applicantName} - {evaluation.position}
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

          {/* Printable Content */}
          <div id="printable-evaluation" className="overflow-y-auto flex-1 p-8">
            {/* LSPU Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-3">
                <img src={lspuLogo} alt="LSPU Logo" className="w-16 h-16" />
                <div>
                  <p className="text-xs">Republic of the Philippines</p>
                  <h1 className="text-lg">LAGUNA STATE POLYTECHNIC UNIVERSITY</h1>
                  <p className="text-xs">Province of Laguna</p>
                </div>
              </div>
              <div className="border-t-2 border-b-2 border-black py-2 mt-2">
                <h2 className="text-base">PERSONNEL SELECTION BOARD</h2>
                <h3 className="text-sm">EVALUATION FORM FOR {isTeaching ? 'TEACHING' : 'NON-TEACHING'} POSITION</h3>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                <div>
                  <span className="inline-block w-32">NAME OF APPLICANT:</span>
                  <span className="border-b border-black px-2">{evaluation.applicantName || 'N/A'}</span>
                </div>
                <div>
                  <span className="inline-block w-24">POSITION:</span>
                  <span className="border-b border-black px-2">{evaluation.position || 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="inline-block w-32">DATE:</span>
                  <span className="border-b border-black px-2">
                    {new Date(evaluation.evaluatedAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div>
                  <span className="inline-block w-24">CATEGORY:</span>
                  <span className="border-b border-black px-2">{isTeaching ? 'Teaching' : 'Non-Teaching'}</span>
                </div>
              </div>
            </div>

            {/* I. POTENTIAL (15%) */}
            <div className="mb-4">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th colSpan={3} className="border border-black px-2 py-1 text-left">
                      I. POTENTIAL (15%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Interview Section */}
                  <tr>
                    <td className="border border-black px-2 py-1" colSpan={3}>
                      <strong>INTERVIEW (10%)</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 w-3/5">Personality (Pleasing personal appearance)</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">10</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">{potential.personality || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Communication Skills</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.communication || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Analytical Skills</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.analytical || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Achievement Orientation</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.achievement || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Leadership/Management</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.leadership || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Relationship Management</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.relationship || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Job Fit</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.jobFit || 0}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-black px-2 py-1"><strong>Total</strong></td>
                    <td className="border border-black px-2 py-1 text-center"><strong>70</strong></td>
                    <td className="border border-black px-2 py-1 text-center"><strong>{potential.interviewTotal || 0}</strong></td>
                  </tr>
                  
                  {/* Aptitude Test */}
                  <tr>
                    <td className="border border-black px-2 py-1" colSpan={3}>
                      <strong>APTITUDE TEST (5%)</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Superior (5) / Above Average (4) / Average (3) / Below Average (2) / Lowest (1)</td>
                    <td className="border border-black px-2 py-1 text-center">5</td>
                    <td className="border border-black px-2 py-1 text-center">{potential.aptitudeTest || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* II. EDUCATION (40%) */}
            <div className="mb-4">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th colSpan={3} className="border border-black px-2 py-1 text-left">
                      II. EDUCATION (40%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 w-3/5">Relevance and Appropriateness of Education</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">40</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">{education.relevance || 0}</td>
                  </tr>
                  
                  {isTeaching ? (
                    <>
                      <tr className="bg-gray-50">
                        <td className="border border-black px-2 py-1">Basic Minimum Requirement (Masteral Degree)</td>
                        <td className="border border-black px-2 py-1 text-center">35</td>
                        <td className="border border-black px-2 py-1 text-center">35</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-1">Doctoral Degree or Units (20%/40%/60%/80%/100%: 1/2/3/4/5 pts)</td>
                        <td className="border border-black px-2 py-1 text-center">5</td>
                        <td className="border border-black px-2 py-1 text-center">{education.doctoralUnits || 0}</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="bg-gray-50">
                        <td className="border border-black px-2 py-1">Basic Minimum Requirement per Qualification Standards</td>
                        <td className="border border-black px-2 py-1 text-center">30</td>
                        <td className="border border-black px-2 py-1 text-center">30</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-1">Masteral Degree or Units (25%/50%/75%/CAR/100%: 1/2/3/4/5 pts)</td>
                        <td className="border border-black px-2 py-1 text-center">5</td>
                        <td className="border border-black px-2 py-1 text-center">{education.masteralUnits || 0}</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-2 py-1">Doctoral Degree or Units (25%/50%/75%/CAR/100%: 6/7/8/9/10 pts)</td>
                        <td className="border border-black px-2 py-1 text-center">10</td>
                        <td className="border border-black px-2 py-1 text-center">{education.doctoralUnits || 0}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* III. EXPERIENCE (20%) */}
            <div className="mb-4">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th colSpan={3} className="border border-black px-2 py-1 text-left">
                      III. EXPERIENCE (20%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 w-3/5">Relevance and Appropriateness of Experience</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5"></td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">{experience.years || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 pl-6">• 5 yrs to 10 yrs Experience (15 pts)</td>
                    <td className="border border-black px-2 py-1 text-center">15</td>
                    <td className="border border-black px-2 py-1 text-center"></td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 pl-6">• 3 yrs to 4 yrs Experience (10 pts)</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center"></td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1 pl-6">• 1 yr to 2 yrs Experience (5 pts)</td>
                    <td className="border border-black px-2 py-1 text-center">5</td>
                    <td className="border border-black px-2 py-1 text-center"></td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Additional points for every year (more than 10 yrs)</td>
                    <td className="border border-black px-2 py-1 text-center">20</td>
                    <td className="border border-black px-2 py-1 text-center">{experience.additional || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* IV. TRAINING (10%) */}
            <div className="mb-4">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th colSpan={3} className="border border-black px-2 py-1 text-left">
                      IV. TRAINING (10%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 w-3/5">Relevance and Appropriateness of Training (40 hrs)</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">5</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">{training.relevance || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Additional one point for every 8 hrs of training</td>
                    <td className="border border-black px-2 py-1 text-center">10</td>
                    <td className="border border-black px-2 py-1 text-center">{training.additional || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* V. ELIGIBILITY (10%) */}
            <div className="mb-4">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th colSpan={3} className="border border-black px-2 py-1 text-left">
                      V. ELIGIBILITY (10%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 w-3/5">RA 1080, CSC Exam, BAR/BOARD Exam</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">10</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">{eligibility.score || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* VI. OUTSTANDING ACCOMPLISHMENTS (5%) */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th colSpan={3} className="border border-black px-2 py-1 text-left">
                      VI. OUTSTANDING ACCOMPLISHMENTS (5%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 w-3/5">Citations, Recognitions, Honor Graduates, Board/Bar Topnotcher, CSC Topnotcher</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">5</td>
                    <td className="border border-black px-2 py-1 text-center w-1/5">{accomplishments.score || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SUMMARY OF SCORES */}
            <div className="mb-6">
              <table className="w-full border-collapse border-2 border-black text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border-2 border-black px-2 py-2 text-left">SUMMARY OF SCORES</th>
                    <th className="border-2 border-black px-2 py-2 text-center w-24">%</th>
                    <th className="border-2 border-black px-2 py-2 text-center w-24">SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1">Potential</td>
                    <td className="border border-black px-2 py-1 text-center">15%</td>
                    <td className="border border-black px-2 py-1 text-center">{summary.potential || '0.00'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Education</td>
                    <td className="border border-black px-2 py-1 text-center">40%</td>
                    <td className="border border-black px-2 py-1 text-center">{summary.education || '0.00'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Experience</td>
                    <td className="border border-black px-2 py-1 text-center">20%</td>
                    <td className="border border-black px-2 py-1 text-center">{summary.experience || '0.00'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Training</td>
                    <td className="border border-black px-2 py-1 text-center">10%</td>
                    <td className="border border-black px-2 py-1 text-center">{summary.training || '0.00'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Eligibility</td>
                    <td className="border border-black px-2 py-1 text-center">10%</td>
                    <td className="border border-black px-2 py-1 text-center">{summary.eligibility || '0.00'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1">Outstanding Accomplishment</td>
                    <td className="border border-black px-2 py-1 text-center">5%</td>
                    <td className="border border-black px-2 py-1 text-center">{summary.accomplishments || '0.00'}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border-2 border-black px-2 py-2"><strong>TOTAL</strong></td>
                    <td className="border-2 border-black px-2 py-2 text-center"><strong>100%</strong></td>
                    <td className="border-2 border-black px-2 py-2 text-center"><strong>{summary.total || '0.00'}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="mt-12 flex justify-center">
              <div className="text-center">
                <div className="border-b-2 border-black w-64 mb-1"></div>
                <p className="text-xs">(Signature above Printed Name)</p>
                <p className="text-xs mt-1"><strong>EVALUATOR</strong></p>
                {evaluation.evaluatorName && (
                  <p className="text-xs mt-2">{evaluation.evaluatorName}</p>
                )}
                <div className="mt-4">
                  <p className="text-xs">Date: _________________</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-600">
              <p>LSPU-HRO-SF-030</p>
              <p>Rev 1</p>
              <p>10 September 2018</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 border-t px-6 py-4 rounded-b-lg flex-shrink-0 no-print">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-[#1565C0] transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
