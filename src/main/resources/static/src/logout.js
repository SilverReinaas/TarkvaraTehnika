import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(AuthService, Router)
export class logOut{
    constructor(auth, router){
        auth.logout();
        localStorage.clear();
        router.navigate(auth.isAuthenticated() ? "dashboard" : "login");
    }
}