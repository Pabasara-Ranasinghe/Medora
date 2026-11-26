
// ==================================================
// MEDORA LABORATORY REPORT PARSER
// Supports CBC, Glucose, Lipid Profile, LFT, RFT, TFT
// ==================================================

// --------------------------------------------------
// TEST PARAMETERS
// --------------------------------------------------

const TEST_PATTERNS = [

  // ================= BLOOD GLUCOSE =================

  {
    id: 'fasting-blood-glucose',
    name: 'Fasting Blood Glucose',
    category: 'glucose',
    heading: /Fasting\s+(?:Plasma|Blood)\s+Glucose(?:\s*\((?:FPG|FBG)\))?/i,
  },
  {
    id: 'random-blood-glucose',
    name: 'Random Blood Glucose',
    category: 'glucose',
    heading: /Random\s+(?:Blood|Plasma)\s+Glucose(?:\s*\(RBG\))?/i,
  },
  {
    id: 'postprandial-blood-glucose',
    name: 'Postprandial Blood Glucose',
    category: 'glucose',
    heading: /Postprandial\s+(?:Blood\s+)?Glucose(?:\s*\((?:2\s*hr?\s*)?PPBG?\))?/i,
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'glucose',
    heading: /HbA1c(?:\s*\((?:Glycated\s+Hemoglobin|Glycosylated\s+Hemoglobin)\))?/i,
  },
  {
    id: 'estimated-average-glucose',
    name: 'Estimated Average Glucose',
    category: 'glucose',
    heading: /Estimated\s+Average\s+Glucose(?:\s*\(eAG\))?/i,
  },

  // ================= CBC =================

  {
    id: 'rbc',
    name: 'Red Blood Cell Count (RBC)',
    category: 'cbc',
    heading: /(?:Total\s+Red\s+Blood\s+Count|Red\s+Blood\s+Cell\s+Count|RBC\s+Count)\s*(?:\(\s*RBC\s*\))?/i,
  },
  {
    id: 'hemoglobin',
    name: 'Hemoglobin (Hb)',
    category: 'cbc',
    heading: /(?:Hemoglobin|Haemoglobin)\s*(?:\(\s*Hb\s*\))?/i,
  },
  {
    id: 'hematocrit',
    name: 'Hematocrit (PCV)',
    category: 'cbc',
    heading: /(?:Hematocrit|Haematocrit|Packed\s+Cell\s+Volume)\s*(?:\(\s*PCV\s*\))?/i,
  },
  {
    id: 'mcv',
    name: 'Mean Corpuscular Volume (MCV)',
    category: 'cbc',
    heading: /Mean\s+Corpuscular\s+Volume\s*(?:\(\s*MCV\s*\))?/i,
  },
  {
    id: 'mch',
    name: 'Mean Corpuscular Hemoglobin (MCH)',
    category: 'cbc',
    heading: /Mean\s+Corpuscular\s+(?:Hb|Hemoglobin|Haemoglobin)\s*(?:\(\s*MCH\s*\))?/i,
  },
  {
    id: 'mchc',
    name: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
    category: 'cbc',
    heading: /Mean\s+Corpuscular\s+(?:Hb\s+Conc(?:entration)?|Hemoglobin\s+Concentration|Haemoglobin\s+Concentration)\s*(?:\(\s*MCHC\s*\))?/i,
  },
  {
    id: 'rdw',
    name: 'Red Cell Distribution Width (RDW)',
    category: 'cbc',
    heading: /Red\s+Cell\s+Distribution\s+Width\s*(?:\(\s*RDW(?:-CV)?\s*\))?/i,
  },
  {
    id: 'wbc',
    name: 'White Blood Cell Count (WBC)',
    category: 'cbc',
    heading: /(?:Total\s+Leucocyte\s+Count|Total\s+Leukocyte\s+Count|White\s+Blood\s+Cell\s+Count)\s*(?:\(\s*WBC\s*\))?/i,
  },
  {
    id: 'platelets',
    name: 'Platelet Count',
    category: 'cbc',
    heading: /Platelet\s+Count/i,
  },

  // ================= LIPID PROFILE =================

  {
    id: 'total-cholesterol',
    name: 'Total Cholesterol',
    category: 'lipid',
    heading: /Total\s+Cholesterol(?:\s*\(TC\))?/i,
  },
  {
    id: 'hdl-cholesterol',
    name: 'HDL Cholesterol',
    category: 'lipid',
    heading: /HDL(?:\s+Cholesterol)?/i,
  },
  {
    id: 'ldl-cholesterol',
    name: 'LDL Cholesterol',
    category: 'lipid',
    heading: /LDL(?:\s+Cholesterol)?/i,
  },
  {
    id: 'vldl-cholesterol',
    name: 'VLDL Cholesterol',
    category: 'lipid',
    heading: /VLDL(?:\s+Cholesterol)?/i,
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    category: 'lipid',
    heading: /Triglycerides?/i,
  },
  {
    id: 'non-hdl-cholesterol',
    name: 'Non-HDL Cholesterol',
    category: 'lipid',
    heading: /Non[\s-]?HDL\s+Cholesterol/i,
  },

  // ================= LIVER FUNCTION (LFT) =================

  {
    id: 'alt',
    name: 'Alanine Aminotransferase (ALT/SGPT)',
    category: 'lft',
    heading: /(?:Alanine\s+Aminotransferase|\bALT\b|\bSGPT\b)/i,
  },
  {
    id: 'ast',
    name: 'Aspartate Aminotransferase (AST/SGOT)',
    category: 'lft',
    heading: /(?:Aspartate\s+Aminotransferase|\bAST\b|\bSGOT\b)/i,
  },
  {
    id: 'alp',
    name: 'Alkaline Phosphatase (ALP)',
    category: 'lft',
    heading: /(?:Alkaline\s+Phosphatase|ALP)/i,
  },
  {
    id: 'ggt',
    name: 'Gamma Glutamyl Transferase (GGT)',
    category: 'lft',
    heading: /(?:Gamma[\s-]+Glutamyl\s+Transferase|GGT)/i,
  },
  {
    id: 'total-bilirubin',
    name: 'Total Bilirubin',
    category: 'lft',
    heading: /Total\s+Bilirubin/i,
  },
  {
    id: 'direct-bilirubin',
    name: 'Direct Bilirubin',
    category: 'lft',
    heading: /Direct\s+Bilirubin/i,
  },
  {
    id: 'indirect-bilirubin',
    name: 'Indirect Bilirubin',
    category: 'lft',
    heading: /Indirect\s+Bilirubin/i,
  },
  {
    id: 'total-protein',
    name: 'Total Protein',
    category: 'lft',
    heading: /Total\s+Protein/i,
  },
  {
    id: 'albumin',
    name: 'Albumin',
    category: 'lft',
    heading: /Albumin/i,
  },
  {
    id: 'globulin',
    name: 'Globulin',
    category: 'lft',
    heading: /Globulin/i,
  },

  // ================= RENAL FUNCTION (RFT) =================

  {
    id: 'blood-urea',
    name: 'Blood Urea',
    category: 'rft',
    heading: /Blood\s+Urea(?!\s+Nitrogen)/i,
  },
  {
    id: 'bun',
    name: 'Blood Urea Nitrogen (BUN)',
    category: 'rft',
    heading: /Blood\s+Urea\s+Nitrogen|BUN/i,
  },
  {
    id: 'creatinine',
    name: 'Creatinine',
    category: 'rft',
    heading: /Creatinine/i,
  },
  {
    id: 'egfr',
    name: 'Estimated Glomerular Filtration Rate (eGFR)',
    category: 'rft',
    heading: /(?:Estimated\s+Glomerular\s+Filtration\s+Rate|eGFR)/i,
  },
  {
    id: 'uric-acid',
    name: 'Uric Acid',
    category: 'rft',
    heading: /Uric\s+Acid/i,
  },
  {
    id: 'sodium',
    name: 'Sodium',
    category: 'rft',
    heading: /Sodium/i,
  },
  {
    id: 'potassium',
    name: 'Potassium',
    category: 'rft',
    heading: /Potassium/i,
  },
  {
    id: 'chloride',
    name: 'Chloride',
    category: 'rft',
    heading: /Chloride/i,
  },
  {
    id: 'bicarbonate',
    name: 'Bicarbonate',
    category: 'rft',
    heading: /Bicarbonate/i,
  },

  // ================= THYROID FUNCTION (TFT) =================

  {
    id: 'tsh',
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: 'tft',
    heading: /(?:Thyroid\s+Stimulating\s+Hormone|TSH)/i,
  },
  {
    id: 'free-t3',
    name: 'Free T3 (FT3)',
    category: 'tft',
    heading: /(?:Free\s+T3|FT3)/i,
  },
  {
    id: 'free-t4',
    name: 'Free T4 (FT4)',
    category: 'tft',
    heading: /(?:Free\s+T4|FT4)/i,
  },
  {
    id: 'total-t3',
    name: 'Total T3',
    category: 'tft',
    heading: /Total\s+T3/i,
  },
  {
    id: 'total-t4',
    name: 'Total T4',
    category: 'tft',
    heading: /Total\s+T4/i,
  },
]

