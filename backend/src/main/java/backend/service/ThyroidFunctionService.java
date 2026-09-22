package backend.service;

import backend.dto.ThyroidFunctionRequest;
import backend.dto.ThyroidFunctionResponse;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ThyroidFunctionService {

    public ThyroidFunctionResponse analyze(
            ThyroidFunctionRequest request) {

        Map<String, ThyroidRange> standardRanges =
                getStandardRanges(request.getAge());

        Map<String, ThyroidFunctionResponse.ParameterAnalysis> analysis =
                new LinkedHashMap<>();

        if (request.getResults() == null ||
                request.getResults().isEmpty()) {

            return new ThyroidFunctionResponse(
                    "No thyroid test results were provided.",
                    getDisclaimer(),
                    analysis
            );
        }

        for (Map.Entry<String, Double> entry :
                request.getResults().entrySet()) {

            String parameter = entry.getKey();
            Double value = entry.getValue();

            if (value == null) {
                continue;
            }

            ThyroidRange range = null;

            /*
             * Use the laboratory range when the user
             * selected laboratory reference ranges.
             */
            if ("laboratory".equalsIgnoreCase(
                    request.getRangeType())) {

                if (request.getLabRanges() != null &&
                        request.getLabRanges().containsKey(parameter)) {

                    ThyroidFunctionRequest.LabRange labRange =
                            request.getLabRanges().get(parameter);

                    if (labRange != null &&
                            labRange.getLow() != null &&
                            labRange.getHigh() != null) {

                        range = new ThyroidRange(
                                labRange.getLow(),
                                labRange.getHigh()
                        );
                    }
                }
            }

            /*
             * Otherwise use Medora's standard range.
             */
            if (range == null) {
                range = standardRanges.get(parameter);
            }

            if (range == null) {

                analysis.put(
                        parameter,
                        new ThyroidFunctionResponse.ParameterAnalysis(
                                "RANGE_UNAVAILABLE",
                                "A reference range is not available for this parameter.",
                                null,
                                null
                        )
                );

                continue;
            }

            String status;
            String message;

            if (value < range.low) {

                status = "BELOW_RANGE";

                message = "Your result is below the reference range of "
                        + format(range.low)
                        + "–"
                        + format(range.high)
                        + ".";

            } else if (value > range.high) {

                status = "ABOVE_RANGE";

                message = "Your result is above the reference range of "
                        + format(range.low)
                        + "–"
                        + format(range.high)
                        + ".";

            } else {

                status = "WITHIN_RANGE";

                message = "Your result is within the reference range of "
                        + format(range.low)
                        + "–"
                        + format(range.high)
                        + ".";
            }

            analysis.put(
                    parameter,
                    new ThyroidFunctionResponse.ParameterAnalysis(
                            status,
                            message,
                            range.low,
                            range.high
                    )
            );
        }

        return new ThyroidFunctionResponse(
                "Your thyroid function results have been analyzed.",
                getDisclaimer(),
                analysis
        );
    }

    /*
     * Standard thyroid reference ranges.
     *
     * TSH and Free T4 use age-specific ranges where
     * appropriate.
     */
    private Map<String, ThyroidRange> getStandardRanges(
            Integer age) {

        Map<String, ThyroidRange> ranges =
                new LinkedHashMap<>();

        /*
         * TSH
         */
        ThyroidRange tshRange =
                getTshRange(age);

        ranges.put(
                "tsh",
                tshRange
        );

        /*
         * Free T4
         */
        ThyroidRange freeT4Range =
                getFreeT4Range(age);

        ranges.put(
                "freeT4",
                freeT4Range
        );

        /*
         * Free T3
         */
        ranges.put(
                "freeT3",
                new ThyroidRange(
                        2.3,
                        4.2
                )
        );

        /*
         * Total T4
         */
        ranges.put(
                "totalT4",
                new ThyroidRange(
                        4.5,
                        12.5
                )
        );

        /*
         * Total T3
         */
        ranges.put(
                "totalT3",
                new ThyroidRange(
                        80.0,
                        200.0
                )
        );

        /*
         * TPO antibodies.
         *
         * The provided reference is <35 IU/mL.
         * We represent this as 0–35 for comparison.
         */
        ranges.put(
                "tpoAntibodies",
                new ThyroidRange(
                        0.0,
                        35.0
                )
        );

        /*
         * Thyroglobulin antibodies.
         */
        ranges.put(
                "thyroglobulinAntibodies",
                new ThyroidRange(
                        0.0,
                        20.0
                )
        );

        /*
         * Thyroglobulin.
         */
        ranges.put(
                "thyroglobulin",
                new ThyroidRange(
                        1.5,
                        38.5
                )
        );

        return ranges;
    }

    /*
     * Age-specific TSH ranges.
     */
    private ThyroidRange getTshRange(Integer age) {

        if (age == null) {

            return new ThyroidRange(
                    0.4,
                    4.0
            );
        }

        /*
         * Infant: 1–12 months
         */
        if (age < 1) {

            return new ThyroidRange(
                    0.7,
                    8.0
            );
        }

        /*
         * Child: 1–12 years
         */
        if (age < 12) {

            return new ThyroidRange(
                    0.6,
                    5.5
            );
        }

        /*
         * Adolescent: 12–18 years
         */
        if (age < 18) {

            return new ThyroidRange(
                    0.5,
                    4.5
            );
        }

        /*
         * Elderly: 65+
         */
        if (age >= 65) {

            return new ThyroidRange(
                    0.4,
                    6.5
            );
        }

        /*
         * Adult: 18–64 years
         */
        return new ThyroidRange(
                0.4,
                4.0
        );
    }

    /*
     * Age-specific Free T4 ranges.
     */
    private ThyroidRange getFreeT4Range(Integer age) {

        if (age == null) {

            return new ThyroidRange(
                    0.8,
                    1.8
            );
        }

        /*
         * Infant: 1–12 months
         */
        if (age < 1) {

            return new ThyroidRange(
                    0.9,
                    2.2
            );
        }

        /*
         * Child: 1–12 years
         */
        if (age < 12) {

            return new ThyroidRange(
                    0.8,
                    2.0
            );
        }

        /*
         * Adolescent: 12–18 years
         */
        if (age < 18) {

            return new ThyroidRange(
                    0.8,
                    1.9
            );
        }

        /*
         * Adult and elderly
         */
        return new ThyroidRange(
                0.8,
                1.8
        );
    }

    private String format(Double value) {

        if (value == null) {
            return "-";
        }

        if (value == value.longValue()) {
            return String.valueOf(value.longValue());
        }

        return String.valueOf(value);
    }

    private String getDisclaimer() {

        return "Medora provides general health information and "
                + "does not provide a medical diagnosis. "
                + "Reference ranges may vary between laboratories "
                + "and individual circumstances. Please consult "
                + "a qualified healthcare professional for "
                + "interpretation of your results.";
    }

    /*
     * Internal class used to store reference ranges.
     */
    private static class ThyroidRange {

        private final Double low;

        private final Double high;

        public ThyroidRange(
                Double low,
                Double high) {

            this.low = low;
            this.high = high;
        }
    }
}