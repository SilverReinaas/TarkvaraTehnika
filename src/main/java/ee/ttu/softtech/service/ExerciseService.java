package ee.ttu.softtech.service;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.Muscle;
import ee.ttu.softtech.model.UnitType;

import java.util.ArrayList;
import java.util.List;

public interface ExerciseService {
    
    void addExercise(Exercise exercise);

    List<Exercise> getUserExercises(Integer userId);

    Exercise getExerciseById(Integer id);

    List<UnitType> getUnitTypes();

    List<Muscle> getMuscles();

    List<ExerciseSet> getExerciseSets(Integer exerciseId);

}