import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ThyroidFunctionReport.css'

function ThyroidFunctionReport() {
  const navigate = useNavigate()

  const [rangeType, setRangeType] = useState('standard')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')

  const [results, setResults] = useState({
    tsh: '',
    freeT4: '',
    freeT3: '',
    totalT4: '',
    totalT3: '',
    tpoAntibodies: '',
    thyroglobulinAntibodies: '',
    thyroglobulin: '',
  })

  const [labRanges, setLabRanges] = useState({})

  const [analysis, setAnalysis] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ==============================
  // AI STATES
  // ==============================

  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const parameters = [
    {
      id: 'tsh',
      name: 'TSH (Thyroid-Stimulating Hormone)',
      unit: 'mIU/L',
    },
    {
      id: 'freeT4',
      name: 'Free T4 (FT4)',
      unit: 'ng/dL',
    },
    {
      id: 'freeT3',
      name: 'Free T3 (FT3)',
      unit: 'pg/mL',
    },
    {
      id: 'totalT4',
      name: 'Total T4',
      unit: 'µg/dL',
    },
    {
      id: 'totalT3',
      name: 'Total T3',
      unit: 'ng/dL',
    },
    {
      id: 'tpoAntibodies',
      name: 'TPO Antibodies (Anti-TPO)',
      unit: 'IU/mL',
    },
    {
      id: 'thyroglobulinAntibodies',
      name: 'Thyroglobulin Antibodies',
      unit: 'IU/mL',
    },
    {
      id: 'thyroglobulin',
      name: 'Thyroglobulin',
      unit: 'ng/mL',
    },
  ]

  // ==============================
  // RESULT CHANGE
  // ==============================

  const handleResultChange = (id, value) => {
    setResults((previous) => ({
      ...previous,
      [id]: value,
    }))
  }

  // ==============================
  // LAB RANGE CHANGE
  // ==============================

  const handleRangeChange = (id, type, value) => {
    setLabRanges((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [type]: value,
      },
    }))
  }

  // ==============================
  // THYROID ANALYSIS
  // ==============================

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
        age: Number(age),
        gender: gender,
        rangeType: rangeType,
        results: convertedResults,
        labRanges: convertedLabRanges,
      }

      console.log(
        'Sending Thyroid Function data:',
        requestBody
      )

      const response = await fetch(
        'http://localhost:8081/api/reports/thyroid-function',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      const responseText = await response.text()

      let data = {}

      if (responseText) {
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error(
            'Invalid JSON response:',
            parseError
          )

          throw new Error(
            'The server returned an invalid response.'
          )
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
          responseText ||
          `Server returned status ${response.status}`
        )
      }

      console.log(
        'Thyroid Function Analysis Response:',
        data
      )

      setAnalysis(data)
    } catch (error) {
      console.error(
        'Thyroid function analysis error:',
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

  // ==============================
  // AI SUMMARY
  // ==============================

  const handleAISummary = async () => {
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
Thyroid Function Test Report

Patient Age:
${age} years

Gender:
${gender}

TSH:
${results.tsh} mIU/L

Free T4:
${results.freeT4} ng/dL

Free T3:
${results.freeT3} pg/mL

Total T4:
${results.totalT4} µg/dL

Total T3:
${results.totalT3} ng/dL

TPO Antibodies:
${results.tpoAntibodies} IU/mL

Thyroglobulin Antibodies:
${results.thyroglobulinAntibodies} IU/mL

Thyroglobulin:
${results.thyroglobulin} ng/mL

Reference Range Type:
${rangeType}

Medora's thyroid analysis:
${analysis.message || ''}

Parameter analysis:
${JSON.stringify(
  analysis.analysis || {},
  null,
  2
)}

Please summarize these thyroid function test results
in simple, easy-to-understand language for the user.

Requirements:

- Keep the explanation short and easy to understand.
- Explain which results are within the reference range.
- Explain which results are below or above the reference range.
- Briefly explain what TSH, Free T4, Free T3, Total T4 and Total T3 represent.
- Briefly explain thyroid antibodies such as TPO antibodies and thyroglobulin antibodies.
- Explain the overall pattern of the results in general terms.
- If several results are abnormal, explain that they may be worth discussing with a healthcare professional.
- Do not provide a medical diagnosis.
- Do not tell the user to start, stop, or change medication.
- Do not make definite claims about a disease.
- Recommend discussing concerning results with a qualified healthcare professional.
- Avoid unnecessary medical terminology.
- Make the explanation reassuring but accurate.
`

      console.log(
        'Sending Thyroid AI summary request:',
        reportContext
      )

      // IMPORTANT:
      // Use the SAME AI endpoint as Liver Function.
      // Do NOT call /api/reports/thyroid-function/ai-summary.
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
        'Thyroid AI Summary Response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to generate AI summary.'
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
        'Thyroid AI summary error:',
        error
      )

      setAiError(
        error.message ||
        'Failed to generate AI summary.'
      )
    } finally {
      setAiLoading(false)
    }
  }

  // ==============================
  // STATUS TEXT
  // ==============================

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

  // ==============================
  // STATUS CLASS
  // ==============================

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

  // ==============================
  // STATUS ICON
  // ==============================

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

  // ==============================
  // FORMAT RANGE
  // ==============================

  const formatRange = (result) => {
    if (
      result?.low === null ||
      result?.high === null ||
      result?.low === undefined ||
      result?.high === undefined
    ) {
      return 'Range unavailable'
    }

    return `${result.low} – ${result.high}`
  }

  // ==============================
  // FORMAT PARAMETER NAME
  // ==============================

  const formatParameterName = (parameter) => {
    const found = parameters.find(
      (item) => item.id === parameter
    )

    return found ? found.name : parameter
  }

  // ==============================
  // JSX
  // ==============================

  return (
    <div className="thyroid-page">

      {/* ================= HEADER ================= */}

      <div className="thyroid-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/test-results')
          }
        >
          ← Back to Test Reports
        </button>

        <div className="thyroid-logo">
          Medora
        </div>

        <p className="section-label">
          THYROID FUNCTION TEST
        </p>

        <h1>
          Enter your thyroid function results
        </h1>

        <p>
          Enter the values exactly as shown
          on your laboratory report.
        </p>

      </div>

      {/* ================= FORM ================= */}

      <form onSubmit={handleSubmit}>

        {/* PERSONAL INFORMATION */}

        <div className="range-section">

          <h2>
            Personal information
          </h2>

          <p>
            Age and gender help Medora use
            the appropriate thyroid function
            reference ranges.
          </p>

          <div className="parameter-card">

            <div className="result-input">

              <label>
                Age
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  min="0"
                  max="120"
                  step="1"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value)
                  }
                  placeholder="Enter age"
                  required
                />

                <span>
                  years
                </span>

              </div>

            </div>

            <div className="result-input">

              <label>
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                required
              >

                <option value="">
                  Select gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* REFERENCE RANGES */}

        <div className="range-section">

          <h2>
            Reference ranges
          </h2>

          <p>
            Choose how Medora should interpret
            your thyroid function results.
          </p>

          <label className="range-option">

            <input
              type="radio"
              name="rangeType"
              value="standard"
              checked={
                rangeType === 'standard'
              }
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
                thyroid function reference ranges.
              </span>

            </div>

          </label>

          <label className="range-option">

            <input
              type="radio"
              name="rangeType"
              value="laboratory"
              checked={
                rangeType === 'laboratory'
              }
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

        {/* THYROID RESULTS */}

        <div className="results-section">

          <div className="section-heading">

            <h2>
              Thyroid function results
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
                    value={
                      results[parameter.id]
                    }
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

        {/* ERROR */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* SUBMIT */}

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
            Medora provides general health
            information and does not provide
            a medical diagnosis.
          </p>

        </div>

      </form>

      {/* ================= ANALYSIS ================= */}

      {analysis && (

        <div className="analysis-section">

          <p className="section-label">
            THYROID FUNCTION ANALYSIS
          </p>

          <h2>
            Results interpretation
          </h2>

          <p className="analysis-intro">
            {analysis.message}
          </p>

          {/* INDIVIDUAL RESULTS */}

          {analysis.analysis && (

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

                    <div className="analysis-main">

                      <strong>
                        {getStatusIcon(
                          result.status
                        )}{' '}
                        {formatParameterName(
                          parameter.id
                        )}
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

                    <p className="analysis-reference">
                      Reference: {formatRange(result)}
                    </p>

                    <p className="analysis-message">
                      {result.message}
                    </p>

                  </div>

                )
              })}

            </div>

          )}

          {/* ================= AI SUMMARY ================= */}

          <div className="ai-summary-section">

            <div className="ai-summary-intro">

              <h3>
                Want a simpler explanation?
              </h3>

              <p>
                Let Medora AI summarize your
                thyroid results in simple,
                easy-to-understand language.
              </p>

              <button
                type="button"
                className="ai-summary-button"
                onClick={handleAISummary}
                disabled={aiLoading}
              >

                {aiLoading
                  ? '✨ Generating Summary...'
                  : '✨ Generate AI Summary'}

              </button>

            </div>

            {aiError && (

              <div className="form-error ai-error">
                {aiError}
              </div>

            )}

            {aiExplanation && (

              <div className="ai-summary-card">

                <p className="section-label">
                  MEDORA AI SUMMARY
                </p>

                <h2>
                  ✨ Understanding Your Results
                </h2>

                <div className="ai-summary-text">
                  {aiExplanation}
                </div>

              </div>

            )}

          </div>

          {/* DISCLAIMER */}

          {analysis.disclaimer && (

            <div className="medical-disclaimer">

              <strong>
                Medical Disclaimer
              </strong>

              <p>
                {analysis.disclaimer}
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  )
}

export default ThyroidFunctionReport