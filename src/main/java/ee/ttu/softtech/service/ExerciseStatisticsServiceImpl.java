package ee.ttu.softtech.service;

import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.ExerciseStatistics;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.UnitType;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class ExerciseStatisticsServiceImpl implements ExerciseStatisticsService {

    @Autowired
    private ExerciseService es;

    @Override
    public ExerciseStatistics getExerciseStatistics(Integer userId, Integer exerciseId, Date from) {
        ExerciseStatistics s = new ExerciseStatistics();
        List<ExerciseSet> exerciseSets = es.getExerciseSets(exerciseId)
                .stream().filter(x -> x.getCreated().after(from)).collect(Collectors.toList());

        s.setTrainings(new ArrayList<Date>(
                new TreeSet(exerciseSets.stream().map(x -> x.getCreated()).collect(Collectors.toSet()))
        ));

        Map<String, Map<Date, Float>> measureLogs = new HashMap<>();

        for (ExerciseSet set : exerciseSets) {
            if (set.getCreated().before(from)) {
                continue;
            }

            for (UnitType ut : set.getUnitTypes()) {
                if (!measureLogs.containsKey(ut.getName())) {
                    measureLogs.put(ut.getName(), new TreeMap<>());
                }
            }

            for (MeasureLog ml : set.getMeasureLogs()) {
                String name = ml.getUnitType().getName();
                Date date = ml.getCreated();
                Float value = ml.getVal();

                measureLogs.get(name).put(date, value);
            }
        }

        s.setMeasureLogs(measureLogs);

        SortedMap<Date, Long> setCounts = new TreeMap<>(exerciseSets.stream().map(x -> x.getCreated())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting())));
        List<Long> counts = new ArrayList<>(setCounts.values());

        if (counts.size() >= 3) {
            List<Long> lastCounts = counts.subList(counts.size() - 3, counts.size());

            if (lastCounts.stream().distinct().count() != 1) {
                s.setWarnMakeMoreRegular(true);
            }
        }

        List<Integer> increaseDifficulty = new ArrayList<>();

        for (String measureName : measureLogs.keySet()) {
            Map<Date, Float> measureValues = measureLogs.get(measureName);

            SortedMap<Date, Float> truncatedDateMeasureValues = new TreeMap<>();
            measureValues.entrySet().forEach(e -> truncatedDateMeasureValues.put(DateUtils.truncate(e.getKey(), Calendar.DATE), e.getValue()));

            Map<Date, Double> avgPerDay = new TreeMap<>(truncatedDateMeasureValues.entrySet().stream()
                    .collect(Collectors.groupingBy(x -> x.getKey(), Collectors.averagingDouble(x -> x.getValue()))));
            List<Double> avgPerDayValues = new ArrayList<>(avgPerDay.values());

            if (avgPerDayValues.size() >= 3) {
                List<Double> lastCounts = avgPerDayValues.subList(counts.size() - 3, counts.size());

                if (lastCounts.stream().distinct().count() == 1) {
                    increaseDifficulty.add(1);
                } else {
                    increaseDifficulty.add(0);
                }
            }
        }

        s.setWarnIncreaseDifficulty(increaseDifficulty.stream().mapToInt(Integer::intValue).sum() == increaseDifficulty.size());
        return s;
    }
}
