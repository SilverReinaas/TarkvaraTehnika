package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.Database;
import ee.ttu.softtech.model.AppUser;
import ee.ttu.softtech.model.LoginData;
import ee.ttu.softtech.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private Database db;

    @Override
    public boolean authenticate(LoginData loginData) {
        AppUser user = db.findByUsername(loginData.getUsername());
        
        if (user == null) {
            return false;
        }
        
        String passwordHash = user.getPassword();
        String inputPasswordHash = Util.hash(loginData.getPassword());
        return passwordHash.equals(inputPasswordHash);
    }
}