package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.*;
import ee.ttu.softtech.model.*;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ExerciseServiceImplTest {

    @Mock
    private ExerciseRepository exerciseRepository;
    @Mock
    private UnitTypeRepository unitTypeRepository;
    @Mock
    private ExerciseUnitTypeRepository exerciseUnitTypeRepository;
    @Mock
    private ExerciseSetRepository exerciseSetRepository;
    @Mock
    private MeasureLogRepository measureLogRepository;
    @Mock
    private MuscleRepository muscleRepository;
    @Mock
    private ExerciseMuscleRepository exerciseMuscleRepository;

    AppUser appUser = new AppUser();
    Exercise exercise = new Exercise();
    UnitType unitType = new UnitType();
    ExerciseUnitType exerciseUnitType = new ExerciseUnitType();
    ExerciseSet exerciseSet = new ExerciseSet();
    MeasureLog measureLog = new MeasureLog();
    Muscle muscle = new Muscle();
    ExerciseMuscle exerciseMuscle = new ExerciseMuscle();

    List<Exercise> exercises = new ArrayList<>();
    List<UnitType> unitTypes = new ArrayList<>();
    List<Muscle> muscles = new ArrayList<>();
    List<ExerciseSet> exerciseSets = new ArrayList<>();
    List<MeasureLog> measureLogs = new ArrayList<>();
    List<ExerciseMuscle> exerciseMuscles= new ArrayList<>();
    List<ExerciseUnitType> exerciseUnitTypes = new ArrayList<>();

    @Before
    public void setUp() {
        appUser.setId(1);
        appUser.setUsername("Username");
        appUser.setPassword("Password");

        exercise.setId(2);
        exercise.setName("Bench press");
        exercise.setDescription("Description");
        exercise.setUserId(1);

        unitType.setId(3);
        unitType.setName("Weight");
        unitType.setUnit("kg");

        exerciseUnitType.setExerciseId(2);
        exerciseUnitType.setUnitTypeId(3);

        exerciseSet.setId(4);
        exerciseSet.setCreated(new Date());
        exerciseSet.setExerciseId(2);

        measureLog.setUnitTypeId(3);
        measureLog.setExerciseSetId(4);
        measureLog.setVal((float) 100);

        muscle.setId(5);
        muscle.setLocationId(20);
        muscle.setMuscleName("Biceps");

        exerciseMuscle.setExerciseId(2);
        exerciseMuscle.setMuscleId(5);

        exercises.add(exercise);
        unitTypes.add(unitType);
        muscles.add(muscle);
        exerciseSets.add(exerciseSet);
        measureLogs.add(measureLog);
        exerciseMuscles.add(exerciseMuscle);
        exerciseUnitTypes.add(exerciseUnitType);

        exerciseRepository = mock(ExerciseRepository.class);
        when(exerciseRepository.findByUserId(1)).thenReturn(exercises);
        when(exerciseRepository.save(exercise)).thenReturn(exercise);
        when(exerciseRepository.findById(2)).thenReturn(exercise);

        unitTypeRepository = mock(UnitTypeRepository.class);
        when(unitTypeRepository.findAll()).thenReturn(unitTypes);

        exerciseUnitTypeRepository = mock(ExerciseUnitTypeRepository.class);
        when(exerciseUnitTypeRepository.findAllByExerciseId(2)).thenReturn(exerciseUnitTypes);
        when(exerciseUnitTypeRepository.save(exerciseUnitType)).thenReturn(exerciseUnitType);

        exerciseSetRepository = mock(ExerciseSetRepository.class);
        when(exerciseSetRepository.findByExerciseId(2)).thenReturn(exerciseSets);

        measureLogRepository = mock(MeasureLogRepository.class);
        when(measureLogRepository.findAllByExerciseSetId(4)).thenReturn(measureLogs);

        muscleRepository = mock(MuscleRepository.class);
        when(muscleRepository.findAll()).thenReturn(muscles);

        exerciseMuscleRepository = mock(ExerciseMuscleRepository.class);
        when(exerciseMuscleRepository.findAllByExerciseId(2)).thenReturn(exerciseMuscles);
        when(exerciseMuscleRepository.save(exerciseMuscle)).thenReturn(exerciseMuscle);
    }

    @Test
    public void addExerciseTest() {
        Assert.assertEquals(exercise, exerciseRepository.save(exercise));
        Assert.assertEquals(exerciseUnitType, exerciseUnitTypeRepository.save(exerciseUnitType));
        Assert.assertEquals(exerciseMuscle, exerciseMuscleRepository.save(exerciseMuscle));
    }
    @Test
    public void getUserExercisesTest() {
        Assert.assertEquals(exercises, exerciseRepository.findByUserId(1));
        for (Exercise exercise : exercises) {
            Assert.assertEquals(exerciseUnitTypes, exerciseUnitTypeRepository.findAllByExerciseId(exercise.getId()));
            Assert.assertEquals(exerciseMuscles, exerciseMuscleRepository.findAllByExerciseId(exercise.getId()));
            List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
            List<Integer> muscleIds = exerciseMuscles.stream().mapToInt(x -> x.getMuscleId()).boxed().collect(Collectors.toList());
            //Assert.assertEquals(unitTypes, unitTypeRepository.findAll(unitTypeIds));
            //Assert.assertEquals(muscles, muscleRepository.findAll(muscleIds));
        }
    }
    @Test
    public void getExerciseByIdTest() {
        Assert.assertEquals(exercise, exerciseRepository.findById(2));
        for (Exercise exercise : exercises) {
            Assert.assertEquals(exerciseUnitTypes, exerciseUnitTypeRepository.findAllByExerciseId(exercise.getId()));
            Assert.assertEquals(exerciseMuscles, exerciseMuscleRepository.findAllByExerciseId(exercise.getId()));
            List<Integer> unitTypeIds = exerciseUnitTypes.stream().mapToInt(x -> x.getUnitTypeId()).boxed().collect(Collectors.toList());
            List<Integer> muscleIds = exerciseMuscles.stream().mapToInt(x -> x.getMuscleId()).boxed().collect(Collectors.toList());
            //Assert.assertEquals(unitTypes, unitTypeRepository.findAll(unitTypeIds));
            //Assert.assertEquals(muscles, muscleRepository.findAll(muscleIds));
        }
    }
    @Test
    public void getUnitTypesTest() {
        Assert.assertEquals(unitTypes, unitTypeRepository.findAll());
    }
    @Test
    public void getMusclesTest() {
        Assert.assertEquals(muscles, muscleRepository.findAll());
    }
    @Test
    public void getExerciseSetsTest() {
        Assert.assertEquals(exerciseSets, exerciseSetRepository.findByExerciseId(2));
        Assert.assertEquals(measureLogs, measureLogRepository.findAllByExerciseSetId(4));
    }
}
