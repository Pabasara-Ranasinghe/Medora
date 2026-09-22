import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LiverFunctionReport.css'

function LiverFunctionReport() {
  const navigate = useNavigate()

  const [rangeType, setRangeType] = useState('standard')

  const [results, setResults] = useState({
    alt: '',
    ast: '',
    alp: '',
    totalBilirubin: '',
    directBilirubin: '',
    albumin: '',
  })

  const [labRanges, setLabRanges] = useState({})

  const [analysis, setAnalysis] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // AI states
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const parameters = [
    {
      id: 'alt',
      name: 'ALT (Alanine Aminotransferase)',
      unit: 'U/L',
    },
    {
      id: 'ast',
      name: 'AST (Aspartate Aminotransferase)',
      unit: 'U/L',
    },
    {
      id: 'alp',
      name: 'ALP (Alkaline Phosphatase)',
      unit: 'U/L',
    },
    {
      id: 'totalBilirubin',
      name: 'Total Bilirubin',
      unit: 'mg/dL',
    },
    {
      id: 'directBilirubin',
      name: 'Direct Bilirubin',
      unit: 'mg/dL',
    },
    {
      id: 'albumin',
      name: 'Albumin',
      unit: 'g/dL',
    },
  ]

  // --------------------------------------------------
  // HANDLE RESULT CHANGE
  // --------------------------------------------------

  const handleResultChange = (id, value) => {
    setResults((previous) => ({
      ...previous,
      [id]: value,
    }))
  }

  // --------------------------------------------------
  // HANDLE LAB RANGE CHANGE
  // --------------------------------------------------

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
  // NORMAL LIVER FUNCTION ANALYSIS
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setAnalysis(null)

    // Clear previous AI explanation
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
        rangeType: rangeType,
        results: convertedResults,
        labRanges: convertedLabRanges,
      }

      console.log(
        'Sending Liver Function data:',
        requestBody
      )

      // IMPORTANT:
      // Correct backend endpoint
      const response = await fetch(
        'http://localhost:8081/api/reports/liver-function',
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
        'Liver Function Analysis Response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to analyze liver function results.'
        )
      }

      setAnalysis(data)
    } catch (error) {
      console.error(
        'Liver function analysis error:',
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
Liver Function Test Report

ALT:
${results.alt} U/L

AST:
${results.ast} U/L

ALP:
${results.alp} U/L

Total Bilirubin:
${results.totalBilirubin} mg/dL

Direct Bilirubin:
${results.directBilirubin} mg/dL

Albumin:
${results.albumin} g/dL

Reference Range Type:
${rangeType}

Medora's analysis:
${analysis.message || ''}

Parameter analysis:
${JSON.stringify(analysis.analysis || {})}

Please explain these liver function test results
in simple language for the user.

Requirements:
- Keep the explanation short and easy to understand.
- Explain which results are within range.
- Explain which results may need attention.
- Explain generally what ALT, AST, ALP, bilirubin, and albumin represent.
- Explain what the overall pattern of results may indicate in general terms.
- Do not provide a medical diagnosis.
- Do not tell the user to start or stop medication.
- Recommend discussing concerning results with a qualified healthcare professional.
- Avoid unnecessary technical terminology.
`

      console.log(
        'Sending Liver AI explanation request:',
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
        'Liver AI Explanation Response:',
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
        'Liver AI explanation error:',
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
  // STATUS TEXT
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

  // --------------------------------------------------
  // STATUS CLASS
  // --------------------------------------------------

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

  // --------------------------------------------------
  // STATUS ICON
  // --------------------------------------------------

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

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    <div className="liver-page">

      {/* ================= HEADER ================= */}

      <div className="liver-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/test-results')}
        >
          ← Back to Test Reports
        </button>

        <div className="liver-logo">
          Medora
        </div>

        <p className="section-label">
          LIVER FUNCTION TEST
        </p>

        <h1>
          Enter your liver function results
        </h1>

        <p>
          Enter the values exactly as shown on your
          laboratory report.
        </p>

      </div>

      {/* ================= FORM ================= */}

      <form onSubmit={handleSubmit}>

        {/* ================= REFERENCE RANGES ================= */}

        <div className="range-section">

          <h2>
            Reference ranges
          </h2>

          <p>
            Choose how Medora should interpret your
            laboratory results.
          </p>

          {/* Standard */}

          <label className="range-option">

            <input
              type="radio"
              name="rangeType"
              value="standard"
              checked={rangeType === 'standard'}
              onChange={() => {
                setRangeType('standard')
                setLabRanges({})
              }}
            />

            <div>

              <strong>
                Use Medora's standard ranges
              </strong>

              <span>
                Medora will use its predefined
                reference ranges for this analysis.
              </span>

            </div>

          </label>

          {/* Laboratory */}

          <label className="range-option">

            <input
              type="radio"
              name="rangeType"
              value="laboratory"
              checked={rangeType === 'laboratory'}
              onChange={() =>
                setRangeType('laboratory')
              }
            />

            <div>

              <strong>
                Use ranges from my laboratory report
              </strong>

              <span>
                Enter the reference ranges shown
                on your laboratory report.
              </span>

            </div>

          </label>

        </div>

        {/* ================= RESULTS ================= */}

        <div className="results-section">

          <div className="section-heading">

            <h2>
              Liver function results
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

              {/* Laboratory ranges */}

              {rangeType === 'laboratory' && (

                <div className="lab-range">

                  <label>
                    My laboratory reference range
                  </label>

                  <div className="range-inputs">

                    <input
                      type="number"
                      step="any"
                      placeholder="Low"
                      value={
                        labRanges[
                          parameter.id
                        ]?.low || ''
                      }
                      onChange={(e) =>
                        handleRangeChange(
                          parameter.id,
                          'low',
                          e.target.value
                        )
                      }
                      required
                    />

                    <span>
                      to
                    </span>

                    <input
                      type="number"
                      step="any"
                      placeholder="High"
                      value={
                        labRanges[
                          parameter.id
                        ]?.high || ''
                      }
                      onChange={(e) =>
                        handleRangeChange(
                          parameter.id,
                          'high',
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* ================= SUBMIT ================= */}

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

      {/* ================= ANALYSIS ================= */}

      {analysis && (

        <div className="analysis-section">

          <p className="section-label">
            LIVER FUNCTION ANALYSIS
          </p>

          <h2>
            Results interpretation
          </h2>

          <p>
            {analysis.message}
          </p>

          {/* Individual results */}

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

          {/* ================= AI EXPLANATION ================= */}

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

          {/* ================= DISCLAIMER ================= */}

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

export default LiverFunctionReport