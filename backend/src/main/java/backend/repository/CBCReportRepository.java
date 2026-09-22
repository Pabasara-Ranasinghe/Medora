package backend.repository;

import backend.model.CBCReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CBCReportRepository extends JpaRepository<CBCReport, String> {

    List<CBCReport> findByUserId(String userId);

}
