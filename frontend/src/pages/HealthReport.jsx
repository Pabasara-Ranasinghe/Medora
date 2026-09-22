import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './healthreport.css'

function HealthReport() {
  const navigate = useNavigate()

  const [reportType, setReportType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [reportId, setReportId] = useState('')
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

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

      console.log('Creating health report:', requestBody)

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

      console.log('Health report response:', data)

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

  const handleExplainWithAI = async () => {
    setAiError('')
    setAiExplanation('')

    if (!reportType) {
      setAiError(
        'Please select a report type first.'
      )
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

      console.log(
        'AI explanation response:',
        data
      )

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
      console.error(
        'AI explanation error:',
        error
      )

      setAiError(
        error.message ||
        'Failed to generate AI explanation.'
      )
    } finally {
      setAiLoading(false)
    }
  }

  const handleGoToTestResults = () => {
    navigate('/test-results')
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

        <form onSubmit={handleCreateReport}>

          <select
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value)
            }
          >
            <option value="">
              Select report type
            </option>

            <option value="Blood Test">
              Blood Test
            </option>

            <option value="Lipid Profile">
              Lipid Profile
            </option>

            <option value="Liver Function Test">
              Liver Function Test
            </option>

            <option value="Kidney Function Test">
              Kidney Function Test
            </option>

            <option value="Urine Test">
              Urine Test
            </option>

            <option value="Thyroid Function Test">
              Thyroid Function Test
            </option>

          </select>

          <button
            type="submit"
            className="report-button"
            disabled={loading}
          >
            {loading
              ? 'Creating Report...'
              : 'Create Health Report'}
          </button>

        </form>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {success && (
          <div className="report-success">

            <p>
              {success}
            </p>

            {reportId && (
              <p>
                <strong>
                  Report ID:
                </strong>{' '}
                {reportId}
              </p>
            )}

          </div>
        )}

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

                <h2>
                  AI Explanation
                </h2>

                <p>
                  {aiExplanation}
                </p>

                <div className="medical-disclaimer">

                  <strong>
                    Important
                  </strong>

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