// --------------------------------------------------
// REPORT CATEGORY IDENTIFICATION
// --------------------------------------------------

const CATEGORY_MARKERS = {
  cbc: [
    { pattern: /complete\s+blood\s+count/i, weight: 4 },
    { pattern: /full\s+blood\s+count/i, weight: 4 },
    { pattern: /\bCBC\b/i, weight: 4 },
    { pattern: /\bFBC\b/i, weight: 4 },
    { pattern: /total\s+leucocyte\s+count/i, weight: 2 },
    { pattern: /total\s+leukocyte\s+count/i, weight: 2 },
    { pattern: /platelet\s+count/i, weight: 1 },
    { pattern: /red\s+blood\s+cell\s+count/i, weight: 1 },
    { pattern: /white\s+blood\s+cell\s+count/i, weight: 1 },
  ],

  glucose: [
    { pattern: /blood\s+glucose\s+(?:test|report|profile)/i, weight: 4 },
    { pattern: /blood\s+glucose/i, weight: 3 },
    { pattern: /fasting\s+(?:plasma|blood)\s+glucose/i, weight: 2 },
    { pattern: /random\s+(?:blood|plasma)\s+glucose/i, weight: 2 },
    { pattern: /postprandial\s+(?:blood\s+)?glucose/i, weight: 2 },
    { pattern: /\bHbA1c\b/i, weight: 2 },
    { pattern: /glycated\s+hemoglobin/i, weight: 2 },
  ],

  lipid: [
    { pattern: /lipid\s+profile/i, weight: 4 },
    { pattern: /lipid\s+panel/i, weight: 4 },
    { pattern: /total\s+cholesterol/i, weight: 2 },
    { pattern: /HDL\s+cholesterol/i, weight: 1 },
    { pattern: /LDL\s+cholesterol/i, weight: 1 },
    { pattern: /triglycerides?/i, weight: 1 },
  ],

  lft: [
    { pattern: /liver\s+function\s+(?:test|tests|profile)/i, weight: 4 },
    { pattern: /\bLFT\b/i, weight: 4 },
    { pattern: /alanine\s+aminotransferase/i, weight: 2 },
    { pattern: /aspartate\s+aminotransferase/i, weight: 2 },
    { pattern: /alkaline\s+phosphatase/i, weight: 1 },
    { pattern: /total\s+bilirubin/i, weight: 1 },
    { pattern: /gamma[\s-]+glutamyl\s+transferase/i, weight: 1 },
  ],

  rft: [
    { pattern: /renal\s+function\s+(?:test|tests|profile)/i, weight: 4 },
    { pattern: /kidney\s+function\s+(?:test|tests|profile)/i, weight: 4 },
    { pattern: /\bRFT\b/i, weight: 4 },
    { pattern: /estimated\s+glomerular\s+filtration\s+rate/i, weight: 2 },
    { pattern: /\beGFR\b/i, weight: 2 },
    { pattern: /blood\s+urea\s+nitrogen/i, weight: 1 },
    { pattern: /creatinine/i, weight: 1 },
    { pattern: /uric\s+acid/i, weight: 1 },
  ],

  tft: [
    { pattern: /thyroid\s+function\s+(?:test|tests|profile)/i, weight: 4 },
    { pattern: /\bTFT\b/i, weight: 4 },
    { pattern: /thyroid\s+stimulating\s+hormone/i, weight: 2 },
    { pattern: /\bTSH\b/i, weight: 2 },
    { pattern: /\bFT3\b/i, weight: 1 },
    { pattern: /\bFT4\b/i, weight: 1 },
  ],
}

