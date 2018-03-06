package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseSetRepository;
import ee.ttu.softtech.dao.MeasureLogRepository;
import ee.ttu.softtech.dao.UnitTypeRepository;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MeasureLogServiceImpl implements MeasureLogService {

    @Autowired
    private MeasureLogRepository db;
    @Autowired
    private ExerciseSetRepository set_db;
    @Autowired
    private UnitTypeRepository unitType_db;

    @Override
    public void addMeasureLog(MeasureLog measureLog) {
        db.save(measureLog);
    }

    @Override
    public ExerciseSet addExerciseSet(ExerciseSet exerciseSet) {
        return set_db.save(exerciseSet);
    }

    @Override
    public List<MeasureLog> findAllByExerciseSetId(Integer id) {
        List<MeasureLog> result = db.findAllByExerciseSetId(id);
        for(MeasureLog log : result){
            UnitType unitType = unitType_db.findAllById(log.getUnitTypeId());
            log.setUnitType(unitType);
        }
        return result;
    }

}