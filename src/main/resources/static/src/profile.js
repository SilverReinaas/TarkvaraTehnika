import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getProfile'), Endpoint.of('saveProfile'), Router)
export class Profile extends UserAware {

    @bindable profile;

	constructor(getProfileEndpoint, saveProfileEndpoint, router) {
	    super();

		this.getProfileEndpoint = getProfileEndpoint;
		this.saveProfileEndpoint = saveProfileEndpoint;
		this.router = router;

		this.getProfile();
	};

	getProfile() {
	    this.getProfileEndpoint
	        .find('', {userId: this.loggedInUserId})
            .then(response => {
                this.profile = response;
            })
            .catch(error => {
                console.log(error);
            });
	}

	saveProfile() {
	    //let newProfile = JSON.parse(JSON.stringify(this.profile));

	    this.saveProfileEndpoint
	        .post('', this.profile)
	        .catch(error => {
	        	//console.log(newProfile);
	            console.log(error);
	        })
	}

}