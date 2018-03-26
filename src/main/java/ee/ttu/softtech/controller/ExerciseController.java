package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.SetsByDate;
import ee.ttu.softtech.service.ExerciseService;
import org.apache.log4j.Logger;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Controller
public class ExerciseController {

    private static final Logger log = Logger.getLogger(ExerciseController.class);

    @Autowired
    private ExerciseService exerciseService;
    
    @RequestMapping(value = "addExercise", method = RequestMethod.POST)
    public @ResponseBody String addExercise(@RequestBody Exercise exercise) throws IOException {
        exerciseService.addExercise(exercise);
        return "OK";
    }

    @RequestMapping(value = "getUserExercises", method = RequestMethod.GET)
    public @ResponseBody Iterable getUserExercises(@RequestParam Integer userId) throws IOException {
        return exerciseService.getUserExercises(userId);
    }

    @RequestMapping(value = "getExerciseById", method = RequestMethod.GET)
    public @ResponseBody Exercise getExerciseById(@RequestParam Integer id) throws IOException {
        return exerciseService.getExerciseById(id);
    }

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
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end).plusDays(1);
        return getDaySetsList(id).stream().filter(x -> x.getDate().isAfter(startDate) && x.getDate().isBefore(endDate)).collect(Collectors.toList());
    }

    @RequestMapping(value = "getExerciseSetsToday", method = RequestMethod.GET)
    public @ResponseBody
    List<ExerciseSet> getExerciseSetsToday(@RequestParam Integer id) throws IOException {
        final Date now = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(now);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        final Date morning = c.getTime();
        log.info(now.toString()+"-"+morning.toString());
        return exerciseService.getExerciseSets(id).stream()
                .filter(p -> p.getCreated().after(morning) && p.getCreated().before(now)).collect(Collectors.toList());
    }

    @RequestMapping(value = "getUnitTypes", method=RequestMethod.GET)
    public @ResponseBody Iterable getUnitTypes() throws IOException {
        return exerciseService.getUnitTypes();
    }
    @RequestMapping(value = "getMuscles", method=RequestMethod.GET)
    public @ResponseBody Iterable getMuscles() throws IOException {
        return exerciseService.getMuscles();
    }
}