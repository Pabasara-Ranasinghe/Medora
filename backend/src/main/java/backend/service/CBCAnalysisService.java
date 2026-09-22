package backend.service;

import backend.dto.CBCReportRequest;
import backend.dto.CBCReportResponse;
import backend.model.CBCReport;
import backend.model.HealthReport;
import backend.model.User;
import backend.repository.CBCReportRepository;
import backend.repository.HealthReportRepository;
import backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CBCAnalysisService {

    private final CBCReportRepository cbcReportRepository;
    private final HealthReportRepository healthReportRepository;
    private final UserRepository userRepository;
    private final CBCReferenceRangeService cbcReferenceRangeService;

    public CBCAnalysisService(
            CBCReportRepository cbcReportRepository,
            HealthReportRepository healthReportRepository,
            UserRepository userRepository,
            CBCReferenceRangeService cbcReferenceRangeService
    ) {
        this.cbcReportRepository = cbcReportRepository;
        this.healthReportRepository = healthReportRepository;
        this.userRepository = userRepository;
        this.cbcReferenceRangeService = cbcReferenceRangeService;
    }

    public CBCReportResponse analyze(CBCReportRequest request) {

        Map<String, CBCReportResponse.AnalysisResult> analysis =
                new LinkedHashMap<>();

        /*
         * No results provided
         */
        if (request.getResults() == null ||
                request.getResults().isEmpty()) {

            return new CBCReportResponse(
                    "No results were provided.",
                    analysis,
                    getDisclaimer()
            );
        }

        /*
         * Create the CBC report object.
         */
        CBCReport report = new CBCReport();

        String reportId = UUID.randomUUID().toString();

        report.setReportId(reportId);
        report.setUserId(request.getUserId());
        report.setRangeType(request.getRangeType());

        /*
         * Analyze every submitted CBC parameter.
         */
        for (Map.Entry<String, Double> entry :
                request.getResults().entrySet()) {

            String parameter = entry.getKey();
            Double value = entry.getValue();

            /*
             * Missing value
             */
            if (value == null) {

                analysis.put(
                        parameter,
                        new CBCReportResponse.AnalysisResult(
                                "NO_VALUE",
                                "No value was provided for this parameter."
                        )
                );

                continue;
            }

            /*
             * Get reference range.
             */
            double[] range = getRange(request, parameter);

            /*
             * Reference range unavailable.
             */
            if (range == null) {

                analysis.put(
                        parameter,
                        new CBCReportResponse.AnalysisResult(
                                "RANGE_UNAVAILABLE",
                                "A reference range was not available for this parameter."
                        )
                );

                continue;
            }

            String status;

            /*
             * Below range
             */
            if (value < range[0]) {

                status = "BELOW_RANGE";

                analysis.put(
                        parameter,
                        new CBCReportResponse.AnalysisResult(
                                status,
                                "Your reported value is below the reference range used for this analysis."
                        )
                );
            }

            /*
             * Above range
             */
            else if (value > range[1]) {

                status = "ABOVE_RANGE";

                analysis.put(
                        parameter,
                        new CBCReportResponse.AnalysisResult(
                                status,
                                "Your reported value is above the reference range used for this analysis."
                        )
                );
            }

            /*
             * Within range
             */
            else {

                status = "WITHIN_RANGE";

                analysis.put(
                        parameter,
                        new CBCReportResponse.AnalysisResult(
                                status,
                                "Your reported value is within the reference range used for this analysis."
                        )
                );
            }

            /*
             * Save the value and status into the CBC entity.
             */
            saveParameter(
                    report,
                    parameter,
                    value,
                    status
            );
        }

        /*
         * Save CBC report.
         */
        cbcReportRepository.save(report);

        /*
         * Also create the general HealthReport record.
         */
        HealthReport healthReport = new HealthReport();

        healthReport.setReportId(reportId);
        healthReport.setUserId(request.getUserId());
        healthReport.setReportType("CBC");

        healthReportRepository.save(healthReport);

        return new CBCReportResponse(
                "CBC results analyzed and saved successfully",
                analysis,
                getDisclaimer()
        );
    }

    /*
     * Get all CBC reports belonging to a specific user.
     */
    public List<CBCReport> getReportsByUserId(String userId) {

        return cbcReportRepository.findByUserId(userId);
    }

    /*
     * Save an individual CBC parameter
     * into the CBCReport entity.
     */
    private void saveParameter(
            CBCReport report,
            String parameter,
            Double value,
            String status
    ) {

        switch (parameter.toLowerCase()) {

            case "rbc":
                report.setRbc(value);
                report.setRbcStatus(status);
                break;

            case "hemoglobin":
                report.setHemoglobin(value);
                report.setHemoglobinStatus(status);
                break;

            case "hematocrit":
                report.setHematocrit(value);
                report.setHematocritStatus(status);
                break;

            case "wbc":
                report.setWbc(value);
                report.setWbcStatus(status);
                break;

            case "platelets":
                report.setPlatelets(value);
                report.setPlateletsStatus(status);
                break;

            case "mcv":
                report.setMcv(value);
                report.setMcvStatus(status);
                break;

            case "mch":
                report.setMch(value);
                report.setMchStatus(status);
                break;

            case "mchc":
                report.setMchc(value);
                report.setMchcStatus(status);
                break;

            case "rdw":
                report.setRdw(value);
                report.setRdwStatus(status);
                break;

            default:
                break;
        }
    }

    /*
     * Get the correct reference range.
     */
    private double[] getRange(
            CBCReportRequest request,
            String parameter
    ) {

        /*
         * User selected laboratory ranges.
         *
         * These ranges have priority because
         * laboratory-specific ranges should be
         * used when provided by the user's report.
         */
        if ("laboratory".equalsIgnoreCase(
                request.getRangeType()
        )) {

            if (request.getLabRanges() == null) {
                return null;
            }

            CBCReportRequest.ReferenceRange labRange =
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
         *
         * Get user information using userId.
         */
        if (request.getUserId() == null) {
            return null;
        }

        User user = userRepository
                .findById(request.getUserId())
                .orElse(null);

        if (user == null) {
            return null;
        }

        /*
         * Date of birth is required to calculate age.
         */
        if (user.getDateOfBirth() == null) {
            return null;
        }

        /*
         * Calculate current age.
         */
        int age = Period.between(
                user.getDateOfBirth(),
                LocalDate.now()
        ).getYears();

        /*
         * Gender can be null or
         * PREFER_NOT_TO_SAY.
         *
         * The reference-range service will
         * handle parameters where gender
         * is not required.
         */
        String gender = user.getGender();

        /*
         * Get the appropriate CBC range.
         */
        return cbcReferenceRangeService.getRange(
                parameter,
                age,
                gender
        );
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
