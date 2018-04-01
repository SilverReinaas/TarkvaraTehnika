package ee.ttu.softtech.model;

import java.util.List;

public class MuscleSets {
    private Muscle muscle;
    private List<ExerciseSet> exerciseSets;

    public Muscle getMuscle() {
        return muscle;
    }

    public void setMuscle(Muscle muscle) {
        this.muscle = muscle;
    }

    public List<ExerciseSet> getExerciseSets() {
        return exerciseSets;
    }

    public void setExerciseSets(List<ExerciseSet> exerciseSets) {
        this.exerciseSets = exerciseSets;
    }
}
