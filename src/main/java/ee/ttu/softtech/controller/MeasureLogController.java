package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.MeasureLog;
import ee.ttu.softtech.model.MeasureLogData;
import ee.ttu.softtech.service.MeasureLogService;
import org.apache.log4j.Logger;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;


@Controller
public class MeasureLogController {

    private static final Logger log = Logger.getLogger(MeasureLogController.class);

    @Autowired
    private MeasureLogService measureLogService;

    @RequestMapping(value = "addMeasureLog", method = RequestMethod.POST)
    public @ResponseBody String addMeasureLog(@RequestBody MeasureLogData measureLogData) throws IOException{
        ExerciseSet exerciseSet = new ExerciseSet();
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Date logDateTime = null;
        try {
            logDateTime = df.parse(measureLogData.getLogDate().toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar cal = Calendar.getInstance();
        Calendar today = Calendar.getInstance();
        today.setTime(new Date());
        cal.setTime(logDateTime);
        cal.set(Calendar.HOUR_OF_DAY,today.get(today.HOUR_OF_DAY));
        cal.set(Calendar.MINUTE,today.MINUTE);
        cal.set(Calendar.SECOND,today.SECOND);
        logDateTime = cal.getTime();
        exerciseSet.setCreated(logDateTime);
        exerciseSet.setExerciseId(measureLogData.getExerciseId());
        exerciseSet = measureLogService.addExerciseSet(exerciseSet);
        for (int i=0; i<measureLogData.getUnitTypes().size(); i++){
            MeasureLog measureLog = new MeasureLog();
            measureLog.setExerciseSetId(exerciseSet.getId());
            measureLog.setUnitTypeId(measureLogData.getUnitTypes().get(i).getId());
            measureLog.setVal(measureLogData.getValues().get(i));
            measureLogService.addMeasureLog(measureLog);
        }
        return "OK";
    }

    @RequestMapping(value = "findAllBySetId", method = RequestMethod.GET)
    public @ResponseBody Iterable findAllByExerciseSetId(@RequestParam Integer id) throws IOException {
        return measureLogService.findAllByExerciseSetId(id);
    }
}