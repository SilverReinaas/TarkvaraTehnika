package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.*;
import ee.ttu.softtech.service.ExerciseService;
import ee.ttu.softtech.service.ExerciseStatisticsService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class ExerciseSetController {

    private static final Logger log = Logger.getLogger(ExerciseController.class);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private ExerciseController exerciseController;
    @Autowired
    private ExerciseService exerciseService;
    @Autowired
    private ExerciseStatisticsService exerciseStatisticsService;

    @RequestMapping(value = "getExerciseSets", method = RequestMethod.GET)
    public @ResponseBody
    List<ExerciseSet> getExerciseSets(@RequestParam Integer exerciseId) throws IOException {
        return exerciseService.getExerciseSets(exerciseId);
    }

    @RequestMapping(value = "getDaySetsList", method = RequestMethod.GET)
    public @ResponseBody
    List<SetsByDate> getDaySetsList(@RequestParam Integer id) throws IOException, ParseException {
        List<SetsByDate> result = new ArrayList<>();
        List<ExerciseSet> sets =  exerciseService.getExerciseSets(id);
        Collections.sort(sets, Comparator.comparing(ExerciseSet::getCreated));
        SetsByDate firstSetsByDate = new SetsByDate();
        firstSetsByDate.setDate(SetsByDate.getDateFromSet(sets.get(0)));
        firstSetsByDate.setSets(new ArrayList<ExerciseSet>());
        result.add(firstSetsByDate);
        for (ExerciseSet set : sets) {
            Boolean found = false;
            for(SetsByDate setsByDate : result){
                if(setsByDate.getDate().isEqual(SetsByDate.getDateFromSet(set))){
                    setsByDate.addSet(set);
                    found = true;
                    break;
                }
            }
            if(!found){
                SetsByDate setsByDate = new SetsByDate();
                setsByDate.setDate(SetsByDate.getDateFromSet(set));
                setsByDate.setSets(new ArrayList<ExerciseSet>());
                setsByDate.addSet(set);
                result.add(setsByDate);
            }
        }
        return result;
    }

    @RequestMapping(value = "getDaySetsListByPeriod", method = RequestMethod.GET)
    public @ResponseBody
    List<SetsByDate> getDaySetsListByPeriod(@RequestParam Integer id, String start, String end) throws IOException, ParseException {
        LocalDate startDate = LocalDate.parse(start, formatter).minusDays(1);
        LocalDate endDate = LocalDate.parse(end, formatter).plusDays(1);
        try {
            return getDaySetsList(id).stream().filter(x -> x.getDate().isAfter(startDate) && x.getDate().isBefore(endDate)).collect(Collectors.toList());
        }
        catch (Exception ex) {
            return  new ArrayList<>();
        }
    }

    @RequestMapping(value = "getAllSetsList", method = RequestMethod.GET)
    public @ResponseBody
    List<SetsByDate> getAllSetsList(@RequestParam Integer id) throws IOException, ParseException {
        List<SetsByDate> result = new ArrayList<>();
        Iterable<Exercise> exercises = exerciseService.getUserExercises(id);
        List<Integer> exerciseIds = new ArrayList<>();
        for (Exercise exercise : exercises) {
            exerciseIds.add(exercise.getId());
        }
        List<ExerciseSet> sets =  new ArrayList<>();
        for (Integer exerciseId : exerciseIds) {
            sets.addAll(exerciseService.getExerciseSets(exerciseId));
        }
        log.info(sets);
        Collections.sort(sets, Comparator.comparing(ExerciseSet::getCreated));
        SetsByDate firstSetsByDate = new SetsByDate();
        firstSetsByDate.setDate(SetsByDate.getDateFromSet(sets.get(0)));
        firstSetsByDate.setSets(new ArrayList<ExerciseSet>());
        result.add(firstSetsByDate);
        for (ExerciseSet set : sets) {
            Boolean found = false;
            for(SetsByDate setsByDate : result){
                if(setsByDate.getDate().isEqual(SetsByDate.getDateFromSet(set))){
                    setsByDate.addSet(set);
                    found = true;
                    break;
                }
            }
            if(!found){
                SetsByDate setsByDate = new SetsByDate();
                setsByDate.setDate(SetsByDate.getDateFromSet(set));
                setsByDate.setSets(new ArrayList<ExerciseSet>());
                setsByDate.addSet(set);
                result.add(setsByDate);
            }
        }
        return result;
    }

    @RequestMapping(value = "getAllSetsListByPeriod", method = RequestMethod.GET)
    public @ResponseBody
    List<SetsByDate> getAllSetsListByPeriod(@RequestParam Integer id, String start, String end) throws IOException, ParseException {
        LocalDate startDate = LocalDate.parse(start).minusDays(1);
        LocalDate endDate = LocalDate.parse(end).plusDays(1);
        try {
            return getAllSetsList(id).stream().filter(x -> x.getDate().isAfter(startDate) && x.getDate().isBefore(endDate)).collect(Collectors.toList());
        }
        catch (Exception ex) {
            return  new ArrayList<>();
        }
    }

    @RequestMapping(value = "getExerciseSetsToday", method = RequestMethod.GET)
    public @ResponseBody
    List<ExerciseSet> getExerciseSetsToday(@RequestParam Integer id) throws IOException {
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        final Date morning = c.getTime();
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        final Date now = c.getTime();
        log.info(now.toString()+"-"+morning.toString());
        return exerciseService.getExerciseSets(id).stream()
                .filter(p -> p.getCreated().after(morning) && p.getCreated().before(now)).collect(Collectors.toList());
    }

    @RequestMapping(value = "getMuscleSetsList", method = RequestMethod.GET)
    public @ResponseBody
    List<MuscleSets> getMuscleSetsList(@RequestParam Integer userId, String start, String end) throws IOException {
        LocalDate startDate = LocalDate.parse(start).minusDays(1);
        LocalDate endDate = LocalDate.parse(end).plusDays(1);
        List<MuscleSets> result = new ArrayList<>();
        List<Muscle> muscles = exerciseController.getMuscles();
        List<Exercise> exercises = exerciseController.getUserExercises(userId);
        for (Muscle muscle:muscles) {
            MuscleSets muscleSets = new MuscleSets();
            muscleSets.setMuscle(muscle);
            muscleSets.setExerciseSets(new ArrayList<>());
            List<Exercise> muscleExercises = exercises.stream().filter(
                    exercise -> exercise.getMuscles().stream().anyMatch(
                            x -> x.getId().equals(muscle.getId()))).collect(Collectors.toList());
            List<ExerciseSet> muscleExerciseSets = new ArrayList<>();
            for (Exercise muscleExercise:muscleExercises) {
                muscleExerciseSets.addAll(getExerciseSets(muscleExercise.getId()).stream().filter(
                        x -> LocalDate.parse(x.getCreated().toString().substring(0, 10)).isAfter(startDate) &&
                                LocalDate.parse(x.getCreated().toString().substring(0, 10)).isBefore(endDate)).collect(Collectors.toList()));
            }
            muscleSets.setExerciseSets(muscleExerciseSets);
            result.add(muscleSets);
        }
        return  result;
    }
}
