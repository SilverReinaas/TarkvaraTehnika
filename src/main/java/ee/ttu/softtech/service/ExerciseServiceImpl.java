package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseRepository;
import ee.ttu.softtech.model.Exercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExerciseServiceImpl implements ExerciseService {

    @Autowired
    private ExerciseRepository db;
    
    @Override
    public void addExercise(Exercise exercise) {
        db.save(exercise);
    }
}