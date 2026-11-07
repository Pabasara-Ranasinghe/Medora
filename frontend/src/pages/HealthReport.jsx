
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseLabResults } from '../utils/parseLabResults'
import './healthreport.css'

function HealthReport() {
  const navigate = useNavigate()

  // PDF Review states
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [pdfSuccess, setPdfSuccess] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [parsedResults, setParsedResults] = useState([])

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

  // Verification progress
  const verifiedCount = parsedResults.filter(
    (result) => result.verified
  ).length

  const allResultsVerified =
    parsedResults.length > 0 &&
    verifiedCount === parsedResults.length

  // Verify or unverify an individual result
  const handleVerifyResult = (resultId, checked) => {
    setParsedResults((previousResults) =>
      previousResults.map((result) =>
        result.id === resultId
          ? { ...result, verified: checked }
          : result
      )
    )
  }

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
      console.error('Health report creation error:', error)

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

      setExtractedText(extracted)

      const results = parseLabResults(extracted)

      setParsedResults(results)

      setPdfSuccess(
        results.length > 0
          ? `PDF extracted successfully. ${results.length} possible test results found. Please review and verify them carefully.`
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
                  setPdfFile(e.target.files?.[0] || null)
                  setPdfError('')
                  setPdfSuccess('')
                  setExtractedText('')
                  setParsedResults([])
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
                These are preliminary extracted values.
                Compare each result with the original PDF
                before confirming it.
              </p>

              {/* VERIFICATION PROGRESS */}

              <div
                style={{
                  background: '#F3F4F6',
                  padding: '16px',
                  borderRadius: '10px',
                  margin: '18px 0',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '10px',
                  }}
                >

                  <strong style={{ color: '#374151' }}>
                    Verification Progress
                  </strong>

                  <span
                    style={{
                      fontWeight: '600',
                      color: allResultsVerified
                        ? '#15803D'
                        : '#4B5563',
                    }}
                  >
                    {verifiedCount} of {parsedResults.length} verified
                  </span>

                </div>

                <div
                  style={{
                    height: '8px',
                    background: '#D1D5DB',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >

                  <div
                    style={{
                      height: '100%',
                      width: `${(verifiedCount / parsedResults.length) * 100}%`,
                      background: '#16A34A',
                      borderRadius: '10px',
                      transition: 'width 0.3s ease',
                    }}
                  />

                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#4B5563',
                    margin: '10px 0 0',
                  }}
                >
                  {allResultsVerified
                    ? 'All detected results have been verified.'
                    : 'Please verify each result against the original laboratory report.'}
                </p>

              </div>

              <div className="pdf-results-list">

                {parsedResults.map((result) => {

                  const style =
                    statusStyles[result.statusCode] ||
                    statusStyles.NEEDS_REVIEW

                  const canVerify =
                    result.value !== null &&
                    result.value !== undefined &&
                    String(result.value).trim() !== '' &&
                    result.referenceRange &&
                    result.referenceRange !== 'Not detected'

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

                      {/* INDIVIDUAL VERIFICATION */}

                      <div
                        style={{
                          marginTop: '16px',
                          paddingTop: '14px',
                          borderTop: '1px solid #D1D5DB',
                        }}
                      >

                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            cursor: canVerify ? 'pointer' : 'not-allowed',
                            color: '#374151',
                            fontSize: '14px',
                            lineHeight: '1.5',
                          }}
                        >

                          <input
                            type="checkbox"
                            checked={Boolean(result.verified)}
                            disabled={!canVerify}
                            onChange={(e) =>
                              handleVerifyResult(
                                result.id,
                                e.target.checked
                              )
                            }
                            style={{
                              marginTop: '3px',
                              width: '16px',
                              height: '16px',
                              flexShrink: 0,
                              accentColor: '#16A34A',
                            }}
                          />

                          <span>
                            I have checked this result against
                            the original laboratory PDF and
                            confirm that the extracted information
                            is correct.
                          </span>

                        </label>

                        <p
                          style={{
                            fontSize: '12px',
                            color: result.verified
                              ? '#15803D'
                              : '#6B7280',
                            marginTop: '10px',
                            marginBottom: '0',
                            fontWeight: '500',
                          }}
                        >
                          {result.verified
                            ? '✓ Verified by you'
                            : canVerify
                              ? 'Please verify against the original report'
                              : 'Cannot verify: value or reference range is missing.'}
                        </p>

                      </div>

                    </div>

                  )
                })}

              </div>

              {/* VERIFICATION NOTICE */}

              <div
                style={{
                  background: allResultsVerified
                    ? '#F0FDF4'
                    : '#FFFBEB',
                  border: `1px solid ${
                    allResultsVerified ? '#86EFAC' : '#FDE68A'
                  }`,
                  borderRadius: '10px',
                  padding: '15px',
                  marginTop: '16px',
                }}
              >

                <strong
                  style={{
                    color: allResultsVerified
                      ? '#166534'
                      : '#92400E',
                  }}
                >
                  {allResultsVerified
                    ? 'Verification completed'
                    : 'Verification required'}
                </strong>

                <p
                  style={{
                    color: '#4B5563',
                    fontSize: '13px',
                    marginBottom: '0',
                  }}
                >
                  {allResultsVerified
                    ? 'All detected results have been confirmed by you. No medical analysis has been performed yet.'
                    : 'Unverified results must not be used for medical analysis. Please compare each value and reference range with the original PDF.'}
                </p>

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

                  setExtractedText(updatedText)

                  // Re-parsing resets verification.
                  // Changed results must be reviewed again.
                  setParsedResults(
                    parseLabResults(updatedText)
                  )
                }}
                rows={12}
                placeholder="Extracted PDF text will appear here..."
              />

              <div className="pdf-review-notice">

                <strong>Important:</strong>

                <p>
                  Automated PDF extraction may contain errors.
                  Verify all test names, values, units and
                  reference ranges against the original report.
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
