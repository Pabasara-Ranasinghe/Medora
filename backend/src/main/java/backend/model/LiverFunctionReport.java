package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "liver_function_report")
public class LiverFunctionReport {

    @Id
    private String reportId;

    private String userId;

    private String rangeType;

    private Double alt;
    private String altStatus;

    private Double ast;
    private String astStatus;

    private Double alp;
    private String alpStatus;

    private Double totalBilirubin;
    private String totalBilirubinStatus;

    private Double directBilirubin;
    private String directBilirubinStatus;

    private Double albumin;
    private String albuminStatus;

    public LiverFunctionReport() {
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

    public Double getAlt() {
        return alt;
    }

    public void setAlt(Double alt) {
        this.alt = alt;
    }

    public String getAltStatus() {
        return altStatus;
    }

    public void setAltStatus(String altStatus) {
        this.altStatus = altStatus;
    }

    public Double getAst() {
        return ast;
    }

    public void setAst(Double ast) {
        this.ast = ast;
    }

    public String getAstStatus() {
        return astStatus;
    }

    public void setAstStatus(String astStatus) {
        this.astStatus = astStatus;
    }

    public Double getAlp() {
        return alp;
    }

    public void setAlp(Double alp) {
        this.alp = alp;
    }

    public String getAlpStatus() {
        return alpStatus;
    }

    public void setAlpStatus(String alpStatus) {
        this.alpStatus = alpStatus;
    }

    public Double getTotalBilirubin() {
        return totalBilirubin;
    }

    public void setTotalBilirubin(Double totalBilirubin) {
        this.totalBilirubin = totalBilirubin;
    }

    public String getTotalBilirubinStatus() {
        return totalBilirubinStatus;
    }

    public void setTotalBilirubinStatus(String totalBilirubinStatus) {
        this.totalBilirubinStatus = totalBilirubinStatus;
    }

    public Double getDirectBilirubin() {
        return directBilirubin;
    }

    public void setDirectBilirubin(Double directBilirubin) {
        this.directBilirubin = directBilirubin;
    }

    public String getDirectBilirubinStatus() {
        return directBilirubinStatus;
    }

    public void setDirectBilirubinStatus(String directBilirubinStatus) {
        this.directBilirubinStatus = directBilirubinStatus;
    }

    public Double getAlbumin() {
        return albumin;
    }

    public void setAlbumin(Double albumin) {
        this.albumin = albumin;
    }

    public String getAlbuminStatus() {
        return albuminStatus;
    }

    public void setAlbuminStatus(String albuminStatus) {
        this.albuminStatus = albuminStatus;
    }
}