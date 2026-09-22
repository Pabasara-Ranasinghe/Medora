package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class BloodGlucoseReport {

@Id
private String reportId;

private String userId;

private String testType;

private String rangeType;

private Double glucose;

private String glucoseStatus;

public BloodGlucoseReport() {
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

public String getTestType() {
    return testType;
}

public void setTestType(String testType) {
    this.testType = testType;
}

public String getRangeType() {
    return rangeType;
}

public void setRangeType(String rangeType) {
    this.rangeType = rangeType;
}

public Double getGlucose() {
    return glucose;
}

public void setGlucose(Double glucose) {
    this.glucose = glucose;
}

public String getGlucoseStatus() {
    return glucoseStatus;
}

public void setGlucoseStatus(String glucoseStatus) {
    this.glucoseStatus = glucoseStatus;
}

}