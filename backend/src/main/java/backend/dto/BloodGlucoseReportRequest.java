package backend.dto;

import java.util.Map;

public class BloodGlucoseReportRequest {

private String userId;

private String testType;

private String rangeType;

private Double glucose;

private Map<String, ReferenceRange> labRanges;

public BloodGlucoseReportRequest() {
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

public Map<String, ReferenceRange> getLabRanges() {
    return labRanges;
}

public void setLabRanges(Map<String, ReferenceRange> labRanges) {
    this.labRanges = labRanges;
}

public static class ReferenceRange {

    private Double low;

    private Double high;

    public ReferenceRange() {
    }

    public Double getLow() {
        return low;
    }

    public void setLow(Double low) {
        this.low = low;
    }

    public Double getHigh() {
        return high;
    }

    public void setHigh(Double high) {
        this.high = high;
    }
}

}