package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MuscleSets {
    private Muscle muscle;
    private List<ExerciseSet> exerciseSets;
}
