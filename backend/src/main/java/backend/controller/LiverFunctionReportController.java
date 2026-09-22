package backend.controller;

import backend.dto.LiverFunctionReportRequest;
import backend.dto.LiverFunctionReportResponse;
import backend.service.LiverFunctionAnalysisService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports/liver-function")
@CrossOrigin(origins = "http://localhost:5177")
public class LiverFunctionReportController {

    private final LiverFunctionAnalysisService
            liverFunctionAnalysisService;

    public LiverFunctionReportController(
            LiverFunctionAnalysisService
                    liverFunctionAnalysisService
    ) {
        this.liverFunctionAnalysisService =
                liverFunctionAnalysisService;
    }

    @PostMapping
    public LiverFunctionReportResponse analyzeLiverFunction(
            @RequestBody LiverFunctionReportRequest request
    ) {

        return liverFunctionAnalysisService.analyze(request);
    }
}