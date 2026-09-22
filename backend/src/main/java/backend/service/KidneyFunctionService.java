package backend.service;

import backend.dto.KidneyFunctionRequest;
import backend.dto.KidneyFunctionResponse;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class KidneyFunctionService {

    public KidneyFunctionResponse analyze(
            KidneyFunctionRequest request) {

        Map<String, KidneyFunctionResponse.ParameterAnalysis> analysis =
                new LinkedHashMap<>();

        Map<String, Range> ranges =
                getReferenceRanges(
                        request.getAge(),
                        request.getGender()
                );

        System.out.println("AGE: " + request.getAge());
        System.out.println("GENDER: " + request.getGender());
        System.out.println("REFERENCE RANGES: " + ranges.keySet());
        System.out.println("RESULTS: " + request.getResults());

        if (request.getResults() != null) {

            for (Map.Entry<String, Double> entry :
                    request.getResults().entrySet()) {

                String parameter = entry.getKey();

                Double value = entry.getValue();

                Range range = ranges.get(parameter);

                analysis.put(
                        parameter,
                        analyzeParameter(
                                parameter,
                                value,
                                range
                        )
                );
            }
        }

        String message =
                "Your kidney function results have been analyzed.";

        String disclaimer =
                "Medora provides general health information "
                        + "and does not provide a medical diagnosis. "
                        + "Reference ranges may vary between laboratories. "
                        + "Please discuss your results with a qualified "
                        + "healthcare professional.";

        return new KidneyFunctionResponse(
                message,
                disclaimer,
                analysis
        );
    }

    private Map<String, Range> getReferenceRanges(
            Integer age,
            String gender) {

        Map<String, Range> ranges =
                new LinkedHashMap<>();

        if (age == null) {
            return ranges;
        }

        /*
         * ADULT STANDARD RANGES
         *
         * These ranges are used for adults
         * between 18 and 65 years.
         */

        if (age >= 18 && age <= 65) {

            // BUN
            ranges.put(
                    "bun",
                    new Range(7.0, 20.0)
            );

            // Creatinine depends on gender
            if ("male".equalsIgnoreCase(gender)) {

                ranges.put(
                        "creatinine",
                        new Range(0.74, 1.35)
                );

                ranges.put(
                        "uricAcid",
                        new Range(3.4, 7.0)
                );

            } else if ("female".equalsIgnoreCase(gender)) {

                ranges.put(
                        "creatinine",
                        new Range(0.59, 1.04)
                );

                ranges.put(
                        "uricAcid",
                        new Range(2.4, 6.0)
                );
            }

            // eGFR
            ranges.put(
                    "egfr",
                    new Range(90.0, null)
            );

            // BUN / Creatinine ratio
            ranges.put(
                    "bunCreatinineRatio",
                    new Range(10.0, 20.0)
            );

            // Electrolytes
            ranges.put(
                    "sodium",
                    new Range(135.0, 145.0)
            );

            ranges.put(
                    "potassium",
                    new Range(3.5, 5.1)
            );

            ranges.put(
                    "chloride",
                    new Range(96.0, 106.0)
            );

            // Minerals
            ranges.put(
                    "calcium",
                    new Range(8.5, 10.5)
            );

            ranges.put(
                    "phosphate",
                    new Range(2.5, 4.5)
            );

            // Cystatin C
            ranges.put(
                    "cystatinC",
                    new Range(0.6, 1.0)
            );

            return ranges;
        }

        /*
         * CHILDREN
         */

        if (age >= 1 && age < 12) {

            ranges.put(
                    "creatinine",
                    new Range(0.3, 0.7)
            );

            ranges.put(
                    "egfr",
                    new Range(90.0, null)
            );

            return ranges;
        }

        /*
         * ADOLESCENTS
         */

        if (age >= 12 && age < 18) {

            ranges.put(
                    "creatinine",
                    new Range(0.5, 1.0)
            );

            ranges.put(
                    "egfr",
                    new Range(90.0, null)
            );

            return ranges;
        }

        /*
         * NEONATE
         */

        if (age == 0) {

            ranges.put(
                    "creatinine",
                    new Range(0.3, 1.0)
            );

            return ranges;
        }

        /*
         * ELDERLY
         */

        if (age > 65) {

            ranges.put(
                    "bun",
                    new Range(7.0, 20.0)
            );

            ranges.put(
                    "egfr",
                    new Range(60.0, null)
            );

            ranges.put(
                    "bunCreatinineRatio",
                    new Range(10.0, 20.0)
            );

            if ("male".equalsIgnoreCase(gender)) {

                ranges.put(
                        "uricAcid",
                        new Range(3.4, 7.0)
                );

            } else if ("female".equalsIgnoreCase(gender)) {

                ranges.put(
                        "uricAcid",
                        new Range(2.4, 6.0)
                );
            }

            ranges.put(
                    "sodium",
                    new Range(135.0, 145.0)
            );

            ranges.put(
                    "potassium",
                    new Range(3.5, 5.1)
            );

            ranges.put(
                    "chloride",
                    new Range(96.0, 106.0)
            );

            ranges.put(
                    "calcium",
                    new Range(8.5, 10.5)
            );

            ranges.put(
                    "phosphate",
                    new Range(2.5, 4.5)
            );

            ranges.put(
                    "cystatinC",
                    new Range(0.6, 1.0)
            );

            return ranges;
        }

        return ranges;
    }

    private KidneyFunctionResponse.ParameterAnalysis analyzeParameter(
            String parameter,
            Double value,
            Range range) {

        if (value == null) {

            return new KidneyFunctionResponse.ParameterAnalysis(
                    "NO_VALUE",
                    "No value was provided for this parameter.",
                    range != null ? range.low : null,
                    range != null ? range.high : null
            );
        }

        if (range == null) {

            return new KidneyFunctionResponse.ParameterAnalysis(
                    "RANGE_UNAVAILABLE",
                    "A specific reference range is not available "
                            + "for this age group.",
                    null,
                    null
            );
        }

        /*
         * Range with only a minimum
         * Example: eGFR >= 90
         */

        if (range.high == null) {

            if (value >= range.low) {

                return new KidneyFunctionResponse.ParameterAnalysis(
                        "WITHIN_RANGE",
                        "Your "
                                + getParameterName(parameter)
                                + " is within the reference range.",
                        range.low,
                        null
                );

            } else {

                return new KidneyFunctionResponse.ParameterAnalysis(
                        "BELOW_RANGE",
                        "Your "
                                + getParameterName(parameter)
                                + " is below the reference value.",
                        range.low,
                        null
                );
            }
        }

        /*
         * Normal range
         */

        if (value >= range.low &&
                value <= range.high) {

            return new KidneyFunctionResponse.ParameterAnalysis(
                    "WITHIN_RANGE",
                    "Your "
                            + getParameterName(parameter)
                            + " is within the reference range.",
                    range.low,
                    range.high
            );
        }

        /*
         * Below range
         */

        if (value < range.low) {

            return new KidneyFunctionResponse.ParameterAnalysis(
                    "BELOW_RANGE",
                    "Your "
                            + getParameterName(parameter)
                            + " is below the reference range.",
                    range.low,
                    range.high
            );
        }

        /*
         * Above range
         */

        return new KidneyFunctionResponse.ParameterAnalysis(
                "ABOVE_RANGE",
                "Your "
                        + getParameterName(parameter)
                        + " is above the reference range.",
                range.low,
                range.high
        );
    }

    private String getParameterName(String parameter) {

        switch (parameter) {

            case "bun":
                return "Blood Urea Nitrogen (BUN)";

            case "creatinine":
                return "Serum Creatinine";

            case "egfr":
                return "eGFR";

            case "bunCreatinineRatio":
                return "BUN/Creatinine Ratio";

            case "uricAcid":
                return "Uric Acid";

            case "sodium":
                return "Sodium";

            case "potassium":
                return "Potassium";

            case "chloride":
                return "Chloride";

            case "calcium":
                return "Calcium";

            case "phosphate":
                return "Phosphate";

            case "cystatinC":
                return "Cystatin C";

            default:
                return parameter;
        }
    }

    private static class Range {

        private final Double low;

        private final Double high;

        private Range(
                Double low,
                Double high) {

            this.low = low;
            this.high = high;
        }

        @Override
        public String toString() {

            return "[" + low + " - " + high + "]";
        }
    }
}