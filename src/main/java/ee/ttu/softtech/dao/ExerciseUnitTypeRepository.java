package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.ExerciseUnitType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseUnitTypeRepository extends JpaRepository<ExerciseUnitType, Integer> {
    
    ExerciseUnitType save(ExerciseUnitType exerciseUnitType);
    
    List<ExerciseUnitType> findAllByExerciseId(Integer exerciseId);
    
} 