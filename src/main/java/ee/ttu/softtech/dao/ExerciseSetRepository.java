package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.ExerciseSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseSetRepository extends JpaRepository<ExerciseSet, Integer> {
    ExerciseSet save(ExerciseSet exerciseSet);

    List<ExerciseSet> findByExerciseId(Integer exerciseId);
}
