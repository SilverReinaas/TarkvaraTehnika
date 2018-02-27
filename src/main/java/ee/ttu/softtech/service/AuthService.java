package ee.ttu.softtech.service;

import ee.ttu.softtech.model.LoginData;

public interface AuthService {

    boolean authenticate(LoginData loginData);

    
}