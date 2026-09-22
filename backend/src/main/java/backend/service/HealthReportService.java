package backend.service;

import backend.dto.HealthReportRequest;
import backend.dto.HealthReportResponse;
import backend.model.HealthReport;
import backend.repository.HealthReportRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class HealthReportService {

    private final HealthReportRepository healthReportRepository;

    public HealthReportService(HealthReportRepository healthReportRepository) {
        this.healthReportRepository = healthReportRepository;
    }

    public HealthReportResponse processReport(HealthReportRequest request) {

        HealthReport report = new HealthReport();

        report.setReportId(UUID.randomUUID().toString());
        report.setUserId(request.getUserId());
        report.setReportType(request.getReportType());

        healthReportRepository.save(report);

        return new HealthReportResponse(
                "Health report saved successfully",
                report.getReportId()
        );
    }
}