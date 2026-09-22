package backend.dto;

import java.util.Map;

public class CBCReportResponse {

    private String message;

    private Map<String, AnalysisResult> analysis;

    private String disclaimer;

    public CBCReportResponse() {
    }

    public CBCReportResponse(
            String message,
            Map<String, AnalysisResult> analysis,
            String disclaimer
    ) {
        this.message = message;
        this.analysis = analysis;
        this.disclaimer = disclaimer;
    }

    public String getMessage() {
        return message;
    }

    public Map<String, AnalysisResult> getAnalysis() {
        return analysis;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public static class AnalysisResult {

        private String status;

        private String message;

        public AnalysisResult() {
        }

        public AnalysisResult(
                String status,
                String message
        ) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }
    }
}