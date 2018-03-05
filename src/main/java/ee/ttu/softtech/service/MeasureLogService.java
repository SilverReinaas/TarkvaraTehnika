package ee.ttu.softtech.service;

import ee.ttu.softtech.model.Exercise;
import ee.ttu.softtech.model.MeasureLog;

public interface MeasureLogService {

    void addMeasureLog(MeasureLog measureLog);

    Iterable<MeasureLog> getMeasureLogsById(Integer exerciseId);

}