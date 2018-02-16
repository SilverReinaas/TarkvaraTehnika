package ee.ttu.softtech.dao;

import ee.ttu.softtech.model.AppUser;
import org.springframework.data.repository.CrudRepository;

public interface Database extends CrudRepository<AppUser, Integer> {
    
    AppUser findByUsername(String username);
    
}