package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.LoginData;
import ee.ttu.softtech.model.LoginResponse;
import ee.ttu.softtech.service.AuthService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

@Controller
public class AuthController {

    private static final Logger log = Logger.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;

    @RequestMapping(value = "auth/login", method = RequestMethod.POST)
    public @ResponseBody LoginResponse login(@RequestBody LoginData loginData) throws IOException {
        boolean isLogin = authService.authenticate(loginData);
        LoginResponse loginResponse = null;

        if (isLogin) {
            loginResponse = new LoginResponse(LoginResponse.Status.OK);
            loginResponse.setUserId(authService.getUserByUsername(loginData.getUsername()).getId());
        } else {
            loginResponse =  new LoginResponse(LoginResponse.Status.FAIL);
        }

        return loginResponse;
    }
    
}
