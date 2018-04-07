package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.*;
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
    @Autowired
    private MuscleRepository muscleDb;
    @Autowired
    private ExerciseMuscleRepository exerciseMuscleDb;

    @Override
    public void addExercise(Exercise exercise) {
        exercise = db.save(exercise);
        
        for (Integer unitTypeId : exercise.getUnitTypeIds()) {
            exerciseUnitTypesDb.save(new ExerciseUnitType(exercise.getId(), unitTypeId));
        }
        for (Integer muscleId : exercise.getMuscleIds()) {
            exerciseMuscleDb.save(new ExerciseMuscle(exercise.getId(), muscleId));
        }
    }

    @Override
    public List<Exercise> getUserExercises(Integer userId) {
        List<Exercise> result = db.findByUserId(userId);
        
        for (Exercise exercise : result) {
            List<ExerciseUnitType> exerciseUnitTypes = exerciseUnitTypesDb.findAllByExerciseId(exercise.getId());
            List<ExerciseMuscle> exerciseMuscles = exerciseMuscleDb.findAllByExerciseId(exercise.getId());
            List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
            List<Integer> muscleIds = exerciseMuscles.stream().mapToInt(x -> x.getMuscleId()).boxed().collect(Collectors.toList());
            List<UnitType> unitTypes = unitTypesDb.findAll(unitTypeIds);
            List<Muscle> muscles = muscleDb.findAll(muscleIds);
            exercise.setUnitTypes(unitTypes);
            exercise.setMuscles(muscles);
        }
        return result;
    }

    @Override
    public Exercise getExerciseById(Integer id) {
        Exercise result = db.findById(id);
        List<ExerciseUnitType> exerciseUnitTypes = exerciseUnitTypesDb.findAllByExerciseId(result.getId());
        List<ExerciseMuscle> exerciseMuscles = exerciseMuscleDb.findAllByExerciseId(result.getId());
        List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
        List<Integer> muscleIds = exerciseMuscles.stream().mapToInt(x -> x.getMuscleId()).boxed().collect(Collectors.toList());
        List<UnitType> unitTypes = unitTypesDb.findAll(unitTypeIds);
        List<Muscle> muscles = muscleDb.findAll(muscleIds);
        result.setUnitTypes(unitTypes);
        result.setMuscles((muscles));
        return result;
    }
    
    @Override
    public List<UnitType> getUnitTypes() {
        return unitTypesDb.findAll();
    }


    @Override
    public List<Muscle> getMuscles() {
        return muscleDb.findAll();
    }

    @Override
    public List<ExerciseSet> getExerciseSets(Integer exerciseId) {
        List<ExerciseSet> result = set_db.findByExerciseId(exerciseId);
        for (ExerciseSet set : result){
            List<MeasureLog> measureLogs = measureLogService.findAllByExerciseSetId(set.getId());
            set.setMeasureLogs(measureLogs);
            set.setUnitTypes(measureLogs.stream().map(x -> x.getUnitType()).distinct().collect(Collectors.toList()));
        }
        return result;
    }
}