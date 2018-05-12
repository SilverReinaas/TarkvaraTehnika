package ee.ttu.softtech.service;

import ee.ttu.softtech.model.AppUser;

public interface UserService {

    void save(AppUser user);

    AppUser get(Integer userId);

}
