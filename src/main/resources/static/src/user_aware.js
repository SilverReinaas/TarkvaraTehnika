import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';

@inject(AuthService)

export class UserAware {

    get loggedInUserId(){
        return localStorage.getItem("currentUserId");
    }

    get isAuthenticated(){
        return authService.isAuthenticated();
    }
}