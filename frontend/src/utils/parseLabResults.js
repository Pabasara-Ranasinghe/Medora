
const TEST_PATTERNS = [
  // Blood Glucose parameters
  {
    id: 'fasting-blood-glucose',
    name: 'Fasting Blood Glucose',
    category: 'glucose',
    heading: /Fasting\s+(?:Plasma|Blood)\s+Glucose(?:\s*\(?(?:FPG|FBG)\)?)?/i,
  },
  {
    id: 'random-blood-glucose',
    name: 'Random Blood Glucose',
    category: 'glucose',
    heading: /Random\s+Blood\s+Glucose(?:\s*\(?(?:RBG)\)?)?/i,
  },
  {
    id: 'postprandial-blood-glucose',
    name: 'Postprandial Blood Glucose',
    category: 'glucose',
    heading: /Postprandial\s+(?:Blood\s+)?Glucose(?:\s*\(?(?:2h\s*)?PPBG\)?)?/i,
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'glucose',
    heading: /HbA1c(?:\s*\(Glycated\s+Hemoglobin\))?/i,
  },
  {
    id: 'estimated-average-glucose',
    name: 'Estimated Average Glucose',
    category: 'glucose',
    heading: /Estimated\s+Average\s+Glucose(?:\s*\(eAG\))?/i,
  },

  // Complete Blood Count (CBC) parameters
  {
    id: 'rbc',
    name: 'Red Blood Cell Count (RBC)',
    category: 'cbc',
    heading: /(?:Total\s+Red\s+Blood\s+Count\s*\(RBC\)|Red\s+Blood\s+Cell\s+Count\s*\(RBC\)|RBC\s+Count)/i,
  },
  {
    id: 'hemoglobin',
    name: 'Hemoglobin (Hb)',
    category: 'cbc',
    heading: /(?:Hemoglobin|Haemoglobin)\s*\(Hb\)/i,
  },
  {
    id: 'hematocrit',
    name: 'Hematocrit (PCV)',
    category: 'cbc',
    heading: /(?:Hematocrit|Haematocrit)\s*\(PCV\)/i,
  },
  {
    id: 'mcv',
    name: 'Mean Corpuscular Volume (MCV)',
    category: 'cbc',
    heading: /Mean\s+Corpuscular\s+Volume\s*\(MCV\)/i,
  },
  {
    id: 'mch',
    name: 'Mean Corpuscular Hemoglobin (MCH)',
    category: 'cbc',
    heading: /Mean\s+Corpuscular\s+(?:Hb|Hemoglobin|Haemoglobin)\s*\(MCH\)/i,
  },
  {
    id: 'mchc',
    name: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
    category: 'cbc',
    heading: /Mean\s+Corpuscular\s+(?:Hb\s+Conc|Hemoglobin\s+Concentration|Haemoglobin\s+Concentration)\s*\(MCHC\)/i,
  },
  {
    id: 'rdw',
    name: 'Red Cell Distribution Width (RDW)',
    category: 'cbc',
    heading: /Red\s+Cell\s+Distribution\s+Width\s*\(RDW(?:-CV)?\)/i,
  },
  {
    id: 'wbc',
    name: 'White Blood Cell Count (WBC)',
    category: 'cbc',
    heading: /(?:Total\s+Leucocyte\s+Count|Total\s+Leukocyte\s+Count|White\s+Blood\s+Cell\s+Count)\s*\(WBC\)/i,
  },
  {
    id: 'platelets',
    name: 'Platelet Count',
    category: 'cbc',
    heading: /Platelet\s+Count/i,
  },
]

