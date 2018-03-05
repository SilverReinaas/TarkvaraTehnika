package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.MeasureLogRepository;
import ee.ttu.softtech.model.MeasureLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MeasureLogServiceImpl implements MeasureLogService {

    @Autowired
    private MeasureLogRepository db;

    @Override
    public void addMeasureLog(MeasureLog measureLog) {
        db.save(measureLog);
    }
    
}