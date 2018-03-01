import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(AuthService, Router)
export class Home {
    constructor(auth, router){
        router.navigate(auth.isAuthenticated() ? "dashboard" : "login");
    }
}
