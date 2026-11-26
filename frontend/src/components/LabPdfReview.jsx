import { useState } from 'react'
import { detectLabReportCategory, parseLabResults } from '../utils/parseLabResults'
import './LabPdfReview.css'

const CATEGORY_NAMES = {
  glucose: 'Blood Glucose',
  lipid: 'Lipid Profile',
  lft: 'Liver Function Test (LFT)',
  rft: 'Renal / Kidney Function Test (RFT/KFT)',
  tft: 'Thyroid Function Test (TFT)',
}

const STATUS_CLASSES = {
  WITHIN_RANGE: 'extracted-status-within',
  ABOVE_RANGE: 'extracted-status-above',
  BELOW_RANGE: 'extracted-status-below',
  RANGE_UNAVAILABLE: 'extracted-status-unavailable',
  NEEDS_REVIEW: 'extracted-status-unavailable',
}

function parseNumericRange(referenceRange, allowMinimumOnly = false) {
  if (!referenceRange) return null

  const normalized = String(referenceRange)
    .replace(/,/g, '')
    .replace(/[–—−]/g, '-')
    .trim()
  const minimumMatch = allowMinimumOnly
    ? normalized.match(/^(?:>=|≥)\s*(\d+(?:\.\d+)?)$/)
    : null

  if (minimumMatch) {
    const low = Number(minimumMatch[1])
    return Number.isFinite(low) ? { low, high: null } : null
  }

  const match = normalized.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/)

  if (!match) return null

  const low = Number(match[1])
  const high = Number(match[2])
  if (!Number.isFinite(low) || !Number.isFinite(high) || low > high) return null

  return { low, high }
}

