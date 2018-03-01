package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Exercise;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;

public interface ExerciseRepository extends CrudRepository<Exercise, Integer> {

    Exercise save(Exercise exercise);

    Iterable<Exercise> findAll();

}