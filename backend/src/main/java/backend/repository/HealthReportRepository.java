package backend.repository;

import backend.model.HealthReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthReportRepository extends JpaRepository<HealthReport, String> {
}