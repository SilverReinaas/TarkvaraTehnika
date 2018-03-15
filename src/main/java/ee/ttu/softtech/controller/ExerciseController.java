package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.service.ExerciseService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
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