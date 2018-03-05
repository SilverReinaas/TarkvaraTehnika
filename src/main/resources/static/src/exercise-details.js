import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'), Router)
export class Details{

    @bindable exercise;

    constructor(exerciseEndpoint, router) {
        this.exerciseEndpoint = exerciseEndpoint;
        this.router = router;
        this.exercise;
    }
    activate(params) {
        this.getExercise(params.id);
    }
    getExercise(exerciseId) {
        this.exerciseEndpoint
          .find('', {id : exerciseId})
          .then(response => {
            this.exercise = response;
            console.log(JSON.stringify(response));
          })
          .catch(error => {
            console.log(error);
          });
    }
    addExerciseLog() {
        let measurements = {};
        for (let i = 0; i < this.exercise.unitTypeIds.length; i++) {
            measurements[this.exercise.unitTypeIds[i]] = this.exercise.unitTypes[i];
        }

        this.addExerciseLogEndpoint
         .post('', {exerciseId: this.exercise.id, measurements: measurements})
         .then(response => {
           console.log(response);
         })
         .catch(error => {
           console.log(error);
         })

        console.log(this.exercise.id, this.exercise.unitTypeIds, this.exercise.unitTypes);
    }
}