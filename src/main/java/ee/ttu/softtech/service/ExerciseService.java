package ee.ttu.softtech.service;

import ee.ttu.softtech.model.Exercise;

import java.util.ArrayList;

public interface ExerciseService {
    
    void addExercise(Exercise exercise);

    ArrayList<Exercise> getUserExercises(Integer userId);
}