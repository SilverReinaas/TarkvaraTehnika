package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseSetRepository;
import ee.ttu.softtech.dao.MeasureLogRepository;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.MeasureLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MeasureLogServiceImpl implements MeasureLogService {

    @Autowired
    private MeasureLogRepository db;
    @Autowired
    private ExerciseSetRepository set_db;

    @Override
    public void addMeasureLog(MeasureLog measureLog) {
        db.save(measureLog);
    }

    @Override
    public ExerciseSet addExerciseSet(ExerciseSet exerciseSet) {
        return set_db.save(exerciseSet);
    }

}