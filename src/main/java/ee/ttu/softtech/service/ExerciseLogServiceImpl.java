package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseLogRepository;
import ee.ttu.softtech.dao.MeasureLogRepository;
import ee.ttu.softtech.dao.UnitTypeRepository;
import ee.ttu.softtech.model.ExerciseLog;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ExerciseLogServiceImpl implements ExerciseLogService {

    @Autowired
    private ExerciseLogRepository db;
    @Autowired
    private MeasureLogRepository measureDb;

    @Override
    public void addExerciseLog(ExerciseLog exerciseLog) {
        exerciseLog = db.save(exerciseLog);
        
        for (Map.Entry<Integer, Float> values : exerciseLog.getMeasurements().entrySet()) {
            MeasureLog log = new MeasureLog();
            log.setExerciseId(exerciseLog.getExerciseId());
            log.setUnitTypeId(values.getKey());
            log.setVal(values.getValue());
            measureDb.save(log);
        }
    }
    
}