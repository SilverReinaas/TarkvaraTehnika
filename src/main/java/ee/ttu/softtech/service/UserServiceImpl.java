package ee.ttu.softtech.service;

import ee.ttu.softtech.dao.UserRepository;
import ee.ttu.softtech.model.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository dao;

    @Override
    public void save(AppUser user) {
        dao.save(user);
    }

    @Override
    public AppUser get(Integer userId) {
        return dao.findOne(userId);
    }
}
