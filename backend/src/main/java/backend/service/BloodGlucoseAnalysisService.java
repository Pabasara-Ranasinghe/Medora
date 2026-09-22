package backend.service;

import backend.dto.BloodGlucoseReportRequest;
import backend.dto.BloodGlucoseReportResponse;
import backend.model.BloodGlucoseReport;
import backend.model.HealthReport;
import backend.repository.BloodGlucoseReportRepository;
import backend.repository.HealthReportRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BloodGlucoseAnalysisService {

    private final BloodGlucoseReportRepository bloodGlucoseReportRepository;
    private final HealthReportRepository healthReportRepository;
    private final BloodGlucoseReferenceRangeService
            bloodGlucoseReferenceRangeService;

    public BloodGlucoseAnalysisService(
            BloodGlucoseReportRepository bloodGlucoseReportRepository,
            HealthReportRepository healthReportRepository,
            BloodGlucoseReferenceRangeService
                    bloodGlucoseReferenceRangeService
    ) {

        this.bloodGlucoseReportRepository =
                bloodGlucoseReportRepository;

        this.healthReportRepository =
                healthReportRepository;

        this.bloodGlucoseReferenceRangeService =
                bloodGlucoseReferenceRangeService;
    }

    public BloodGlucoseReportResponse analyze(
            BloodGlucoseReportRequest request
    ) {

        /*
         * No glucose value provided.
         */
        if (request.getGlucose() == null) {

            return new BloodGlucoseReportResponse(
                    "No glucose result was provided.",
                    "NO_VALUE",
                    "Please enter the glucose value shown on your laboratory report.",
                    getDisclaimer()
            );
        }

        /*
         * Get the appropriate reference range.
         */
        double[] range = getRange(request);

        /*
         * Reference range unavailable.
         */
        if (range == null) {

            return new BloodGlucoseReportResponse(
                    "A reference range was not available.",
                    "RANGE_UNAVAILABLE",
                    "Please provide the reference range shown on your laboratory report.",
                    getDisclaimer()
            );
        }

        Double glucose = request.getGlucose();

        String status;
        String guidance;

        /*
         * Below range.
         */
        if (glucose < range[0]) {

            status = "BELOW_RANGE";

            guidance =
                    "Your reported glucose value is below the reference range " +
                    "used for this analysis. Consider discussing this result " +
                    "with a qualified healthcare professional, especially if " +
                    "you are experiencing symptoms.";

        }

        /*
         * Above range.
         */
        else if (glucose > range[1]) {

            status = "ABOVE_RANGE";

            guidance =
                    "Your reported glucose value is above the reference range " +
                    "used for this analysis. Consider discussing this result " +
                    "with a qualified healthcare professional.";

        }

        /*
         * Within range.
         */
        else {

            status = "WITHIN_RANGE";

            guidance =
                    "Your reported glucose value is within the reference range " +
                    "used for this analysis.";
        }

        /*
         * Create report ID.
         */
        String reportId = UUID.randomUUID().toString();

        /*
         * Create Blood Glucose report.
         */
        BloodGlucoseReport report =
                new BloodGlucoseReport();

        report.setReportId(reportId);
        report.setUserId(request.getUserId());
        report.setTestType(request.getTestType());
        report.setRangeType(request.getRangeType());
        report.setGlucose(glucose);
        report.setGlucoseStatus(status);

        /*
         * Save Blood Glucose report.
         */
        bloodGlucoseReportRepository.save(report);

        /*
         * Create general HealthReport record.
         */
        HealthReport healthReport =
                new HealthReport();

        healthReport.setReportId(reportId);
        healthReport.setUserId(request.getUserId());
        healthReport.setReportType("BLOOD_GLUCOSE");

        /*
         * Save general report record.
         */
        healthReportRepository.save(healthReport);

        /*
         * Return analysis response.
         */
        return new BloodGlucoseReportResponse(
                "Blood glucose result analyzed and saved successfully.",
                status,
                guidance,
                getDisclaimer()
        );
    }

    /*
     * Get the correct reference range.
     */
    private double[] getRange(
            BloodGlucoseReportRequest request
    ) {

        /*
         * User selected laboratory ranges.
         *
         * Laboratory ranges take priority
         * over Medora's standard ranges.
         */
        if ("laboratory".equalsIgnoreCase(
                request.getRangeType()
        )) {

            if (request.getLabRanges() == null) {
                return null;
            }

            BloodGlucoseReportRequest.ReferenceRange
                    labRange =
                    request.getLabRanges().get("glucose");

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
         * Use Medora's standard reference ranges.
         */
        return bloodGlucoseReferenceRangeService.getRange(
                request.getTestType()
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