// Classify a result using its extracted reference range.
function classifyResult(value, referenceRange) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || !referenceRange) {
    return {
      status: 'Needs review',
      statusCode: 'NEEDS_REVIEW',
      statusColor: 'gray',
    }
  }

  const range = referenceRange.replace(/,/g, '').trim()

  // Less than: < 140
  const lessThanMatch = range.match(/^<\s*(\d+(?:\.\d+)?)/)

  if (lessThanMatch) {
    const upper = Number(lessThanMatch[1])

    return numericValue < upper
      ? {
          status: 'Within range',
          statusCode: 'WITHIN_RANGE',
          statusColor: 'blue',
        }
      : {
          status: 'Above range',
          statusCode: 'ABOVE_RANGE',
          statusColor: 'red',
        }
  }

  // Greater than or equal to: >= 126
  const greaterEqualMatch = range.match(/^(?:≥|>=)\s*(\d+(?:\.\d+)?)/)

  if (greaterEqualMatch) {
    const lower = Number(greaterEqualMatch[1])

    return numericValue >= lower
      ? {
          status: 'Within range',
          statusCode: 'WITHIN_RANGE',
          statusColor: 'blue',
        }
      : {
          status: 'Below range',
          statusCode: 'BELOW_RANGE',
          statusColor: 'yellow',
        }
  }

  // Greater than: > 10
  const greaterThanMatch = range.match(/^>\s*(\d+(?:\.\d+)?)/)

  if (greaterThanMatch) {
    const lower = Number(greaterThanMatch[1])

    return numericValue > lower
      ? {
          status: 'Within range',
          statusCode: 'WITHIN_RANGE',
          statusColor: 'blue',
        }
      : {
          status: 'Below range',
          statusCode: 'BELOW_RANGE',
          statusColor: 'yellow',
        }
  }

  // Numeric range: 70 - 99 or 70 – 99
  const rangeMatch = range.match(
    /^(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)$/
  )

  if (rangeMatch) {
    const lower = Number(rangeMatch[1])
    const upper = Number(rangeMatch[2])

    if (numericValue < lower) {
      return {
        status: 'Below range',
        statusCode: 'BELOW_RANGE',
        statusColor: 'yellow',
      }
    }

    if (numericValue > upper) {
      return {
        status: 'Above range',
        statusCode: 'ABOVE_RANGE',
        statusColor: 'red',
      }
    }

    return {
      status: 'Within range',
      statusCode: 'WITHIN_RANGE',
      statusColor: 'blue',
    }
  }

  return {
    status: 'Needs review',
    statusCode: 'NEEDS_REVIEW',
    statusColor: 'gray',
  }
}

// Extract a value, unit and reference range from a test section.
function extractMeasurement(sectionText) {
  // Match a number followed by a supported laboratory unit.
  // This avoids accidentally extracting numbers from method descriptions.
  const valuePattern =
    /(\d+(?:\.\d+)?)\s*(10\s*\^\s*[36]\s*\/\s*[μµu]L|mg\s*\/\s*dL|mmol\s*\/\s*L|g\s*\/\s*dL|10\s*\^\s*[36]|fL|pg|%)/i

  const valueMatch = valuePattern.exec(sectionText)

  if (!valueMatch) {
    return null
  }

  const value = valueMatch[1]
  const unit = valueMatch[2].trim()

  const afterValue = sectionText.slice(
    valueMatch.index + valueMatch[0].length
  )

  // Find the laboratory reference range.
  const rangePattern =
    /(?:<|>|≤|≥|<=|>=)\s*\d+(?:\.\d+)?|\d+(?:\.\d+)?\s*[–—-]\s*\d+(?:\.\d+)?/

  const rangeMatch = rangePattern.exec(afterValue)

  const referenceRange = rangeMatch
    ? rangeMatch[0].trim()
    : ''

  return {
    value,
    unit,
    referenceRange,
  }
}

export function parseLabResults(text) {
  if (!text || typeof text !== 'string') {
    return []
  }

  // Normalize line breaks and repeated spaces.
  const normalizedText = text
    .replace(/\s+/g, ' ')
    .trim()

  // Find all supported test headings.
  const sections = TEST_PATTERNS
    .map((test) => {
      const match = test.heading.exec(normalizedText)

      return {
        ...test,
        index: match ? match.index : -1,
        headingLength: match ? match[0].length : 0,
      }
    })
    .filter((test) => test.index !== -1)
    .sort((a, b) => a.index - b.index)

  const results = []

  for (let i = 0; i < sections.length; i++) {
    const currentTest = sections[i]

    const start = currentTest.index
    const end =
      sections[i + 1]?.index ?? normalizedText.length

    const sectionText = normalizedText.slice(start, end)

    const content = sectionText.slice(
      currentTest.headingLength
    )

    const measurement = extractMeasurement(content)

    if (!measurement) {
      continue
    }

    const classification = classifyResult(
      measurement.value,
      measurement.referenceRange
    )

    results.push({
      id: currentTest.id,
      name: currentTest.name,
      category: currentTest.category,
      value: measurement.value,
      unit: measurement.unit,
      referenceRange: measurement.referenceRange,

      ...classification,

      // Results must be reviewed and confirmed by the user.
      verified: false,
    })
  }

  return results
}
