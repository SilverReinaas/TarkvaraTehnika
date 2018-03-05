package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.ExerciseRepository;
import ee.ttu.softtech.dao.ExerciseUnitTypeRepository;
import ee.ttu.softtech.dao.UnitTypeRepository;
import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseUnitType;
import ee.ttu.softtech.model.UnitType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.ObjIntConsumer;
import java.util.stream.Collectors;

@Component
public class ExerciseServiceImpl implements ExerciseService {

    @Autowired
    private ExerciseRepository db;
    @Autowired
    private UnitTypeRepository unitTypesDb;
    @Autowired
    private ExerciseUnitTypeRepository exerciseUnitTypesDb;
    
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
}