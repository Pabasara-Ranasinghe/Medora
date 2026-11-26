import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  parseLabResults,
  detectLabReportCategory,
} from '../utils/parseLabResults'
import './healthreport.css'

const CBC_PARAMETER_IDS = [
  'rbc',
  'hemoglobin',
  'hematocrit',
  'mcv',
  'mch',
  'mchc',
  'rdw',
  'wbc',
  'platelets',
]

const VERIFIED_CBC_STORAGE_KEY = 'medoraVerifiedCBCReports'

// Convert a numeric laboratory reference range into low/high values.
function parseNumericReferenceRange(referenceRange) {
  if (!referenceRange) return null

  const normalizedRange = String(referenceRange)
    .replace(/,/g, '')
    .trim()

  const match = normalizedRange.match(
    /^(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)$/
  )

  if (!match) return null

  const low = Number(match[1])
  const high = Number(match[2])

  if (
    !Number.isFinite(low) ||
    !Number.isFinite(high) ||
    low > high
  ) {
    return null
  }

  return { low, high }
}

// Remove a previously saved CBC report from this browser session.
function removeVerifiedCBCReport(reportId) {
  if (!reportId) return

  try {
    const savedReports = JSON.parse(
      sessionStorage.getItem(VERIFIED_CBC_STORAGE_KEY) || '[]'
    )

    const updatedReports = savedReports.filter(
      (report) => report.id !== reportId
    )

    sessionStorage.setItem(
      VERIFIED_CBC_STORAGE_KEY,
      JSON.stringify(updatedReports)
    )
  } catch (error) {
    console.error('Unable to update CBC reports:', error)
  }
}

// Automatically make a complete CBC PDF available to CBCReport.jsx.
// No individual checkbox confirmation is required.
function saveCompleteCBCReport(results, reportId, fileName) {
  if (!reportId) return false

  const cbcResults = results.filter(
    (result) => result.category === 'cbc'
  )

  const resultMap = new Map(
    cbcResults.map((result) => [result.id, result])
  )

  const hasAllCBCParameters =
    cbcResults.length === CBC_PARAMETER_IDS.length &&
    CBC_PARAMETER_IDS.every((id) => resultMap.has(id))

  const hasCompleteValuesAndRanges =
    hasAllCBCParameters &&
    CBC_PARAMETER_IDS.every((id) => {
      const result = resultMap.get(id)

      return (
        String(result.value ?? '').trim() !== '' &&
        Number.isFinite(Number(result.value)) &&
        parseNumericReferenceRange(result.referenceRange) !== null
      )
    })

  if (!hasCompleteValuesAndRanges) {
    removeVerifiedCBCReport(reportId)
    return false
  }

  const savedValues = {}
  const labRanges = {}

  for (const id of CBC_PARAMETER_IDS) {
    const result = resultMap.get(id)
    savedValues[id] = Number(result.value)
    labRanges[id] = parseNumericReferenceRange(result.referenceRange)
  }

  const savedReport = {
    id: reportId,
    fileName: fileName || 'Laboratory Report',
    savedAt: new Date().toISOString(),
    results: savedValues,
    labRanges,
  }

  try {
    const savedReports = JSON.parse(
      sessionStorage.getItem(VERIFIED_CBC_STORAGE_KEY) || '[]'
    )

    sessionStorage.setItem(
      VERIFIED_CBC_STORAGE_KEY,
      JSON.stringify([
        ...savedReports.filter((report) => report.id !== reportId),
        savedReport,
      ])
    )

    return true
  } catch (error) {
    console.error('Unable to save extracted CBC report:', error)
    return false
  }
}

