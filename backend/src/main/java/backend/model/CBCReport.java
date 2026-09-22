package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CBCReport {

    @Id
    private String reportId;

    private String userId;

    private String rangeType;

    private Double rbc;
    private Double hemoglobin;
    private Double hematocrit;
    private Double wbc;
    private Double platelets;
    private Double mcv;
    private Double mch;
    private Double mchc;
    private Double rdw;

    private String rbcStatus;
    private String hemoglobinStatus;
    private String hematocritStatus;
    private String wbcStatus;
    private String plateletsStatus;
    private String mcvStatus;
    private String mchStatus;
    private String mchcStatus;
    private String rdwStatus;

    public CBCReport() {
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

    public Double getRbc() {
        return rbc;
    }

    public void setRbc(Double rbc) {
        this.rbc = rbc;
    }

    public Double getHemoglobin() {
        return hemoglobin;
    }

    public void setHemoglobin(Double hemoglobin) {
        this.hemoglobin = hemoglobin;
    }

    public Double getHematocrit() {
        return hematocrit;
    }

    public void setHematocrit(Double hematocrit) {
        this.hematocrit = hematocrit;
    }

    public Double getWbc() {
        return wbc;
    }

    public void setWbc(Double wbc) {
        this.wbc = wbc;
    }

    public Double getPlatelets() {
        return platelets;
    }

    public void setPlatelets(Double platelets) {
        this.platelets = platelets;
    }

    public Double getMcv() {
        return mcv;
    }

    public void setMcv(Double mcv) {
        this.mcv = mcv;
    }

    public Double getMch() {
        return mch;
    }

    public void setMch(Double mch) {
        this.mch = mch;
    }

    public Double getMchc() {
        return mchc;
    }

    public void setMchc(Double mchc) {
        this.mchc = mchc;
    }

    public Double getRdw() {
        return rdw;
    }

    public void setRdw(Double rdw) {
        this.rdw = rdw;
    }

    public String getRbcStatus() {
        return rbcStatus;
    }

    public void setRbcStatus(String rbcStatus) {
        this.rbcStatus = rbcStatus;
    }

    public String getHemoglobinStatus() {
        return hemoglobinStatus;
    }

    public void setHemoglobinStatus(String hemoglobinStatus) {
        this.hemoglobinStatus = hemoglobinStatus;
    }

    public String getHematocritStatus() {
        return hematocritStatus;
    }

    public void setHematocritStatus(String hematocritStatus) {
        this.hematocritStatus = hematocritStatus;
    }

    public String getWbcStatus() {
        return wbcStatus;
    }

    public void setWbcStatus(String wbcStatus) {
        this.wbcStatus = wbcStatus;
    }

    public String getPlateletsStatus() {
        return plateletsStatus;
    }

    public void setPlateletsStatus(String plateletsStatus) {
        this.plateletsStatus = plateletsStatus;
    }

    public String getMcvStatus() {
        return mcvStatus;
    }

    public void setMcvStatus(String mcvStatus) {
        this.mcvStatus = mcvStatus;
    }

    public String getMchStatus() {
        return mchStatus;
    }

    public void setMchStatus(String mchStatus) {
        this.mchStatus = mchStatus;
    }

    public String getMchcStatus() {
        return mchcStatus;
    }

    public void setMchcStatus(String mchcStatus) {
        this.mchcStatus = mchcStatus;
    }

    public String getRdwStatus() {
        return rdwStatus;
    }

    public void setRdwStatus(String rdwStatus) {
        this.rdwStatus = rdwStatus;
    }
}