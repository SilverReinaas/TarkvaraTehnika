package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.ExerciseMuscle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseMuscleRepository extends JpaRepository<ExerciseMuscle, Integer> {

    ExerciseMuscle save(ExerciseMuscle exerciseMuscle);

    List<ExerciseMuscle> findAllByExerciseId(Integer exerciseId);

}