package backend.repository;

import backend.model.LiverFunctionReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiverFunctionReportRepository
        extends JpaRepository<LiverFunctionReport, String> {

    List<LiverFunctionReport> findByUserId(String userId);
}