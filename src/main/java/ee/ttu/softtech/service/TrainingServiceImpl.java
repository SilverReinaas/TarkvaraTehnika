package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.TrainingRepository;
import ee.ttu.softtech.model.Training;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TrainingServiceImpl implements TrainingService {

    @Autowired
    private TrainingRepository db;
    
    @Override
    public void addTraining(Training training) {
        db.save(training);
    }
}