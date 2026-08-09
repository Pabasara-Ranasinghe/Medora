package backend.controller;

import backend.dto.HealthReportRequest;
import backend.service.HealthReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class HealthReportController {

    private final HealthReportService healthReportService;

    public HealthReportController(HealthReportService healthReportService) {
        this.healthReportService = healthReportService;
    }

    @PostMapping
    public String createReport(@RequestBody HealthReportRequest request) {
        return healthReportService.processReport(request);
    }
}