package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.service.MeasureLogService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@Controller
public class MeasureLogController {

    private static final Logger log = Logger.getLogger(MeasureLogController.class);

    @Autowired
    private MeasureLogService measureLogService;

    @RequestMapping(value = "addMeasureLog", method = RequestMethod.POST)
    public @ResponseBody String addMeasureLog(@RequestBody MeasureLog measureLog) throws IOException {
        measureLogService.addMeasureLog(measureLog);
        return "OK";
    }

    @RequestMapping(value = "getMeasureLogsById", method = RequestMethod.GET)
    public @ResponseBody Iterable getMeasureLogsById(@RequestParam Integer exerciseId) throws IOException {
        return measureLogService.getMeasureLogsById(exerciseId);
    }
}