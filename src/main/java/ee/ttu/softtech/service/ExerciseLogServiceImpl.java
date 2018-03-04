package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseLogRepository;
import ee.ttu.softtech.model.ExerciseLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExerciseLogServiceImpl implements ExerciseLogService {

    @Autowired
    private ExerciseLogRepository db;

    @Override
    public void addExerciseLog(ExerciseLog exerciseLog) {
        db.save(exerciseLog);
    }
}