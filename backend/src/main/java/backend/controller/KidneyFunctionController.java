package backend.controller;

import backend.dto.KidneyFunctionRequest;
import backend.dto.KidneyFunctionResponse;
import backend.service.KidneyFunctionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class KidneyFunctionController {

    private final KidneyFunctionService kidneyFunctionService;

    public KidneyFunctionController(
            KidneyFunctionService kidneyFunctionService) {

        this.kidneyFunctionService = kidneyFunctionService;
    }

    @PostMapping("/kidney-function")
    public ResponseEntity<KidneyFunctionResponse> analyzeKidneyFunction(
            @RequestBody KidneyFunctionRequest request) {

        KidneyFunctionResponse response =
                kidneyFunctionService.analyze(request);

        return ResponseEntity.ok(response);
    }
}