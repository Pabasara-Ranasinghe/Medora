package backend.repository;

import backend.model.LipidProfileReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LipidProfileReportRepository
        extends JpaRepository<LipidProfileReport, String> {

    List<LipidProfileReport> findByUserId(String userId);
}
