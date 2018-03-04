import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';

@inject(Endpoint.of('getUserExercises'), Endpoint.of('addExerciseLog'))
export class Dashboard extends UserAware {

    @bindable exercises;
    
    exerciseId = null;
    unitTypeIds = [];
    unitTypes = [];

    constructor(userExercisesEndpoint, addExerciseLogEndpoint) {
        super();
        //this.exercises = [{"name":"test1"}, {"name": "test2"}];
        //this.exercises = this.getExercises();
        this.userExercisesEndpoint = userExercisesEndpoint;
        this.addExerciseLogEndpoint = addExerciseLogEndpoint;
        
        this.exercises = [];
        this.getExercises();
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
    
    addExerciseLog() {
        let measurements = {};
        
        for (let i = 0; i < this.unitTypeIds.length; i++) {
            measurements[this.unitTypeIds[i]] = this.unitTypes[i];
        }        

        this.addExerciseLogEndpoint
         .post('', {exerciseId: this.exerciseId, measurements: measurements})
         .then(response => {
           console.log(response);
         })
         .catch(error => {
           console.log(error);
         })
    
        console.log(this.exerciseId, this.unitTypeIds, this.unitTypes);
    }
}