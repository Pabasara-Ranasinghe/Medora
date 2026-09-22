package backend.dto;

public class BloodGlucoseReportResponse {

private String message;

private String status;

private String guidance;

private String disclaimer;

public BloodGlucoseReportResponse() {
}

public BloodGlucoseReportResponse(
        String message,
        String status,
        String guidance,
        String disclaimer
) {
    this.message = message;
    this.status = status;
    this.guidance = guidance;
    this.disclaimer = disclaimer;
}

public String getMessage() {
    return message;
}

public void setMessage(String message) {
    this.message = message;
}

public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}

public String getGuidance() {
    return guidance;
}

public void setGuidance(String guidance) {
    this.guidance = guidance;
}

public String getDisclaimer() {
    return disclaimer;
}

public void setDisclaimer(String disclaimer) {
    this.disclaimer = disclaimer;
}

}