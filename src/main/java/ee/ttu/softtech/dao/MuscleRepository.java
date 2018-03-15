package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.Muscle;
import ee.ttu.softtech.model.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;
import java.util.List;

public interface MuscleRepository extends JpaRepository<Muscle, Integer> {

    List<Muscle> findAll();

    List<Muscle> findAll(Iterable<Integer> ids);

    Muscle findAllById(Integer exerciseId);
}