package backend.controller;

import backend.dto.LipidProfileReportRequest;
import backend.dto.LipidProfileReportResponse;
import backend.service.LipidProfileAnalysisService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports/lipid")
@CrossOrigin(origins = "http://localhost:5177")
public class LipidProfileReportController {

private final LipidProfileAnalysisService lipidProfileAnalysisService;

public LipidProfileReportController(
        LipidProfileAnalysisService lipidProfileAnalysisService
) {
    this.lipidProfileAnalysisService = lipidProfileAnalysisService;
}

@PostMapping
public LipidProfileReportResponse analyzeLipidProfile(
        @RequestBody LipidProfileReportRequest request
) {
    return lipidProfileAnalysisService.analyze(request);
}

}