package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitTypeRepository extends JpaRepository<UnitType, Integer> {

    List<UnitType> findAll();
    
    List<UnitType> findAll(Iterable<Integer> ids);

    UnitType findAllById(Integer unitTypeId);
}