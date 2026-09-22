package backend.dto;

import java.util.Map;

public class KidneyFunctionResponse {

    private String message;

    private String disclaimer;

    private Map<String, ParameterAnalysis> analysis;

    public KidneyFunctionResponse() {
    }

    public KidneyFunctionResponse(
            String message,
            String disclaimer,
            Map<String, ParameterAnalysis> analysis) {

        this.message = message;
        this.disclaimer = disclaimer;
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

    public Map<String, ParameterAnalysis> getAnalysis() {
        return analysis;
    }

    public void setAnalysis(
            Map<String, ParameterAnalysis> analysis) {

        this.analysis = analysis;
    }

    public static class ParameterAnalysis {

        private String status;

        private String message;

        private Double low;

        private Double high;

        public ParameterAnalysis() {
        }

        public ParameterAnalysis(
                String status,
                String message,
                Double low,
                Double high) {

            this.status = status;
            this.message = message;
            this.low = low;
            this.high = high;
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