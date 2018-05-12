package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.AppUser;
import ee.ttu.softtech.service.UserService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class ProfileController {

    private static final Logger log = Logger.getLogger(ProfileController.class);

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/getProfile", method = RequestMethod.GET)
    public @ResponseBody
    AppUser profile(@RequestParam Integer userId) {
        return userService.get(userId);
    }

    @RequestMapping(value = "/saveProfile", method = RequestMethod.POST)
    public @ResponseBody AppUser saveProfile(@RequestBody AppUser user) {
        userService.save(user);
        return user;
    }

}