export default function LabPdfReview({ expectedCategory, parameters = [], fieldMap = {}, onResults }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [results, setResults] = useState([])
  const [extractedText, setExtractedText] = useState('')
  const [detectedCategory, setDetectedCategory] = useState(null)
  const categoryName = CATEGORY_NAMES[expectedCategory] || 'laboratory'
  const inputId = `lab-pdf-upload-${expectedCategory}`

  const resetResults = () => {
    setResults([])
    setExtractedText('')
    setDetectedCategory(null)
    setSuccess('')
    onResults?.([], {})
  }

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null)
    setError('')
    resetResults()
  }

  const upload = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    resetResults()

    if (!file) {
      setError('Please select a PDF file.')
      return
    }

    if (
      !file.name.toLowerCase().endsWith('.pdf') ||
      (file.type && file.type !== 'application/pdf')
    ) {
      setError('Please upload a valid PDF file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must not exceed 10 MB.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        'http://localhost:8081/api/pdf-review/extract',
        { method: 'POST', body: formData }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to extract PDF text.')
      }

      const text = data?.extractedText || ''
      if (text.trim().length < 20) {
        throw new Error('No readable text was extracted from this PDF. Try a text-based laboratory report.')
      }

      const detection = detectLabReportCategory(text)
      if (detection.status === 'AMBIGUOUS') {
        throw new Error(`Medora could not confidently identify this report type. Please upload a clear ${categoryName} report.`)
      }
      if (detection.status !== 'IDENTIFIED' || detection.category !== expectedCategory) {
        throw new Error(`This does not appear to be a ${categoryName} report. Please upload the matching laboratory report.`)
      }

      const uniqueResults = Array.from(
        new Map(
          parseLabResults(text)
            .filter((item) => item.category === expectedCategory)
            .map((item) => [item.id, item])
        ).values()
      )

      if (!uniqueResults.length) {
        throw new Error(`The report was identified as ${categoryName}, but no supported results could be extracted.`)
      }

      const numericRanges = Object.fromEntries(
        uniqueResults.flatMap((item) => {
          const range = parseNumericRange(
            item.referenceRange,
            expectedCategory === 'rft'
          )
          return range ? [[item.id, range]] : []
        })
      )

      setDetectedCategory(detection.category)
      setResults(uniqueResults)
      setExtractedText(text)
      onResults?.(uniqueResults, numericRanges)

      const displayedParameters = parameters.map((parameter) => ({
        ...parameter,
        id: Object.entries(fieldMap).find(([, fieldId]) => fieldId === parameter.id)?.[0] || parameter.id,
      }))
      const expectedCount = displayedParameters.length || uniqueResults.length
      const foundCount = displayedParameters.length
        ? displayedParameters.filter((parameter) => uniqueResults.some((item) => item.id === parameter.id)).length
        : uniqueResults.length
      setSuccess(
        `${categoryName} report identified. ${foundCount} of ${expectedCount} supported parameters were detected; available values and reference ranges are shown below.`
      )
    } catch (uploadError) {
      console.error('Laboratory PDF upload error:', uploadError)
      setError(uploadError.message || 'Failed to process the PDF.')
    } finally {
      setLoading(false)
    }
  }

  const displayedParameters = parameters.length
    ? parameters.map((parameter) => ({
        ...parameter,
        id: Object.entries(fieldMap).find(([, fieldId]) => fieldId === parameter.id)?.[0] || parameter.id,
      }))
    : results.map(({ id, name, unit }) => ({ id, name, unit }))
  const resultById = new Map(results.map((result) => [result.id, result]))

  return (
    <section className="range-section lab-pdf-review" aria-label={`${categoryName} PDF review`}>
      <h2>Upload your {categoryName} laboratory report</h2>
      <p>
        Upload the matching laboratory PDF. Medora checks its report type and extracts the available values and reference ranges for review.
      </p>

      <form onSubmit={upload}>
        <div className="lab-pdf-upload-area">
          <span className="lab-pdf-upload-icon" aria-hidden="true">📄</span>
          <label htmlFor={inputId}>Choose a {categoryName} laboratory PDF</label>
          <input
            id={inputId}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />
          {file && <p className="lab-pdf-selected-file">{file.name}</p>}
          <small>PDF files only · Maximum size: 10 MB</small>
        </div>

        <button className="lab-pdf-upload-button" type="submit" disabled={loading}>
          {loading ? 'Extracting and checking report…' : `Upload & Extract ${categoryName} Results`}
        </button>
      </form>

      {error && <div className="form-error" role="alert">{error}</div>}
      {success && <div className="lab-pdf-success" role="status">{success}</div>}

      {results.length > 0 && (
        <div className="lab-pdf-extracted-section" aria-live="polite">
          <h3>Detected {CATEGORY_NAMES[detectedCategory]} Results</h3>
          <p>Review the values and reference ranges extracted from your PDF.</p>
          <div className="pdf-extraction-summary">
            <strong>
              {displayedParameters.length
                ? `${displayedParameters.filter((parameter) => resultById.has(parameter.id)).length} of ${displayedParameters.length}`
                : results.length} supported parameters detected
            </strong>
            <p>Only information found in the uploaded report is displayed. Missing values and ranges are left blank.</p>
          </div>

          {displayedParameters.map((parameter) => {
            const result = resultById.get(parameter.id)
            const statusClass = result ? STATUS_CLASSES[result.statusCode] : null

            return (
              <article className="lab-pdf-parameter-card" key={parameter.id}>
                <div className="lab-pdf-parameter-info">
                  <h4>{parameter.name}</h4>
                  <span>Unit: {result?.unit || parameter.unit || 'Not detected'}</span>
                </div>
                <div className="lab-pdf-result-details">
                  <p><strong>Extracted value:</strong> {result?.value ?? 'Not detected'}{result?.unit ? ` ${result.unit}` : ''}</p>
                  <p><strong>Reference range:</strong> {result?.referenceRange || 'Not detected'}</p>
                  {result ? (
                    <span className={`extracted-status ${statusClass || 'extracted-status-unavailable'}`}>
                      {result.status || 'Needs review'}
                    </span>
                  ) : (
                    <p className="lab-pdf-missing">This parameter was not detected in the PDF.</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {extractedText && (
        <details className="lab-pdf-original-text">
          <summary>View original extracted PDF text</summary>
          <textarea value={extractedText} readOnly rows={12} aria-label="Original extracted PDF text" />
          <p>Compare extracted information with your original laboratory report.</p>
        </details>
      )}
    </section>
  )
}
