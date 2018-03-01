package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Exercise;
import org.springframework.data.repository.CrudRepository;

public interface ExerciseRepository extends CrudRepository<Exercise, Integer> {

    Exercise save(Exercise training);

}