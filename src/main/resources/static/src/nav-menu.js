import {bindable} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';
import {inject, computedFrom} from 'aurelia-framework';

@inject(AuthService)
export class NavMenu{
    @bindable router = null;

    constructor(auth){
        this.auth = auth;
    }

    get isAuthenticated(){
        return this.auth.isAuthenticated();
    }
}