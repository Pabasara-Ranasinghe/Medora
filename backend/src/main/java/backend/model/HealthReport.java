package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class HealthReport {

    @Id
    private String reportId;

    private String userId;
    private String reportType;

    public HealthReport() {
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }
}