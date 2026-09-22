package backend.dto;

import java.util.Map;

public class LipidProfileReportResponse {

private String message;
private String disclaimer;
private String rangeType;
private Map<String, Result> analysis;

public LipidProfileReportResponse() {
}

public LipidProfileReportResponse(
        String message,
        String disclaimer,
        String rangeType,
        Map<String, Result> analysis
) {
    this.message = message;
    this.disclaimer = disclaimer;
    this.rangeType = rangeType;
    this.analysis = analysis;
}

public String getMessage() {
    return message;
}

public void setMessage(String message) {
    this.message = message;
}

public String getDisclaimer() {
    return disclaimer;
}

public void setDisclaimer(String disclaimer) {
    this.disclaimer = disclaimer;
}

public String getRangeType() {
    return rangeType;
}

public void setRangeType(String rangeType) {
    this.rangeType = rangeType;
}

public Map<String, Result> getAnalysis() {
    return analysis;
}

public void setAnalysis(Map<String, Result> analysis) {
    this.analysis = analysis;
}

public static class Result {

    private String status;
    private String message;

    public Result() {
    }

    public Result(
            String status,
            String message
    ) {
        this.status = status;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

}