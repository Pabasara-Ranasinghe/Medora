package backend.service;

import backend.dto.HealthReportRequest;
import org.springframework.stereotype.Service;

@Service
public class HealthReportService {

    public String processReport(HealthReportRequest request) {

        return "Health report received for user: "
                + request.getUserId()
                + " | Type: "
                + request.getReportType();
    }
}