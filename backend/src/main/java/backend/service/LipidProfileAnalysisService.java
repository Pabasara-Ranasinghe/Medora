package backend.service;

import backend.dto.LipidProfileReportRequest;
import backend.dto.LipidProfileReportResponse;
import backend.model.HealthReport;
import backend.model.LipidProfileReport;
import backend.model.User;
import backend.repository.HealthReportRepository;
import backend.repository.LipidProfileReportRepository;
import backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class LipidProfileAnalysisService {

    private final LipidProfileReportRepository lipidProfileReportRepository;
    private final HealthReportRepository healthReportRepository;
    private final UserRepository userRepository;
    private final LipidProfileReferenceRangeService
            lipidProfileReferenceRangeService;

    public LipidProfileAnalysisService(
            LipidProfileReportRepository lipidProfileReportRepository,
            HealthReportRepository healthReportRepository,
            UserRepository userRepository,
            LipidProfileReferenceRangeService
                    lipidProfileReferenceRangeService
    ) {

        this.lipidProfileReportRepository =
                lipidProfileReportRepository;

        this.healthReportRepository =
                healthReportRepository;

        this.userRepository =
                userRepository;

        this.lipidProfileReferenceRangeService =
                lipidProfileReferenceRangeService;
    }

    public LipidProfileReportResponse analyze(
            LipidProfileReportRequest request
    ) {

        Map<String, LipidProfileReportResponse.Result>
                analysis = new LinkedHashMap<>();

        /*
         * No results provided.
         */
        if (request.getResults() == null ||
                request.getResults().isEmpty()) {

            return new LipidProfileReportResponse(
                    "No lipid profile results were provided.",
                    getDisclaimer(),
                    request.getRangeType(),
                    analysis
            );
        }

        /*
         * Create lipid profile report.
         */
        LipidProfileReport report =
                new LipidProfileReport();

        String reportId =
                UUID.randomUUID().toString();

        report.setReportId(reportId);
        report.setUserId(request.getUserId());
        report.setRangeType(request.getRangeType());

        /*
         * Analyze every submitted parameter.
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
                        new LipidProfileReportResponse.Result(
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
             * Reference range unavailable.
             */
            if (range == null) {

                analysis.put(
                        parameter,
                        new LipidProfileReportResponse.Result(
                                "RANGE_UNAVAILABLE",
                                "A reference range was not available for this parameter."
                        )
                );

                continue;
            }

            String status;
            String message;

            /*
             * Special handling for HDL.
             *
             * HDL is desirable when it is at or above
             * the gender-specific minimum.
             */
            if ("hdl".equalsIgnoreCase(parameter)) {

                if (value < range[0]) {

                    status = "BELOW_RANGE";

                    message =
                            "HDL Cholesterol is below the " +
                            "recommended reference level.";

                } else {

                    status = "WITHIN_RANGE";

                    message =
                            "HDL Cholesterol is at or above " +
                            "the recommended reference level.";
                }

            }

            /*
             * Other lipid parameters.
             */
            else if (value < range[0]) {

                status = "BELOW_RANGE";

                message =
                        getParameterName(parameter) +
                        " is below the provided reference range.";

            } else if (value > range[1]) {

                status = "ABOVE_RANGE";

                message =
                        getParameterName(parameter) +
                        " is above the provided reference range.";

            } else {

                status = "WITHIN_RANGE";

                message =
                        getParameterName(parameter) +
                        " is within the provided reference range.";
            }

            /*
             * Add result to response.
             */
            analysis.put(
                    parameter,
                    new LipidProfileReportResponse.Result(
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
         * Save lipid profile report.
         */
        lipidProfileReportRepository.save(report);

        /*
         * Create general HealthReport.
         */
        HealthReport healthReport =
                new HealthReport();

        healthReport.setReportId(reportId);
        healthReport.setUserId(request.getUserId());
        healthReport.setReportType("LIPID_PROFILE");

        healthReportRepository.save(healthReport);

        return new LipidProfileReportResponse(
                "Lipid profile results analyzed successfully.",
                getDisclaimer(),
                request.getRangeType(),
                analysis
        );
    }

    /*
     * Get all lipid profile reports for a user.
     */
    public List<LipidProfileReport> getReportsByUserId(
            String userId
    ) {

        return lipidProfileReportRepository
                .findByUserId(userId);
    }

    /*
     * Get the correct reference range.
     */
    private double[] getRange(
            LipidProfileReportRequest request,
            String parameter
    ) {

        /*
         * Laboratory range has priority.
         */
        if ("laboratory".equalsIgnoreCase(
                request.getRangeType()
        )) {

            if (request.getLabRanges() == null) {
                return null;
            }

            LipidProfileReportRequest.ReferenceRange
                    labRange =
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
         * Get user's gender for HDL.
         */
        String gender = null;

        if (request.getUserId() != null) {

            User user = userRepository
                    .findById(request.getUserId())
                    .orElse(null);

            if (user != null) {
                gender = user.getGender();
            }
        }

        /*
         * Use Medora standard range.
         */
        return lipidProfileReferenceRangeService.getRange(
                parameter,
                gender
        );
    }

    /*
     * Save individual lipid parameter.
     */
    private void saveParameter(
            LipidProfileReport report,
            String parameter,
            Double value,
            String status
    ) {

        switch (parameter.toLowerCase()) {

            case "totalcholesterol":
            case "total_cholesterol":
            case "total cholesterol":

                report.setTotalCholesterol(value);
                report.setTotalCholesterolStatus(status);
                break;

            case "ldl":

                report.setLdl(value);
                report.setLdlStatus(status);
                break;

            case "hdl":

                report.setHdl(value);
                report.setHdlStatus(status);
                break;

            case "triglycerides":

                report.setTriglycerides(value);
                report.setTriglyceridesStatus(status);
                break;

            case "vldl":

                report.setVldl(value);
                report.setVldlStatus(status);
                break;

            case "cholesterolhdlratio":
            case "cholesterol_hdl_ratio":
            case "cholesterol/hdl ratio":

                report.setCholesterolHdlRatio(value);
                report.setCholesterolHdlRatioStatus(status);
                break;

            default:
                break;
        }
    }

    /*
     * Convert parameter name into a readable name.
     */
    private String getParameterName(
            String parameter
    ) {

        switch (parameter.toLowerCase()) {

            case "totalcholesterol":
            case "total_cholesterol":
            case "total cholesterol":
                return "Total Cholesterol";

            case "ldl":
                return "LDL Cholesterol";

            case "hdl":
                return "HDL Cholesterol";

            case "triglycerides":
                return "Triglycerides";

            case "vldl":
                return "VLDL";

            case "cholesterolhdlratio":
            case "cholesterol_hdl_ratio":
            case "cholesterol/hdl ratio":
                return "Total Cholesterol/HDL Ratio";

            default:
                return parameter;
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
