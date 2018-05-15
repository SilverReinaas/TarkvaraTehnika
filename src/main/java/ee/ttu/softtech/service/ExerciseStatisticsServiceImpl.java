package ee.ttu.softtech.service;

import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.ExerciseStatistics;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.UnitType;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ExerciseStatisticsServiceImpl implements ExerciseStatisticsService {

    private DateFormat df = new SimpleDateFormat("dd/MM");

    @Autowired
    private ExerciseService es;

    @Override
    public ExerciseStatistics getExerciseStatistics(Integer userId, Integer exerciseId, Date from) {
        ExerciseStatistics s = new ExerciseStatistics();
        List<ExerciseSet> exerciseSets = es.getExerciseSets(exerciseId)
                .stream().filter(x -> x.getCreated().after(from)).collect(Collectors.toList());

        s.setDates(new ArrayList<>());

        Date start = DateUtils.truncate(from, Calendar.DATE);
        Calendar startC = Calendar.getInstance();
        startC.setTime(start);

        Date end = new Date();

        while (startC.getTime().before(end)) {
            s.getDates().add(startC.getTime());
            startC.add(Calendar.DATE, 1);
        }

        s.setTrainings(new ArrayList<>());

        for (ExerciseSet set : exerciseSets) {
            Date setDate = DateUtils.truncate(set.getCreated(), Calendar.DATE);
            s.getTrainings().add(setDate);
        }

        Map<String, Map<String, Float>> measureLogs = new HashMap<>();

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
                String date = df.format(ml.getCreated());
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
            Map<String, Float> measureValues = measureLogs.get(measureName);
            Map<String, Double> avgPerDay = new TreeMap<>(measureValues.entrySet().stream()
                    .collect(Collectors.groupingBy(x -> x.getKey(), Collectors.averagingDouble(x -> x.getValue()))));
            List<Double> avgPerDayValues = new ArrayList<>(avgPerDay.values());

            if (avgPerDayValues.size() >= 3) {
                List<Double> lastCounts = avgPerDayValues.subList(counts.size() - 4, counts.size()-1);

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