function HealthReport() {
  const navigate = useNavigate()

  // PDF Review states
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [pdfSuccess, setPdfSuccess] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [parsedResults, setParsedResults] = useState([])
  const [categoryDetection, setCategoryDetection] = useState({
    category: null,
    status: 'UNKNOWN',
    scores: {},
  })
  const [currentPdfReportId, setCurrentPdfReportId] = useState(null)

  // Health Report states
  const [reportType, setReportType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [reportId, setReportId] = useState('')

  // AI Explanation states
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  // Create Health Report
  const handleCreateReport = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')
    setReportId('')
    setAiExplanation('')
    setAiError('')

    if (!reportType) {
      setError('Please select a report type.')
      return
    }

    try {
      setLoading(true)

      const storedUser = JSON.parse(
        localStorage.getItem('medoraUser')
      )

      if (!storedUser?.userId) {
        throw new Error(
          'Please sign in before creating a health report.'
        )
      }

      const requestBody = {
        userId: storedUser.userId,
        reportType: reportType,
      }

      const response = await fetch(
        'http://localhost:8081/api/reports',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to create health report.'
        )
      }

      setSuccess(
        data?.message ||
        'Health report created successfully.'
      )

      setReportId(data?.reportId || '')
    } catch (error) {
      console.error(
        'Health report creation error:',
        error
      )

      setError(
        error.message ||
        'Failed to connect to the Medora server.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Explain Health Report with AI
  const handleExplainWithAI = async () => {
    setAiError('')
    setAiExplanation('')

    if (!reportType) {
      setAiError('Please select a report type first.')
      return
    }

    try {
      setAiLoading(true)

      const storedUser = JSON.parse(
        localStorage.getItem('medoraUser')
      )

      if (!storedUser?.userId) {
        throw new Error(
          'Please sign in before using AI explanation.'
        )
      }

      const reportContext = `
Health Report Type: ${reportType}
Report ID: ${reportId || 'Not available'}

The user has requested a general explanation
of their health report type.

Provide a simple, clear explanation of what this
type of health report generally contains and what
the common parameters mean.

Do not provide a medical diagnosis.
Encourage the user to consult a qualified
healthcare professional for interpretation of
their actual results.
      `.trim()

      const response = await fetch(
        'http://localhost:8081/api/ai/explain',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportContext,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to generate AI explanation.'
        )
      }

      setAiExplanation(
        data?.explanation ||
        'No explanation was returned.'
      )
    } catch (error) {
      console.error('AI explanation error:', error)

      setAiError(
        error.message ||
        'Failed to generate AI explanation.'
      )
    } finally {
      setAiLoading(false)
    }
  }

  // Upload and Extract Laboratory PDF
  const handlePDFUpload = async (e) => {
    e.preventDefault()

    setPdfError('')
    setPdfSuccess('')
    setExtractedText('')
    setParsedResults([])
    setCategoryDetection({ category: null, status: 'UNKNOWN', scores: {} })
    setCurrentPdfReportId(null)

    if (!pdfFile) {
      setPdfError('Please select a PDF file.')
      return
    }

    if (!pdfFile.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Only PDF files are supported.')
      return
    }

    if (pdfFile.size > 10 * 1024 * 1024) {
      setPdfError('File size must not exceed 10 MB.')
      return
    }

    try {
      setPdfLoading(true)

      const formData = new FormData()
      formData.append('file', pdfFile)

      const response = await fetch(
        'http://localhost:8081/api/pdf-review/extract',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to extract PDF text.'
        )
      }

      const extracted = data?.extractedText || ''

      const results = parseLabResults(extracted)
      const detected = detectLabReportCategory(extracted)

      const newReportId =
        `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

      setExtractedText(extracted)
      setCurrentPdfReportId(newReportId)
      setParsedResults(results)
      setCategoryDetection(detected)

      // A complete CBC can be made available to the CBC page
      // automatically. Other categories remain in PDF review.
      const cbcSaved = saveCompleteCBCReport(
        results,
        newReportId,
        pdfFile.name
      )

      const categoryName = detected.category
        ? detected.category.toUpperCase()
        : detected.status === 'AMBIGUOUS'
          ? 'Ambiguous / combined report'
          : 'Unknown report category'

      setPdfSuccess(
        results.length > 0
          ? `PDF extracted successfully. ${results.length} test results found. Detected category: ${categoryName}.${cbcSaved ? ' Complete CBC results are available on the CBC page.' : ''}`
          : 'PDF text extracted, but no supported test results were identified. Please check the original report.'
      )
    } catch (error) {
      console.error('PDF upload error:', error)

      setPdfError(
        error.message ||
        'Failed to process the PDF.'
      )
    } finally {
      setPdfLoading(false)
    }
  }

  // Navigate to Test Results
  const handleGoToTestResults = () => {
    navigate('/test-results')
  }

  // Status styles
  const statusStyles = {
    WITHIN_RANGE: {
      background: '#EFF6FF',
      border: '#3B82F6',
      color: '#2563EB',
    },

    ABOVE_RANGE: {
      background: '#FEF2F2',
      border: '#EF4444',
      color: '#DC2626',
    },

    BELOW_RANGE: {
      background: '#FEFCE8',
      border: '#EAB308',
      color: '#A16207',
    },

    NEEDS_REVIEW: {
      background: '#F3F4F6',
      border: '#9CA3AF',
      color: '#4B5563',
    },
  }

  const categoryLabels = {
    cbc: 'Complete Blood Count (CBC)',
    glucose: 'Blood Glucose',
    lipid: 'Lipid Profile',
    lft: 'Liver Function Test (LFT)',
    rft: 'Renal Function Test (RFT)',
    tft: 'Thyroid Function Test (TFT)',
  }

  return (
    <div className="health-report-page">

      <div className="health-report-card">

        <div className="health-logo">
          Medora
        </div>

        <h1>
          Create a Health Report
        </h1>

        <p className="health-subtitle">
          Select the type of health report you want
          to analyze and continue with your results.
        </p>

        {/* CREATE HEALTH REPORT */}

        <form onSubmit={handleCreateReport}>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select report type</option>
            <option value="Blood Test">Blood Test</option>
            <option value="Lipid Profile">Lipid Profile</option>
            <option value="Liver Function Test">Liver Function Test</option>
            <option value="Kidney Function Test">Kidney Function Test</option>
            <option value="Urine Test">Urine Test</option>
            <option value="Thyroid Function Test">Thyroid Function Test</option>
          </select>

          <button
            type="submit"
            className="report-button"
            disabled={loading}
          >
            {loading ? 'Creating Report...' : 'Create Health Report'}
          </button>

        </form>

        {/* HEALTH REPORT MESSAGES */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {success && (
          <div className="report-success">

            <p>{success}</p>

            {reportId && (
              <p>
                <strong>Report ID:</strong> {reportId}
              </p>
            )}

          </div>
        )}

        {/* AI EXPLANATION */}

        {reportId && (

          <div className="ai-explanation-section">

            <button
              type="button"
              className="ai-explain-button"
              onClick={handleExplainWithAI}
              disabled={aiLoading}
            >
              {aiLoading
                ? 'Generating Explanation...'
                : '✨ Explain My Report with AI'}
            </button>

            {aiError && (
              <div className="form-error">
                {aiError}
              </div>
            )}

            {aiExplanation && (

              <div className="ai-explanation-card">

                <h2>AI Explanation</h2>

                <p>{aiExplanation}</p>

                <div className="medical-disclaimer">

                  <strong>Important</strong>

                  <p>
                    Medora provides general health
                    information and does not provide
                    a medical diagnosis. Always consult
                    a qualified healthcare professional
                    for medical advice.
                  </p>

                </div>

              </div>

            )}

          </div>

        )}

        {/* PDF REVIEW SECTION */}

        <div className="pdf-review-section">

          <div className="pdf-review-heading">

            <h2>Review a Laboratory Report</h2>

            <p>
              Upload your laboratory report in PDF format
              and let Medora extract the available test information.
            </p>

          </div>

          <form onSubmit={handlePDFUpload}>

            <div className="pdf-upload-area">

              <span className="pdf-upload-icon">
                📄
              </span>

              <label htmlFor="pdf-upload">
                Choose a laboratory PDF
              </label>

              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  // A newly selected file starts a fresh PDF review.
                  removeVerifiedCBCReport(currentPdfReportId)

                  setPdfFile(e.target.files?.[0] || null)
                  setPdfError('')
                  setPdfSuccess('')
                  setExtractedText('')
                  setParsedResults([])
                  setCategoryDetection({
                    category: null,
                    status: 'UNKNOWN',
                    scores: {},
                  })
                  setCurrentPdfReportId(null)
                }}
              />

              {pdfFile && (
                <p className="selected-pdf">
                  {pdfFile.name}
                </p>
              )}

              <small>
                PDF files only · Maximum size: 10 MB
              </small>

            </div>

            <button
              type="submit"
              className="pdf-upload-button"
              disabled={pdfLoading}
            >
              {pdfLoading
                ? 'Extracting PDF...'
                : 'Upload & Extract Text'}
            </button>

          </form>

          {/* PDF ERROR */}

          {pdfError && (
            <div className="form-error">
              {pdfError}
            </div>
          )}

          {/* PDF SUCCESS */}

          {pdfSuccess && (
            <div className="pdf-success">
              {pdfSuccess}
            </div>
          )}

          {/* STRUCTURED LABORATORY RESULTS */}

          {parsedResults.length > 0 && (

            <div className="pdf-extracted-section">

              <h3>Detected Laboratory Results</h3>

              <p>
                Medora has extracted the available test names, values,
                units and reference ranges from the PDF. The results below
                are shown for review; no medical analysis has been performed.
              </p>

              <div
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  margin: '18px 0',
                }}
              >
                <strong style={{ color: '#1E40AF' }}>
                  Detected report category
                </strong>
                <p style={{ color: '#1F2937', margin: '6px 0 0' }}>
                  {categoryDetection.category
                    ? categoryLabels[categoryDetection.category] ||
                      categoryDetection.category.toUpperCase()
                    : categoryDetection.status === 'AMBIGUOUS'
                      ? 'Ambiguous or combined report'
                      : 'Could not confidently identify the report category'}
                </p>
              </div>

              <div className="pdf-results-list">

                {parsedResults.map((result) => {

                  const style =
                    statusStyles[result.statusCode] ||
                    statusStyles.NEEDS_REVIEW

                  return (

                    <div
                      key={result.id}
                      className="pdf-result-preview"
                      style={{
                        backgroundColor: style.background,
                        border: `1px solid ${style.border}`,
                        borderLeft: `5px solid ${style.border}`,
                        borderRadius: '12px',
                        padding: '18px',
                        marginBottom: '14px',
                        display: 'block',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >

                      <h4
                        style={{
                          color: '#1F2937',
                          margin: '0 0 12px 0',
                          fontSize: '17px',
                        }}
                      >
                        {result.name}
                      </h4>

                      <p style={{ color: '#374151' }}>
                        <strong>Value:</strong>{' '}
                        {result.value} {result.unit}
                      </p>

                      <p style={{ color: '#374151' }}>
                        <strong>Reference range:</strong>{' '}
                        {result.referenceRange || 'Not detected'}
                      </p>

                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          marginTop: '8px',
                          borderRadius: '20px',
                          backgroundColor: style.background,
                          color: style.color,
                          border: `1px solid ${style.border}`,
                          fontWeight: '600',
                          fontSize: '13px',
                        }}
                      >
                        {result.status}
                      </span>


                    </div>

                  )
                })}

              </div>


            </div>

          )}

          {/* ORIGINAL EXTRACTED PDF TEXT */}

          {extractedText && (

            <details className="pdf-extracted-section">

              <summary>
                View original extracted PDF text
              </summary>

              <textarea
                className="pdf-extracted-text"
                value={extractedText}
                onChange={(e) => {
                  const updatedText = e.target.value

                  // Re-parse the edited text and refresh the detected category.
                  const updatedResults = parseLabResults(updatedText)
                  const updatedCategory = detectLabReportCategory(updatedText)

                  setExtractedText(updatedText)
                  setParsedResults(updatedResults)
                  setCategoryDetection(updatedCategory)

                  if (currentPdfReportId) {
                    const cbcSaved = saveCompleteCBCReport(
                      updatedResults,
                      currentPdfReportId,
                      pdfFile?.name
                    )

                    if (!cbcSaved) {
                      removeVerifiedCBCReport(currentPdfReportId)
                    }
                  }
                }}
                rows={12}
                placeholder="Extracted PDF text will appear here..."
              />

              <div className="pdf-review-notice">

                <strong>Important:</strong>

                <p>
                  Automated PDF extraction may contain errors.
                  Review the extracted test names, values, units and
                  reference ranges against the original laboratory PDF.
                  No medical analysis has been performed yet.
                </p>

              </div>

            </details>

          )}

        </div>

        {/* VIEW TEST REPORTS */}

        <button
          type="button"
          className="report-button"
          onClick={handleGoToTestResults}
        >
          View Test Reports
        </button>

      </div>

    </div>
  )
}

export default HealthReport