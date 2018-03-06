import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getUserExercises'), Router)
export class Dashboard extends UserAware {

    @bindable exercises;

    exerciseId;

    constructor(userExercisesEndpoint, router) {
        super();
        this.userExercisesEndpoint = userExercisesEndpoint;
        this.exercises = [];
        this.getExercises();
        this.router = router;
    }

    getExercises() {
		this.userExercisesEndpoint
		  .find('', {userId: this.loggedInUserId})
          .then(response => {
            this.exercises = response;
          })
          .catch(error => {
            console.log(error);
          });
    }

    openExercise(id) {
    this.router.navigateToRoute('exercise-details', { id: id } );
    }


}