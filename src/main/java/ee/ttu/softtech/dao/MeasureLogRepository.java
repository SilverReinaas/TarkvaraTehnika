package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.MeasureLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasureLogRepository extends JpaRepository<MeasureLog, Integer> {
    
    MeasureLog save(MeasureLog log);
    
}