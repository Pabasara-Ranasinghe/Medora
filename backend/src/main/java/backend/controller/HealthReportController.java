package backend.controller;

import backend.dto.HealthReportRequest;
import backend.dto.HealthReportResponse;
import backend.service.HealthReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5177")
public class HealthReportController {

    private final HealthReportService healthReportService;

    public HealthReportController(HealthReportService healthReportService) {
        this.healthReportService = healthReportService;
    }

    @PostMapping
    public HealthReportResponse createReport(
            @RequestBody HealthReportRequest request) {

        return healthReportService.processReport(request);
    }
}