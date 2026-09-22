package backend.service;

import backend.dto.LiverFunctionReportRequest;
import backend.dto.LiverFunctionReportResponse;
import backend.model.HealthReport;
import backend.model.LiverFunctionReport;
import backend.repository.HealthReportRepository;
import backend.repository.LiverFunctionReportRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class LiverFunctionAnalysisService {

    private final LiverFunctionReportRepository liverFunctionReportRepository;
    private final HealthReportRepository healthReportRepository;

    public LiverFunctionAnalysisService(
            LiverFunctionReportRepository liverFunctionReportRepository,
            HealthReportRepository healthReportRepository
    ) {
        this.liverFunctionReportRepository =
                liverFunctionReportRepository;

        this.healthReportRepository =
                healthReportRepository;
    }

    public LiverFunctionReportResponse analyze(
            LiverFunctionReportRequest request
    ) {

        Map<String, LiverFunctionReportResponse.Result> analysis =
                new LinkedHashMap<>();

        /*
         * No results provided.
         */
        if (request.getResults() == null ||
                request.getResults().isEmpty()) {

            return new LiverFunctionReportResponse(
                    "No liver function test results were provided.",
                    getDisclaimer(),
                    request.getRangeType(),
                    analysis
            );
        }

        /*
         * Create report.
         */
        String reportId = UUID.randomUUID().toString();

        LiverFunctionReport report =
                new LiverFunctionReport();

        report.setReportId(reportId);
        report.setUserId(request.getUserId());
        report.setRangeType(request.getRangeType());

        /*
         * Analyze each submitted parameter.
         */
        for (Map.Entry<String, Double> entry :
                request.getResults().entrySet()) {

            String parameter = entry.getKey();
            Double value = entry.getValue();

            /*
             * Missing value.
             */
            if (value == null) {

                analysis.put(
                        parameter,
                        new LiverFunctionReportResponse.Result(
                                "NO_VALUE",
                                "No value was provided for this parameter."
                        )
                );

                continue;
            }

            /*
             * Get reference range.
             */
            double[] range =
                    getRange(request, parameter);

            /*
             * Range unavailable.
             */
            if (range == null) {

                analysis.put(
                        parameter,
                        new LiverFunctionReportResponse.Result(
                                "RANGE_UNAVAILABLE",
                                "A reference range was not available for this parameter."
                        )
                );

                continue;
            }

            String status;
            String message;

            /*
             * Below range.
             */
            if (value < range[0]) {

                status = "BELOW_RANGE";

                message =
                        "Your reported value is below the reference range " +
                        "used for this analysis.";

            }

            /*
             * Above range.
             */
            else if (value > range[1]) {

                status = "ABOVE_RANGE";

                message =
                        "Your reported value is above the reference range " +
                        "used for this analysis.";

            }

            /*
             * Within range.
             */
            else {

                status = "WITHIN_RANGE";

                message =
                        "Your reported value is within the reference range " +
                        "used for this analysis.";
            }

            analysis.put(
                    parameter,
                    new LiverFunctionReportResponse.Result(
                            status,
                            message
                    )
            );

            /*
             * Save parameter.
             */
            saveParameter(
                    report,
                    parameter,
                    value,
                    status
            );
        }

        /*
         * Save LFT report.
         */
        liverFunctionReportRepository.save(report);

        /*
         * Save general HealthReport record.
         */
        HealthReport healthReport =
                new HealthReport();

        healthReport.setReportId(reportId);
        healthReport.setUserId(request.getUserId());
        healthReport.setReportType("LIVER_FUNCTION");

        healthReportRepository.save(healthReport);

        return new LiverFunctionReportResponse(
                "Liver function test results analyzed successfully.",
                getDisclaimer(),
                request.getRangeType(),
                analysis
        );
    }

    /*
     * Save individual parameter.
     */
    private void saveParameter(
            LiverFunctionReport report,
            String parameter,
            Double value,
            String status
    ) {

        switch (parameter.toLowerCase()) {

            case "alt":
                report.setAlt(value);
                report.setAltStatus(status);
                break;

            case "ast":
                report.setAst(value);
                report.setAstStatus(status);
                break;

            case "alp":
                report.setAlp(value);
                report.setAlpStatus(status);
                break;

            case "totalbilirubin":
                report.setTotalBilirubin(value);
                report.setTotalBilirubinStatus(status);
                break;

            case "directbilirubin":
                report.setDirectBilirubin(value);
                report.setDirectBilirubinStatus(status);
                break;

            case "albumin":
                report.setAlbumin(value);
                report.setAlbuminStatus(status);
                break;

            default:
                break;
        }
    }

    /*
     * Get reference range.
     */
    private double[] getRange(
            LiverFunctionReportRequest request,
            String parameter
    ) {

        /*
         * Laboratory-specific ranges.
         */
        if ("laboratory".equalsIgnoreCase(
                request.getRangeType()
        )) {

            if (request.getLabRanges() == null) {
                return null;
            }

            LiverFunctionReportRequest.ReferenceRange labRange =
                    request.getLabRanges().get(parameter);

            if (labRange == null ||
                    labRange.getLow() == null ||
                    labRange.getHigh() == null) {

                return null;
            }

            return new double[]{
                    labRange.getLow(),
                    labRange.getHigh()
            };
        }

        /*
         * Medora standard ranges.
         */
        switch (parameter.toLowerCase()) {

            case "alt":
                return new double[]{7, 56};

            case "ast":
                return new double[]{10, 40};

            case "alp":
                return new double[]{44, 147};

            case "totalbilirubin":
                return new double[]{0.1, 1.2};

            case "directbilirubin":
                return new double[]{0.0, 0.3};

            case "albumin":
                return new double[]{3.5, 5.0};

            default:
                return null;
        }
    }

    /*
     * Medical disclaimer.
     */
    private String getDisclaimer() {

        return "This information is for general educational purposes " +
                "and is not a medical diagnosis. Laboratory results " +
                "should be interpreted in the context of the individual's " +
                "health and by a qualified healthcare professional.";
    }
}