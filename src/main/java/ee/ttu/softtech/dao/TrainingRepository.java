package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.Training;
import org.springframework.data.repository.CrudRepository;

public interface TrainingRepository extends CrudRepository<Training, Integer> {

    Training save(Training training);

}