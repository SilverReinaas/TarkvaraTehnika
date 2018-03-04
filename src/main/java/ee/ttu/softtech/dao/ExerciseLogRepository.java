package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Integer> {

    ExerciseLog save(ExerciseLog exerciseLog);
}