package backend.controller;

import backend.dto.ThyroidFunctionRequest;
import backend.dto.ThyroidFunctionResponse;
import backend.service.ThyroidFunctionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/thyroid-function")
@CrossOrigin(origins = "http://localhost:5177")
public class ThyroidFunctionController {

    private final ThyroidFunctionService thyroidFunctionService;

    public ThyroidFunctionController(
            ThyroidFunctionService thyroidFunctionService) {

        this.thyroidFunctionService =
                thyroidFunctionService;
    }

    @PostMapping
    public ThyroidFunctionResponse analyzeThyroidFunction(
            @RequestBody ThyroidFunctionRequest request) {

        return thyroidFunctionService.analyze(request);
    }
}