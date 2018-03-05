import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'), Router)
export class Details{

    @bindable exercise;

    exerciseId = null;

    constructor(exerciseEndpoint, router) {
        this.exerciseEndpoint = exerciseEndpoint;
        this.router = router;
        this.exercise;
    }
    activate(params) {
    }
    getExercise() {
        this.exerciseEndpoint
          .find('', {id : params.id})
          .then(response => {
            this.exercise = response;
          })
          .catch(error => {
            console.log(error);
          });
    }
}