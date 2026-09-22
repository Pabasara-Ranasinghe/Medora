package backend.repository;

import backend.model.BloodGlucoseReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodGlucoseReportRepository
extends JpaRepository<BloodGlucoseReport, String> {
}