import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';

@inject(AuthService)
export class UserAware {

    constructor(authService){
        this.authService = authService;
    }

    get loggedInUserId(){
        return localStorage.getItem("currentUserId");
    }

    get isAuthenticated(){
        return this.authService.isAuthenticated();
    }
}