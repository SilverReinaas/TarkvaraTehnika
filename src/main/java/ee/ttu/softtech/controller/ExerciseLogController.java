package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.ExerciseLog;
import ee.ttu.softtech.service.ExerciseLogService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;


@Controller
public class ExerciseLogController {

    private static final Logger log = Logger.getLogger(ExerciseLogController.class);

    @Autowired
    private ExerciseLogService exerciseLogService;

    @RequestMapping(value = "addExerciseLog", method = RequestMethod.POST)
    public @ResponseBody String addExerciseLog(@RequestBody ExerciseLog exerciseLog) throws IOException {
        exerciseLogService.addExerciseLog(exerciseLog);
        return "OK";
    }
}