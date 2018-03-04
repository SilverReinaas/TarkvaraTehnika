import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';

@inject(Endpoint.of('getUserExercises'))
export class Dashboard extends UserAware {

    @bindable exercises;

    constructor(endpoint) {
        super();
        //this.exercises = [{"name":"test1"}, {"name": "test2"}];
        //this.exercises = this.getExercises();
        this.endpoint = endpoint;
        this.exercises = [];
        this.getExercises();
    }

    getExercises() {
		this.endpoint
		  .find('', {userId: this.loggedInUserId})
          .then(response => {
            this.exercises = response;
          })
          .catch(error => {
            console.log(error);
          });
    }
}