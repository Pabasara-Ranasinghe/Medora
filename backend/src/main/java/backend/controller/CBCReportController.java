package backend.controller;

import backend.dto.CBCReportRequest;
import backend.dto.CBCReportResponse;
import backend.model.CBCReport;
import backend.service.CBCAnalysisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/cbc")
@CrossOrigin(origins = "http://localhost:5177")
public class CBCReportController {

private final CBCAnalysisService cbcAnalysisService;

public CBCReportController(
        CBCAnalysisService cbcAnalysisService
) {
    this.cbcAnalysisService = cbcAnalysisService;
}

@PostMapping
public CBCReportResponse analyzeCBC(
        @RequestBody CBCReportRequest request
) {
    return cbcAnalysisService.analyze(request);
}

@GetMapping("/user/{userId}")
public List<CBCReport> getUserCBCReports(
        @PathVariable String userId
) {
    return cbcAnalysisService.getReportsByUserId(userId);
}

}
