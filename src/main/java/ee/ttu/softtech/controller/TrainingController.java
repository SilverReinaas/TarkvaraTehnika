package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.Training;
import ee.ttu.softtech.service.TrainingService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

@Controller
public class TrainingController {

    private static final Logger log = Logger.getLogger(TrainingController.class);

    @Autowired
    private TrainingService trainingService;
    
    @RequestMapping(value = "addTraining", method = RequestMethod.POST)
    public @ResponseBody String addTraining(@RequestBody Training training) throws IOException {
        trainingService.addTraining(training);
        return "OK";
    }
    
}