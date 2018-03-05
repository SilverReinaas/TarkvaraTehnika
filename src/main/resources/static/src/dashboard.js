import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getUserExercises'), Endpoint.of('addExerciseLog'), Router)
export class Dashboard extends UserAware {

    @bindable exercises;
    
    exerciseId = null;
    unitTypeIds = [];
    unitTypes = [];

    constructor(userExercisesEndpoint, addExerciseLogEndpoint, router) {
        super();
        this.userExercisesEndpoint = userExercisesEndpoint;
        this.addExerciseLogEndpoint = addExerciseLogEndpoint;
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

    openExercise() {
    this.router.navigateToRoute('exercise-details', { id: 99999 } );
    }


}