export function detectLabReportCategory(text) {
  if (!text || typeof text !== 'string') {
    return {
      category: null,
      status: 'UNKNOWN',
      scores: {},
    }
  }

  const normalizedText = text.replace(/\s+/g, ' ')

  const scores = {}

  Object.entries(CATEGORY_MARKERS).forEach(
    ([category, markers]) => {
      scores[category] = markers.reduce(
        (total, marker) => {
          return total + (
            marker.pattern.test(normalizedText)
              ? marker.weight
              : 0
          )
        },
        0
      )
    }
  )

  const rankedCategories = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])

  const [bestCategory, bestScore] = rankedCategories[0]
  const secondScore = rankedCategories[1]?.[1] || 0

  // A report must contain enough evidence to identify
  // its category confidently.

  if (bestScore < 3) {
    return {
      category: null,
      status: 'UNKNOWN',
      scores,
    }
  }

  // If two categories have similar scores, the report
  // may be a combined report or difficult to identify.

  if (bestScore - secondScore < 1) {
    return {
      category: null,
      status: 'AMBIGUOUS',
      scores,
    }
  }

  return {
    category: bestCategory,
    status: 'IDENTIFIED',
    scores,
  }
}

// --------------------------------------------------
// RESULT CLASSIFICATION
// --------------------------------------------------

