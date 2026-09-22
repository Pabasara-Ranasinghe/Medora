package backend.dto;

public class AIResponse {

    private String explanation;

    public AIResponse() {
    }

    public AIResponse(String explanation) {
        this.explanation = explanation;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}