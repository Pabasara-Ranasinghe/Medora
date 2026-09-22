package backend.dto;

public class HealthReportResponse {

    private String message;
    private String reportId;

    public HealthReportResponse() {
    }

    public HealthReportResponse(String message, String reportId) {
        this.message = message;
        this.reportId = reportId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }
}