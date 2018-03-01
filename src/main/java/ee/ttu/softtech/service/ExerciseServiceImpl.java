package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseRepository;
import ee.ttu.softtech.model.Exercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Iterator;

@Component
public class ExerciseServiceImpl implements ExerciseService {

    @Autowired
    private ExerciseRepository db;
    
    @Override
    public void addExercise(Exercise exercise) {
        db.save(exercise);
    }

    @Override
    public ArrayList<Exercise> getUserExercises(Integer userId) {
        ArrayList<Exercise> result = new ArrayList<Exercise>();
        for (Iterator<Exercise> i = db.findAll().iterator(); i.hasNext();) {
            Exercise exercise = i.next();
            if(exercise.getUserId() == userId)
                result.add(exercise);
        }
        return result;
    }
}