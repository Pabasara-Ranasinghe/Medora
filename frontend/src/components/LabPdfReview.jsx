import { useState } from 'react'
import { detectLabReportCategory, parseLabResults } from '../utils/parseLabResults'

const CATEGORY_NAMES = {
  glucose: 'Blood Glucose',
  lipid: 'Lipid Profile',
  lft: 'Liver Function Test (LFT)',
  rft: 'Renal / Kidney Function Test (RFT/KFT)',
  tft: 'Thyroid Function Test (TFT)',
}

const STATUS_COLORS = {
  WITHIN_RANGE: '#2563EB',
  ABOVE_RANGE: '#DC2626',
  BELOW_RANGE: '#A16207',
  RANGE_UNAVAILABLE: '#4B5563',
  NEEDS_REVIEW: '#4B5563',
}

export default function LabPdfReview({ expectedCategory, onResults }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [detected, setDetected] = useState(null)

  const upload = async (event) => {
    event.preventDefault()
    setError('')
    if (!file) return setError('Choose a laboratory PDF to upload.')
    if (file.size > 10 * 1024 * 1024) return setError('PDF files must be 10 MB or smaller.')

    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const response = await fetch('http://localhost:8081/api/pdf-review/extract', { method: 'POST', body: form })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to read this PDF.')

      const text = (data.extractedText || '').trim()
      if (text.length < 20) throw new Error('This PDF does not contain enough readable text. Try a text-based laboratory PDF.')
      const category = detectLabReportCategory(text)
      if (category.status !== 'IDENTIFIED' || category.category !== expectedCategory) {
        throw new Error(`Invalid report. Please upload a ${CATEGORY_NAMES[expectedCategory]} laboratory report to continue.`)
      }

      const parsed = parseLabResults(text).filter((item) => item.category === expectedCategory)
      if (!parsed.length) throw new Error(`The PDF was identified as ${CATEGORY_NAMES[expectedCategory]}, but no readable test results were found.`)

      setDetected(category.category)
      setResults(parsed)
      onResults(parsed)
    } catch (err) {
      setError(err.message?.startsWith('Invalid report') || err.message?.startsWith('The PDF') || err.message?.startsWith('This PDF')
        ? err.message
        : 'Unable to process this PDF. Check that it is a readable, unprotected laboratory report and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="range-section" aria-label="PDF laboratory report review">
      <h2>Upload a laboratory PDF</h2>
      <p>Medora extracts this report’s available values and laboratory ranges for review.</p>
      <form onSubmit={upload}>
        <input type="file" accept=".pdf,application/pdf" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(''); setResults([]); setDetected(null) }} />
        {file && <p>Selected file: {file.name}</p>}
        <button className="analyze-button" type="submit" disabled={loading}>{loading ? 'Extracting PDF…' : 'Upload & Extract'}</button>
      </form>
      {error && <div className="form-error" role="alert">{error}</div>}
      {detected && <p role="status">PDF extracted. Detected category: {CATEGORY_NAMES[detected]}.</p>}
      {!!results.length && <div className="results-section">
        <h3>Extracted results</h3>
        {results.map((result) => <article key={result.id} className="parameter-card">
          <div className="parameter-info"><h3>{result.name}</h3><span>Value: {result.value}{result.unit ? ` ${result.unit}` : ''}</span></div>
          <p>Reference range: {result.referenceRange || 'Unavailable in this report'}</p>
          <strong style={{ color: STATUS_COLORS[result.statusCode] || STATUS_COLORS.NEEDS_REVIEW }}>{result.status}</strong>
        </article>)}
      </div>}
    </section>
  )
}
