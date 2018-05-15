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
public class ExerciseController {

    private static final Logger log = Logger.getLogger(ExerciseController.class);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private ExerciseService exerciseService;
    @Autowired
    private ExerciseStatisticsService exerciseStatisticsService;
    
    @RequestMapping(value = "addExercise", method = RequestMethod.POST)
    public @ResponseBody String addExercise(@RequestBody Exercise exercise) throws IOException {
        exerciseService.addExercise(exercise);
        return "OK";
    }

    @RequestMapping(value = "getUserExercises", method = RequestMethod.GET)
    public @ResponseBody List<Exercise> getUserExercises(@RequestParam Integer userId) throws IOException {
        return exerciseService.getUserExercises(userId);
    }

    @RequestMapping(value = "getExerciseById", method = RequestMethod.GET)
    public @ResponseBody Exercise getExerciseById(@RequestParam Integer id) throws IOException {
        return exerciseService.getExerciseById(id);
    }



    @RequestMapping(value = "getUnitTypes", method=RequestMethod.GET)
    public @ResponseBody List<UnitType> getUnitTypes() throws IOException {
        return exerciseService.getUnitTypes();
    }
    @RequestMapping(value = "getMuscles", method=RequestMethod.GET)
    public @ResponseBody List<Muscle> getMuscles() throws IOException {
        return exerciseService.getMuscles();
    }


    @RequestMapping(value = "getExerciseStatistics", method=RequestMethod.GET)
    public @ResponseBody ExerciseStatistics getExerciseStatistics(@RequestParam Integer userId, @RequestParam Integer exerciseId) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -1);
        return exerciseStatisticsService.getExerciseStatistics(userId, exerciseId, cal.getTime());
    }
}