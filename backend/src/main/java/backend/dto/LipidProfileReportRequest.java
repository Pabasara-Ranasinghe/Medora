package backend.dto;

import java.util.Map;

public class LipidProfileReportRequest {

private String userId;
private String rangeType;
private Map<String, Double> results;
private Map<String, ReferenceRange> labRanges;

public LipidProfileReportRequest() {
}

public String getUserId() {
    return userId;
}

public void setUserId(String userId) {
    this.userId = userId;
}

public String getRangeType() {
    return rangeType;
}

public void setRangeType(String rangeType) {
    this.rangeType = rangeType;
}

public Map<String, Double> getResults() {
    return results;
}

public void setResults(Map<String, Double> results) {
    this.results = results;
}

public Map<String, ReferenceRange> getLabRanges() {
    return labRanges;
}

public void setLabRanges(
        Map<String, ReferenceRange> labRanges
) {
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