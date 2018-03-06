package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.MeasureLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeasureLogRepository extends JpaRepository<MeasureLog, Integer> {
    
    MeasureLog save(MeasureLog log);

    List<MeasureLog> findAllByExerciseSetId(Integer id);
}