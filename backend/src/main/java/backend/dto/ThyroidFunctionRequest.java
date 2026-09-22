package backend.dto;

import java.util.Map;

public class ThyroidFunctionRequest {

    private String userId;

    private Integer age;

    private String gender;

    private String rangeType;

    private Map<String, Double> results;

    private Map<String, LabRange> labRanges;

    public ThyroidFunctionRequest() {
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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

    public Map<String, LabRange> getLabRanges() {
        return labRanges;
    }

    public void setLabRanges(Map<String, LabRange> labRanges) {
        this.labRanges = labRanges;
    }

    public static class LabRange {

        private Double low;

        private Double high;

        public LabRange() {
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