package ee.ttu.softtech.controller;

import ee.ttu.softtech.model.LoginData;
import ee.ttu.softtech.model.LoginResponse;
import ee.ttu.softtech.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

@Controller
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @RequestMapping(value = "auth", method = RequestMethod.POST)
    public @ResponseBody LoginResponse login(@RequestBody LoginData loginData) throws IOException {
        boolean isLogin = authService.authenticate(loginData);
        return isLogin ? new LoginResponse(LoginResponse.Status.OK) : new LoginResponse(LoginResponse.Status.FAIL);
    }
    
    @RequestMapping(value = "abc", method = RequestMethod.GET)
    public @ResponseBody LoginResponse abc() {
        LoginData ld = new LoginData();
        ld.setLogin("misha");
        ld.setPassword("test");
        boolean isLogin = authService.authenticate(ld);
        return isLogin ? new LoginResponse(LoginResponse.Status.OK) : new LoginResponse(LoginResponse.Status.FAIL);
    }
    
}
