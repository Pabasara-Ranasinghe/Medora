import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LipidProfileReport.css'
import LabPdfReview from '../components/LabPdfReview'

function LipidProfileReport() {
  const navigate = useNavigate()

  const [rangeType, setRangeType] = useState('standard')

  const [results, setResults] = useState({
    totalCholesterol: '',
    ldl: '',
    hdl: '',
    triglycerides: '',
    vldl: '',
    cholesterolHdlRatio: '',
  })

  const [labRanges, setLabRanges] = useState({})
  const [analysis, setAnalysis] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // AI states
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const handlePdfResults = (items) => {
    const fieldMap = { 'total-cholesterol': 'totalCholesterol', 'ldl-cholesterol': 'ldl', 'hdl-cholesterol': 'hdl', triglycerides: 'triglycerides', 'vldl-cholesterol': 'vldl' }
    setResults((current) => ({ ...current, ...Object.fromEntries(items.filter((item) => fieldMap[item.id]).map((item) => [fieldMap[item.id], item.value])) }))
    setError('')
  }

  const parameters = [
    {
      id: 'totalCholesterol',
      name: 'Total Cholesterol',
      unit: 'mg/dL',
    },
    {
      id: 'ldl',
      name: 'LDL Cholesterol',
      unit: 'mg/dL',
    },
    {
      id: 'hdl',
      name: 'HDL Cholesterol',
      unit: 'mg/dL',
    },
    {
      id: 'triglycerides',
      name: 'Triglycerides',
      unit: 'mg/dL',
    },
    {
      id: 'vldl',
      name: 'VLDL',
      unit: 'mg/dL',
    },
    {
      id: 'cholesterolHdlRatio',
      name: 'Total Cholesterol / HDL Ratio',
      unit: 'ratio',
    },
  ]

  const handleResultChange = (id, value) => {
    setResults((previous) => ({
      ...previous,
      [id]: value,
    }))
  }

  const handleRangeChange = (id, type, value) => {
    setLabRanges((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [type]: value,
      },
    }))
  }

  // --------------------------------------------------
  // NORMAL LIPID PROFILE ANALYSIS
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setAnalysis(null)

    // Clear previous AI explanation when new results are analyzed
    setAiExplanation('')
    setAiError('')

    try {
      const convertedResults = {}

      Object.entries(results).forEach(([key, value]) => {
        if (value !== '') {
          convertedResults[key] = Number(value)
        }
      })

      const convertedLabRanges = {}

      if (rangeType === 'laboratory') {
        Object.entries(labRanges).forEach(([key, range]) => {
          if (
            range?.low !== '' &&
            range?.high !== '' &&
            range?.low !== undefined &&
            range?.high !== undefined
          ) {
            convertedLabRanges[key] = {
              low: Number(range.low),
              high: Number(range.high),
            }
          }
        })
      }

      const storedUser = JSON.parse(
        localStorage.getItem('medoraUser')
      )

      if (!storedUser?.userId) {
        throw new Error(
          'Please sign in before analyzing your results.'
        )
      }

      const requestBody = {
        userId: storedUser.userId,
        rangeType,
        results: convertedResults,
        labRanges: convertedLabRanges,
      }

      console.log(
        'Sending Lipid Profile data:',
        requestBody
      )

      const response = await fetch(
        'http://localhost:8081/api/reports/lipid',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      const data = await response.json()

      console.log(
        'Lipid Profile Analysis Response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to analyze lipid profile results.'
        )
      }

      setAnalysis(data)

    } catch (error) {
      console.error(
        'Lipid profile analysis error:',
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

  // --------------------------------------------------
  // AI EXPLANATION
  // --------------------------------------------------

  const handleAIExplain = async () => {
    if (!analysis) {
      setAiError(
        'Please analyze your results first.'
      )
      return
    }

    setAiLoading(true)
    setAiError('')
    setAiExplanation('')

    try {
      const storedUser = JSON.parse(
        localStorage.getItem('medoraUser')
      )

      if (!storedUser?.userId) {
        throw new Error(
          'Please sign in before using AI analysis.'
        )
      }

      const reportContext = `
Lipid Profile Report

Total Cholesterol:
${results.totalCholesterol} mg/dL

LDL Cholesterol:
${results.ldl} mg/dL

HDL Cholesterol:
${results.hdl} mg/dL

Triglycerides:
${results.triglycerides} mg/dL

VLDL:
${results.vldl} mg/dL

Total Cholesterol / HDL Ratio:
${results.cholesterolHdlRatio}

Reference Range Type:
${rangeType}

Medora's analysis:
${analysis.message || ''}

Parameter analysis:
${JSON.stringify(analysis.analysis || {})}

Please explain these lipid profile results in simple language for the user.

Requirements:
- Keep the explanation short and easy to understand.
- Explain which results are within range.
- Explain which results may need attention.
- Explain what the results generally mean.
- Do not provide a medical diagnosis.
- Do not tell the user to start or stop medication.
- Recommend discussing concerning results with a qualified healthcare professional.
- Avoid unnecessary technical terminology.
`

      console.log(
        'Sending AI explanation request:',
        reportContext
      )

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
        'AI Explanation Response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to generate AI explanation.'
        )
      }

      if (!data?.explanation) {
        throw new Error(
          'The AI did not return an explanation.'
        )
      }

      setAiExplanation(data.explanation)

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

  // --------------------------------------------------
  // STATUS HELPERS
  // --------------------------------------------------

  const getStatusText = (status) => {
    switch (status) {
      case 'WITHIN_RANGE':
        return 'Within the reference range'

      case 'BELOW_RANGE':
        return 'Below the reference range'

      case 'ABOVE_RANGE':
        return 'Above the reference range'

      case 'RANGE_UNAVAILABLE':
        return 'Reference range unavailable'

      case 'NO_VALUE':
        return 'No value provided'

      default:
        return 'Result reviewed'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'WITHIN_RANGE':
        return 'status-within'

      case 'BELOW_RANGE':
        return 'status-below'

      case 'ABOVE_RANGE':
        return 'status-above'

      default:
        return 'status-neutral'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'WITHIN_RANGE':
        return '✓'

      case 'BELOW_RANGE':
      case 'ABOVE_RANGE':
        return '⚠'

      default:
        return '•'
    }
  }

  return (
    <div className="lipid-page">

      {/* --------------------------------------------------
          HEADER
      -------------------------------------------------- */}

      <div className="lipid-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/test-results')}
        >
          ← Back to Test Reports
        </button>

        <div className="lipid-logo">
          Medora
        </div>

        <p className="section-label">
          LIPID PROFILE
        </p>

        <h1>
          Enter your lipid profile results
        </h1>

        <p>
          Enter the values exactly as shown on your
          laboratory report.
        </p>

      </div>

      {/* --------------------------------------------------
          FORM
      -------------------------------------------------- */}

      <LabPdfReview expectedCategory="lipid" onResults={handlePdfResults} />
      <form onSubmit={handleSubmit}>

        

        {/* --------------------------------------------------
            RESULTS
        -------------------------------------------------- */}

        <div className="results-section">

          <div className="section-heading">

            <h2>
              Lipid profile results
            </h2>

            <p>
              Enter your result for each parameter.
            </p>

          </div>

          {parameters.map((parameter) => (

            <div
              className="parameter-card"
              key={parameter.id}
            >

              <div className="parameter-info">

                <h3>
                  {parameter.name}
                </h3>

                <span>
                  Unit: {parameter.unit}
                </span>

              </div>

              <div className="result-input">

                <label>
                  Your result
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    step="any"
                    value={results[parameter.id]}
                    onChange={(e) =>
                      handleResultChange(
                        parameter.id,
                        e.target.value
                      )
                    }
                    placeholder="Enter value"
                    required
                  />

                  <span>
                    {parameter.unit}
                  </span>

                </div>

              </div>

              {/* Laboratory reference range */}

              

            </div>

          ))}

        </div>

        {/* Error */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* Submit */}

        <div className="submit-section">

          <button
            type="submit"
            className="analyze-button"
            disabled={loading}
          >
            {loading
              ? 'Analyzing...'
              : 'Analyze Results'}
          </button>

          <p>
            Medora provides general health information
            and does not provide a medical diagnosis.
          </p>

        </div>

      </form>

      {/* --------------------------------------------------
          ANALYSIS
      -------------------------------------------------- */}

      {analysis && (

        <div className="analysis-section">

          <p className="section-label">
            LIPID PROFILE ANALYSIS
          </p>

          <h2>
            Results interpretation
          </h2>

          <p>
            {analysis.message}
          </p>

          {/* Individual analysis */}

          <div className="analysis-list">

            {parameters.map((parameter) => {

              const result =
                analysis.analysis?.[
                  parameter.id
                ]

              if (!result) {
                return null
              }

              return (

                <div
                  className={`analysis-card ${getStatusClass(
                    result.status
                  )}`}
                  key={parameter.id}
                >

                  <div>

                    <strong>
                      {getStatusIcon(
                        result.status
                      )}
                      {' '}
                      {parameter.name}
                    </strong>

                    <span>
                      {results[
                        parameter.id
                      ]}{' '}
                      {parameter.unit}
                    </span>

                  </div>

                  <p className="analysis-status">
                    {getStatusText(
                      result.status
                    )}
                  </p>

                  <p className="analysis-message">
                    {result.message}
                  </p>

                </div>

              )
            })}

          </div>

          {/* --------------------------------------------------
              AI EXPLANATION
          -------------------------------------------------- */}

          <div className="ai-explanation-section">

            <button
              type="button"
              className="ai-explain-button"
              onClick={handleAIExplain}
              disabled={aiLoading}
            >
              {aiLoading
                ? '✨ Generating Explanation...'
                : '✨ Explain My Results'}
            </button>

            {aiError && (
              <div className="form-error">
                {aiError}
              </div>
            )}

            {aiExplanation && (

              <div className="ai-explanation-card">

                <p className="section-label">
                  AI HEALTH GUIDANCE
                </p>

                <h2>
                  ✨ Understanding Your Results
                </h2>

                <p>
                  {aiExplanation}
                </p>

              </div>

            )}

          </div>

          {/* Disclaimer */}

          <div className="medical-disclaimer">

            <strong>
              Important
            </strong>

            <p>
              {analysis.disclaimer}
            </p>

          </div>

        </div>

      )}

    </div>
  )
}

export default LipidProfileReport
