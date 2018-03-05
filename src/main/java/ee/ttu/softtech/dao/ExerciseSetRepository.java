package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.ExerciseSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseSetRepository extends JpaRepository<ExerciseSet, Integer> {
    ExerciseSet save(ExerciseSet exerciseSet);
}
