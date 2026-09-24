package backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GroqAIService implements AIService {

    private final RestClient restClient;

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private static final String MODEL =
        "openai/gpt-oss-120b";

    public GroqAIService() {
        this.restClient = RestClient.builder()
                .baseUrl(GROQ_URL)
                .build();
    }

    @Override
    public String generateExplanation(String reportContext) {

        String prompt = """
                You are Medora, an AI health guidance assistant.

                Analyze the following health report information and explain
                the results in simple language that an ordinary user can understand.

                Important rules:
                - Do not diagnose diseases.
                - Do not claim certainty about a medical condition.
                - Explain abnormal and normal values clearly.
                - Mention when the user should discuss a result with a healthcare professional.
                - Do not recommend prescription medication.
                - Keep the explanation clear and concise.

                Health report:
                %s
                """.formatted(reportContext);

        Map<String, Object> requestBody = Map.of(
                "model", MODEL,
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "temperature", 0.3
        );

        Map<?, ?> response = restClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new RuntimeException("No response received from Groq.");
        }

        List<?> choices = (List<?>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("Groq returned no choices.");
        }

        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);

        Map<?, ?> message =
                (Map<?, ?>) firstChoice.get("message");

        if (message == null || message.get("content") == null) {
            throw new RuntimeException(
                    "Groq response did not contain a message."
            );
        }

        return message.get("content").toString();
    }
}