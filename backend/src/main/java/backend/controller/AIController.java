package backend.controller;

import backend.dto.AIRequest;
import backend.dto.AIResponse;
import backend.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5177")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/explain")
    public AIResponse explainReport(
            @RequestBody AIRequest request) {

        String explanation =
                aiService.generateExplanation(
                        request.getReportContext()
                );

        return new AIResponse(explanation);
    }
}