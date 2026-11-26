import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {

  parseLabResults,

  detectLabReportCategory,

} from '../utils/parseLabResults'

import './CBCReport.css'

const EMPTY_RESULTS = {

  rbc: '',

  hemoglobin: '',

  hematocrit: '',

  wbc: '',

  platelets: '',

  mcv: '',

  mch: '',

  mchc: '',

  rdw: '',

}

const CBC_PARAMETER_IDS = [

  'rbc',

  'hemoglobin',

  'hematocrit',

  'wbc',

  'platelets',

  'mcv',

  'mch',

  'mchc',

  'rdw',

]

const parameters = [

  { id: 'rbc', name: 'Red Blood Cells (RBC)', unit: '×10⁶/µL' },

  { id: 'hemoglobin', name: 'Hemoglobin (Hb)', unit: 'g/dL' },

  { id: 'hematocrit', name: 'Hematocrit (Hct)', unit: '%' },

  { id: 'wbc', name: 'White Blood Cells (WBC)', unit: '×10³/µL' },

  { id: 'platelets', name: 'Platelets', unit: '×10³/µL' },

  { id: 'mcv', name: 'MCV', unit: 'fL' },

  { id: 'mch', name: 'MCH', unit: 'pg' },

  { id: 'mchc', name: 'MCHC', unit: 'g/dL' },

  { id: 'rdw', name: 'RDW', unit: '%' },

]

