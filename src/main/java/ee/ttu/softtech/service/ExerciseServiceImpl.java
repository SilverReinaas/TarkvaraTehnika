package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseRepository;
import ee.ttu.softtech.dao.ExerciseSetRepository;
import ee.ttu.softtech.dao.ExerciseUnitTypeRepository;
import ee.ttu.softtech.dao.UnitTypeRepository;
import ee.ttu.softtech.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExerciseServiceImpl implements ExerciseService {

    @Autowired
    private ExerciseRepository db;
    @Autowired
    private ExerciseSetRepository set_db;
    @Autowired
    private UnitTypeRepository unitTypesDb;
    @Autowired
    private ExerciseUnitTypeRepository exerciseUnitTypesDb;
    @Autowired
    private MeasureLogService measureLogService;

    @Override
    public void addExercise(Exercise exercise) {
        exercise = db.save(exercise);
        
        for (Integer unitTypeId : exercise.getUnitTypeIds()) {
            exerciseUnitTypesDb.save(new ExerciseUnitType(exercise.getId(), unitTypeId));
        }
    }

    @Override
    public List<Exercise> getUserExercises(Integer userId) {
        List<Exercise> result = db.findByUserId(userId);
        
        for (Exercise exercise : result) {
            List<ExerciseUnitType> exerciseUnitTypes = exerciseUnitTypesDb.findAllByExerciseId(exercise.getId());
            List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
            List<UnitType> unitTypes = unitTypesDb.findAll(unitTypeIds);
            exercise.setUnitTypes(unitTypes);
        }
        
        return result;
    }

    @Override
    public Exercise getExerciseById(Integer id) {
        Exercise result = db.findById(id);
        List<ExerciseUnitType> exerciseUnitTypes = exerciseUnitTypesDb.findAllByExerciseId(result.getId());
        List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
        List<UnitType> unitTypes = unitTypesDb.findAll(unitTypeIds);
        result.setUnitTypes(unitTypes);
        return result;
    }
    
    @Override
    public List<UnitType> getUnitTypes() {
        return unitTypesDb.findAll();
    }

    @Override
    public List<ExerciseSet> getExerciseSets(Integer exerciseId) {
        List<ExerciseSet> result = set_db.findByExerciseId(exerciseId);
        for (ExerciseSet set : result){
            List<MeasureLog> measureLogs = measureLogService.findAllByExerciseSetId(set.getId());
            set.setMeasureLogs(measureLogs);
        }
        return result;
    }
}