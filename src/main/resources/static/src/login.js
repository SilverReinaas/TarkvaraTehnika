import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';
@inject(AuthService)

export class Login {

	constructor(authService) {
		this.authService = authService;
	};

	username = '';
	password = '';
	
    @computedFrom('authService.authenticated')
    get authenticated() {
      return this.authService.authenticated;
    }

    login() {
        return this.authService.login({username: this.username, password: this.password})
        .then(response => {
            console.log("success logged " + response);
        })
        .catch(err => {
			console.log(err);
            console.log("login failure");
        });
    };

    authenticate(name) {
        return this.authService.authenticate(name)
        .then(response => {
            console.log("auth response " + response);
        });
    }	
  
}