function parseNumericReferenceRange(referenceRange) {

  if (!referenceRange) return null

  const normalized = String(referenceRange)

    .replace(/,/g, '')

    .replace(/[–—−]/g, '-')

    .trim()

  const match = normalized.match(

    /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/

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

function CBCReport() {

  const navigate = useNavigate()

  // PDF upload states

  const [pdfFile, setPdfFile] = useState(null)

  const [pdfLoading, setPdfLoading] = useState(false)

  const [pdfError, setPdfError] = useState('')

  const [pdfSuccess, setPdfSuccess] = useState('')

  const [parsedResults, setParsedResults] = useState([])

  const [extractedText, setExtractedText] = useState('')

  // Verified PDF report

  const [selectedPdfReport, setSelectedPdfReport] = useState(null)

  // CBC analysis states

  const [rangeType, setRangeType] = useState('standard')

  const [results, setResults] = useState(EMPTY_RESULTS)

  const [labRanges, setLabRanges] = useState({})

  const [analysis, setAnalysis] = useState(null)

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  // AI explanation states

  const [aiExplanation, setAiExplanation] = useState('')

  const [aiLoading, setAiLoading] = useState(false)

  const [aiError, setAiError] = useState('')

  const availableParameterCount = CBC_PARAMETER_IDS.filter((id) =>

    parsedResults.some((result) => result.id === id)

  ).length

  const hasCompleteLaboratoryRanges = CBC_PARAMETER_IDS.every((id) => {

    const result = parsedResults.find((item) => item.id === id)

    return (

      result &&

      result.value !== null &&

      result.value !== undefined &&

      String(result.value).trim() !== '' &&

      Number.isFinite(Number(result.value)) &&

      parseNumericReferenceRange(result.referenceRange) !== null

    )

  })

  // Reset the previous analysis when the input changes.

  const resetAnalysis = () => {

    setAnalysis(null)

    setError('')

    setAiExplanation('')

    setAiError('')

  }

  // Reset extracted PDF data when a new file is selected.

  const resetPdfData = () => {

    setParsedResults([])

    setExtractedText('')

    setSelectedPdfReport(null)

    setLabRanges({})

    setRangeType('standard')

    setPdfSuccess('')

    resetAnalysis()

  }

  // Handle selecting a PDF.

  const handleFileChange = (e) => {

    const file = e.target.files?.[0] || null

    setPdfFile(file)

    setPdfError('')

    resetPdfData()

  }

  // Upload and extract the CBC PDF.

  const handlePDFUpload = async (e) => {

    e.preventDefault()

    setPdfError('')

    setPdfSuccess('')

    resetPdfData()

    if (!pdfFile) {

      setPdfError('Please select a PDF file.')

      return

    }

    if (

      !pdfFile.name.toLowerCase().endsWith('.pdf') ||

      (pdfFile.type && pdfFile.type !== 'application/pdf')

    ) {

      setPdfError('Please upload a valid PDF file.')

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

          data?.message || 'Unable to extract PDF text.'

        )

      }

      const extracted = data?.extractedText || ''

      if (!extracted.trim()) {

        throw new Error(

          'No readable text was extracted from this PDF.'

        )

      }

      // Identify the report category before accepting results.

      const detection = detectLabReportCategory(extracted)

      if (detection.status === 'AMBIGUOUS') {

        throw new Error(

          'Medora could not confidently identify this report type. Please upload a clear CBC report.'

        )

      }

      if (

        detection.status !== 'IDENTIFIED' ||

        detection.category !== 'cbc'

      ) {

        throw new Error(

          'This does not appear to be a CBC report. Please upload a Complete Blood Count (CBC) laboratory report.'

        )

      }

      // Only CBC results are accepted on this page.

      const resultsFromPdf = parseLabResults(extracted).filter(

        (result) => result.category === 'cbc'

      )

      if (resultsFromPdf.length === 0) {

        throw new Error(

          'The report was identified as CBC, but no supported CBC results could be extracted.'

        )

      }

      const resultMap = new Map()

      resultsFromPdf.forEach((result) => {
        if (!resultMap.has(result.id)) {
          resultMap.set(result.id, result)
        }
      })

      const uniqueResults = Array.from(resultMap.values())
      const extractedValues = { ...EMPTY_RESULTS }
      const extractedRanges = {}

      uniqueResults.forEach((result) => {
        if (
          CBC_PARAMETER_IDS.includes(result.id) &&
          result.value !== null &&
          result.value !== undefined &&
          String(result.value).trim() !== '' &&
          Number.isFinite(Number(result.value))
        ) {
          extractedValues[result.id] = String(result.value)
        }

        const range = parseNumericReferenceRange(result.referenceRange)

        if (range && CBC_PARAMETER_IDS.includes(result.id)) {
          extractedRanges[result.id] = range
        }
      })

      const completeReport = CBC_PARAMETER_IDS.every(
        (id) =>
          extractedValues[id] !== '' &&
          extractedRanges[id] !== undefined
      )

      setExtractedText(extracted)
      setParsedResults(uniqueResults)
      setResults(extractedValues)
      setLabRanges(extractedRanges)
      setSelectedPdfReport(
        completeReport
          ? {
              fileName: pdfFile?.name || 'CBC Laboratory Report',
              savedAt: new Date().toISOString(),
            }
          : null
      )
      setRangeType(completeReport ? 'laboratory' : 'standard')
      resetAnalysis()

      setPdfSuccess(
        completeReport
          ? 'CBC report identified successfully. All nine supported values and numeric reference ranges have been extracted and added to the form.'
          : `CBC report identified. ${uniqueResults.filter((result) => CBC_PARAMETER_IDS.includes(result.id)).length} supported parameters were found. Missing or unreadable values and ranges must be entered manually before using laboratory ranges.`
      )

    } catch (error) {

      console.error('CBC PDF upload error:', error)

      setPdfError(

        error.message || 'Failed to process the PDF.'

      )

    } finally {

      setPdfLoading(false)

    }

  }

  // Handle manually changing a CBC value.

  const handleResultChange = (id, value) => {

    setResults((previous) => ({

      ...previous,

      [id]: value,

    }))

    resetAnalysis()

  }

  // Select Medora standard reference ranges.

  const handleStandardRangeSelection = () => {

    setRangeType('standard')

    resetAnalysis()

  }

  // CBC analysis.

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)

    setError('')

    setAnalysis(null)

    setAiExplanation('')

    setAiError('')

    try {

      const convertedResults = {}

      const missingParameters = parameters.filter(

        (parameter) =>

          results[parameter.id] === '' ||

          !Number.isFinite(Number(results[parameter.id]))

      )

      if (missingParameters.length > 0) {

        throw new Error(

          'Please provide valid values for all CBC parameters.'

        )

      }

      parameters.forEach((parameter) => {

        convertedResults[parameter.id] = Number(

          results[parameter.id]

        )

      })

      // Standard backend ranges use absolute WBC and

      // platelet counts. Frontend values are ×10³/µL.

      if (rangeType === 'standard') {

        convertedResults.wbc *= 1000

        convertedResults.platelets *= 1000

      }

      const convertedLabRanges = {}

      if (rangeType === 'laboratory') {

        if (!selectedPdfReport) {

          throw new Error(

            'Upload a CBC PDF with all nine readable values and numeric reference ranges, or use Medora standard ranges.'

          )

        }

        CBC_PARAMETER_IDS.forEach((id) => {

          const range = labRanges[id]

          if (

            range &&

            Number.isFinite(Number(range.low)) &&

            Number.isFinite(Number(range.high)) &&

            Number(range.low) <= Number(range.high)

          ) {

            convertedLabRanges[id] = {

              low: Number(range.low),

              high: Number(range.high),

            }

          }

        })

        if (

          Object.keys(convertedLabRanges).length !==

          CBC_PARAMETER_IDS.length

        ) {

          throw new Error(

            'Some laboratory reference ranges are missing or invalid. Please verify the PDF again or use Medora standard ranges.'

          )

        }

      }

      const storedUser = JSON.parse(

        localStorage.getItem('medoraUser') || 'null'

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

      const response = await fetch(

        'http://localhost:8081/api/reports/cbc',

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

          data?.message || 'Unable to analyze CBC results.'

        )

      }

      setAnalysis(data)

    } catch (error) {

      console.error('CBC analysis error:', error)

      setError(

        error.message || 'Failed to analyze CBC results.'

      )

    } finally {

      setLoading(false)

    }

  }

  // AI explanation.

  const handleAIExplain = async () => {

    if (!analysis) {

      setAiError('Please analyze your results first.')

      return

    }

    setAiLoading(true)

    setAiError('')

    setAiExplanation('')

    try {

      const storedUser = JSON.parse(

        localStorage.getItem('medoraUser') || 'null'

      )

      if (!storedUser?.userId) {

        throw new Error(

          'Please sign in before using AI analysis.'

        )

      }

      const reportContext = `

Complete Blood Count (CBC) Report

Red Blood Cells (RBC): ${results.rbc} ×10⁶/µL

Hemoglobin (Hb): ${results.hemoglobin} g/dL

Hematocrit (Hct): ${results.hematocrit} %

White Blood Cells (WBC): ${results.wbc} ×10³/µL

Platelets: ${results.platelets} ×10³/µL

MCV: ${results.mcv} fL

MCH: ${results.mch} pg

MCHC: ${results.mchc} g/dL

RDW: ${results.rdw} %

Reference Range Type:

${rangeType === 'standard'

  ? "Medora's standard ranges"

  : 'Verified laboratory PDF ranges'}

Laboratory PDF:

${selectedPdfReport?.fileName || 'Not selected'}

Reference ranges:

${JSON.stringify(

  rangeType === 'laboratory' ? labRanges : {}

)}

Medora's analysis:

${analysis.message || ''}

Parameter analysis:

${JSON.stringify(analysis.analysis || {})}

Please explain these CBC results in simple language.

Requirements:

- Keep the explanation short and easy to understand.

- Explain which results are within range.

- Explain which results may need attention.

- Explain what the CBC parameters generally mean.

- Do not provide a medical diagnosis.

- Do not recommend starting or stopping medication.

- Recommend discussing concerning results with a qualified healthcare professional.

- Avoid unnecessary technical terminology.

`

      const response = await fetch(

        'http://localhost:8081/api/ai/explain',

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json',

          },

          body: JSON.stringify({ reportContext }),

        }

      )

      const data = await response.json()

      if (!response.ok) {

        throw new Error(

          data?.message || 'Unable to generate AI explanation.'

        )

      }

      if (!data?.explanation) {

        throw new Error(

          'The AI did not return an explanation.'

        )

      }

      setAiExplanation(data.explanation)

    } catch (error) {

      console.error('CBC AI explanation error:', error)

      setAiError(

        error.message || 'Failed to generate AI explanation.'

      )

    } finally {

      setAiLoading(false)

    }

  }

  // Analysis status helpers.

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

    <div className="cbc-container">

      <div className="cbc-header">

        <button

          type="button"

          className="back-button"

          onClick={() => navigate('/test-results')}

        >

          ← Back to Test Reports

        </button>

        <div className="cbc-logo">Medora</div>

        <p className="section-label">

          COMPLETE BLOOD COUNT

        </p>

        <h1>Enter your CBC results</h1>

        <p>

          Upload your CBC laboratory report or enter

          your results manually.

        </p>

      </div>

      {/* CBC PDF UPLOAD */}

      <div className="range-section">

        <h2>Upload your CBC laboratory report</h2>

        <p>

          Upload your Complete Blood Count report.

          Medora will identify the report type and extract

          the available CBC values and reference ranges.

        </p>

        <form onSubmit={handlePDFUpload}>

          <div className="pdf-upload-area">

            <span className="pdf-upload-icon">📄</span>

            <label htmlFor="cbc-pdf-upload">

              Choose a CBC laboratory PDF

            </label>

            <input

              id="cbc-pdf-upload"

              type="file"

              accept=".pdf,application/pdf"

              onChange={handleFileChange}

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

              ? 'Extracting and checking report...'

              : 'Upload & Extract CBC Results'}

          </button>

        </form>

        {pdfError && (

          <div className="form-error">

            {pdfError}

          </div>

        )}

        {pdfSuccess && (

          <div className="pdf-success">

            {pdfSuccess}

          </div>

        )}

        {/* EXTRACTED RESULTS */}

        {parsedResults.length > 0 && (
          <div className="pdf-extracted-section">
            <h3>Detected CBC Results</h3>
            <p>
              Medora extracted the following values and reference ranges
              from your PDF. Please review the displayed information.
            </p>

            <div className="pdf-extraction-summary">
              <strong>
                {availableParameterCount} of {CBC_PARAMETER_IDS.length} CBC
                parameters detected
              </strong>
              <p>
                {hasCompleteLaboratoryRanges
                  ? 'All nine values and numeric reference ranges were extracted. The CBC form has been populated automatically.'
                  : 'Some values or numeric reference ranges could not be extracted. You can complete the missing information manually.'}
              </p>
            </div>

            {parameters.map((parameter) => {
              const result = parsedResults.find(
                (item) => item.id === parameter.id
              )

              if (!result) {
                return (
                  <div key={parameter.id} className="parameter-card">
                    <div className="parameter-info">
                      <h3>{parameter.name}</h3>
                      <span>Unit: {parameter.unit}</span>
                    </div>
                    <p>This parameter was not detected in the PDF.</p>
                  </div>
                )
              }

              const statusStyles = {
                WITHIN_RANGE: {
                  label: 'Within range',
                  className: 'extracted-status-within',
                },
                ABOVE_RANGE: {
                  label: 'Above range',
                  className: 'extracted-status-above',
                },
                BELOW_RANGE: {
                  label: 'Below range',
                  className: 'extracted-status-below',
                },
              }

              const extractedStatus = statusStyles[result.statusCode]

              return (
                <div key={parameter.id} className="parameter-card">
                  <div className="parameter-info">
                    <h3>{parameter.name}</h3>
                    <span>Unit: {result.unit || parameter.unit}</span>
                  </div>

                  <div className="extracted-result-details">
                    <p>
                      <strong>Extracted value:</strong>{' '}
                      {result.value ?? 'Not detected'}{' '}
                      {result.unit || parameter.unit}
                    </p>
                    <p>
                      <strong>Reference range:</strong>{' '}
                      {result.referenceRange || 'Not detected'}
                    </p>
                    {extractedStatus && (
                      <span
                        className={`extracted-status ${extractedStatus.className}`}
                      >
                        {extractedStatus.label}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ORIGINAL EXTRACTED TEXT */}

        {extractedText && (

          <details className="pdf-extracted-section">

            <summary>

              View original extracted PDF text

            </summary>

            <textarea

              className="pdf-extracted-text"

              value={extractedText}

              readOnly

              rows={12}

            />

            <p>

              Always compare extracted information with

              your original laboratory report.

            </p>

          </details>

        )}

      </div>

      {/* REFERENCE RANGES */}

      <form onSubmit={handleSubmit}>

        <div className="range-section">

          <h2>Reference ranges</h2>

          <p>

            Choose how Medora should interpret your

            laboratory results.

          </p>

          {selectedPdfReport && rangeType === 'laboratory' && (

            <div className="pdf-report-hint">

              ✓ CBC laboratory report:

              {' '}

              {selectedPdfReport.fileName}

            </div>

          )}

          <label className="range-option">

            <input

              type="radio"

              name="rangeType"

              value="standard"

              checked={rangeType === 'standard'}

              onChange={handleStandardRangeSelection}

            />

            <div>

              <strong>

                Use Medora's standard ranges

              </strong>

              <span>

                Medora will use its predefined reference

                ranges for this analysis.

              </span>

            </div>

          </label>

          {selectedPdfReport && (

            <label className="range-option">

              <input

                type="radio"

                name="rangeType"

                value="laboratory"

                checked={rangeType === 'laboratory'}

                onChange={() => {

                  setRangeType('laboratory')

                  resetAnalysis()

                }}

              />

              <div>

                <strong>

                  Use laboratory ranges from uploaded PDF

                </strong>

                <span>

                  Use the reference ranges extracted and

                  verified from your CBC PDF.

                </span>

              </div>

            </label>

          )}

        </div>

        {/* CBC VALUES */}

        <div className="results-section">

          <div className="section-heading">

            <h2>Blood test results</h2>

            <p>

              {selectedPdfReport && rangeType === 'laboratory'

                ? 'Values were populated from your uploaded CBC PDF.'

                : 'Enter your result for each parameter.'}

            </p>

          </div>

          {parameters.map((parameter) => (

            <div

              className="parameter-card"

              key={parameter.id}

            >

              <div className="parameter-info">

                <h3>{parameter.name}</h3>

                <span>

                  Unit: {parameter.unit}

                </span>

              </div>

              <div className="result-input">

                <label>Your result</label>

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

                  <span>{parameter.unit}</span>

                </div>

              </div>

              {rangeType === 'laboratory' && (

                <div className="lab-range">

                  <label>

                    Laboratory reference range

                  </label>

                  <div className="range-inputs">

                    <span>

                      {labRanges[parameter.id]?.low}

                    </span>

                    <span>to</span>

                    <span>

                      {labRanges[parameter.id]?.high}

                    </span>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

        {error && (

          <div className="form-error">

            {error}

          </div>

        )}

        <div className="submit-section">

          <button

            type="submit"

            className="analyze-button"

            disabled={loading}

          >

            {loading ? 'Analyzing...' : 'Analyze Results'}

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

            CBC ANALYSIS

          </p>

          <h2>Results interpretation</h2>

          <p>{analysis.message}</p>

          <div className="analysis-list">

            {parameters.map((parameter) => {

              const result = analysis.analysis?.[parameter.id]

              if (!result) return null

              return (

                <div

                  className={`analysis-card ${getStatusClass(

                    result.status

                  )}`}

                  key={parameter.id}

                >

                  <div>

                    <strong>

                      {getStatusIcon(result.status)}{' '}

                      {parameter.name}

                    </strong>

                    <span>

                      {results[parameter.id]} {parameter.unit}

                    </span>

                  </div>

                  <p className="analysis-status">

                    {getStatusText(result.status)}

                  </p>

                  <p className="analysis-message">

                    {result.message}

                  </p>

                </div>

              )

            })}

          </div>

          {/* AI EXPLANATION */}

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

                <p>{aiExplanation}</p>

              </div>

            )}

          </div>

          <div className="medical-disclaimer">

            <strong>Important</strong>

            <p>{analysis.disclaimer}</p>

          </div>

        </div>

      )}

    </div>

  )

}

export default CBCReport