function classifyResult(value, referenceRange) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || !referenceRange) {
    return {
      status: referenceRange ? 'Unable to determine status' : 'Reference range unavailable',
      statusCode: referenceRange ? 'NEEDS_REVIEW' : 'RANGE_UNAVAILABLE',
      statusColor: 'gray',
    }
  }

  const range = referenceRange
    .replace(/,/g, '')
    .trim()

  // Less than: < 140

  const lessThanMatch = range.match(
    /^<\s*(\d+(?:\.\d+)?)/
  )

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

  // Less than or equal to: <= 140

  const lessEqualMatch = range.match(
    /^(?:≤|<=)\s*(\d+(?:\.\d+)?)/
  )

  if (lessEqualMatch) {
    const upper = Number(lessEqualMatch[1])

    return numericValue <= upper
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

  const greaterEqualMatch = range.match(
    /^(?:≥|>=)\s*(\d+(?:\.\d+)?)/
  )

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

  const greaterThanMatch = range.match(
    /^>\s*(\d+(?:\.\d+)?)/
  )

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

  // Numeric range: 70 - 99

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

// --------------------------------------------------
// MEASUREMENT EXTRACTION
// --------------------------------------------------

function extractMeasurement(sectionText) {
  const numberPattern = '\\d+(?:\\.\\d+)?'

  const unitPattern =
    '(?:' +
    '10\\s*\\^?\\s*[36]\\s*(?:\\/\\s*[μµu]L)?|' +
    'mg\\s*\\/\\s*dL|' +
    'mmol\\s*\\/\\s*L|' +
    'μmol\\s*\\/\\s*L|' +
    'µmol\\s*\\/\\s*L|' +
    'umol\\s*\\/\\s*L|' +
    'g\\s*\\/\\s*dL|' +
    'g\\s*\\/\\s*L|' +
    'mg\\s*\\/\\s*L|' +
    'ng\\s*\\/\\s*mL|' +
    'pg\\s*\\/\\s*mL|' +
    'mIU\\s*\\/\\s*L|' +
    'μIU\\s*\\/\\s*mL|' +
    'µIU\\s*\\/\\s*mL|' +
    'pmol\\s*\\/\\s*L|' +
    'nmol\\s*\\/\\s*L|' +
    'U\\s*\\/\\s*L|' +
    'IU\\s*\\/\\s*L|' +
    'fL|' +
    'pg|' +
    '%' +
    ')'

  const valuePattern = new RegExp(
    `(${numberPattern})\\s*(${unitPattern})?`,
    'i'
  )

  const valueMatch = valuePattern.exec(sectionText)

  if (!valueMatch) {
    return null
  }

  const value = valueMatch[1]
  const unit = (valueMatch[2] || '').trim()

  const beforeValue = sectionText.slice(0, valueMatch.index)
  const afterValue = sectionText.slice(valueMatch.index + valueMatch[0].length)

  // Extract the reference range appearing after the value.

  const rangePattern =
    /(?:<|>|≤|≥|<=|>=)\s*\d+(?:\.\d+)?|\d+(?:\.\d+)?\s*[–—-]\s*\d+(?:\.\d+)?/

  const rangeMatch = rangePattern.exec(afterValue) || rangePattern.exec(beforeValue)

  const referenceRange = rangeMatch
    ? rangeMatch[0].trim()
    : ''

  return {
    value,
    unit,
    referenceRange,
  }
}

// --------------------------------------------------
// MAIN PARSER
// --------------------------------------------------

export function parseLabResults(text) {
  if (!text || typeof text !== 'string') {
    return []
  }

  const normalizedText = text
    .replace(/\s+/g, ' ')
    .trim()

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
  const usedIds = new Set()

  for (let i = 0; i < sections.length; i++) {
    const currentTest = sections[i]

    // Avoid duplicate extraction of the same parameter.

    if (usedIds.has(currentTest.id)) {
      continue
    }

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

    usedIds.add(currentTest.id)

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

      verified: false,
    })
  }

  return results
}
