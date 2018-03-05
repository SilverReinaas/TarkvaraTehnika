package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {

    Exercise save(Exercise exercise);

    List<Exercise> findAll();
    
    List<Exercise> findByUserId(Integer userId);

    Exercise findById(Integer id);

}