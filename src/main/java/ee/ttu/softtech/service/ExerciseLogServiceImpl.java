package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseLogRepository;
import ee.ttu.softtech.dao.UnitTypeRepository;
import ee.ttu.softtech.model.ExerciseLog;
import ee.ttu.softtech.model.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ExerciseLogServiceImpl implements ExerciseLogService {

    @Autowired
    private ExerciseLogRepository db;

    @Override
    public void addExerciseLog(ExerciseLog exerciseLog) {
        db.save(exerciseLog);
    }
    
}