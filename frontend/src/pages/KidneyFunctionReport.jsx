import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './KidneyFunctionReport.css'

function KidneyFunctionReport() {

  const navigate = useNavigate()

  const [rangeType, setRangeType] = useState('standard')

  const [age, setAge] = useState('')

  const [gender, setGender] = useState('')

  const [results, setResults] = useState({
    bun: '',
    creatinine: '',
    egfr: '',
    bunCreatinineRatio: '',
    uricAcid: '',
    sodium: '',
    potassium: '',
    chloride: '',
    calcium: '',
    phosphate: '',
    cystatinC: '',
  })

  const [labRanges, setLabRanges] = useState({})

  const [analysis, setAnalysis] = useState(null)

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  // ========================================
  // AI STATES
  // ========================================

  const [aiExplanation, setAiExplanation] = useState('')

  const [aiLoading, setAiLoading] = useState(false)

  const [aiError, setAiError] = useState('')

  // ========================================
  // PARAMETERS
  // ========================================

  const parameters = [
    {
      id: 'bun',
      name: 'Blood Urea Nitrogen (BUN)',
      unit: 'mg/dL',
    },
    {
      id: 'creatinine',
      name: 'Serum Creatinine',
      unit: 'mg/dL',
    },
    {
      id: 'egfr',
      name: 'eGFR',
      unit: 'mL/min/1.73m²',
    },
    {
      id: 'bunCreatinineRatio',
      name: 'BUN/Creatinine Ratio',
      unit: ':1',
    },
    {
      id: 'uricAcid',
      name: 'Uric Acid',
      unit: 'mg/dL',
    },
    {
      id: 'sodium',
      name: 'Sodium (Na⁺)',
      unit: 'mEq/L',
    },
    {
      id: 'potassium',
      name: 'Potassium (K⁺)',
      unit: 'mEq/L',
    },
    {
      id: 'chloride',
      name: 'Chloride (Cl⁻)',
      unit: 'mEq/L',
    },
    {
      id: 'calcium',
      name: 'Calcium (Total)',
      unit: 'mg/dL',
    },
    {
      id: 'phosphate',
      name: 'Phosphate',
      unit: 'mg/dL',
    },
    {
      id: 'cystatinC',
      name: 'Cystatin C',
      unit: 'mg/L',
    },
  ]

  // ========================================
  // RESULT CHANGE
  // ========================================

  const handleResultChange = (id, value) => {

    setResults((previous) => ({
      ...previous,
      [id]: value,
    }))

  }

  // ========================================
  // LAB RANGE CHANGE
  // ========================================

  const handleRangeChange = (
    id,
    type,
    value
  ) => {

    setLabRanges((previous) => ({
      ...previous,

      [id]: {
        ...previous[id],
        [type]: value,
      },
    }))

  }

  // ========================================
  // NORMAL KIDNEY ANALYSIS
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)

    setError('')

    setAnalysis(null)

    // Clear previous AI explanation
    setAiExplanation('')

    setAiError('')

    try {

      // ========================================
      // CONVERT RESULTS
      // ========================================

      const convertedResults = {}

      Object.entries(results).forEach(
        ([key, value]) => {

          if (value !== '') {

            convertedResults[key] =
              Number(value)

          }

        }
      )

      // ========================================
      // CONVERT LAB RANGES
      // ========================================

      const convertedLabRanges = {}

      if (rangeType === 'laboratory') {

        Object.entries(labRanges).forEach(
          ([key, range]) => {

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

          }
        )

      }

      // ========================================
      // GET USER
      // ========================================

      const storedUser =
        JSON.parse(
          localStorage.getItem('medoraUser')
        )

      if (!storedUser?.userId) {

        throw new Error(
          'Please sign in before analyzing your results.'
        )

      }

      // ========================================
      // REQUEST BODY
      // ========================================

      const requestBody = {

        userId: storedUser.userId,

        age: Number(age),

        gender: gender,

        rangeType: rangeType,

        results: convertedResults,

        labRanges: convertedLabRanges,

      }

      console.log(
        'Sending kidney function data:',
        requestBody
      )

      // ========================================
      // BACKEND REQUEST
      // ========================================

      const response = await fetch(
        'http://localhost:8081/api/reports/kidney-function',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(requestBody),
        }
      )

      // ========================================
      // READ RESPONSE
      // ========================================

      const responseText =
        await response.text()

      console.log(
        'Kidney Function Response:',
        responseText
      )

      let data = {}

      if (responseText) {

        try {

          data =
            JSON.parse(responseText)

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

      // ========================================
      // HANDLE SERVER ERROR
      // ========================================

      if (!response.ok) {

        throw new Error(
          data?.message ||
          responseText ||
          `Server returned status ${response.status}`
        )

      }

      // ========================================
      // SAVE ANALYSIS
      // ========================================

      setAnalysis(data)

    } catch (error) {

      console.error(
        'Kidney function analysis error:',
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

  // ========================================
  // AI EXPLANATION
  // ========================================

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

      // ========================================
      // GET USER
      // ========================================

      const storedUser =
        JSON.parse(
          localStorage.getItem('medoraUser')
        )

      if (!storedUser?.userId) {

        throw new Error(
          'Please sign in before using AI analysis.'
        )

      }

      // ========================================
      // BUILD REPORT CONTEXT
      // ========================================

      const reportContext = `
Kidney / Renal Function Test

Age:
${age} years

Gender:
${gender}

Blood Urea Nitrogen (BUN):
${results.bun} mg/dL

Serum Creatinine:
${results.creatinine} mg/dL

eGFR:
${results.egfr} mL/min/1.73m²

BUN/Creatinine Ratio:
${results.bunCreatinineRatio}

Uric Acid:
${results.uricAcid} mg/dL

Sodium:
${results.sodium} mEq/L

Potassium:
${results.potassium} mEq/L

Chloride:
${results.chloride} mEq/L

Calcium:
${results.calcium} mg/dL

Phosphate:
${results.phosphate} mg/dL

Cystatin C:
${results.cystatinC} mg/L

Reference Range Type:
${rangeType}

Medora's analysis:
${analysis.message || ''}

Parameter analysis:
${JSON.stringify(
  analysis.analysis || {},
  null,
  2
)}

Please explain these kidney function results
in simple language for the user.

Requirements:
- Keep the explanation short and easy to understand.
- Explain which results are within the provided reference range.
- Explain which results may need attention.
- Explain what the results generally mean.
- Give a simple overall explanation of the kidney-related results.
- Do not provide a medical diagnosis.
- Do not tell the user to start or stop medication.
- Recommend discussing concerning results with a qualified healthcare professional.
- Avoid unnecessary technical terminology.
`

      console.log(
        'Sending Kidney AI explanation request:',
        reportContext
      )

      // ========================================
      // AI BACKEND REQUEST
      // ========================================

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

      const data =
        await response.json()

      console.log(
        'Kidney AI Explanation Response:',
        data
      )

      // ========================================
      // HANDLE AI ERROR
      // ========================================

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

      // ========================================
      // DISPLAY AI RESPONSE
      // ========================================

      setAiExplanation(
        data.explanation
      )

    } catch (error) {

      console.error(
        'Kidney AI explanation error:',
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

  // ========================================
  // STATUS CLASS
  // ========================================

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

  // ========================================
  // STATUS TEXT
  // ========================================

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

  // ========================================
  // STATUS ICON
  // ========================================

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

  // ========================================
  // RETURN
  // ========================================

  return (

    <div className="kidney-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="kidney-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/test-results')
          }
        >
          ← Back to Test Reports
        </button>

        <div className="kidney-logo">
          Medora
        </div>

        <p className="section-label">
          KIDNEY / RENAL FUNCTION TEST
        </p>

        <h1>
          Enter your kidney function results
        </h1>

        <p>
          Enter the values exactly as shown
          on your laboratory report.
        </p>

      </div>

      {/* ========================================
          FORM
      ======================================== */}

      <form onSubmit={handleSubmit}>

        {/* ========================================
            PERSONAL INFORMATION
        ======================================== */}

        <div className="range-section">

          <h2>
            Personal information
          </h2>

          <p>
            Age and gender help Medora use
            the appropriate kidney function
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

        {/* ========================================
            REFERENCE RANGES
        ======================================== */}

        <div className="range-section">

          <h2>
            Reference ranges
          </h2>

          <p>
            Choose how Medora should interpret
            your kidney function results.
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
                kidney function reference ranges.
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

        {/* ========================================
            RESULTS
        ======================================== */}

        <div className="results-section">

          <div className="section-heading">

            <h2>
              Kidney function results
            </h2>

            <p>
              Enter your result for each parameter.
            </p>

          </div>

          {parameters.map(
            (parameter) => (

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
                        results[
                          parameter.id
                        ]
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

                {/* LABORATORY RANGE */}

                {rangeType ===
                  'laboratory' && (

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

            )
          )}

        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (

          <div className="form-error">
            {error}
          </div>

        )}

        {/* ========================================
            SUBMIT
        ======================================== */}

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

      {/* ========================================
          ANALYSIS
      ======================================== */}

      {analysis && (

        <div className="analysis-section">

          <p className="section-label">
            KIDNEY FUNCTION ANALYSIS
          </p>

          <h2>
            Results interpretation
          </h2>

          <p className="analysis-introduction">
            {analysis.message}
          </p>

          {/* ========================================
              INDIVIDUAL ANALYSIS
          ======================================== */}

          {analysis.analysis && (

            <div className="analysis-results">

              {Object.entries(
                analysis.analysis
              ).map(
                ([parameter, result]) => (

                  <div
                    className={`analysis-card ${getStatusClass(
                      result.status
                    )}`}
                    key={parameter}
                  >

                    <div className="analysis-card-header">

                      <h3>
                        {parameter}
                      </h3>

                      <span>
                        {getStatusIcon(
                          result.status
                        )}{' '}
                        {getStatusText(
                          result.status
                        )}
                      </span>

                    </div>

                    <p>
                      {result.message}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

          {/* ========================================
              AI EXPLANATION
          ======================================== */}

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

            {/* AI ERROR */}

            {aiError && (

              <div className="form-error">
                {aiError}
              </div>

            )}

            {/* AI RESPONSE */}

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

          {/* ========================================
              DISCLAIMER
          ======================================== */}

          {analysis.disclaimer && (

            <div className="medical-disclaimer">

              <strong>
                Important
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

export default KidneyFunctionReport