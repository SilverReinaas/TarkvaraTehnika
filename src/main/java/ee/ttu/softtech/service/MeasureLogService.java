package ee.ttu.softtech.service;

import ee.ttu.softtech.model.ExerciseSet;
import ee.ttu.softtech.model.MeasureLog;

public interface MeasureLogService {

    void addMeasureLog(MeasureLog measureLog);

    ExerciseSet addExerciseSet(ExerciseSet exerciseSet);

}