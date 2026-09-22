package backend.controller;

import backend.dto.BloodGlucoseReportRequest;
import backend.dto.BloodGlucoseReportResponse;
import backend.service.BloodGlucoseAnalysisService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports/blood-glucose")
@CrossOrigin(origins = "http://localhost:5177")
public class BloodGlucoseReportController {

private final BloodGlucoseAnalysisService bloodGlucoseAnalysisService;

public BloodGlucoseReportController(
        BloodGlucoseAnalysisService bloodGlucoseAnalysisService
) {
    this.bloodGlucoseAnalysisService = bloodGlucoseAnalysisService;
}

@PostMapping
public BloodGlucoseReportResponse analyzeBloodGlucose(
        @RequestBody BloodGlucoseReportRequest request
) {
    return bloodGlucoseAnalysisService.analyze(request);
}

}