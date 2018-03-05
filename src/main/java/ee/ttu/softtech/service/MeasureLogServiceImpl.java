package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.MeasureLogRepository;
import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseUnitType;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MeasureLogServiceImpl implements MeasureLogService {

    @Autowired
    private MeasureLogRepository db;

    @Override
    public void addMeasureLog(MeasureLog measureLog) {
        db.save(measureLog);
    }

    @Override
    public List<MeasureLog> getMeasureLogsById(Integer exerciseId) {
        List<MeasureLog> result = db.findByExerciseId(exerciseId);
        return result;
    }
}