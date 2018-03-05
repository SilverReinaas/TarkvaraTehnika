package ee.ttu.softtech.service;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.UnitType;

import java.util.ArrayList;

public interface ExerciseService {
    
    void addExercise(Exercise exercise);

    Iterable<Exercise> getUserExercises(Integer userId);

    Exercise getExerciseById(Integer id);

    Iterable<UnitType> getUnitTypes();
}