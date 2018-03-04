package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseLog;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;

public interface ExerciseLogRepository extends CrudRepository<ExerciseLog, Integer> {

    ExerciseLog save(ExerciseLog exerciseLog);
}