package ee.ttu.softtech.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ExerciseStatistics {

    private boolean warnIncreaseDifficulty;
    private boolean warnMakeMoreRegular;
    private List<Date> dates;
    private List<Date> trainings;
    private Map<String, Map<Date, Float>> measureLogs;

}