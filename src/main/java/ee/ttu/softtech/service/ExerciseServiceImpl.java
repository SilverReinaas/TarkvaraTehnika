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
    private ExerciseRepository exerciseRepository;
    @Autowired
    private ExerciseSetRepository exerciseSetRepository;
    @Autowired
    private UnitTypeRepository unitTypeRepository;
    @Autowired
    private ExerciseUnitTypeRepository exerciseUnitTypeRepository;
    @Autowired
    private MeasureLogService measureLogService;
    @Autowired
    private MuscleRepository muscleRepository;
    @Autowired
    private ExerciseMuscleRepository exerciseMuscleRepository;

    @Override
    public void addExercise(Exercise exercise) {
        exercise = exerciseRepository.save(exercise);
        
        for (Integer unitTypeId : exercise.getUnitTypeIds()) {
            exerciseUnitTypeRepository.save(new ExerciseUnitType(exercise.getId(), unitTypeId));
        }
        for (Integer muscleId : exercise.getMuscleIds()) {
            exerciseMuscleRepository.save(new ExerciseMuscle(exercise.getId(), muscleId));
        }
    }

    @Override
    public List<Exercise> getUserExercises(Integer userId) {
        List<Exercise> result = exerciseRepository.findByUserId(userId);
        
        for (Exercise exercise : result) {
            List<ExerciseUnitType> exerciseUnitTypes = exerciseUnitTypeRepository.findAllByExerciseId(exercise.getId());
            List<ExerciseMuscle> exerciseMuscles = exerciseMuscleRepository.findAllByExerciseId(exercise.getId());
            List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
            List<Integer> muscleIds = exerciseMuscles.stream().mapToInt(x -> x.getMuscleId()).boxed().collect(Collectors.toList());
            List<UnitType> unitTypes = unitTypeRepository.findAll(unitTypeIds);
            List<Muscle> muscles = muscleRepository.findAll(muscleIds);
            exercise.setUnitTypes(unitTypes);
            exercise.setMuscles(muscles);
        }
        return result;
    }

    @Override
    public Exercise getExerciseById(Integer id) {
        Exercise result = exerciseRepository.findById(id);
        List<ExerciseUnitType> exerciseUnitTypes = exerciseUnitTypeRepository.findAllByExerciseId(result.getId());
        List<ExerciseMuscle> exerciseMuscles = exerciseMuscleRepository.findAllByExerciseId(result.getId());
        List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
        List<Integer> muscleIds = exerciseMuscles.stream().mapToInt(x -> x.getMuscleId()).boxed().collect(Collectors.toList());
        List<UnitType> unitTypes = unitTypeRepository.findAll(unitTypeIds);
        List<Muscle> muscles = muscleRepository.findAll(muscleIds);
        result.setUnitTypes(unitTypes);
        result.setMuscles((muscles));
        return result;
    }
    
    @Override
    public List<UnitType> getUnitTypes() {
        return unitTypeRepository.findAll();
    }


    @Override
    public List<Muscle> getMuscles() {
        return muscleRepository.findAll();
    }

    @Override
    public List<ExerciseSet> getExerciseSets(Integer exerciseId) {
        List<ExerciseSet> result = exerciseSetRepository.findByExerciseId(exerciseId);
        for (ExerciseSet set : result){
            List<MeasureLog> measureLogs = measureLogService.findAllByExerciseSetId(set.getId());
            set.setMeasureLogs(measureLogs);
            set.setUnitTypes(measureLogs.stream().map(x -> x.getUnitType()).distinct().collect(Collectors.toList()));
        }
        return result;
    }

    @Override
    public List<ExerciseSet> getExerciseSets() {
        return exerciseSetRepository.findAll();
    }
}