import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BloodGlucoseReport.css'

function BloodGlucoseReport() {
  const navigate = useNavigate()

  const [testType, setTestType] = useState('fasting')
  const [rangeType, setRangeType] = useState('standard')

  const [glucose, setGlucose] = useState('')

  const [labRange, setLabRange] = useState({
    low: '',
    high: '',
  })

  const [analysis, setAnalysis] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // AI states
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  // --------------------------------------------------
  // TEST TYPE NAME
  // --------------------------------------------------

  const getTestTypeName = () => {
    switch (testType) {
      case 'fasting':
        return 'Fasting Blood Glucose'

      case 'random':
        return 'Random Blood Glucose'

      case 'post-meal':
        return 'Post-meal Blood Glucose'

      default:
        return 'Blood Glucose'
    }
  }

  // --------------------------------------------------
  // NORMAL BLOOD GLUCOSE ANALYSIS
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (glucose === '') {
      setError('Please enter your glucose result.')
      return
    }

    if (
      rangeType === 'laboratory' &&
      (labRange.low === '' || labRange.high === '')
    ) {
      setError(
        'Please enter both laboratory reference range values.'
      )
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    // Clear previous AI explanation
    setAiExplanation('')
    setAiError('')

    try {
      const storedUser = JSON.parse(
        localStorage.getItem('medoraUser')
      )

      if (!storedUser?.userId) {
        throw new Error(
          'Please sign in before entering laboratory results.'
        )
      }

      const requestBody = {
        userId: storedUser.userId,
        testType: testType,
        rangeType: rangeType,
        glucose: Number(glucose),

        labRanges:
          rangeType === 'laboratory'
            ? {
                glucose: {
                  low: Number(labRange.low),
                  high: Number(labRange.high),
                },
              }
            : {},
      }

      console.log(
        'Sending Blood Glucose data:',
        requestBody
      )

      const response = await fetch(
        'http://localhost:8081/api/reports/blood-glucose',
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
        'Blood Glucose Analysis Response:',
        data
      )

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to analyze blood glucose result.'
        )
      }

      setAnalysis(data)

    } catch (err) {
      console.error(
        'Blood Glucose analysis error:',
        err
      )

      setError(
        err.message ||
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
        'Please analyze your blood glucose result first.'
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
Blood Glucose Report

Test Type:
${getTestTypeName()}

Blood Glucose Result:
${glucose} mg/dL

Reference Range Type:
${rangeType}

Laboratory Reference Range:
${
  rangeType === 'laboratory'
    ? `${labRange.low} - ${labRange.high} mg/dL`
    : 'Medora standard reference range'
}

Medora's Analysis:
${analysis.message || ''}

Status:
${analysis.status || ''}

Guidance:
${analysis.guidance || ''}

Please explain this blood glucose result in simple language for the user.

Requirements:
- Keep the explanation short and easy to understand.
- Explain what the glucose result generally means.
- Explain whether the result is within, below, or above the reference range.
- Explain the general significance of the selected test type.
- Mention if the result may need further attention.
- Do not provide a medical diagnosis.
- Do not tell the user to start or stop medication.
- Do not recommend specific medications.
- Recommend discussing concerning or unusual results with a qualified healthcare professional.
- Avoid unnecessary technical terminology.
- Do not create information that is not supported by the provided result.
`

      console.log(
        'Sending AI blood glucose explanation request:',
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
        'AI Blood Glucose Explanation Response:',
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

    } catch (err) {
      console.error(
        'AI blood glucose explanation error:',
        err
      )

      setAiError(
        err.message ||
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
  // UI
  // --------------------------------------------------

  return (
    <div className="blood-glucose-page">

      {/* HEADER */}

      <div className="glucose-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/test-results')}
        >
          ← Back to Test Reports
        </button>

        <div className="glucose-logo">
          Medora
        </div>

        <p className="section-label">
          BLOOD GLUCOSE
        </p>

        <h1>
          Enter your blood glucose result
        </h1>

        <p>
          Enter the glucose value exactly as shown
          on your laboratory report.
        </p>

      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit}>

        {/* TEST TYPE */}

        <div className="test-type-section">

          <h2>
            Test type
          </h2>

          <p>
            Select the type of blood glucose test
            shown on your laboratory report.
          </p>

          <label className="test-type-option">

            <input
              type="radio"
              name="testType"
              value="fasting"
              checked={testType === 'fasting'}
              onChange={() =>
                setTestType('fasting')
              }
            />

            <div>
              <strong>
                Fasting Blood Glucose
              </strong>

              <span>
                Blood glucose measured after fasting.
              </span>
            </div>

          </label>

          <label className="test-type-option">

            <input
              type="radio"
              name="testType"
              value="random"
              checked={testType === 'random'}
              onChange={() =>
                setTestType('random')
              }
            />

            <div>
              <strong>
                Random Blood Glucose
              </strong>

              <span>
                Blood glucose measured at any time.
              </span>
            </div>

          </label>

          <label className="test-type-option">

            <input
              type="radio"
              name="testType"
              value="post-meal"
              checked={testType === 'post-meal'}
              onChange={() =>
                setTestType('post-meal')
              }
            />

            <div>
              <strong>
                Post-meal Blood Glucose
              </strong>

              <span>
                Blood glucose measured after a meal.
              </span>
            </div>

          </label>

        </div>

        {/* REFERENCE RANGE */}

        <div className="range-section">

          <h2>
            Reference ranges
          </h2>

          <p>
            Choose how Medora should interpret
            your laboratory result.
          </p>

          <label className="range-option">

            <input
              type="radio"
              name="rangeType"
              value="standard"
              checked={rangeType === 'standard'}
              onChange={() => {
                setRangeType('standard')

                setLabRange({
                  low: '',
                  high: '',
                })
              }}
            />

            <div>
              <strong>
                Use Medora's standard range
              </strong>

              <span>
                Medora will use its predefined
                reference range for this analysis.
              </span>
            </div>

          </label>

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
                Use range from my laboratory report
              </strong>

              <span>
                Enter the reference range shown
                on your laboratory report.
              </span>
            </div>

          </label>

        </div>

        {/* GLUCOSE RESULT */}

        <div className="glucose-result-section">

          <h2>
            Blood glucose result
          </h2>

          <p>
            Enter your reported glucose value.
          </p>

          <div className="glucose-input-group">

            <label htmlFor="glucose">
              {getTestTypeName()}
            </label>

            <div className="glucose-input">

              <input
                id="glucose"
                type="number"
                step="any"
                value={glucose}
                onChange={(e) =>
                  setGlucose(e.target.value)
                }
                placeholder="Enter value"
              />

              <span>
                mg/dL
              </span>

            </div>

          </div>

        </div>

        {/* LABORATORY RANGE */}

        {rangeType === 'laboratory' && (

          <div className="lab-range-section">

            <h2>
              Laboratory reference range
            </h2>

            <p>
              Enter the range shown on your
              laboratory report.
            </p>

            <div className="range-inputs">

              <input
                type="number"
                step="any"
                placeholder="Low"
                value={labRange.low}
                onChange={(e) =>
                  setLabRange({
                    ...labRange,
                    low: e.target.value,
                  })
                }
              />

              <span>
                to
              </span>

              <input
                type="number"
                step="any"
                placeholder="High"
                value={labRange.high}
                onChange={(e) =>
                  setLabRange({
                    ...labRange,
                    high: e.target.value,
                  })
                }
              />

              <span>
                mg/dL
              </span>

            </div>

          </div>

        )}

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
              : 'Analyze Result'}
          </button>

          <p>
            Medora provides general health information
            and does not provide a medical diagnosis.
          </p>

        </div>

      </form>

      {/* ANALYSIS */}

      {analysis && (

        <div className="analysis-section">

          <p className="section-label">
            BLOOD GLUCOSE ANALYSIS
          </p>

          <h2>
            Result interpretation
          </h2>

          <p>
            {analysis.message}
          </p>

          <div
            className={`analysis-card ${getStatusClass(
              analysis.status
            )}`}
          >

            <div className="analysis-main">

              <strong>
                {getStatusIcon(analysis.status)}
                {' '}
                {getTestTypeName()}
              </strong>

              <span>
                {glucose} mg/dL
              </span>

            </div>

            <p className="analysis-status">
              {getStatusText(analysis.status)}
            </p>

            <p className="analysis-message">
              {analysis.guidance}
            </p>

          </div>

          {/* AI EXPLANATION */}

          <div className="ai-explanation-section">

            <div className="ai-section-header">

              <p className="section-label">
                AI HEALTH GUIDANCE
              </p>

              <h2>
                Want to understand your result better?
              </h2>

              <p>
                Medora's AI can explain your blood
                glucose result in simple language.
              </p>

            </div>

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
              <div className="form-error ai-error">
                {aiError}
              </div>
            )}

            {aiExplanation && (

              <div className="ai-explanation-card">

                <p className="section-label">
                  AI HEALTH GUIDANCE
                </p>

                <h2>
                  ✨ Understanding Your Result
                </h2>

                <div className="ai-explanation-text">
                  {aiExplanation}
                </div>

                <div className="ai-note">
                  <strong>
                    Remember
                  </strong>

                  <p>
                    This AI explanation is for general
                    health information only and is not
                    a medical diagnosis.
                  </p>
                </div>

              </div>

            )}

          </div>

          {/* DISCLAIMER */}

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

export default BloodGlucoseReport