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
        console.log(exerciseId);
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
}