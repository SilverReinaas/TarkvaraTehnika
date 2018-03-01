import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';
import {UserAware} from 'user_aware';

@inject(AuthService)
export class Login extends UserAware {

	constructor(authService) {
	    super();
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
            localStorage.setItem("currentUserId",response.userId);
            console.log("success logged " + JSON.stringify(response));
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
