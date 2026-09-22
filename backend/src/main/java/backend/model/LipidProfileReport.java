package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class LipidProfileReport {

    @Id
    private String reportId;

    private String userId;
    private String rangeType;

    private Double totalCholesterol;
    private String totalCholesterolStatus;

    private Double ldl;
    private String ldlStatus;

    private Double hdl;
    private String hdlStatus;

    private Double triglycerides;
    private String triglyceridesStatus;

    private Double vldl;
    private String vldlStatus;

    private Double cholesterolHdlRatio;
    private String cholesterolHdlRatioStatus;

    public LipidProfileReport() {
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

    public String getRangeType() {
        return rangeType;
    }

    public void setRangeType(String rangeType) {
        this.rangeType = rangeType;
    }

    public Double getTotalCholesterol() {
        return totalCholesterol;
    }

    public void setTotalCholesterol(Double totalCholesterol) {
        this.totalCholesterol = totalCholesterol;
    }

    public String getTotalCholesterolStatus() {
        return totalCholesterolStatus;
    }

    public void setTotalCholesterolStatus(
            String totalCholesterolStatus
    ) {
        this.totalCholesterolStatus = totalCholesterolStatus;
    }

    public Double getLdl() {
        return ldl;
    }

    public void setLdl(Double ldl) {
        this.ldl = ldl;
    }

    public String getLdlStatus() {
        return ldlStatus;
    }

    public void setLdlStatus(String ldlStatus) {
        this.ldlStatus = ldlStatus;
    }

    public Double getHdl() {
        return hdl;
    }

    public void setHdl(Double hdl) {
        this.hdl = hdl;
    }

    public String getHdlStatus() {
        return hdlStatus;
    }

    public void setHdlStatus(String hdlStatus) {
        this.hdlStatus = hdlStatus;
    }

    public Double getTriglycerides() {
        return triglycerides;
    }

    public void setTriglycerides(Double triglycerides) {
        this.triglycerides = triglycerides;
    }

    public String getTriglyceridesStatus() {
        return triglyceridesStatus;
    }

    public void setTriglyceridesStatus(
            String triglyceridesStatus
    ) {
        this.triglyceridesStatus = triglyceridesStatus;
    }

    public Double getVldl() {
        return vldl;
    }

    public void setVldl(Double vldl) {
        this.vldl = vldl;
    }

    public String getVldlStatus() {
        return vldlStatus;
    }

    public void setVldlStatus(String vldlStatus) {
        this.vldlStatus = vldlStatus;
    }

    public Double getCholesterolHdlRatio() {
        return cholesterolHdlRatio;
    }

    public void setCholesterolHdlRatio(
            Double cholesterolHdlRatio
    ) {
        this.cholesterolHdlRatio = cholesterolHdlRatio;
    }

    public String getCholesterolHdlRatioStatus() {
        return cholesterolHdlRatioStatus;
    }

    public void setCholesterolHdlRatioStatus(
            String cholesterolHdlRatioStatus
    ) {
        this.cholesterolHdlRatioStatus =
                cholesterolHdlRatioStatus;
    }
}
