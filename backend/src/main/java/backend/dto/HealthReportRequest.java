package backend.dto;

public class HealthReportRequest {

    private String userId;
    private String reportType;

    // Blood test results
    private Double hemoglobin;
    private Double whiteBloodCells;
    private Double redBloodCells;
    private Double platelets;
    private Double bloodGlucose;
    private Double totalCholesterol;

    public HealthReportRequest() {
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

    public Double getHemoglobin() {
        return hemoglobin;
    }

    public void setHemoglobin(Double hemoglobin) {
        this.hemoglobin = hemoglobin;
    }

    public Double getWhiteBloodCells() {
        return whiteBloodCells;
    }

    public void setWhiteBloodCells(Double whiteBloodCells) {
        this.whiteBloodCells = whiteBloodCells;
    }

    public Double getRedBloodCells() {
        return redBloodCells;
    }

    public void setRedBloodCells(Double redBloodCells) {
        this.redBloodCells = redBloodCells;
    }

    public Double getPlatelets() {
        return platelets;
    }

    public void setPlatelets(Double platelets) {
        this.platelets = platelets;
    }

    public Double getBloodGlucose() {
        return bloodGlucose;
    }

    public void setBloodGlucose(Double bloodGlucose) {
        this.bloodGlucose = bloodGlucose;
    }

    public Double getTotalCholesterol() {
        return totalCholesterol;
    }

    public void setTotalCholesterol(Double totalCholesterol) {
        this.totalCholesterol = totalCholesterol;
    }
}