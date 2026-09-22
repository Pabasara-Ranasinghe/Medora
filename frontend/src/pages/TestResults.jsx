import { useNavigate } from 'react-router-dom'
import './TestResults.css'

function TestResults() {
  const navigate = useNavigate()

  const testTypes = [
    {
      id: 'cbc',
      icon: '🩸',
      title: 'Complete Blood Count',
      shortName: 'CBC',
      description:
        'Analyze red blood cells, white blood cells, hemoglobin, platelets and related blood indices.',
    },
    {
      id: 'blood-glucose',
      icon: '🩸',
      title: 'Blood Glucose',
      shortName: 'Glucose',
      description:
        'Review fasting and random blood glucose results.',
    },
    {
      id: 'lipid',
      icon: '❤️',
      title: 'Lipid Profile',
      shortName: 'Lipid',
      description:
        'Review cholesterol, LDL, HDL, triglycerides and non-HDL cholesterol.',
    },
    {
      id: 'lft',
      icon: '🧪',
      title: 'Liver Function Test',
      shortName: 'LFT',
      description:
        'Review common liver-related laboratory measurements.',
    },
    {
      id: 'kidney',
      icon: '🧪',
      title: 'Kidney / Renal Function',
      shortName: 'RFT',
      description:
        'Review creatinine, urea, eGFR and electrolyte results.',
    },
    {
      id: 'thyroid',
      icon: '🦋',
      title: 'Thyroid Function Test',
      shortName: 'TFT',
      description:
        'Review TSH, Free T4 and Free T3 results.',
    },
  ]

  const handleSelect = (test) => {
    navigate(`/test-results/${test.id}`)
  }

  return (
    <div className="test-results-page">
      <div className="test-results-container">

        <div className="test-results-header">

          <div className="test-results-logo">
            Medora
          </div>

          <p className="section-label">
            LABORATORY REPORTS
          </p>

          <h1>
            What would you like to analyze?
          </h1>

          <p>
            Select a laboratory report and enter the
            results exactly as shown on your report.
          </p>

        </div>

        <div className="test-grid">

          {testTypes.map((test) => (
            <div
              className="test-card"
              key={test.id}
              onClick={() => handleSelect(test)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelect(test)
                }
              }}
            >

              <div className="test-icon">
                {test.icon}
              </div>

              <h2>
                {test.title}
              </h2>

              <span className="test-short-name">
                {test.shortName}
              </span>

              <p>
                {test.description}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(test)
                }}
              >
                Enter Results →
              </button>

            </div>
          ))}

        </div>

        <p className="medical-note">
          Laboratory results should be interpreted using
          the reference ranges provided by your laboratory.
          Medora does not provide a medical diagnosis.
        </p>

      </div>
    </div>
  )
}

export default TestResults
